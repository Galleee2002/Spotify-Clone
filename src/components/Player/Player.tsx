import React from "react";
import { PlayerProps } from "../../types";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
} from "lucide-react";
import "./Player.css";

const Player: React.FC<PlayerProps> = ({
  playerState,
  controls,
  className = "",
  compact = false,
}) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
  } = playerState;

  if (!currentTrack) return null;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`player ${className} ${compact ? "compact" : ""}`}>
      <div className="player-track-info">
        <img
          src={currentTrack.coverUrl}
          alt={currentTrack.title}
          className="player-cover"
        />
        <div className="player-details">
          <div className="player-title">{currentTrack.title}</div>
          <div className="player-artist">{currentTrack.artist}</div>
        </div>
      </div>

      <div className="player-controls">
        <div className="player-buttons">
          <button
            className={`control-button ${isShuffled ? "active" : ""}`}
            onClick={controls.toggleShuffle}
          >
            <Shuffle size={16} />
          </button>

          <button className="control-button" onClick={controls.previous}>
            <SkipBack size={20} />
          </button>

          <button
            className="play-button"
            onClick={isPlaying ? controls.pause : controls.play}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <button className="control-button" onClick={controls.next}>
            <SkipForward size={20} />
          </button>

          <button
            className={`control-button ${repeatMode !== "off" ? "active" : ""}`}
            onClick={controls.toggleRepeat}
          >
            <Repeat size={16} />
          </button>
        </div>

        <div className="progress-container">
          <span className="time-display">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => controls.seek(Number(e.target.value))}
            className="progress-bar"
          />
          <span className="time-display">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-volume">
        <button onClick={controls.toggleMute} className="volume-button">
          {isMuted || volume === 0 ? (
            <VolumeX size={20} />
          ) : (
            <Volume2 size={20} />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => controls.setVolume(Number(e.target.value))}
          className="volume-slider"
        />
      </div>
    </div>
  );
};

export default Player;
