# Código del Proyecto

## src\App.test.tsx

```
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

```

## src\App.tsx

```
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import TrackList from "./components/Tracklist";
import Player from "./components/Player";
import UserProfile from "./components/UserProfile/UserProfile";
import { useAudio } from "./hooks/useAudio";
import { samplePlaylists, sampleUser } from "./data/sampleData";
import { Playlist, Track, SearchFilters } from "./types";
import "./App.css";

const App: React.FC = () => {
  const [activePlaylist, setActivePlaylist] = useState<string | null>(
    "playlist-1"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [playlists] = useState<Playlist[]>(samplePlaylists);
  const [showProfile, setShowProfile] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    type: "all",
    explicit: true,
    year: undefined,
  });

  const { audioRef, playerState, controls } = useAudio();

  const currentPlaylist = activePlaylist
    ? playlists.find((p) => p.id === activePlaylist)
    : null;
  const filteredTracks =
    currentPlaylist?.tracks.filter(
      (track) =>
        track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.album.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const userProfileData = {
    id: sampleUser.id,
    displayName: sampleUser.displayName || sampleUser.name || "Usuario",
    avatarUrl: sampleUser.avatarUrl,
    email: sampleUser.email,
    followers: sampleUser.followers || 0,
    following: sampleUser.following || 0,
    playlistsCount: Array.isArray(sampleUser.playlists)
      ? sampleUser.playlists.length
      : playlists.length,
    totalListenTime: 247,
  };

  const recentTracks = currentPlaylist?.tracks.slice(0, 5) || [];
  const topTracks = currentPlaylist?.tracks.slice().reverse().slice(0, 5) || [];

  useEffect(() => {
    if (currentPlaylist && currentPlaylist.tracks.length > 0) {
      currentPlaylist.tracks.forEach((track) => {
        if (
          !playerState.queue.find((qTrack: Track) => qTrack.id === track.id)
        ) {
          controls.addToQueue(track);
        }
      });
    }
  }, [activePlaylist, currentPlaylist, controls, playerState.queue]);

  const handlePlaylistSelect = (playlistId: string) => {
    setActivePlaylist(playlistId);
  };

  const handleTrackSelect = (track: Track) => {
    if (!playerState.currentTrack || playerState.currentTrack.id !== track.id) {
      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.load();
      }
    }

    if (playerState.isPlaying) {
      controls.pause();
    } else {
      controls.play();
    }
  };

  const handleTrackLike = (trackId: string) => {
    console.log("Toggle like for track:", trackId);
  };

  const handleShowProfile = () => {
    setShowProfile(true);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  return (
    <div className="app">
      <Sidebar
        playlists={playlists}
        activePlaylist={activePlaylist}
        onPlaylistSelect={handlePlaylistSelect}
        user={sampleUser}
        onShowProfile={handleShowProfile}
      />

      <main className="main-content">
        <div className="main-header">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Buscar canciones, artistas o álbumes..."
            filters={searchFilters}
            onFiltersChange={setSearchFilters}
          />
        </div>

        {currentPlaylist && (
          <div className="playlist-view">
            <div className="playlist-header">
              <img
                src={currentPlaylist.coverUrl}
                alt={currentPlaylist.name}
                className="playlist-cover-large"
              />
              <div className="playlist-info">
                <h1>{currentPlaylist.name}</h1>
                <p>{currentPlaylist.description}</p>
                <p>{currentPlaylist.tracks.length} canciones</p>
              </div>
            </div>

            <TrackList
              tracks={filteredTracks}
              currentTrack={playerState.currentTrack}
              onTrackSelect={handleTrackSelect}
              onTrackLike={handleTrackLike}
            />
          </div>
        )}

        {!currentPlaylist && (
          <div className="empty-state">
            <h2>Selecciona una playlist</h2>
            <p>
              Elige una playlist del sidebar para comenzar a escuchar música
            </p>
          </div>
        )}
      </main>

      <Player playerState={playerState} controls={controls} />

      {showProfile && (
        <UserProfile
          user={userProfileData}
          recentTracks={recentTracks}
          topTracks={topTracks}
          onClose={handleCloseProfile}
        />
      )}

      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />
    </div>
  );
};

export default App;

```

## src\components\AudioVisualizer\AudioVisualizer.tsx

