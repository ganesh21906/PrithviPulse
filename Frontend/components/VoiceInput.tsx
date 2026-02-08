import React, { useState, useEffect } from 'react';

interface Props {
  onTranscript: (text: string) => void;
  lang: string;
  label: string;
}

export const VoiceInput: React.FC<Props> = ({ onTranscript, lang, label }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      // Map simplified lang codes to BCP 47 tags for better accuracy
      const langMap: Record<string, string> = {
        'en': 'en-IN',
        'hi': 'hi-IN',
        'ta': 'ta-IN'
      };
      recognitionInstance.lang = langMap[lang] || 'en-US';
      recognitionInstance.interimResults = false;

      recognitionInstance.onstart = () => setIsListening(true);
      recognitionInstance.onend = () => setIsListening(false);
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
      };

      setRecognition(recognitionInstance);
    }
  }, [lang, onTranscript]);

  const toggleListen = () => {
    if (!recognition) {
      alert("Voice input not supported in this browser. Please use Chrome/Edge.");
      return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <button
      onClick={toggleListen}
      type="button"
      className={`flex-shrink-0 flex items-center justify-center gap-2 p-3 rounded-full transition-all ${
        isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-green-100 text-green-700'
      }`}
      aria-label={label}
      tabIndex={-1}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
      </svg>
      {isListening && <span className="text-sm font-semibold">Listening...</span>}
    </button>
  );
};
