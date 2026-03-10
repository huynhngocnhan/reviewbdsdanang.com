import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { adminService } from "../../services/admin.service";

type FooterAdminProfile = {
  fullName?: string;
  title?: string;
  tagline?: string;
  phone?: string;
  address?: string;
  avatarAsset?: {
    url: string;
  };
  mediaLinks?: unknown;
};

type FooterAdminData = {
  id: string;
  email?: string;
  profile?: FooterAdminProfile | null;
};

type SocialLink = {
  label: string;
  url: string;
};

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop";

const Footer: React.FC = () => {
  const [admin, setAdmin] = useState<FooterAdminData | null>(null);

  useEffect(() => {

    const fetchAdmin = async () => {
      try {
        const respone = await adminService.getAdmin();
        if (respone) {
        setAdmin(respone.admin)
        }
      } catch {
        setAdmin(null);
      }
    };
    void fetchAdmin();
  }, []);

  const profile = admin?.profile;
  const fullName = profile?.fullName ?? "Chuyên viên tư vấn BĐS";
  const title = profile?.title ?? "Tư vấn mua bán bất động sản tại Đà Nẵng";
  const tagline = profile?.tagline ?? "Kết nối sản phẩm phù hợp, pháp lý rõ ràng, hỗ trợ nhanh và minh bạch.";
  const phone = profile?.phone ?? "0900 000 000";
  const email = admin?.email ?? "contact@example.com";
  const address = profile?.address ?? "Đà Nẵng, Việt Nam";
  const avatarUrl = profile?.avatarAsset?.url  ?? FALLBACK_AVATAR;

  const socialLinks = useMemo<SocialLink[]>(() => {
    if (!Array.isArray(profile?.mediaLinks)) return [];

    return (profile.mediaLinks as unknown[])
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean)
      .map((url) => ({ url, label: detectSocialLabel(url) }))
      .slice(0, 5);
  }, [profile?.mediaLinks]);

  return (
    <footer className="border-t border-amber-100 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div
          data-aos="fade-up"
          data-aos-duration="800"
          className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-8 lg:gap-10"
        >
          <div className="mx-auto shrink-0 sm:mx-0">
            <div className="rounded-2xl border border-amber-200 bg-white p-2 shadow-sm">
              <img
                src={admin?.profile?.avatarAsset?.url || avatarUrl}
                alt={fullName}
                className="h-28 w-28 rounded-xl object-cover sm:h-40 sm:w-40"
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src = FALLBACK_AVATAR;
                  event.currentTarget.onerror = null;
                }}
              />
            </div>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="text-center sm:text-left lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">reviewbdsdanang.com</p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">{fullName}</h3>
              <p className="mt-2 text-sm font-medium text-gray-700">{title}</p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600">{tagline}</p>

              <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
                <ContactChip href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</ContactChip>
                <ContactChip href={`mailto:${email}`}>{email}</ContactChip>
                <ContactChip>{address}</ContactChip>
              </div>
            </div>

            <div className="text-center sm:text-left lg:col-span-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-900">Kết nối nhanh</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <SocialButton href={`tel:${phone.replace(/\s+/g, "")}`} label="Gọi ngay">
                  <PhoneIcon className="h-4 w-4" />
                  Gọi ngay
                </SocialButton>
                <SocialButton href={`mailto:${email}`} label="Email">
                  <MailIcon className="h-4 w-4" />
                  Email
                </SocialButton>
                {socialLinks.map((item) => (
                  <SocialButton key={item.url} href={item.url} label={item.label} isExternal>
                    {getSocialIcon(item.label)}
                    {item.label}
                  </SocialButton>
                ))}
              </div>

              <p className="mt-5 text-xs leading-relaxed text-gray-500">
                Thông tin trong website là minh bạch và được cập nhật thường xuyên từ hồ sơ admin.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-100 pt-5 text-center text-xs text-gray-500 sm:flex sm:items-center sm:justify-between sm:text-left">
          <p>© 2026 {fullName}. All rights reserved.</p>
          <p className="mt-1 sm:mt-0">Website designed by Huynh Ngoc Nhan.</p>
        </div>
      </div>
    </footer>
  );
};

