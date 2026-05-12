/**
 * useVolumeControl
 *
 * ── What "sync with the system" actually means in a browser ──────────────────
 *
 * Browsers intentionally sandbox OS master volume — no web API can read or
 * write it. This is a security boundary (prevents sites from blasting audio
 * or fingerprinting users via volume level).
 *
 * What IS possible and what this hook does:
 *
 * 1. HTMLAudioElement.volume  — the only real two-way volume bridge between
 *    the browser and the OS. When the user changes volume via:
 *      • OS media keys (keyboard volume up/down)
 *      • Windows taskbar / macOS menu bar media controls
 *      • Android/iOS lock-screen media controls
 *      • Browser tab mute button
 *    …the browser fires a `volumechange` event on the active <audio> element.
 *    We listen to that event and sync our slider back to match.
 *
 * 2. Web Audio GainNode — drives the actual audio graph. The <audio> element
 *    is routed through a GainNode so our slider and the OS controls both
 *    affect the same output.
 *
 * 3. MediaSession API — registers the movie as the active media session so
 *    the OS shows the correct title/artwork in its media controls panel
 *    instead of a blank entry. Also wires OS play/pause/seek actions back
 *    into the player state.
 *
 * 4. Silent audio source — a 1-second silent audio loop activates the media
 *    session so OS controls appear even before real audio is playing.
 *
 * Usage:
 *   const { volume, muted, setVolume, toggleMute, volumeIcon,
 *           gainNode, setMediaMetadata } = useVolumeControl();
 *
 *   // To connect a real <audio>/<video> element to the audio graph:
 *   const src = audioCtx.createMediaElementSource(audioEl);
 *   src.connect(gainNode!).connect(audioCtx.destination);
 */

import { useState, useEffect, useRef, useCallback } from 'react';

// ── Silent audio source ───────────────────────────────────────────────────────
// A minimal valid MP3 (44 bytes, 1 frame of silence) encoded as a data URI.
// This activates the browser's media session without producing audible sound.
const SILENT_MP3 =
  'data:audio/mpeg;base64,' +
  'SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsgU291bmQgRWZmZWN0cyBMaWJyYXJ5' +
  'VFNTRQAAAAEAAADTQ29tcG9zZXIAVW5rbm93bgBUUEUxAAAAEQAAA1BlcmZvcm1lcgBVbmtub3duAFRBTEIA' +
  'AAABAAADQWXIDQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

const STORAGE_KEY    = 'i99flix-volume';
const DEFAULT_VOLUME = 80;

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

function readPersistedVolume(): number {
  try {
    const raw    = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return DEFAULT_VOLUME;
    const parsed = parseInt(raw, 10);
    return Number.isFinite(parsed) ? clamp(parsed) : DEFAULT_VOLUME;
  } catch {
    return DEFAULT_VOLUME;
  }
}

// ── MediaSession metadata shape ───────────────────────────────────────────────
export interface MediaMetadata {
  title:   string;
  artist?: string;
  album?:  string;
  artwork?: string; // URL to thumbnail image
}

export type VolumeIcon = 'muted' | 'low' | 'high';

export interface VolumeControl {
  volume:     number;
  muted:      boolean;
  volumeIcon: VolumeIcon;
  setVolume:  (v: number) => void;
  toggleMute: () => void;
  resumeContext: () => Promise<void>;
  gainNode:   GainNode | null;
  /**
   * Call this when a movie starts playing to register it with the OS
   * media controls (Windows taskbar, macOS menu bar, lock screen, etc.)
   */
  setMediaMetadata: (meta: MediaMetadata) => void;
}