```
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
        if (
          audioData &&
          typeof audioData === "object" &&
          "frequencyData" in audioData
        ) {
          
          const step = Math.floor(audioData.frequencyData.length / barCount);
          const newBars = Array(barCount)
            .fill(0)
            .map((_, index) => {
              const dataIndex = index * step;
              return audioData.frequencyData[dataIndex] || 0;
            });
          setBars(newBars.map((value) => (value / 255) * 100));
        } else {
          
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

```

## src\components\AudioVisualizer\index.ts

```
export { default } from "./AudioVisualizer";

```

## src\components\Player\index.ts

```
export { default } from "./Player";

```

## src\components\Player\Player.tsx

```
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

```

## src\components\SearchBar\index.ts

```
export { default } from "./SearchBar";

```

## src\components\SearchBar\SearchBar.tsx

```
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, Filter, Sparkles, Music, Clock } from "lucide-react";
import { SearchBarProps, SearchFilters } from "../../types";
import "./SearchBar.css";

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = "Buscar canciones, artistas o álbumes...",
  autoFocus = false,
  filters,
  onFiltersChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  
  const suggestions = [
    { text: "Rock classics", icon: Music, color: "#ff6b6b" },
    { text: "Queen - Bohemian Rhapsody", icon: Sparkles, color: "#4ecdc4" },
    { text: "80s music", icon: Clock, color: "#45b7d1" },
    { text: "Progressive rock", icon: Music, color: "#96ceb4" },
    { text: "Heavy metal", icon: Sparkles, color: "#feca57" },
  ];

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [autoFocus]);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = useCallback(() => {
    onSearchChange("");
    inputRef.current?.focus();
    setIsTyping(false);
  }, [onSearchChange]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onSearchChange(value);
      setIsTyping(true);

      // Simular efecto de typing
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 500);
    },
    [onSearchChange]
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setShowSuggestions(searchTerm === "");
  }, [searchTerm]);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 150);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClear();
        inputRef.current?.blur();
      }
    },
    [handleClear]
  );

  const handleFilterChange = useCallback(
    (newFilters: Partial<SearchFilters>) => {
      if (onFiltersChange && filters) {
        onFiltersChange({ ...filters, ...newFilters });
      }
    },
    [onFiltersChange, filters]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      onSearchChange(suggestion);
      setShowSuggestions(false);
      inputRef.current?.focus();
    },
    [onSearchChange]
  );

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
    setShowSuggestions(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`ultra-search-container ${isFocused ? "focused" : ""} ${
        isTyping ? "typing" : ""
      }`}
    >
      {}
      <div className="search-background-glow" />

      <div className="ultra-search-bar">
        <div className="search-input-wrapper">
          {}
          <div className="search-icon-container">
            <Search
              className={`search-icon ${isTyping ? "searching" : ""}`}
              size={20}
            />
            {isTyping && <div className="search-pulse" />}
          </div>

          {}
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="ultra-search-input"
            autoComplete="off"
            spellCheck="false"
          />

          {}
          <div className="action-buttons">
            {searchTerm && (
              <button
                onClick={handleClear}
                className="action-btn clear-btn"
                aria-label="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}

            {onFiltersChange && (
              <button
                onClick={toggleFilters}
                className={`action-btn filter-btn ${
                  showFilters ? "active" : ""
                }`}
                aria-label="Filtros de búsqueda"
              >
                <Filter size={16} />
                {filters &&
                  Object.values(filters).some(
                    (v) => v !== "all" && v !== true && v !== undefined
                  ) && <div className="filter-indicator" />}
              </button>
            )}
          </div>
        </div>

        {}
        <div
          className={`search-progress ${isFocused || isTyping ? "active" : ""}`}
        />
      </div>

      {}
      {showFilters && filters && onFiltersChange && (
        <div className="ultra-filters-panel">
          <div className="filters-header">
            <Sparkles size={16} />
            <span>Filtros Avanzados</span>
          </div>

          <div className="filter-section">
            <label className="filter-label">Tipo de contenido:</label>
            <div className="filter-pills">
              {[
                { value: "all", label: "Todo", emoji: "🎯" },
                { value: "track", label: "Canciones", emoji: "🎵" },
                { value: "artist", label: "Artistas", emoji: "🎤" },
                { value: "album", label: "Álbumes", emoji: "💿" },
                { value: "playlist", label: "Playlists", emoji: "📋" },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() =>
                    handleFilterChange({ type: type.value as any })
                  }
                  className={`filter-pill ${
                    filters.type === type.value ? "active" : ""
                  }`}
                >
                  <span className="pill-emoji">{type.emoji}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-toggle">
              <input
                type="checkbox"
                checked={!filters.explicit}
                onChange={(e) =>
                  handleFilterChange({ explicit: !e.target.checked })
                }
                className="toggle-input"
              />
              <div className="toggle-slider">
                <div className="toggle-thumb" />
              </div>
              <span>Ocultar contenido explícito</span>
            </label>
          </div>

          <div className="filter-section">
            <label className="filter-label">Año de lanzamiento:</label>
            <div className="year-input-container">
              <input
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={filters.year || ""}
                onChange={(e) =>
                  handleFilterChange({
                    year: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="Cualquier año"
                className="ultra-year-input"
              />
            </div>
          </div>
        </div>
      )}

      {}
      {showSuggestions && searchTerm === "" && (
        <div className="ultra-suggestions-panel">
          <div className="suggestions-header">
            <Clock size={16} />
            <span>Búsquedas recientes</span>
          </div>
          <div className="suggestions-list">
            {suggestions.map((suggestion, index) => {
              const IconComponent = suggestion.icon;
              return (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="suggestion-item"
                  style={
                    { "--delay": `${index * 50}ms` } as React.CSSProperties
                  }
                >
                  <div
                    className="suggestion-icon"
                    style={
                      { "--color": suggestion.color } as React.CSSProperties
                    }
                  >
                    <IconComponent size={16} />
                  </div>
                  <span className="suggestion-text">{suggestion.text}</span>
                  <div className="suggestion-arrow">→</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

```

