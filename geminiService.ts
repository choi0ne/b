
import { GoogleGenAI } from '@google/genai';

// Helper to convert Blob to Base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function transcribeWithGemini(apiKey: string, audioBlob: Blob, previousContext?: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey });
    const base64Data = await blobToBase64(audioBlob);

    let promptText = "제공된 진료 녹음 파일을 한국어로 정확하게 전사해 주세요. 환자와 의사의 대화를 구분하지 않고 들리는 대로 텍스트로 변환하세요. 의학 용어에 유의하여 정확하게 받아 적으세요. 요약이나 군더더기 설명 없이 전사 텍스트만 출력하세요.";
    
    if (previousContext) {
        promptText += `\n\n[이전 대화 문맥]\n${previousContext}\n\n위의 이전 문맥을 참고하여 대화가 자연스럽게 이어지도록 전사하세요.`;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Audio-native, low latency model
            contents: {
                parts: [
                    { inlineData: { mimeType: audioBlob.type, data: base64Data } },
                    { text: promptText }
                ]
            }
        });
        return response.text?.trim() || "";
    } catch (e) {
        throw new Error(`Gemini 음성 전사 실패: ${(e as Error).message}`);
    }
}


const VERIFICATION_SYSTEM_INSTRUCTION = `당신은 대한민국 한의원에서 사용하는 의료 기록 전문 검수 AI입니다. 당신의 임무는 제공된 진료 대화 전사문을 검토하고, 다음과 같은 규칙에 따라 수정하는 것입니다.

[수정 규칙]
1.  명백한 오탈자 및 문법 오류를 교정합니다.
2.  의학 용어 및 한의학 용어(예: 경혈명, 약재명, 병증명 등)가 잘못 사용되었거나 오기된 경우, 문맥에 가장 적합하고 정확한 용어로 수정합니다.
3.  대화의 원래 의미나 내용을 절대 변경하거나 추가하지 마십시오. 오직 교정 작업만 수행합니다.
4.  수정이 완료된 최종 전사문 텍스트'만'을 응답으로 출력해야 합니다. 어떠한 설명이나 인사말도 포함하지 마십시오.
`;

const getVerificationPrompt = (transcript: string): string => `
아래의 진료 대화 전사문을 검토하고 수정 규칙에 따라 교정해주세요.

[전사문 원본]
---
${transcript}
---
`;

export async function verifyAndCorrectTranscript(geminiApiKey: string | undefined, transcript: string): Promise<string> {
    if (!geminiApiKey) {
        throw new Error('Gemini API 키가 없습니다.');
    }
    // Return original transcript if it's empty or just whitespace
    if (!transcript.trim()) {
        return transcript;
    }
    
    try {
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: getVerificationPrompt(transcript),
            config: {
                systemInstruction: VERIFICATION_SYSTEM_INSTRUCTION,
            },
        });
        return response.text?.trim() || transcript;
    } catch (e) {
        throw new Error(`Gemini 전사 내용 검수 실패: ${(e as Error).message}`);
    }
}


const SYSTEM_INSTRUCTION = `당신은 한의원 진료를 돕는 AI 어시스턴트입니다. 당신의 임무는 제공된 진료 기록(대화 전사문, 추가 메모 등)을 바탕으로 구조화된 SOAP 차트를 작성하는 것입니다.

──────────────────────────────
📋 작동 목표
──────────────────────
1️⃣  제공된 진료 기록을 한의과 SOAP 형식에 맞춰 정리합니다.
2️⃣  기록에 있는 내용만 사용해야 하며, 절대 내용을 지어내거나 추론하지 않습니다.
3️⃣  숫자, 경혈명, 용량, 횟수 등은 원문 그대로 유지합니다.
4️⃣  기록에서 특정 정보를 찾을 수 없는 경우, 해당 항목은 "미확인"으로 표시합니다.
5️⃣  차트 마지막에는 주치의가 검토하기 쉽도록 요약과 확인사항 체크리스트를 추가합니다. 체크리스트 3개 항목에 대해서는 대화 내용을 근거로 간결하게 답변해야 합니다. 만약 특정 항목(예: 주호소)이 '미확인'이라 답변 근거가 없다면, 해당 체크리스트 답변도 '미확인'으로 통일하여 기재합니다.
6️⃣  어떠한 인사말이나 서론 없이 바로 SOAP 차트 본문으로 시작합니다.

──────────────────
📋 출력 형식 규칙
──────────────────
- 제공된 SOAP 출력 형식을 엄격하게 준수합니다.
- 깔끔하고 간결한 언어를 사용합니다.
- 실수 가능성이 있는 중요한 수치는 굵은 글씨로 강조합니다(예: **5분**, **3장**).
- 환자명은 대화에서 유추하여 기입하고, 유추가 불가능하면 "미확인"으로 표시합니다.
`;

const formatKST = (d: Date) =>
  new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).format(d);


const getUserPrompt = (transcript: string, additionalNotes: string, consultationDate: Date): string => {
    let contentSection = '';
    let mainInstruction = '아래의 출력 형식과 제공된 내용을 바탕으로 SOAP 차트를 작성해 주세요.';

    if (transcript.trim() && additionalNotes.trim()) {
        mainInstruction = '아래의 출력 형식과, [진료 대화 내용] 및 [추가 메모]를 모두 종합하여 SOAP 차트를 작성해 주세요.';
    }

    if (transcript.trim()) {
        contentSection += `
---

[진료 대화 내용]
${transcript}
`;
    }

    if (additionalNotes.trim()) {
        contentSection += `
---

[추가 메모]
${additionalNotes}
`;
    }

    return `
${mainInstruction}

[출력 형식]
✅ 환자명:
✅ 진료일시: ${formatKST(consultationDate)}

S (주관적)
- 주호소:
- 현병력:
- 악화·완화 요인:
- 관련 증상:
- 기타:

O (객관적)
- 시진:
- 촉진/압통:
- ROM/기능검사:
- 특수검사:
- 활력징후:
- 기타:

A (평가)
- 진단명:
- 의증:

P (계획)
- 시술:
- 치료 빈도/기간:
- 한약:
- 예후:
- 주의사항/금기:
- 생활지도/재활:
- 추적계획:

✅ 청구 태그:

✅ 요약
- 진료내용을 50자 내외 요약

✅확인사항 (체크리스트)
1. 주소증에 대해서 정확하게 진찰했는가?
2. 예후 및 주의사항이 누락되지 않았는가?
3. 치료계획이 환자에게 충분히 설명되었는가?
${contentSection}
`;
};


export async function generateSoapChart(geminiApiKey: string | undefined, transcript: string, additionalNotes: string, consultationDate: Date): Promise<string> {
    if (!geminiApiKey) {
        throw new Error('Gemini API 키가 없습니다.');
    }
    
    try {
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: getUserPrompt(transcript, additionalNotes, consultationDate),
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            },
        });
        return response.text ?? '';
    } catch (e) {
        throw new Error(`Gemini 생성 실패: ${(e as Error).message}`);
    }
}
