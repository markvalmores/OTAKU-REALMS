import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

export default function MicrophoneSystem() {
  const [isMicOn, setIsMicOn] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const audioContext = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const toggleMic = async () => {
    if (isMicOn) {
      streamRef.current?.getTracks().forEach(track => track.stop());
      setIsMicOn(false);
      setMicLevel(0);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        setIsMicOn(true);
        
        audioContext.current = new AudioContext();
        const source = audioContext.current.createMediaStreamSource(stream);
        const analyser = audioContext.current.createAnalyser();
        source.connect(analyser);
        
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateLevel = () => {
          if (!isMicOn) return;
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setMicLevel(Math.min(100, average * 2));
          requestAnimationFrame(updateLevel);
        };
        updateLevel();
      } catch (err) {
        alert("Microphone access denied or not available.");
      }
    }
  };

  return (
    <section className="bg-gray-900 p-6 rounded-2xl border-2 border-orange-900/50">
      <h2 className="text-xl font-heading mb-4 text-orange-400 flex items-center gap-2">
        <Mic className="text-orange-400" />
        Microphone
      </h2>
      <button onClick={toggleMic} className={`w-full p-4 rounded-lg flex items-center justify-center gap-2 font-bold ${isMicOn ? 'bg-red-600' : 'bg-orange-600'}`}>
        {isMicOn ? <MicOff /> : <Mic />} {isMicOn ? 'Disable Mic' : 'Enable Mic'}
      </button>
      <div className="mt-4 h-4 bg-gray-800 rounded-lg overflow-hidden">
        <div className="h-full bg-orange-500 transition-all duration-100" style={{ width: `${micLevel}%` }}></div>
      </div>
    </section>
  );
}