## src\components\Sidebar\index.ts

```
export { default } from "./Sidebar";

```

## src\components\Sidebar\Sidebar.tsx

```
import React, { useState, useEffect, useRef } from "react";
import { SidebarProps } from "../../types";
import "./Sidebar.css";

interface SidebarWithProfileProps extends SidebarProps {
  onShowProfile?: () => void;
}

const Sidebar: React.FC<SidebarWithProfileProps> = ({
  playlists,
  activePlaylist,
  onPlaylistSelect,
  user,
  isCollapsed = false,
  onToggleCollapse,
  onShowProfile,
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

```

## src\components\Tracklist\index.ts

```
export { default } from "./TrackList";

```

## src\components\Tracklist\TrackList.tsx

```
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

```

## src\components\UserProfile\UserProfile.tsx

```
import React, { useState } from "react";
import { User, Edit3, Music, Heart, Clock, Users } from "lucide-react";
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

```

## src\data\sampleData.ts

```
import { Track, Playlist, Artist, Album, User } from "../types";

export const sampleArtists: Artist[] = [
  {
    id: "artist-1",
    name: "Queen",
    imageUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    followers: 28500000,
    verified: true,
    genres: ["Rock", "Classic Rock", "Glam Rock"],
    popularity: 95,
    topTracks: [],
  },
  {
    id: "artist-2",
    name: "Led Zeppelin",
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
    followers: 15200000,
    verified: true,
    genres: ["Rock", "Hard Rock", "Blues Rock"],
    popularity: 92,
    topTracks: [],
  },
  {
    id: "artist-3",
    name: "Eagles",
    imageUrl:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop",
    followers: 8900000,
    verified: true,
    genres: ["Rock", "Country Rock", "Soft Rock"],
    popularity: 89,
    topTracks: [],
  },
  {
    id: "artist-4",
    name: "Guns N' Roses",
    imageUrl:
      "https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop",
    followers: 12300000,
    verified: true,
    genres: ["Hard Rock", "Heavy Metal", "Glam Metal"],
    popularity: 88,
    topTracks: [],
  },
];

export const sampleTracks: Track[] = [
  {
    id: "track-1",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    duration: 355,
    coverUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    liked: true,
    explicit: false,
    popularity: 95,
    releaseDate: "1975-10-31",
    genre: ["Rock", "Progressive Rock"],
    preview: "https://p.scdn.co/mp3-preview/sample1",
  },
  {
    id: "track-2",
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    album: "Led Zeppelin IV",
    duration: 482,
    coverUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    liked: false,
    explicit: false,
    popularity: 92,
    releaseDate: "1971-11-08",
    genre: ["Rock", "Hard Rock"],
    preview: "https://p.scdn.co/mp3-preview/sample2",
  },
  {
    id: "track-3",
    title: "Hotel California",
    artist: "Eagles",
    album: "Hotel California",
    duration: 391,
    coverUrl:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    liked: true,
    explicit: false,
    popularity: 89,
    releaseDate: "1976-12-08",
    genre: ["Rock", "Country Rock"],
    preview: "https://p.scdn.co/mp3-preview/sample3",
  },
  {
    id: "track-4",
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    album: "Appetite for Destruction",
    duration: 356,
    coverUrl:
      "https://imgs.search.brave.com/QfIGZgwRIdTrFkRABtxSuW2_saAogQqOuPSHN9RIxYQ/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vQ0NFdG5X/dXdqbUp4TXgyM0Iz/X1ozRTEzSDVKaTZQ/WUUweUk1Q3JBY205/MC9yczpmaXQ6NTYw/OjMyMDoxOjAvZzpj/ZS9hSFIwY0hNNkx5/OXpkR0YwL2FXTXVk/MmxyYVdFdWJtOWov/YjI5cmFXVXVibVYw/TDJkMS9ibk51Wm01/eWIzTmxjeTlwL2JX/Rm5aWE12WVM5aE5T/OUgvZFc1emJuSXRj/M2RsWlhSai9MbXB3/Wnk5eVpYWnBjMmx2/L2JpOXNZWFJsYzNR/dmMyTmgvYkdVdGRH/OHRkMmxrZEdndC9a/RzkzYmk4eU1EQV9Z/Mkk5L01qQXhNVEEy/TWpFd01USTAvTVRZ.jpeg",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    liked: false,
    explicit: false,
    popularity: 88,
    releaseDate: "1987-07-21",
    genre: ["Hard Rock", "Heavy Metal"],
    preview: "https://p.scdn.co/mp3-preview/sample4",
  },
  {
    id: "track-5",
    title: "We Will Rock You",
    artist: "Queen",
    album: "News of the World",
    duration: 122,
    coverUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    liked: true,
    explicit: false,
    popularity: 94,
    releaseDate: "1977-10-07",
    genre: ["Rock", "Arena Rock"],
    preview: "https://p.scdn.co/mp3-preview/sample5",
  },
  {
    id: "track-6",
    title: "Another Brick in the Wall",
    artist: "Pink Floyd",
    album: "The Wall",
    duration: 238,
    coverUrl:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    liked: false,
    explicit: false,
    popularity: 90,
    releaseDate: "1979-11-30",
    genre: ["Progressive Rock", "Art Rock"],
    preview: "https://p.scdn.co/mp3-preview/sample6",
  },
];

export const sampleUser: User = {
  id: "user-1",
  name: "Music Lover",
  username: "music_lover",
  displayName: "Music Lover",
  email: "user@example.com",
  avatarUrl:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
  followers: 150,
  following: 200,
  isPremium: true,
  country: "AR",
  playlists: [],
  likedTracks: sampleTracks.filter((track) => track.liked),
  recentlyPlayed: [sampleTracks[0], sampleTracks[2], sampleTracks[4]],
};

export const samplePlaylists: Playlist[] = [
  {
    id: "playlist-1",
    name: "Rock Classics",
    description: "The best rock songs of all time",
    tracks: sampleTracks,
    coverUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    isPublic: true,
    createdBy: "user-1",
    owner: sampleUser,
    followers: 25000,
    createdAt: new Date("2024-01-15T10:00:00Z"),
    updatedAt: new Date("2024-06-01T15:30:00Z"),
  },
  {
    id: "playlist-2",
    name: "My Favorites",
    description: "Songs I absolutely love",
    tracks: sampleTracks.filter((track) => track.liked),
    coverUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
    isPublic: false,
    createdBy: "user-1",
    owner: sampleUser,
    followers: 0,
    createdAt: new Date("2024-02-20T08:15:00Z"),
    updatedAt: new Date("2024-06-08T12:00:00Z"),
  },
  {
    id: "playlist-3",
    name: "Workout Mix",
    description: "High energy songs for working out",
    tracks: [sampleTracks[4], sampleTracks[3], sampleTracks[1]],
    coverUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
    isPublic: true,
    createdBy: "user-1",
    owner: sampleUser,
    followers: 1200,
    createdAt: new Date("2024-03-10T14:22:00Z"),
    updatedAt: new Date("2024-05-25T09:45:00Z"),
  },
  {
    id: "playlist-4",
    name: "Chill Vibes",
    description: "Relaxing songs for a peaceful mood",
    tracks: [sampleTracks[2], sampleTracks[5]],
    coverUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    isPublic: true,
    createdBy: "user-1",
    owner: sampleUser,
    followers: 890,
    createdAt: new Date("2024-04-05T16:30:00Z"),
    updatedAt: new Date("2024-06-03T11:20:00Z"),
  },
];

sampleUser.playlists = samplePlaylists.map((p) => p.id);

export const sampleAlbums: Album[] = [
  {
    id: "album-1",
    name: "A Night at the Opera",
    artist: "Queen",
    artistId: sampleArtists[0].id,
    coverUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    releaseDate: "1975-10-31",
    totalTracks: 12,
    tracks: [sampleTracks[0]],
    genres: ["Rock", "Progressive Rock"],
    duration: 355,
    popularity: 95,
    releaseType: "album",
  },
  {
    id: "album-2",
    name: "Led Zeppelin IV",
    artist: "Led Zeppelin",
    artistId: sampleArtists[1].id,
    coverUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
    releaseDate: "1971-11-08",
    totalTracks: 8,
    tracks: [sampleTracks[1]],
    genres: ["Rock", "Hard Rock"],
    duration: 482,
    popularity: 92,
    releaseType: "album",
  },
];

export const popularGenres = [
  "Rock",
  "Pop",
  "Hip Hop",
  "Electronic",
  "Jazz",
  "Classical",
  "Country",
  "R&B",
  "Reggae",
  "Blues",
  "Folk",
  "Indie",
  "Metal",
  "Punk",
  "Alternative",
  "Latin",
];

export const defaultPlayerState = {
  currentTrack: null,
  isPlaying: false,
  isPaused: false,
  isLoading: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  isMuted: false,
  isShuffled: false,
  repeatMode: "off" as const,
  queue: [],
  history: [],
};

export const defaultAudioUrls = {
  demo1: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
  demo2:
    "https://file-examples.com/storage/fe86d2d8e1a86fb7f84b1ff/2017/11/file_example_MP3_700KB.mp3",
  silence:
    "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBDCBzvLZiTYIF2m98OScTQwOUarm7shvFA5SqOHvwmYdBjOB0fPbisIGLIDO8diJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwGJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBDCBzvLZiTYIF2m98OScTQwOUarm7shvFA5SqOHvwmYdBjOB0fPbisIGLIDO8diJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwGJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBDCBzvLZiTYIF2m98OScTQwOUarm7shvFA5SqOHvwmYdBjOB0fPbisIGLIDO8diJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwGJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBDCBzvLZiTYIF2m98OScTQwOUarm7shvFA5SqOHvwmYdBjOB0fPbisIGLIDO8diJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwGJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBDCBzvLZiTYIF2m98OScTQwOUarm7shvFA5SqOHvwmYdBjOB0fPbis",
};

```

