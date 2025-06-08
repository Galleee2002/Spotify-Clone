import React from "react";
import { SidebarProps } from "../../types";
import "./Sidebar.css";

const Sidebar: React.FC<SidebarProps> = ({
  playlists,
  activePlaylist,
  onPlaylistSelect,
  user,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h1 className="logo">Spotify Clone</h1>
        {onToggleCollapse && (
          <button onClick={onToggleCollapse} className="collapse-button">
            ☰
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3>Playlists</h3>
          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              className={`nav-item ${
                activePlaylist === playlist.id ? "active" : ""
              }`}
              onClick={() => onPlaylistSelect(playlist.id)}
            >
              <img
                src={playlist.coverUrl}
                alt={playlist.name}
                className="playlist-cover"
              />
              {!isCollapsed && <span>{playlist.name}</span>}
            </button>
          ))}
        </div>
      </nav>

      {user && !isCollapsed && (
        <div className="user-section">
          <div className="user-info">
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="user-avatar"
            />
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
