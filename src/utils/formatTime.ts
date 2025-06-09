
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