## src\hooks\useAudio.ts

```
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Track,
  PlayerState,
  PlayerControls,
  VisualizerData,
  UseAudioReturn,
  RepeatMode,
} from "../types";

export const useAudio = (): UseAudioReturn => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const [playerState, setPlayerState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    isPaused: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isMuted: false,
    isShuffled: false,
    repeatMode: "off",
    queue: [],
    history: [],
  });

  const [visualizerData, setVisualizerData] = useState<VisualizerData>({
    frequencyData: [],
  });

  
  const initializeAudioContext = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaElementSource(
        audioRef.current
      );

      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);

      analyserRef.current.fftSize = 256;
    } catch (error) {
      console.warn("Audio context initialization failed:", error);
    }
  }, []);

  
  const updateVisualizerData = useCallback(() => {
    if (!analyserRef.current) return;

    const frequencyData = new Uint8Array(analyserRef.current.frequencyBinCount);
    const timeData = new Uint8Array(analyserRef.current.frequencyBinCount);

    analyserRef.current.getByteFrequencyData(frequencyData);
    analyserRef.current.getByteTimeDomainData(timeData);

    
    const frequencyArray = Array.from(frequencyData);
    const volume =
      frequencyArray.reduce((sum, value) => sum + value, 0) /
      frequencyArray.length;
    const peak = Math.max(...frequencyArray);
    const rms = Math.sqrt(
      frequencyArray.reduce((sum, value) => sum + value * value, 0) /
        frequencyArray.length
    );

    setVisualizerData((prev) => ({
      ...prev,
      frequencyData: Array.from(frequencyData),
      timeData: Array.from(timeData),
      volume: volume / 255,
      peak: peak / 255,
      rms: rms / 255,
    }));
  }, []);

  
  const loadTrack = useCallback((track: Track) => {
    if (!audioRef.current) return;

    setPlayerState((prev) => ({
      ...prev,
      currentTrack: track,
      currentTime: 0,
      duration: 0,
      isPlaying: false,
      isPaused: false,
      isLoading: true,
    }));

    audioRef.current.src = track.audioUrl;
    audioRef.current.load();
  }, []);

  
  const play = useCallback(async () => {
    if (!audioRef.current || !playerState.currentTrack) return;

    try {
      initializeAudioContext();
      await audioRef.current.play();
      setPlayerState((prev) => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error playing audio:", error);
      setPlayerState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, [playerState.currentTrack, initializeAudioContext]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setPlayerState((prev) => ({
      ...prev,
      isPlaying: false,
      isPaused: true,
    }));
  }, []);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = time;
    setPlayerState((prev) => ({ ...prev, currentTime: time }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return;

    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioRef.current.volume = clampedVolume;
    setPlayerState((prev) => ({
      ...prev,
      volume: clampedVolume,
      isMuted: clampedVolume === 0,
    }));
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;

    setPlayerState((prev) => {
      const newMuted = !prev.isMuted;
      audioRef.current!.volume = newMuted ? 0 : prev.volume;
      return { ...prev, isMuted: newMuted };
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setPlayerState((prev) => ({ ...prev, isShuffled: !prev.isShuffled }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setPlayerState((prev) => {
      const modes: RepeatMode[] = ["off", "one", "all"];
      const currentIndex = modes.indexOf(prev.repeatMode);
      const nextIndex = (currentIndex + 1) % modes.length;
      return { ...prev, repeatMode: modes[nextIndex] };
    });
  }, []);

  const next = useCallback(() => {
    setPlayerState((prev) => {
      if (prev.queue.length === 0) return prev;

      const currentIndex = prev.queue.findIndex(
        (track) => track.id === prev.currentTrack?.id
      );
      let nextIndex = currentIndex + 1;

      if (prev.isShuffled) {
        nextIndex = Math.floor(Math.random() * prev.queue.length);
      } else if (nextIndex >= prev.queue.length) {
        nextIndex = prev.repeatMode === "all" ? 0 : currentIndex;
      }

      const nextTrack = prev.queue[nextIndex];
      if (nextTrack && nextTrack.id !== prev.currentTrack?.id) {
        loadTrack(nextTrack);
        return {
          ...prev,
          currentTrack: nextTrack,
          history: prev.currentTrack
            ? [...prev.history, prev.currentTrack]
            : prev.history,
        };
      }

      return prev;
    });
  }, [loadTrack]);

  const previous = useCallback(() => {
    setPlayerState((prev) => {
      if (prev.currentTime > 3 && audioRef.current) {
        
        audioRef.current.currentTime = 0;
        return { ...prev, currentTime: 0 };
      }

      if (prev.history.length === 0) return prev;

      const previousTrack = prev.history[prev.history.length - 1];
      const newHistory = prev.history.slice(0, -1);

      loadTrack(previousTrack);
      return {
        ...prev,
        currentTrack: previousTrack,
        history: newHistory,
      };
    });
  }, [loadTrack]);

  const addToQueue = useCallback((track: Track) => {
    setPlayerState((prev) => ({
      ...prev,
      queue: [...prev.queue, track],
    }));
  }, []);

  const removeFromQueue = useCallback((trackId: string) => {
    setPlayerState((prev) => ({
      ...prev,
      queue: prev.queue.filter((track) => track.id !== trackId),
    }));
  }, []);

  const controls: PlayerControls = {
    play,
    pause,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    addToQueue,
    removeFromQueue,
  };

  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setPlayerState((prev) => ({
        ...prev,
        currentTime: audio.currentTime,
        isPaused: audio.paused && !prev.isLoading,
      }));
    };

    const handleDurationChange = () => {
      setPlayerState((prev) => ({ ...prev, duration: audio.duration || 0 }));
    };

    const handleEnded = () => {
      setPlayerState((prev) => {
        if (prev.repeatMode === "one") {
          audio.currentTime = 0;
          audio.play();
          return prev;
        } else {
          next();
          return { ...prev, isPlaying: false, isPaused: true };
        }
      });
    };

    const handleCanPlayThrough = () => {
      setPlayerState((prev) => ({
        ...prev,
        duration: audio.duration || 0,
        isLoading: false,
      }));
    };

    const handleLoadStart = () => {
      setPlayerState((prev) => ({ ...prev, isLoading: true }));
    };

    const handleError = (e: Event) => {
      console.error("Audio error:", e);
      setPlayerState((prev) => ({
        ...prev,
        isPlaying: false,
        isPaused: true,
        isLoading: false,
      }));
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplaythrough", handleCanPlayThrough);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("error", handleError);
    };
  }, [next]);

  
  useEffect(() => {
    let animationFrame: number;

    if (playerState.isPlaying && analyserRef.current) {
      const animate = () => {
        updateVisualizerData();
        animationFrame = requestAnimationFrame(animate);
      };
      animate();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [playerState.isPlaying, updateVisualizerData]);

  
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    audioRef: audioRef as React.RefObject<HTMLAudioElement>,
    playerState,
    controls,
    visualizerData,
  };
};

```

