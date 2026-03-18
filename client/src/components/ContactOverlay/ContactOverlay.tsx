import { useState } from "react";
import type React from "react";

type ContactOverlayProps = {
  phoneNumber?: string;
  zaloUrl?: string;
  tiktokUrl?: string;
  facebookUrl?: string;
};

const ContactOverlay: React.FC<ContactOverlayProps> = ({
  phoneNumber = "0900000000",
  zaloUrl = "https://zalo.me/0900000000",
  tiktokUrl = "https://www.tiktok.com/@reviewbdsdanang.com",
  facebookUrl = "https://www.facebook.com/Tienquangvilla"
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
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="60" height="60" viewBox="0 0 48 48">
        <path fill="#2962ff" d="M15,36V6.827l-1.211-0.811C8.64,8.083,5,13.112,5,19v10c0,7.732,6.268,14,14,14h10	c4.722,0,8.883-2.348,11.417-5.931V36H15z"></path><path fill="#eee" d="M29,5H19c-1.845,0-3.601,0.366-5.214,1.014C10.453,9.25,8,14.528,8,19	c0,6.771,0.936,10.735,3.712,14.607c0.216,0.301,0.357,0.653,0.376,1.022c0.043,0.835-0.129,2.365-1.634,3.742	c-0.162,0.148-0.059,0.419,0.16,0.428c0.942,0.041,2.843-0.014,4.797-0.877c0.557-0.246,1.191-0.203,1.729,0.083	C20.453,39.764,24.333,40,28,40c4.676,0,9.339-1.04,12.417-2.916C42.038,34.799,43,32.014,43,29V19C43,11.268,36.732,5,29,5z"></path><path fill="#2962ff" d="M36.75,27C34.683,27,33,25.317,33,23.25s1.683-3.75,3.75-3.75s3.75,1.683,3.75,3.75	S38.817,27,36.75,27z M36.75,21c-1.24,0-2.25,1.01-2.25,2.25s1.01,2.25,2.25,2.25S39,24.49,39,23.25S37.99,21,36.75,21z"></path><path fill="#2962ff" d="M31.5,27h-1c-0.276,0-0.5-0.224-0.5-0.5V18h1.5V27z"></path><path fill="#2962ff" d="M27,19.75v0.519c-0.629-0.476-1.403-0.769-2.25-0.769c-2.067,0-3.75,1.683-3.75,3.75	S22.683,27,24.75,27c0.847,0,1.621-0.293,2.25-0.769V26.5c0,0.276,0.224,0.5,0.5,0.5h1v-7.25H27z M24.75,25.5	c-1.24,0-2.25-1.01-2.25-2.25S23.51,21,24.75,21S27,22.01,27,23.25S25.99,25.5,24.75,25.5z"></path><path fill="#2962ff" d="M21.25,18h-8v1.5h5.321L13,26h0.026c-0.163,0.211-0.276,0.463-0.276,0.75V27h7.5	c0.276,0,0.5-0.224,0.5-0.5v-1h-5.321L21,19h-0.026c0.163-0.211,0.276-0.463,0.276-0.75V18z"></path>
        </svg>
      ),
    },
    {
      label: "Facebook",
      href: facebookUrl,
      target: "_blank",
      delay: "delay-[60ms]",
      bg: "bg-white",
      ring: "hover:ring-blue-300",
      icon: (
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
      <path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z"></path>
  </svg>
      ),
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
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
          <path d="M6.62 10.79a15.466 15.466 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C10.85 21 3 13.15 3 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
        </svg>
        )}
      </button>
    </div>
  );
};

export default ContactOverlay;
