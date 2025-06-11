import React, { useState, useEffect, useRef } from "react";
import { TrackListProps } from "../../types";
import { Heart, MoreHorizontal, Play } from "lucide-react";
import "./TrackList.css";

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrack,
  onTrackSelect,
  onTrackLike,
  showHeader = true,
  showAlbum = true,
  showDuration = true,
  showActions = true,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [animatingLikes, setAnimatingLikes] = useState<Set<string>>(new Set());
  const menuRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLike = (trackId: string) => {
    onTrackLike(trackId);
    setAnimatingLikes((prev) => new Set(prev).add(trackId));
    setTimeout(() => {
      setAnimatingLikes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(trackId);
        return newSet;
      });
    }, 600);
  };

  const toggleMenu = (trackId: string) => {
    setOpenMenuId(openMenuId === trackId ? null : trackId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  return (
    <div className="track-list">
      {showHeader && (
        <div className="track-list-header">
          <span className="track-number">#</span>
          <span className="track-title">Título</span>
          {showAlbum && <span className="track-album">Álbum</span>}
          {showDuration && <span className="track-duration">Duración</span>}
          {showActions && <span className="track-actions">Acciones</span>}
        </div>
      )}

      {tracks.map((track, index) => (
        <div
          key={track.id}
          className={`track-item ${
            currentTrack?.id === track.id ? "playing" : ""
          }`}
        >
          <div className="track-number-container">
            <span className="track-number">{index + 1}</span>
            <button
              className="play-track-button"
              onClick={() => onTrackSelect(track)}
            >
              <Play size={16} />
            </button>
          </div>

          <div className="track-info" onClick={() => onTrackSelect(track)}>
            <img
              src={track.coverUrl}
              alt={track.title}
              className="track-cover"
            />
            <div className="track-details">
              <div className="track-title">{track.title}</div>
              <div className="track-artist">{track.artist}</div>
            </div>
          </div>

          {showAlbum && <span className="track-album">{track.album}</span>}
          {showDuration && (
            <span className="track-duration">{formatTime(track.duration)}</span>
          )}

          {showActions && (
            <div className="track-actions">
              <button
                className={`like-button ${track.isLiked ? "liked" : ""} ${
                  animatingLikes.has(track.id) ? "animating" : ""
                }`}
                onClick={() => handleLike(track.id)}
              >
                <Heart
                  size={16}
                  fill={
                    track.isLiked || animatingLikes.has(track.id)
                      ? "#ff1744"
                      : "none"
                  }
                />
              </button>
              <div className="more-menu-container" ref={menuRef}>
                <button
                  className="more-button"
                  onClick={() => toggleMenu(track.id)}
                >
                  <MoreHorizontal size={16} />
                </button>
                {openMenuId === track.id && (
                  <div className="dropdown-menu">
                    <button className="menu-item">Añadir a playlist</button>
                    <button className="menu-item">Ir al álbum</button>
                    <button className="menu-item">Compartir</button>
                    <button className="menu-item">Descargar</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TrackList;
