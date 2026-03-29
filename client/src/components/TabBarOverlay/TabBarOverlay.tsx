import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type TabItem = {
  id: string;
  label: string;
};

type Props = {
  items: TabItem[];
};

const ToggleIcon = ({ isOpen }: { isOpen: boolean }) => {
  if (isOpen) {
    return (
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
        <path
          d="M5 5L15 15M15 5L5 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M12.5 4.5L6.5 10L12.5 15.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const TabBarOverlay = ({ items }: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
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
              Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top),
          );

        if (isAutoScrollingRef.current) {
          return;
        }

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

  return (
    <div className="fixed right-0 top-24 z-40 block w-44 sm:w-42">
      <nav
        className={`max-h-[62vh] w-full overflow-hidden rounded-l-lg bg-[#FAFAFA]/95 px-3 py-3 shadow-md backdrop-blur-sm transition-all duration-300 ${
          isOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-full opacity-0"
        }`}
        aria-label="Điều hướng nhanh dự án"
      >
        <div className="mb-2 border-b-2 border-[#876347]/40 pb-2">
          <p className="text-right text-[11px] font-bold uppercase tracking-[0.14em] text-[#876347]">
            Điều hướng nhanh
          </p>
        </div>

        <div className="max-h-[40vh] overflow-y-auto">
          <div className="flex flex-col gap-1">
            {tabItems.map((item) => {
              const isActive = activeId === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleScroll(item.id)}
                  className={`rounded-sm px-1.5 py-1.5 text-right text-[14px] leading-5 transition-all duration-200 ${
                    isActive
                      ? "font-semibold uppercase text-[#85542f] border-r-2 border-[#85542f] pr-2"
                      : "text-[#454444] font-medium hover:text-[#85542f]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`absolute z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#E3E3E3] bg-white text-[#3f3f3f] shadow-sm transition-all duration-300 hover:bg-[#F7F7F7] ${
          isOpen ? "-left-9 top-1" : "right-1 top-1"
        }`}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Đóng thanh điều hướng" : "Mở thanh điều hướng"}
      >
        <ToggleIcon isOpen={isOpen} />
      </button>
    </div>
  );
};

export default TabBarOverlay;
