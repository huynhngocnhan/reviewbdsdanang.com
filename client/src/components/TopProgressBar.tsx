import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const TopProgressBar: React.FC = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const completeTimeoutRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (completeTimeoutRef.current) {
      window.clearTimeout(completeTimeoutRef.current);
      completeTimeoutRef.current = null;
    }
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const startProgress = () => {
    clearTimers();
    setIsVisible(true);
    setProgress(18);

    intervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return Math.min(prev + Math.random() * 12, 90);
      });
    }, 120);

    completeTimeoutRef.current = window.setTimeout(() => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setProgress(100);

      hideTimeoutRef.current = window.setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 220);
    }, 650);
  };

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const clickable = target?.closest("button, a, [role='button']");
      if (!clickable) return;
      if (clickable.getAttribute("data-no-progress") === "true") return;
      startProgress();
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, []);

  useEffect(() => {
    startProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed left-0 top-0 z-[9999] h-1 w-full transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="h-full bg-gradient-to-r from-yellow-400 via-amber-500 to-amber-700 shadow-[0_0_12px_rgba(245,158,11,0.75)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default TopProgressBar;
