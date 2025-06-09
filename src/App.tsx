import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import TrackList from "./components/Tracklist";
import Player from "./components/Player";
import AudioVisualizer from "./components/AudioVisualizer";
import { useAudio } from "./hooks/useAudio";
import { samplePlaylists, sampleTracks, sampleUser } from "./data/sampleData";
import { Playlist, Track, SearchFilters } from "./types";
import "./App.css";

const App: React.FC = () => {
  // Estados principales
  const [activePlaylist, setActivePlaylist] = useState<string | null>(
    "playlist-1"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [playlists] = useState<Playlist[]>(samplePlaylists);

  // Estado para filtros
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    type: "all",
    explicit: true,
    year: undefined,
  });

  // Hook de audio personalizado
  const { audioRef, playerState, controls, visualizerData } = useAudio();

  // Playlist y tracks actuales
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

  // Cargar queue inicial cuando se selecciona una playlist
  useEffect(() => {
    if (currentPlaylist && currentPlaylist.tracks.length > 0) {
      // Limpiar queue actual y cargar nuevas canciones
      currentPlaylist.tracks.forEach((track) => {
        if (
          !playerState.queue.find((qTrack: Track) => qTrack.id === track.id)
        ) {
          controls.addToQueue(track);
        }
      });
    }
  }, [activePlaylist, currentPlaylist, controls, playerState.queue]);

  // Handlers
  const handlePlaylistSelect = (playlistId: string) => {
    setActivePlaylist(playlistId);
  };

  const handleTrackSelect = (track: Track) => {
    // Si no hay track actual o es diferente, cargar el nuevo
    if (!playerState.currentTrack || playerState.currentTrack.id !== track.id) {
      // Simular carga de track (en una app real esto vendría del hook useAudio)
      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.load();
      }

      // Aquí normalmente llamarías a un método del hook para cargar el track
      // controls.loadTrack(track);
    }

    // Reproducir
    if (playerState.isPlaying) {
      controls.pause();
    } else {
      controls.play();
    }
  };

  const handleTrackLike = (trackId: string) => {
    console.log("Toggle like for track:", trackId);
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <Sidebar
        playlists={playlists}
        activePlaylist={activePlaylist}
        onPlaylistSelect={handlePlaylistSelect}
        user={sampleUser}
      />

      {/* Contenido principal */}
      <main className="main-content">
        {/* Header con búsqueda */}
        <div className="main-header">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Buscar canciones, artistas o álbumes..."
            filters={searchFilters}
            onFiltersChange={setSearchFilters}
          />
        </div>

        {/* Vista de playlist */}
        {currentPlaylist && (
          <div className="playlist-view">
            {/* Header de playlist */}
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

            {/* Lista de tracks */}
            <TrackList
              tracks={filteredTracks}
              currentTrack={playerState.currentTrack}
              onTrackSelect={handleTrackSelect}
              onTrackLike={handleTrackLike}
            />
          </div>
        )}

        {/* Mensaje cuando no hay playlist seleccionada */}
        {!currentPlaylist && (
          <div className="empty-state">
            <h2>Selecciona una playlist</h2>
            <p>
              Elige una playlist del sidebar para comenzar a escuchar música
            </p>
          </div>
        )}
      </main>

      {/* Reproductor */}
      <Player playerState={playerState} controls={controls} />

      {/* Audio element oculto */}
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />
    </div>
  );
};

export default App;