## src\index.tsx

```
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);




reportWebVitals();

```

## src\react-app-env.d.ts

```


```

## src\reportWebVitals.ts

```
import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

```

## src\setupTests.ts

```




import '@testing-library/jest-dom';

```

## src\types\types.ts

```




export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  audioUrl: string;
  coverUrl: string;
  liked: boolean;
  explicit?: boolean;
  year?: number;
  genre?: string | string[]; 
  genres?: string[]; 
  popularity?: number;
  releaseDate?: string;
  preview?: string; 
  previewUrl?: string; 
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  followers: number;
  verified: boolean;
  genres: string[];
  popularity?: number;
  topTracks: Track[];
}

export interface Album {
  id: string;
  name: string;
  artist: string; 
  artistId?: string;
  coverUrl: string;
  releaseDate: string;
  tracks: Track[];
  totalTracks: number;
  duration?: number;
  genres?: string[];
  popularity?: number;
  releaseType?: "album" | "single" | "ep";
  label?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  tracks: Track[];
  createdBy?: string;
  isPublic: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  owner?: User;
  followers?: number;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  avatarUrl: string;
  isPremium: boolean;
  playlists: string[] | Playlist[];
  username?: string;
  displayName?: string;
  followers?: number;
  following?: number;
  country?: string;
  likedTracks?: Track[];
  recentlyPlayed?: Track[];
}



export interface SearchFilters {
  type: "all" | "track" | "artist" | "album" | "playlist";
  explicit: boolean;
  year?: number;
  genre?: string;
}

export interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  filters?: SearchFilters;
  onFiltersChange?: (filters: SearchFilters) => void;
}



export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: "off" | "one" | "all";
  queue: Track[];
  history: Track[];
}

export interface PlayerControls {
  play: () => void | Promise<void>;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
}



export interface VisualizerData {
  frequencyData: number[]; 
  timeData?: number[]; 
  volume?: number;
  peak?: number;
  rms?: number;
}

export interface AudioVisualizerProps {
  audioData?: VisualizerData | number[];
  isPlaying: boolean;
  className?: string;
  barCount?: number;
  height?: number;
  color?: string;
  responsive?: boolean;
}



export interface SidebarProps {
  playlists: Playlist[];
  activePlaylist: string | null;
  onPlaylistSelect: (playlistId: string) => void;
  user: User;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export interface TrackListProps {
  tracks: Track[];
  currentTrack: Track | null;
  onTrackSelect: (track: Track) => void;
  onTrackLike: (trackId: string) => void;
  isLoading?: boolean;
  showHeader?: boolean;
  showAlbum?: boolean;
  showDuration?: boolean;
  showActions?: boolean;
}

export interface PlayerProps {
  playerState: PlayerState;
  controls: PlayerControls;
  className?: string;
  compact?: boolean;
}



export interface UseAudioReturn {
  audioRef: React.RefObject<HTMLAudioElement>;
  playerState: PlayerState;
  controls: PlayerControls;
  visualizerData: VisualizerData;
}



export type RepeatMode = "off" | "one" | "all";
export type SearchType = "all" | "track" | "artist" | "album" | "playlist";
export type PlayerEventType =
  | "play"
  | "pause"
  | "stop"
  | "next"
  | "previous"
  | "seek";
export type ReleaseType = "album" | "single" | "ep";



export const SEARCH_TYPES = [
  "all",
  "track",
  "artist",
  "album",
  "playlist",
] as const;
export const REPEAT_MODES = ["off", "one", "all"] as const;
export const RELEASE_TYPES = ["album", "single", "ep"] as const;

```

