/**
 * useFullscreen
 *
 * Wraps the browser Fullscreen API with a clean React interface.
 *
 * - Targets a specific element (the video container) so only the player
 *   goes fullscreen, not the entire page.
 * - Syncs `isFullscreen` state via the `fullscreenchange` event so pressing
 *   Esc (which the browser handles natively) keeps the icon correct.
 * - Provides an `F` keyboard shortcut and double-click handler.
 * - Handles vendor-prefixed APIs (webkit) for Safari compatibility.
 *
 * Usage:
 *   const { isFullscreen, toggleFullscreen, fullscreenRef } = useFullscreen();
 *   <div ref={fullscreenRef} onDoubleClick={toggleFullscreen}>…</div>
 *   <Button onClick={toggleFullscreen} icon={isFullscreen ? <CompressOutlined /> : <ExpandOutlined />} />
 */

import { useState, useRef, useEffect, useCallback } from "react";

// Vendor-prefixed helpers for Safari
function enterFullscreen(el: HTMLElement): Promise<void> {
  if (el.requestFullscreen) return el.requestFullscreen();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((el as any).webkitRequestFullscreen)
    return (el as any).webkitRequestFullscreen();
  return Promise.resolve();
}

function exitFullscreen(): Promise<void> {
  if (document.exitFullscreen) return document.exitFullscreen();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((document as any).webkitExitFullscreen)
    return (document as any).webkitExitFullscreen();
  return Promise.resolve();
}

function getFullscreenElement(): Element | null {
  return (
    document.fullscreenElement ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (document as any).webkitFullscreenElement ??
    null
  );
}

export interface FullscreenControl {
  /** Whether the player is currently fullscreen */
  isFullscreen: boolean;
  /** Toggle fullscreen on/off */
  toggleFullscreen: () => Promise<void>;
  /** Attach this ref to the element you want to go fullscreen */
  fullscreenRef: React.RefObject<HTMLDivElement | null>;
}

export function useFullscreen(): FullscreenControl {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef<HTMLDivElement | null>(null);

  // ── Sync state when fullscreen changes (e.g. user presses Esc) ───────────
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(getFullscreenElement() === fullscreenRef.current);
    };

    document.addEventListener("fullscreenchange", handleChange);
    document.addEventListener("webkitfullscreenchange", handleChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
      document.removeEventListener("webkitfullscreenchange", handleChange);
    };
  }, []);

  // ── Toggle ────────────────────────────────────────────────────────────────
  const toggleFullscreen = useCallback(async () => {
    const el = fullscreenRef.current;
    if (!el) return;

    try {
      if (getFullscreenElement()) {
        await exitFullscreen();
      } else {
        await enterFullscreen(el);
      }
    } catch {
      // Fullscreen request may be rejected if not triggered by a user gesture
      // or if the browser doesn't support it — fail silently.
    }
  }, []);

  // ── F key shortcut ────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.code === "KeyF") {
        e.preventDefault();
        toggleFullscreen();
      }
      // Esc is handled natively by the browser — no need to wire it here
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [toggleFullscreen]);

  return { isFullscreen, toggleFullscreen, fullscreenRef };
}
