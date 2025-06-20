import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import TrackList from "./components/Tracklist";
import Player from "./components/Player";
import UserProfile from "./components/UserProfile/UserProfile";
import { useAudio } from "./hooks/useAudio";
import { samplePlaylists, sampleUser } from "./data/sampleData";
import { Playlist, Track, SearchFilters } from "./types";
import { Menu } from "lucide-react";
import "./App.css";

const App: React.FC = () => {
  const [activePlaylist, setActivePlaylist] = useState<string | null>(
    "playlist-1"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [playlists] = useState<Playlist[]>(samplePlaylists);
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    if (isMobile) {
      setSidebarOpen(false);
    }
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
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app">
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay active" onClick={closeSidebar} />
      )}

      <Sidebar
        playlists={playlists}
        activePlaylist={activePlaylist}
        onPlaylistSelect={handlePlaylistSelect}
        user={sampleUser}
        onShowProfile={handleShowProfile}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        isMobile={isMobile}
      />

      <main className="main-content">
        <div className="main-header">
          {isMobile && (
            <button className="mobile-menu-button" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
          )}
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