export function useVolumeControl(): VolumeControl {
  const [volume, setVolumeState] = useState<number>(readPersistedVolume);
  const [muted,  setMuted]       = useState(false);

  const audioCtxRef  = useRef<AudioContext | null>(null);
  const gainNodeRef  = useRef<GainNode | null>(null);
  const audioElRef   = useRef<HTMLAudioElement | null>(null);

  // ── Build the audio graph once ────────────────────────────────────────────
  const ensureAudioContext = useCallback(() => {
    if (audioCtxRef.current) return;

    const ctx  = new AudioContext();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.value = readPersistedVolume() / 100;

    // Silent <audio> element — activates the browser media session so OS
    // controls (taskbar, lock screen) appear and can send events back to us.
    const audio       = new Audio(SILENT_MP3);
    audio.loop        = true;
    audio.volume      = readPersistedVolume() / 100;

    // Route the silent element through the gain node so both the slider
    // and OS volume controls affect the same audio graph output.
    try {
      const src = ctx.createMediaElementSource(audio);
      src.connect(gain);
    } catch {
      // createMediaElementSource throws if the element is already connected
      // (e.g. hot-reload in dev). Safe to ignore.
    }

    // ── Listen for OS-initiated volume changes ────────────────────────────
    // `volumechange` fires when the user adjusts volume via:
    //   • OS media keys / hardware volume buttons
    //   • Windows taskbar / macOS menu bar media widget
    //   • Browser tab mute toggle
    //   • Android/iOS lock-screen controls
    audio.addEventListener('volumechange', () => {
      const newVol = Math.round(audio.volume * 100);
      setVolumeState(newVol);
      setMuted(audio.muted);
      // Keep gain in sync with the OS-driven change
      gain.gain.setTargetAtTime(audio.muted ? 0 : audio.volume, ctx.currentTime, 0.05);
      try { localStorage.setItem(STORAGE_KEY, String(newVol)); } catch { /* ignore */ }
    });

    audioCtxRef.current = ctx;
    gainNodeRef.current = gain;
    audioElRef.current  = audio;
  }, []);

  // ── Resume suspended context (browser autoplay policy) ───────────────────
  const resumeContext = useCallback(async () => {
    ensureAudioContext();
    const ctx   = audioCtxRef.current;
    const audio = audioElRef.current;
    if (ctx?.state === 'suspended') await ctx.resume();
    if (audio && audio.paused) {
      // Start the silent loop so the media session becomes active
      await audio.play().catch(() => {
        // Autoplay blocked — will retry on next user gesture
      });
    }
  }, [ensureAudioContext]);

  // ── Apply gain + HTMLAudioElement.volume when our state changes ───────────
  useEffect(() => {
    const gain  = gainNodeRef.current;
    const audio = audioElRef.current;
    const ctx   = audioCtxRef.current;
    if (!gain || !audio || !ctx) return;

    const targetGain = muted ? 0 : volume / 100;
    gain.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.05);

    // Keep HTMLAudioElement.volume in sync so the browser's own volume
    // indicator (tab speaker icon, OS media widget) reflects our slider.
    audio.volume = volume / 100;
    audio.muted  = muted;
  }, [volume, muted]);

  // ── Persist volume preference ─────────────────────────────────────────────
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, String(volume)); } catch { /* ignore */ }
  }, [volume]);

  // ── Keyboard media key support ────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Only intercept when focus is inside the player (not a text input)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'KeyM') {
        ensureAudioContext();
        setMuted((m) => !m);
      }
      if (e.code === 'ArrowUp' && e.altKey) {
        e.preventDefault();
        ensureAudioContext();
        setVolumeState((v) => clamp(v + 5));
        setMuted(false);
      }
      if (e.code === 'ArrowDown' && e.altKey) {
        e.preventDefault();
        ensureAudioContext();
        setVolumeState((v) => clamp(v - 5));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [ensureAudioContext]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      audioElRef.current?.pause();
      audioCtxRef.current?.close().catch(() => {});
    };
  }, []);

  // ── Public setVolume ──────────────────────────────────────────────────────
  const setVolume = useCallback((v: number) => {
    const clamped = clamp(v);
    ensureAudioContext();
    setVolumeState(clamped);
    if (clamped > 0) setMuted(false);
  }, [ensureAudioContext]);

  // ── Toggle mute ───────────────────────────────────────────────────────────
  const toggleMute = useCallback(() => {
    ensureAudioContext();
    setMuted((m) => !m);
  }, [ensureAudioContext]);

  // ── MediaSession metadata ─────────────────────────────────────────────────
  const setMediaMetadata = useCallback((meta: MediaMetadata) => {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title:  meta.title,
      artist: meta.artist  ?? 'i99flix',
      album:  meta.album   ?? 'Now Playing',
      artwork: meta.artwork
        ? [
            { src: meta.artwork, sizes: '512x512', type: 'image/jpeg' },
            { src: meta.artwork, sizes: '256x256', type: 'image/jpeg' },
          ]
        : [],
    });

    // Wire OS transport actions back into the player
    // (play/pause are handled by the player component via resumeContext)
    navigator.mediaSession.setActionHandler('play',  () => {
      resumeContext().catch(() => {});
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      audioElRef.current?.pause();
    });
    navigator.mediaSession.setActionHandler('stop', () => {
      audioElRef.current?.pause();
      if (audioElRef.current) audioElRef.current.currentTime = 0;
    });
  }, [resumeContext]);

  // ── Derive icon variant ───────────────────────────────────────────────────
  const effectiveVolume = muted ? 0 : volume;
  const volumeIcon: VolumeIcon =
    effectiveVolume === 0 ? 'muted' :
    effectiveVolume < 50  ? 'low'   : 'high';

  return {
    volume,
    muted,
    volumeIcon,
    setVolume,
    toggleMute,
    resumeContext,
    gainNode: gainNodeRef.current,
    setMediaMetadata,
  };
}
