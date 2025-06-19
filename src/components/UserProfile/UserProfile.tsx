import React, { useState } from "react";
import { Edit3, Music, Heart, Clock, Users } from "lucide-react";
import "./UserProfile.css";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  coverUrl: string;
}

interface UserProfileProps {
  user: {
    id: string;
    displayName: string;
    avatarUrl: string;
    email: string;
    followers: number;
    following: number;
    playlistsCount: number;
    totalListenTime: number;
  };
  recentTracks: Track[];
  topTracks: Track[];
  onEditProfile?: () => void;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  recentTracks,
  topTracks,
  onEditProfile,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"recent" | "top">("recent");

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatListenTime = (hours: number): string => {
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  };

  const currentTracks = activeTab === "recent" ? recentTracks : topTracks;

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <div className="profile-avatar-section">
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="profile-avatar"
            />
            <div className="profile-info">
              <span className="profile-type">Perfil</span>
              <h1 className="profile-name">{user.displayName}</h1>
              <div className="profile-stats">
                <span>{user.playlistsCount} playlists</span>
                <span>•</span>
                <span>{user.followers} seguidores</span>
                <span>•</span>
                <span>{user.following} siguiendo</span>
              </div>
            </div>
          </div>
          <div className="profile-actions">
            {onEditProfile && (
              <button className="edit-btn" onClick={onEditProfile}>
                <Edit3 size={16} />
                Editar
              </button>
            )}
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>
        </div>

        <div className="profile-content">
          <div className="stats-grid">
            <div className="stat-card">
              <Music className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">{user.playlistsCount}</span>
                <span className="stat-label">Playlists</span>
              </div>
            </div>
            <div className="stat-card">
              <Heart className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">{user.followers}</span>
                <span className="stat-label">Seguidores</span>
              </div>
            </div>
            <div className="stat-card">
              <Users className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">{user.following}</span>
                <span className="stat-label">Siguiendo</span>
              </div>
            </div>
            <div className="stat-card">
              <Clock className="stat-icon" />
              <div className="stat-info">
                <span className="stat-value">
                  {formatListenTime(user.totalListenTime)}
                </span>
                <span className="stat-label">Escuchado</span>
              </div>
            </div>
          </div>

          <div className="tracks-section">
            <div className="tracks-header">
              <button
                className={`tab-btn ${activeTab === "recent" ? "active" : ""}`}
                onClick={() => setActiveTab("recent")}
              >
                Recientes
              </button>
              <button
                className={`tab-btn ${activeTab === "top" ? "active" : ""}`}
                onClick={() => setActiveTab("top")}
              >
                Favoritas
              </button>
            </div>
            <div className="tracks-list">
              {currentTracks.slice(0, 5).map((track, index) => (
                <div key={track.id} className="track-row">
                  <span className="track-position">{index + 1}</span>
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="track-cover"
                  />
                  <div className="track-details">
                    <span className="track-title">{track.title}</span>
                    <span className="track-artist">{track.artist}</span>
                  </div>
                  <span className="track-duration">
                    {formatTime(track.duration)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;