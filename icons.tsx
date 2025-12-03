import React from 'react';

export const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"></path>
    <path d="M17 11h-1c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92z"></path>
  </svg>
);

export const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h12v12H6z"></path>
  </svg>
);

export const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
  </svg>
);

export const SaveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

export const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.44.17-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.3 9.81c-.11.2-.06.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.04.24.24.41.48.41h3.84c.24 0-.44.17-.48.41l-.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59.22l1.92-3.32c.12-.22.06-.47-.12-.61l-2.03-1.58zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
    </svg>
);
  
export const GeminiIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.542L16.5 21.75l-.398-1.208a3.375 3.375 0 00-2.456-2.456L12.75 18l1.208-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.208a3.375 3.375 0 002.456 2.456L20.25 18l-1.208.398a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);
  
export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const DjdLogoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
      className={className} 
      viewBox="0 0 50 50" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="50" height="50" rx="5" ry="5" fill="#DC2626" />
      <text 
        x="50%" 
        y="50%" 
        dominantBaseline="middle" 
        textAnchor="middle" 
        fill="white" 
        fontSize="20" 
        fontWeight="bold" 
        fontFamily="Arial, sans-serif"
      >
        DJD
      </text>
    </svg>
);

export const OpenAIIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <path d="M22.2819 10.1319C22.6244 10.3031 22.9994 10.6031 22.9994 11.0006V13.0006C22.9994 13.3981 22.6244 13.6981 22.2819 13.8694C22.2631 13.8781 22.2431 13.8863 22.2238 13.8938C21.7938 14.1044 21.3206 14.2156 20.8294 14.2156C20.3381 14.2156 19.8644 14.1044 19.4344 13.8938C19.4156 13.8863 19.3956 13.8781 19.3769 13.8694C19.0344 13.6981 18.6594 13.3981 18.6594 13.0006V11.0006C18.6594 10.6031 19.0344 10.3031 19.3769 10.1319C19.3956 10.1231 19.4156 10.1156 19.4344 10.1069C19.8644 9.89623 20.3381 9.78498 20.8294 9.78498C21.3206 9.78498 21.7938 9.89623 22.2238 10.1069C22.2431 10.1156 22.2631 10.1231 22.2819 10.1319ZM17.2438 10.8794C16.8138 10.6688 16.3406 10.5575 15.8494 10.5575C15.3581 10.5575 14.8844 10.6688 14.4544 10.8794C14.4356 10.8881 14.4156 10.8956 14.3969 10.9044C14.0544 11.0756 13.6794 11.3756 13.6794 11.7731V13.7731C13.6794 14.1706 14.0544 14.4706 14.3969 14.6419C14.4156 14.6506 14.4356 14.6581 14.4544 14.6669C14.8844 14.8775 15.3581 14.9887 15.8494 14.9887V15.7412C14.5294 15.7412 13.3794 15.1994 12.5306 14.2881C12.1131 13.8269 11.7894 13.2844 11.5869 12.6931C11.5356 12.5444 11.4938 12.3931 11.4619 12.2394C11.2331 11.1619 11.4438 10.0056 12.0488 9.04311C12.6994 8.01186 13.7256 7.28811 14.9088 7.02811L14.9656 7.01686C15.2419 6.96561 15.5306 6.93811 15.8494 6.93811C17.5519 6.93811 19.0069 8.35811 19.0069 10.0412C19.0069 10.2981 18.9831 10.5512 18.9369 10.8006C18.4906 10.7019 17.8869 10.8362 17.2438 10.8794ZM1.71688 13.8694C1.37438 13.6981 1 13.3981 1 13.0006V11.0006C1 10.6031 1.375 10.3031 1.7175 10.1319C1.73625 10.1231 1.75625 10.1156 1.77562 10.1069C2.20562 9.89623 2.67875 9.78498 3.17062 9.78498C3.66187 9.78498 4.13562 9.89623 4.56562 10.1069C4.58437 10.1156 4.60437 10.1231 4.62312 10.1319C4.96562 10.3031 5.34062 10.6031 5.34062 11.0006V13.0006C5.34062 13.3981 4.96562 13.6981 4.62312 13.8694C4.60437 13.8781 4.58437 13.8863 4.56562 13.8938C4.13562 14.1044 3.66187 14.2156 3.17062 14.2156C2.67875 14.2156 2.20562 14.1044 1.77562 13.8938C1.75625 13.8863 1.73625 13.8781 1.71688 13.8694ZM6.77563 10.9044C6.75688 10.8956 6.73687 10.8881 6.71812 10.8794C6.11312 10.8362 5.50937 10.7019 5.06312 10.8006C4.98687 10.5512 4.96312 10.2981 4.96312 10.0412C4.96312 8.35811 6.41812 6.93811 8.12062 6.93811C8.43937 6.93811 8.72812 6.96561 9.00437 7.01686L9.06125 7.02811C10.2444 7.28811 11.2706 8.01186 11.9212 9.04311C12.5262 10.0056 12.7369 11.1619 12.5081 12.2394C12.4762 12.3931 12.4344 12.5444 12.3831 12.6931C12.1806 13.2844 11.8569 13.8269 11.4394 14.2881C10.5906 15.1994 9.44062 15.7412 8.12062 15.7412V14.9887C8.61187 14.9887 9.08562 14.8775 9.51562 14.6669C9.53437 14.6581 9.55437 14.6506 9.57312 14.6419C9.91562 14.4706 10.2906 14.1706 10.2906 13.7731V11.7731C10.2906 11.3756 9.91562 11.0756 9.57312 10.9044C9.55437 10.8956 9.53437 10.8881 9.51562 10.8794C9.08562 10.6688 8.61187 10.5575 8.12062 10.5575C7.62937 10.5575 7.15562 10.6688 6.72562 10.8794L6.77563 10.9044ZM15.8494 6.23811C14.7581 6.23811 13.8569 6.55186 13.1969 7.14936L13.1531 7.18936C13.7831 6.50561 14.7706 6.04061 15.8494 6.04061C16.9281 6.04061 17.9156 6.50561 18.5456 7.18936L18.5019 7.14936C17.8419 6.55186 16.9406 6.23811 15.8494 6.23811ZM8.12062 6.23811C7.02937 6.23811 6.12812 6.55186 5.46812 7.14936L5.42437 7.18936C6.05437 6.50561 7.04187 6.04061 8.12062 6.04061C9.19937 6.04061 10.1869 6.50561 10.8169 7.18936L10.7731 7.14936C10.1131 6.55186 9.21187 6.23811 8.12062 6.23811Z" />
    </svg>
);

