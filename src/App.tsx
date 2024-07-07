import React, { useState, useEffect } from 'react';
import { Camera, Type, Volume2, Mic, Play } from 'lucide-react';

// Mock API service
const mockApiService = {
  signToText: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Hello, this is a mock translation from sign language.");
      }, 2000);
    });
  },
  voiceToSign: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("https://example.com/mock-sign-language-animation.gif");
      }, 2000);
    });
  },
  textToSpeech: (text, voice) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`TTS: "${text}" in ${voice} voice`);
        resolve();
      }, 1000);
    });
  }
};

function App() {
  const [inputText, setInputText] = useState('');
  const [translationMode, setTranslationMode] = useState('signToText');
  const [voiceGender, setVoiceGender] = useState('female');
  const [isTranslating, setIsTranslating] = useState(false);
  const [animationUrl, setAnimationUrl] = useState('');
  const [error, setError] = useState('');

  const handleStartTranslation = async () => {
    setIsTranslating(true);
    setError('');
    try {
      if (translationMode === 'signToText') {
        const result = await mockApiService.signToText();
        setInputText(result);
      } else {
        const result = await mockApiService.voiceToSign();
        setAnimationUrl(result);
      }
    } catch (err) {
      setError('Translation failed. Please try again.');
    }
    setIsTranslating(false);
  };

  const handleTTS = async () => {
    try {
      await mockApiService.textToSpeech(inputText, voiceGender);
      // In a real app, you would play the audio here
      console.log('TTS playback complete');
    } catch (err) {
      setError('TTS playback failed. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">SIGNFORALL</h1>
      
      <div className="mb-6">
        <div className="flex space-x-2 mb-4">
          <button 
            className={`px-4 py-2 rounded flex items-center ${translationMode === 'signToText' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTranslationMode('signToText')}
          >
            <Camera size={18} className="mr-2" /> Sign to Text
          </button>
          <button 
            className={`px-4 py-2 rounded flex items-center ${translationMode === 'voiceToSign' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTranslationMode('voiceToSign')}
          >
            <Mic size={18} className="mr-2" /> Voice to Sign
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="w-full h-40 border rounded bg-gray-100 flex items-center justify-center">
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
                onClick={handleStartTranslation}
                disabled={isTranslating}
              >
                {isTranslating ? (
                  <span>Translating...</span>
                ) : (
                  <>
                    {translationMode === 'signToText' ? (
                      <><Camera size={18} className="mr-2" /> Start Signing</>
                    ) : (
                      <><Mic size={18} className="mr-2" /> Start Speaking</>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
          <div>
            <div className="w-full h-40 border rounded bg-gray-50 p-2">
              <textarea
                className="w-full h-full resize-none"
                placeholder="Translation will appear here"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                readOnly={translationMode === 'signToText'}
              />
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div className="flex items-center">
                <label className="mr-2">TTS Voice:</label>
                <select 
                  className="p-1 border rounded"
                  value={voiceGender}
                  onChange={(e) => setVoiceGender(e.target.value)}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
              <button 
                className="px-4 py-2 bg-green-500 text-white rounded flex items-center"
                onClick={handleTTS}
                disabled={!inputText}
              >
                <Volume2 size={18} className="mr-2" /> Play TTS
              </button>
            </div>
          </div>
        </div>
        {translationMode === 'voiceToSign' && (
          <div className="mt-4 w-full h-48 border rounded bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              {animationUrl ? (
                <img src={animationUrl} alt="Sign language animation" className="mx-auto mb-2" />
              ) : (
                <div className="w-[200px] h-[150px] bg-gray-200 mb-2"></div>
              )}
              <button 
                className="px-4 py-2 bg-green-500 text-white rounded flex items-center mx-auto"
                disabled={!animationUrl}
              >
                <Play size={18} className="mr-2" /> Play Animation
              </button>
            </div>
          </div>
        )}
        {error && (
          <div className="mt-4 text-red-500">{error}</div>
        )}
      </div>
    </div>
  );
}

export default App;