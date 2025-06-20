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
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
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
