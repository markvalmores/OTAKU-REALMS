import React from "react";

interface VFXProps {
  intensity: 'Low' | 'Midrange' | 'High' | 'Ultrakill';
  children: React.ReactNode;
  triggerShake?: boolean;
}

export default function VFX({ intensity, children, triggerShake }: VFXProps) {
  // Screen shake classes depending on mode
  let effectClass = "";

  if (triggerShake) {
    if (intensity === 'Ultrakill') {
      effectClass = "animate-bounce duration-75 border-2 border-red-500 saturate-200 contrast-125";
    } else if (intensity === 'High') {
      effectClass = "animate-bounce duration-150 border border-orange-500/50";
    } else if (intensity === 'Midrange') {
      effectClass = "animate-pulse duration-300";
    }
  }

  return (
    <div className={`transition-all duration-300 ${effectClass}`}>
      {children}
    </div>
  );
}
