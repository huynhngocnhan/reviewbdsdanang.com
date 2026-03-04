type ContactOverlayProps = {
  phoneNumber?: string;
  zaloUrl?: string;
};

const ContactOverlay: React.FC<ContactOverlayProps> = ({
  phoneNumber = "0900000000",
  zaloUrl = "https://zalo.me/0900000000",
}) => {
  return (
    <div className="fixed bottom-5 right-5 z-[1000] flex flex-col items-end gap-3">
      <a
        href={zaloUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Liên hệ qua Zalo"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#0068FF] text-white shadow-lg transition hover:scale-105"
      >
        <span className="text-sm font-bold">Zalo</span>
      </a>

      <a
        href={`tel:${phoneNumber}`}
        aria-label="Gọi điện thoại"
        className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#f29999] bg-[#f9d8d8] shadow-lg"
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ef4444]/20" />
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#ef4444] text-white">
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
            <path d="M6.62 10.79a15.466 15.466 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C10.85 21 3 13.15 3 3a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
          </svg>
        </span>
      </a>
    </div>
  );
};

export default ContactOverlay;
