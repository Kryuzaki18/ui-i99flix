import { useState, useRef, useEffect, useCallback } from "react";

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
  isFullscreen: boolean;
  toggleFullscreen: () => Promise<void>;
  fullscreenRef: React.RefObject<HTMLDivElement | null>;
}

export function useFullscreen(): FullscreenControl {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef<HTMLDivElement | null>(null);

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
      // fail silently
    }
  }, []);

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
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [toggleFullscreen]);

  return { isFullscreen, toggleFullscreen, fullscreenRef };
}
