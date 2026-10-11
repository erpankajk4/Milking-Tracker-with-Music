export function calculateElapsedSeconds(
  accumulatedMs: number,
  activeAnchorMs: number | null
): number {
  if (activeAnchorMs === null) {
    return Math.max(0, Math.floor(accumulatedMs / 1000));
  }
  const currentSegmentMs = Math.max(0, Date.now() - activeAnchorMs);
  return Math.max(0, Math.floor((accumulatedMs + currentSegmentMs) / 1000));
}

export function formatTimerDigits(totalSeconds: number): {
  hours: string;
  minutes: string;
  seconds: string;
  display: string;
} {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(safeSeconds / 3600);
  const mins = Math.floor((safeSeconds % 3600) / 60);
  const secs = safeSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  const hoursStr = pad(hrs);
  const minutesStr = pad(mins);
  const secondsStr = pad(secs);

  const display = hrs > 0 
    ? `${hoursStr}:${minutesStr}:${secondsStr}` 
    : `${minutesStr}:${secondsStr}`;

  return {
    hours: hoursStr,
    minutes: minutesStr,
    seconds: secondsStr,
    display
  };
}

export function validateQuantity(input: string): {
  isValid: boolean;
  value: number | null;
  errorKey?: 'quantityRequired' | 'quantityInvalid';
} {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: false, value: null, errorKey: 'quantityRequired' };
  }

  const parsed = Number(trimmed);
  if (isNaN(parsed) || !isFinite(parsed) || parsed <= 0) {
    return { isValid: false, value: null, errorKey: 'quantityInvalid' };
  }

  return { isValid: true, value: parsed };
}
