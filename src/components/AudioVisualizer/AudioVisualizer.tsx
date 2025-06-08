import React, { useState, useEffect } from "react";
import { AudioVisualizerProps } from "../../types";
import "./AudioVisualizer.css";

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  audioData,
  barCount = 32,
  className = "",
  height = 32,
  color = "#1db954",
  responsive = true,
}) => {
  const [bars, setBars] = useState<number[]>(Array(barCount).fill(0));

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        if (audioData?.frequencyData) {
          // Usar datos reales del analizador de audio
          const step = Math.floor(audioData.frequencyData.length / barCount);
          const newBars = Array(barCount)
            .fill(0)
            .map((_, index) => {
              const dataIndex = index * step;
              return audioData.frequencyData[dataIndex] || 0;
            });
          setBars(newBars.map((value) => (value / 255) * 100));
        } else {
          // Fallback a animación simulada
          setBars((prev) => prev.map(() => Math.random() * 100));
        }
      }, 100);
    } else {
      setBars(Array(barCount).fill(0));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, audioData, barCount]);

  const visualizerStyle = {
    "--visualizer-height": `${height}px`,
    "--visualizer-color": color,
    "--bar-count": barCount,
  } as React.CSSProperties;

  return (
    <div
      className={`audio-visualizer ${className} ${
        responsive ? "responsive" : ""
      }`}
      style={visualizerStyle}
    >
      {bars.map((barHeight, index) => (
        <div
          key={index}
          className="visualizer-bar"
          style={{
            height: `${Math.max(2, barHeight)}%`,
            animationDelay: `${index * 50}ms`,
          }}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;