export const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);
  
export const MarkdownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125A1.125 1.125 0 003 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
    </svg>
);

export const AttachmentIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81" />
    </svg>
);

export const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-7.5 12h29.25" />
    </svg>
);

export const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.563-3.373-11.127-7.962l-6.64 5.332C9.563 38.373 16.318 44 24 44z"></path>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.011 35.39 44 30.134 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);

export const GoogleTasksIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
       <path d="M14.3,9.75c0.35,0.22,0.78,0.36,1.25,0.36c1.24,0,2.25-1.01,2.25-2.25S16.79,5.61,15.55,5.61c-0.47,0-0.9,0.14-1.25,0.36L12,2L9.7,5.97C9.35,5.75,8.92,5.61,8.45,5.61C7.21,5.61,6.2,6.62,6.2,7.86S7.21,10.11,8.45,10.11c0.47,0,0.9-0.14,1.25-0.36L12,13.5l2.3-3.75z M8.45,9.11C7.76,9.11,7.2,8.55,7.2,7.86s0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25S9.14,9.11,8.45,9.11z M15.55,9.11c-0.69,0-1.25-0.56-1.25-1.25s0.56-1.25,1.25-1.25s1.25,0.56,1.25,1.25S16.24,9.11,15.55,9.11z M12.5,14H4v2h8.5c0.55,0,1,0.45,1,1s-0.45,1-1,1H3v2h9.5c1.65,0,3-1.35,3-3S14.15,14,12.5,14z M20,19.5c0,1.38-1.12,2.5-2.5,2.5S15,20.88,15,19.5s1.12-2.5,2.5-2.5S20,18.12,20,19.5z"/>
    </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.033-2.124H8.033c-1.12 0-2.033.944-2.033 2.124v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

export const NotionIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.688 3.375h5.25V19.5h-3V8.625l-2.25 10.875h-2.25L9 8.625v10.875h-3V3.375h5.25l2.25 9.375L13.688 3.375Z" />
    </svg>
);

export const RevisitIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 11H5v2h4v4h2v-4h4v-2h-4V7h-2v4Z"/>
    </svg>
);

export const GoogleSheetsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path fill="#167C3D" d="M37,45H11a5,5,0,0,1-5-5V8a5,5,0,0,1,5-5H28V14a1,1,0,0,0,1,1H40V40A5,5,0,0,1,37,45Z"/>
        <path fill="#34A853" d="M40,12,29,1V13a1,1,0,0,0,1,1H40Z"/>
        <path fill="#FFFFFF" d="M22,25h4v9H22Zm-6,3h4v6H16Zm12-3h4v6H28Z"/>
    </svg>
);

export const DoctalkIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="50" height="50" rx="8" ry="8" fill="#00BFA5" />
      <circle cx="17" cy="22" r="2.5" fill="white" />
      <circle cx="33" cy="22" r="2.5" fill="white" />
      <path d="M 15 32 Q 25 38 35 32" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <rect x="20" y="10" width="10" height="6" rx="3" fill="white" />
    </svg>
);