import { useState } from "react";
import type React from "react";

type ContactOverlayProps = {
  phoneNumber?: string;
  zaloUrl?: string;
  tiktokUrl?: string;
};

const ContactOverlay: React.FC<ContactOverlayProps> = ({
  phoneNumber = "0900000000",
  zaloUrl = "https://zalo.me/0900000000",
  tiktokUrl = "https://www.tiktok.com/@reviewbdsdanang.com",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const contacts = [
    {
      label: "TikTok",
      href: tiktokUrl,
      target: "_blank",
      delay: "delay-[0ms]",
      bg: "bg-black",
      ring: "hover:ring-gray-400",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
        </svg>
      ),
    },
    {
      label: "Zalo",
      href: zaloUrl,
      target: "_blank",
      delay: "delay-[60ms]",
      bg: "bg-[#0068FF]",
      ring: "hover:ring-blue-300",
      icon: <span className="text-xs font-bold tracking-tight">Zalo</span>,
    },
    {
      label: "Gọi điện",
      href: `tel:${phoneNumber}`,
      target: undefined,
      delay: "delay-[120ms]",
      bg: "bg-[#ef4444]",
      ring: "hover:ring-red-300",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
          <path d="M6.62 10.79a15.466 15.466 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C10.85 21 3 13.15 3 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-[1000] flex flex-col items-end gap-3">
      {/* Contact icons */}
      {contacts.map((item, i) => (
        <a
          key={item.label}
          href={item.href}
          target={item.target}
          rel={item.target === "_blank" ? "noreferrer" : undefined}
          aria-label={item.label}
          className={`
            flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg
            ring-2 ring-transparent ring-offset-2 transition-all duration-300
            hover:scale-110 hover:shadow-xl ${item.bg} ${item.ring}
            ${isOpen ? `opacity-100 translate-y-0 ${item.delay}` : "opacity-0 translate-y-4 pointer-events-none"}
          `}
          style={{
            transitionDelay: isOpen ? `${i * 60}ms` : `${(contacts.length - 1 - i) * 40}ms`,
          }}
        >
          {item.icon}
        </a>
      ))}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Đóng menu liên hệ" : "Mở menu liên hệ"}
        className={`
          relative flex h-14 w-14 items-center justify-center rounded-full shadow-xl
          transition-all duration-300 hover:scale-110
          ${isOpen
            ? "bg-[#8F6552] rotate-90"
            : "bg-[#8F6552] hover:bg-[#7a5444]"
          }
        `}
      >
        {/* Ping ring khi đóng */}
        {!isOpen && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8F6552]/40" />
        )}
        {isOpen ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current text-white" aria-hidden="true">
            <path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current text-white" aria-hidden="true">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ContactOverlay;
