import React, { useState, useEffect, useRef } from "react";
import { SidebarProps } from "../../types";
import { X } from "lucide-react";
import "./Sidebar.css";

interface SidebarWithProfileProps extends SidebarProps {
  onShowProfile?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarWithProfileProps> = ({
  playlists,
  activePlaylist,
  onPlaylistSelect,
  user,
  isCollapsed = false,
  onToggleCollapse,
  onShowProfile,
  isOpen = false,
  onClose,
  isMobile = false,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleProfileClick = () => {
    setUserMenuOpen(false);
    onShowProfile?.();
  };

  const handlePlaylistClick = (playlistId: string) => {
    onPlaylistSelect(playlistId);
    setUserMenuOpen(false);
  };

  const handleClose = () => {
    setUserMenuOpen(false);
    onClose?.();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <div
      className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
        isOpen ? "open" : ""
      }`}
    >
      <div className="sidebar-header">
        <h1 className="logo">Spotify Clone</h1>
        {isMobile ? (
          <button onClick={handleClose} className="collapse-button">
            <X size={20} />
          </button>
        ) : (
          onToggleCollapse && (
            <button onClick={onToggleCollapse} className="collapse-button">
              ☰
            </button>
          )
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
              onClick={() => handlePlaylistClick(playlist.id)}
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
        <div className="user-section" ref={userMenuRef}>
          <div className="user-info" onClick={toggleUserMenu}>
            <img
              src={user.avatarUrl}
              alt={user.displayName || user.name}
              className="user-avatar"
            />
            <span>{user.displayName || user.name}</span>
          </div>
          {userMenuOpen && (
            <div className="user-dropdown">
              <button className="user-menu-item" onClick={handleProfileClick}>
                Perfil
              </button>
              <button className="user-menu-item">Configuración</button>
              <button className="user-menu-item">Cerrar sesión</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
