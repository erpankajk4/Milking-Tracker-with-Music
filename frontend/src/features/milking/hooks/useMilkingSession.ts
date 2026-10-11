'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { SessionStatus, AudioStatus, SessionRecord } from '../milking.types';
import { calculateElapsedSeconds, validateQuantity } from '../milking.utils';
import { saveMilkingSession, ApiError } from '../milking.api';

export function useMilkingSession(onSessionSaved?: (record: SessionRecord) => void) {
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [accumulatedMs, setAccumulatedMs] = useState<number>(0);
  const [activeAnchorMs, setActiveAnchorMs] = useState<number | null>(null);
  const [durationSeconds, setDurationSeconds] = useState<number>(0);

  const [audioStatus, setAudioStatus] = useState<AudioStatus>('idle');
  const [audioErrorMsg, setAudioErrorMsg] = useState<string | null>(null);

  const [milkQuantity, setMilkQuantity] = useState<string>('');
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element once in browser
  useEffect(() => {
    const audio = new Audio('/audio/calming-music.mp3');
    audio.loop = true;
    audio.preload = 'auto';

    const handleEnded = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    audio.addEventListener('ended', handleEnded);
    audioRef.current = audio;

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Drift-free visual timer refresh during 'running' state
  useEffect(() => {
    if (status !== 'running') {
      return;
    }

    const updateTimer = () => {
      setDurationSeconds(calculateElapsedSeconds(accumulatedMs, activeAnchorMs));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 250);

    return () => clearInterval(interval);
  }, [status, accumulatedMs, activeAnchorMs]);

  const attemptPlayAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setAudioStatus('playing');
    setAudioErrorMsg(null);

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setAudioStatus('playing');
          setAudioErrorMsg(null);
        })
        .catch((err: unknown) => {
          // Playback blocked or failed
          setAudioStatus('error');
          setAudioErrorMsg(err instanceof Error ? err.message : 'Audio playback error');
        });
    }
  }, []);

  const pauseAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    if (audioStatus !== 'error') {
      setAudioStatus('paused');
    }
  }, [audioStatus]);

  const stopAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setAudioStatus('idle');
  }, []);

  // START
  const startMilking = useCallback(() => {
    const now = Date.now();
    const isoStart = new Date(now).toISOString();

    setStartTime(isoStart);
    setEndTime(null);
    setAccumulatedMs(0);
    setActiveAnchorMs(now);
    setDurationSeconds(0);
    setMilkQuantity('');
    setQuantityError(null);
    setSaveError(null);
    setStatus('running');

    attemptPlayAudio();
  }, [attemptPlayAudio]);

  // PAUSE
  const pauseMilking = useCallback(() => {
    if (status !== 'running') return;

    const now = Date.now();
    const newAccumulated = accumulatedMs + (activeAnchorMs ? now - activeAnchorMs : 0);

    setAccumulatedMs(newAccumulated);
    setActiveAnchorMs(null);
    setDurationSeconds(Math.floor(newAccumulated / 1000));
    setStatus('paused');

    pauseAudio();
  }, [status, accumulatedMs, activeAnchorMs, pauseAudio]);

  // RESUME
  const resumeMilking = useCallback(() => {
    if (status !== 'paused') return;

    const now = Date.now();
    setActiveAnchorMs(now);
    setStatus('running');

    attemptPlayAudio();
  }, [status, attemptPlayAudio]);

  // STOP
  const stopMilking = useCallback(() => {
    if (status !== 'running' && status !== 'paused') return;

    const now = Date.now();
    let finalAccumulated = accumulatedMs;
    if (status === 'running' && activeAnchorMs !== null) {
      finalAccumulated += now - activeAnchorMs;
    }

    const finalSecs = Math.max(1, Math.floor(finalAccumulated / 1000));

    setAccumulatedMs(finalAccumulated);
    setActiveAnchorMs(null);
    setEndTime(new Date(now).toISOString());
    setDurationSeconds(finalSecs);
    setStatus('awaiting_quantity');

    stopAudio();
  }, [status, accumulatedMs, activeAnchorMs, stopAudio]);

  // RETRY AUDIO (manual fallback if browser autoplay was blocked)
  const retryAudio = useCallback(() => {
    attemptPlayAudio();
  }, [attemptPlayAudio]);

  // SUBMIT QUANTITY & PERSIST
  const submitQuantity = useCallback(async () => {
    const validation = validateQuantity(milkQuantity);
    if (!validation.isValid || validation.value === null) {
      setQuantityError(validation.errorKey || 'quantityInvalid');
      return;
    }

    if (!startTime || !endTime) {
      setSaveError('Session timing data is incomplete');
      return;
    }

    setQuantityError(null);
    setSaveError(null);
    setStatus('saving');

    try {
      const savedRecord = await saveMilkingSession({
        start_time: startTime,
        end_time: endTime,
        duration: durationSeconds,
        milk_quantity: validation.value
      });

      // Reset state on successful save
      setStatus('idle');
      setStartTime(null);
      setEndTime(null);
      setAccumulatedMs(0);
      setActiveAnchorMs(null);
      setDurationSeconds(0);
      setMilkQuantity('');
      setSaveError(null);

      if (onSessionSaved) {
        onSessionSaved(savedRecord);
      }
    } catch (err: unknown) {
      // Retain stopped session and entered quantity so user can retry
      setStatus('awaiting_quantity');
      if (err instanceof ApiError) {
        setSaveError(err.message);
      } else if (err instanceof Error) {
        setSaveError(err.message);
      } else {
        setSaveError('An unexpected error occurred while saving.');
      }
    }
  }, [milkQuantity, startTime, endTime, durationSeconds, onSessionSaved]);

  // DISCARD SESSION
  const discardSession = useCallback(() => {
    stopAudio();
    setStatus('idle');
    setStartTime(null);
    setEndTime(null);
    setAccumulatedMs(0);
    setActiveAnchorMs(null);
    setDurationSeconds(0);
    setMilkQuantity('');
    setQuantityError(null);
    setSaveError(null);
    setIsDiscardModalOpen(false);
  }, [stopAudio]);

  return {
    status,
    startTime,
    endTime,
    durationSeconds,
    audioStatus,
    audioErrorMsg,
    milkQuantity,
    setMilkQuantity,
    quantityError,
    setQuantityError,
    saveError,
    isDiscardModalOpen,
    setIsDiscardModalOpen,
    startMilking,
    pauseMilking,
    resumeMilking,
    stopMilking,
    retryAudio,
    submitQuantity,
    discardSession
  };
}
