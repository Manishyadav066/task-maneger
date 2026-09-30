export function formatDate(dateString?: string): string {
  if (!dateString) return 'No date';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTimeAgo(dateString?: string): string {
  if (!dateString) return '';
  const now = new Date();
  const past = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export function truncate(text: string, length = 30): string {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
}
