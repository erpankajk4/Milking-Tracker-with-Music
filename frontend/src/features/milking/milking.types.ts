export type SessionStatus = 'idle' | 'running' | 'paused' | 'awaiting_quantity' | 'saving';

export type AudioStatus = 'idle' | 'playing' | 'paused' | 'error';

export interface MilkingSessionState {
  status: SessionStatus;
  startTime: string | null;
  endTime: string | null;
  activeAnchorMs: number | null;
  accumulatedMs: number;
  durationSeconds: number;
  audioStatus: AudioStatus;
  audioErrorMessage: string | null;
  milkQuantity: string;
  saveError: string | null;
}

export interface CreateSessionPayload {
  start_time: string;
  end_time: string;
  duration: number;
  milk_quantity: number;
}

export interface SessionRecord {
  id: string;
  start_time: string;
  end_time: string;
  duration: number;
  milk_quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ field?: string; message?: string }>;
  };
}
