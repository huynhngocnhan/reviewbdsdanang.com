import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type TabItem = {
  id: string;
  label: string;
};

type Props = {
  items: TabItem[];
};

const TabBarOverlay = ({ items }: Props) => {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [isCollapsed, setIsCollapsed] = useState(true);
  const isAutoScrollingRef = useRef(false);
  const autoScrollTimeoutRef = useRef<number | null>(null);

  const tabItems = useMemo(() => items, [items]);

  useEffect(() => {
    if (!tabItems.length) return;

    const sections = tabItems
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top),
          );

        if (isAutoScrollingRef.current) return;

        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-40px 0px -55% 0px",
        threshold: [0.1, 0.3, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [tabItems]);

  useEffect(() => {
    return () => {
      if (autoScrollTimeoutRef.current !== null) {
        window.clearTimeout(autoScrollTimeoutRef.current);
      }
    };
  }, []);

  const handleScroll = useCallback((targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      const offsetTop =
        element.getBoundingClientRect().top + window.scrollY - 40;
      setActiveId(targetId);
      isAutoScrollingRef.current = true;

      if (autoScrollTimeoutRef.current !== null) {
        window.clearTimeout(autoScrollTimeoutRef.current);
      }

      window.scrollTo({ top: offsetTop, behavior: "smooth" });

      autoScrollTimeoutRef.current = window.setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 700);
    }
  }, []);

  const activeIndex = tabItems.findIndex((i) => i.id === activeId);
  const progressPercent =
    tabItems.length > 1 ? (activeIndex / (tabItems.length - 1)) * 100 : 0;

  return (
    <>
      <style>{`
        .tbo-outer {
          position: fixed;
          right: 0;
          top: 35%;
          transform: translateY(-50%);
          z-index: 40;
          display: flex;
          align-items: center;
          flex-direction: row-reverse;
          animation: tbo-fadeIn 0.45s ease both;
        }

        @keyframes tbo-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* Card: slides in from the right, sitting LEFT of the toggle button */
        .tbo-card {
          position: relative;
          background: rgba(255, 251, 245, 0.93);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(160, 100, 50, 0.16);
          border-radius: 20px;
          padding: 8px 8px;
          box-shadow:
            0 8px 32px rgba(80, 40, 10, 0.10),
            0 1px 4px rgba(80, 40, 10, 0.07);
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 2px;
          /* Collapsed: pushed off-screen to the right */
          opacity: 0;
          pointer-events: none;
          transform: translateX(100%);
          margin-left: -44px;
          transition:
            opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            margin-left 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tbo-card.is-open {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(0);
          margin-left: 8px;
          animation: tbo-slideIn 0.38s cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        @keyframes tbo-slideIn {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* Thin progress track on the left inner edge */
        .tbo-track {
          position: absolute;
          left: 7px;
          top: 42px;
          bottom: 14px;
          width: 2px;
          border-radius: 2px;
          background: rgba(160, 100, 50, 0.13);
          pointer-events: none;
        }
        .tbo-track-fill {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          border-radius: 2px;
          background: linear-gradient(to bottom, #8B3A1A, #C07840);
          transition: height 0.55s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Header */
        .tbo-active-badge {
          font-family: 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #9B5A2A;
          text-align: center;
          padding: 2px 12px 8px;
          opacity: 1;
        }

        /* Nav items */
        .tbo-items-wrap {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .tbo-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px 8px 16px;
          border-radius: 7px;
          border: none;
          background: transparent;
          cursor: pointer;
          text-align: left;
          transition: background 0.18s ease;
          white-space: nowrap;
        }
        .tbo-item:hover {
          background: rgba(160, 100, 50, 0.09);
        }
        .tbo-item.is-active {
          background: rgba(139, 58, 26, 0.11);
        }

        /* Dot */
        .tbo-dot {
          flex-shrink: 0;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(160, 100, 50, 0.28);
          transition: all 0.25s ease;
        }
        .tbo-item:hover .tbo-dot {
          background: rgba(139, 58, 26, 0.50);
          transform: scale(1.15);
        }
        .tbo-item.is-active .tbo-dot {
          width: 9px;
          height: 9px;
          background: #8B3A1A;
          box-shadow: 0 0 0 3px rgba(139, 58, 26, 0.18);
          transform: scale(1);
        }

        /* Label */
        .tbo-label-text {
          font-family: 'Be Vietnam Pro', 'Segoe UI', system-ui, sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.015em;
          color: #7A5030;
          line-height: 1.3;
          max-width: 130px;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.18s, font-weight 0.18s;
        }
        .tbo-item:hover .tbo-label-text {
          color: #5a2210;
        }
        .tbo-item.is-active .tbo-label-text {
          font-weight: 700;
          color: #5a2210;
        }

        /* Toggle button — single, circular, stays at right edge */
        .tbo-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1.5px solid rgba(139, 58, 26, 0.30);
          background: rgba(255, 251, 245, 0.97);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          box-shadow: 0 3px 12px rgba(80, 40, 10, 0.14), 0 1px 3px rgba(80, 40, 10, 0.08);
          cursor: pointer;
          color: #7A3A10;
          transition: background 0.18s ease, border-color 0.18s, box-shadow 0.18s;
          flex-shrink: 0;
        }
        .tbo-toggle:hover {
          background: rgba(139, 58, 26, 0.09);
          border-color: rgba(139, 58, 26, 0.55);
          box-shadow: 0 4px 16px rgba(80, 40, 10, 0.20), 0 1px 3px rgba(80,40,10,0.10);
        }
        .tbo-toggle svg {
          flex-shrink: 0;
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        /* Collapsed: arrow points right ">" to open */
        .tbo-toggle.is-collapsed svg {
          transform: rotate(0deg);
        }
        /* Open: arrow points left "<" to close */
        .tbo-toggle:not(.is-collapsed) svg {
          transform: rotate(180deg);
        }

        /* Mobile: smaller everything */
        @media (max-width: 640px) {
          .tbo-label-text {
            max-width: 72px !important;
            font-size: 10.5px !important;
          }
          .tbo-card { padding: 8px 4px; }
          .tbo-item { padding: 5px 8px 5px 12px; gap: 6px; }
          .tbo-active-badge { font-size: 8px !important; padding: 2px 8px 6px !important; }
          .tbo-toggle { width: 32px; height: 32px; }
          .tbo-card { margin-left: -40px; }
          .tbo-card.is-open { margin-left: 6px; }
        }
      `}</style>

      <div className="tbo-outer" aria-label="Điều hướng nhanh dự án">
        {/* Single toggle button: ">" when closed, "<" when open */}
        <button
          type="button"
          className={`tbo-toggle${isCollapsed ? " is-collapsed" : ""}`}
          onClick={() => setIsCollapsed((v) => !v)}
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? "Mở điều hướng" : "Đóng điều hướng"}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M8.5 2L4 6L8.5 10"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Card: slides in from right, sits to the LEFT of the toggle */}
        <div className={`tbo-card${isCollapsed ? "" : " is-open"}`}>
          {/* Progress track */}
          <div className="tbo-track" aria-hidden="true">
            <div
              className="tbo-track-fill"
              style={{ height: `${progressPercent}%` }}
            />
          </div>

          {/* "Mục lục" header */}
          <p className="tbo-active-badge" aria-hidden="true">
            Mục lục
          </p>

          {/* Items */}
          <div className="tbo-items-wrap">
            {tabItems.map((item) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`tbo-item${isActive ? " is-active" : ""}`}
                  onClick={() => handleScroll(item.id)}
                  aria-label={item.label}
                  aria-current={isActive ? "location" : undefined}
                >
                  <span className="tbo-dot" aria-hidden="true" />
                  <span className="tbo-label-text">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default TabBarOverlay;