const ContactChip: React.FC<React.PropsWithChildren<{ href?: string }>> = ({ href, children }) => {
  const cls =
    "inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-700 whitespace-nowrap";

  if (!href) return <span className={cls}>{children}</span>;

  return (
    <a href={href} className={`${cls} transition hover:border-amber-300 hover:bg-amber-50`}>
      {children}
    </a>
  );
};

const SocialButton: React.FC<
  React.PropsWithChildren<{ href: string; label: string; isExternal?: boolean }>
> = ({ href, label, isExternal = false, children }) => {
  return (
    <a
      href={href}
      aria-label={label}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-800 transition hover:bg-amber-50"
    >
      {children}
    </a>
  );
};

const detectSocialLabel = (url: string) => {
  if (url.includes("facebook.com")) return "Facebook";
  if (url.includes("zalo.me")) return "Zalo";
  if (url.includes("tiktok.com")) return "TikTok";
  if (url.includes("youtube.com")) return "YouTube";
  if (url.includes("linkedin.com")) return "LinkedIn";
  if (url.includes("instagram.com")) return "Instagram";

  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "Liên kết";
  }
};

const getSocialIcon = (label: string) => {
  if (label === "Facebook") return <FacebookIcon className="h-4 w-4" />;
  if (label === "Zalo") return <ZaloIcon className="h-4 w-4" />;
  if (label === "TikTok") return <TikTokIcon className="h-4 w-4" />;
  if (label === "YouTube") return <YouTubeIcon className="h-4 w-4" />;
  if (label === "LinkedIn") return <LinkedInIcon className="h-4 w-4" />;
  if (label === "Instagram") return <InstagramIcon className="h-4 w-4" />;

  return <LinkIcon className="h-4 w-4" />;
};

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z"
      fill="currentColor"
    />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm2-.5a.5.5 0 00-.3.1L12 11l6.3-5.4a.5.5 0 00-.3-.1H6zm13.5 2.1L12.6 13.4a1 1 0 01-1.2 0L4.5 7.6V18a.5.5 0 00.5.5h14a.5.5 0 00.5-.5V7.6z"
      fill="currentColor"
    />
  </svg>
);

const LinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.59 13.41a1 1 0 010-1.41l3-3a3 3 0 114.24 4.24l-1.5 1.5a1 1 0 11-1.42-1.41l1.5-1.5a1 1 0 10-1.41-1.42l-3 3a1 1 0 01-1.41 0zM13.41 10.59a1 1 0 010 1.41l-3 3a3 3 0 11-4.24-4.24l1.5-1.5a1 1 0 111.42 1.41l-1.5 1.5a1 1 0 101.41 1.42l3-3a1 1 0 011.41 0z"
      fill="currentColor"
    />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 21v-7h2.3l.4-2.7h-2.7V9.6c0-.8.2-1.3 1.3-1.3h1.5V6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V11H7v2.7h2.6v7h3.9z" />
  </svg>
);

const ZaloIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.028 11.23c0-4.63-4.49-8.383-10.028-8.383-5.539 0-10.028 3.753-10.028 8.383 0 1.696.598 3.272 1.621 4.582l-1.464 4.195a.625.625 0 00.865.753l4.634-2.146c1.29.56 2.748.88 4.372.88 5.539 0 10.028-3.753 10.028-8.383z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.525.02c1.31 0 2.57.34 3.66.93V7.1a5.41 5.41 0 01-3.66-1.5V17.5a5.5 5.5 0 11-5.5-5.5c.58 0 1.13.1 1.64.28V4.83a9.4 9.4 0 00-1.64-.15 9.5 9.5 0 109.5 9.5V7.64c.94.7 2.05 1.14 3.27 1.25V5.13a4.01 4.01 0 01-3.66-3.63V.02h-3.61z" />
  </svg>
);

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5a4.25 4.25 0 004.25 4.25h8.5a4.25 4.25 0 004.25-4.25v-8.5a4.25 4.25 0 00-4.25-4.25h-8.5zm9.75 1.75a1 1 0 110 2 1 1 0 010-2zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
  </svg>
);

export default Footer;
