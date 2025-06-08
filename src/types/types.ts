// types.ts - Tipos para proyecto con archivos .ts

// ========== TIPOS PARA AUDIO Y MÚSICA ==========

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  audioUrl: string;
  coverUrl: string;
  liked: boolean; // ← Usar 'liked' como en tu sampleData
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
  popularity?: number;
  topTracks: Track[];
}

export interface Album {
  id: string;
  name: string;
  artist: string | Artist; // Permitir ambos formatos
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
  // Propiedades adicionales de tu sampleData
  username?: string;
  displayName?: string;
  followers?: number;
  following?: number;
  country?: string;
  likedTracks?: Track[];
  recentlyPlayed?: Track[];
}

// ========== TIPOS PARA BÚSQUEDA ==========

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

// ========== TIPOS PARA REPRODUCTOR ==========

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

// ========== TIPOS PARA VISUALIZADOR ==========

export interface VisualizerData {
  frequencyData: Uint8Array | number[];
  timeData?: Uint8Array | number[];
  volume?: number;
  peak?: number;
  rms?: number;
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

// ========== TIPOS PARA COMPONENTES ==========

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

// ========== TIPOS PARA HOOKS ==========

export interface UseAudioReturn {
  audioRef: React.RefObject<HTMLAudioElement>;
  playerState: PlayerState;
  controls: PlayerControls;
  visualizerData: VisualizerData | null;
}

// ========== TIPOS AUXILIARES ==========

export type RepeatMode = "off" | "one" | "all";
