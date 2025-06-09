// src/data/sampleData.ts
import { Track, Playlist, Artist, Album, User } from "../types";

/* ARTISTS */
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

/* TRACKS */
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
    artist: "Guns N' Roses", // ← CORREGIDO: nombre correcto
    album: "Appetite for Destruction",
    duration: 356,
    coverUrl:
      "https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop",
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
    artist: "Pink Floyd", // ← CORREGIDO: nombre correcto
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

/* USER */
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

/* PLAYLISTS */
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

// Asignar IDs de playlists al usuario
sampleUser.playlists = samplePlaylists.map((p) => p.id);

/* ALBUMS */
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

/* POPULAR GENRES */
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

/* DEFAULT PLAYER STATE */
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

/* AUDIO DEMOS */
export const defaultAudioUrls = {
  demo1: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
  demo2:
    "https://file-examples.com/storage/fe86d2d8e1a86fb7f84b1ff/2017/11/file_example_MP3_700KB.mp3",
  silence:
    "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBDCBzvLZiTYIF2m98OScTQwOUarm7shvFA5SqOHvwmYdBjOB0fPbisIGLIDO8diJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwGJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBDCBzvLZiTYIF2m98OScTQwOUarm7shvFA5SqOHvwmYdBjOB0fPbisIGLIDO8diJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwGJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBDCBzvLZiTYIF2m98OScTQwOUarm7shvFA5SqOHvwmYdBjOB0fPbisIGLIDO8diJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwGJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBDCBzvLZiTYIF2m98OScTQwOUarm7shvFA5SqOHvwmYdBjOB0fPbisIGLIDO8diJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwGJHfH8N2QQAoUXrTp66hVFApGn+DyvmMeBDCBzvLZiTYIF2m98OScTQwOUarm7shvFA5SqOHvwmYdBjOB0fPbis",
};