## src\types.ts

```




export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; 
  audioUrl: string;
  coverUrl: string;
  isLiked?: boolean;
  liked?: boolean; 
  explicit?: boolean;
  year?: number;
  genre?: string | string[]; 
  popularity?: number;
  releaseDate?: string;
  preview?: string;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  followers: number;
  verified: boolean;
  genres: string[];
  popularity: number;
  topTracks: Track[];
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  artistId: string;
  coverUrl: string;
  releaseDate: string;
  tracks: Track[];
  totalTracks: number;
  duration: number;
  genres: string[];
  popularity: number;
  releaseType: "album" | "single" | "ep";
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  tracks: Track[];
  createdBy: string;
  isPublic: boolean;
  createdAt: Date | string; 
  updatedAt: Date | string; 
  owner?: User;
  followers?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  isPremium: boolean;
  playlists: string[] | Playlist[]; 
  
  username?: string;
  displayName?: string;
  followers?: number;
  following?: number;
  country?: string;
  likedTracks?: Track[];
  recentlyPlayed?: Track[];
}



export interface SearchFilters {
  type: "all" | "track" | "artist" | "album" | "playlist";
  explicit: boolean;
  year?: number;
  genre?: string;
  duration?: {
    min?: number;
    max?: number;
  };
}

export interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  filters?: SearchFilters;
  onFiltersChange?: (filters: SearchFilters) => void;
}



export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: "off" | "one" | "all";
  queue: Track[];
  history: Track[];
}

export interface PlayerControls {
  play: () => void | Promise<void>;
  pause: () => void;
  stop?: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  setRepeatMode?: (mode: "off" | "one" | "all") => void;
  toggleRepeat?: () => void; 
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue?: () => void;
}



export interface VisualizerData {
  frequencyData: number[];
  timeData?: number[];
}

export interface AudioVisualizerProps {
  audioData?: number[] | VisualizerData;
  isPlaying: boolean;
  className?: string;
  
  barCount?: number;
  height?: number;
  color?: string;
  responsive?: boolean;
}



export interface SidebarProps {
  playlists: Playlist[];
  activePlaylist: string | null;
  onPlaylistSelect: (playlistId: string) => void;
  user: User;
  
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export interface TrackListProps {
  tracks: Track[];
  currentTrack: Track | null;
  onTrackSelect: (track: Track) => void;
  onTrackLike: (trackId: string) => void;
  isLoading?: boolean;
  
  showHeader?: boolean;
  showAlbum?: boolean;
  showDuration?: boolean;
  showActions?: boolean;
}

export interface PlayerProps {
  playerState: PlayerState;
  controls: PlayerControls;
  
  className?: string;
  compact?: boolean;
}



export interface UseAudioReturn {
  audioRef: React.RefObject<HTMLAudioElement>;
  playerState: PlayerState;
  controls: PlayerControls;
  visualizerData: number[] | VisualizerData;
}



export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface SearchResponse {
  tracks: Track[];
  playlists: Playlist[];
  total: number;
  hasMore: boolean;
}



export interface TrackEvent {
  type: "play" | "pause" | "like" | "share" | "add_to_playlist";
  trackId: string;
  timestamp: Date;
}

export interface PlaylistEvent {
  type: "create" | "update" | "delete" | "share";
  playlistId: string;
  timestamp: Date;
}



export type RepeatMode = "off" | "one" | "all";
export type SearchType = "all" | "track" | "artist" | "album" | "playlist";
export type PlayerEventType =
  | "play"
  | "pause"
  | "stop"
  | "next"
  | "previous"
  | "seek";



export const SEARCH_TYPES = [
  "all",
  "track",
  "artist",
  "album",
  "playlist",
] as const;
export const REPEAT_MODES = ["off", "one", "all"] as const;

```

## src\utils\formatTime.ts

```

export const formatTime = (
  seconds: number,
  showHours: boolean = false
): string => {
  if (isNaN(seconds) || seconds < 0) {
    return "0:00";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0 || showHours) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};


export const parseTimeToSeconds = (timeString: string): number => {
  const parts = timeString.split(":").map(Number);

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  } else if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  }

  return 0;
};


export const formatDuration = (seconds: number): string => {
  return formatTime(seconds, false);
};


export const getProgressPercentage = (
  currentTime: number,
  duration: number
): number => {
  if (!duration || duration === 0) return 0;
  return Math.min(100, Math.max(0, (currentTime / duration) * 100));
};

```

