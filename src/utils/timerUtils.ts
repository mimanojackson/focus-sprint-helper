
/**
 * Formats seconds into a MM:SS time string
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Formats a date into a human-readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
}

/**
 * Calculates percentage completion
 */
export function calculateProgress(current: number, total: number): number {
  return ((total - current) / total) * 100;
}

/**
 * Calculates the total focus time from sessions in minutes
 */
export function calculateTotalFocusTime(sessions: { duration: number; type: string; completed: boolean }[]): number {
  return sessions
    .filter(session => session.type === 'focus' && session.completed)
    .reduce((total, session) => total + session.duration, 0) / 60;
}

/**
 * Returns a human-readable time string from minutes
 */
export function formatTotalTime(minutes: number): string {
  if (minutes < 60) {
    return `${Math.floor(minutes)} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);
    return remainingMinutes > 0 
      ? `${hours} hr ${remainingMinutes} min` 
      : `${hours} hr`;
  }
}
