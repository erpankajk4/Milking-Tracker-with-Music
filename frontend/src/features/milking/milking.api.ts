import { CreateSessionPayload, SessionRecord, ApiErrorResponse } from './milking.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9041';

export class ApiError extends Error {
  code: string;
  statusCode: number;
  details?: Array<{ field?: string; message?: string }>;

  constructor(
    message: string,
    code = 'API_ERROR',
    statusCode = 500,
    details: Array<{ field?: string; message?: string }> = []
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export async function saveMilkingSession(payload: CreateSessionPayload): Promise<SessionRecord> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    throw new ApiError(
      'Network request failed. Please check your connection to the server.',
      'NETWORK_ERROR',
      0
    );
  }

  if (!response.ok) {
    let errorData: ApiErrorResponse | null = null;
    try {
      errorData = await response.json();
    } catch {
      // response wasn't json
    }

    const code = errorData?.error?.code || `HTTP_${response.status}`;
    const message = errorData?.error?.message || `Failed to save session (Status: ${response.status})`;
    const details = errorData?.error?.details || [];

    throw new ApiError(message, code, response.status, details);
  }

  return await response.json();
}

export async function fetchMilkingSessions(signal?: AbortSignal): Promise<SessionRecord[]> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      cache: 'no-store',
      signal
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    throw new ApiError(
      'Network request failed. Could not reach backend server.',
      'NETWORK_ERROR',
      0
    );
  }

  if (!response.ok) {
    let errorData: ApiErrorResponse | null = null;
    try {
      errorData = await response.json();
    } catch {
      // not json
    }

    const code = errorData?.error?.code || `HTTP_${response.status}`;
    const message = errorData?.error?.message || `Failed to retrieve sessions (Status: ${response.status})`;

    throw new ApiError(message, code, response.status);
  }

  return await response.json();
}
