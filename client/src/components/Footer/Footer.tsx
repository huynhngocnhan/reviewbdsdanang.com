import type React from "react";

type OwnerInfo = {
  profileImageUrl?: string;
  fullName?: string;
  title?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  address?: string;
  sunGroupProjects?: string[];
};

const Footer: React.FC<OwnerInfo> = ({
  profileImageUrl = "https://scontent.fdad3-6.fna.fbcdn.net/v/t39.30808-6/616774652_1156655896678102_766339363288306569_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHfibp6aDQdUWZrYHwyeNtmsN1qKP5ljUaw3Woo_mWNRgFvLiV7OOq_2HRyS-S891qC14r5kiEAhmufboiJ7csY&_nc_ohc=0J6VdhNiTJoQ7kNvwFU9U2N&_nc_oc=Adk31oBQXl5YWOUhpsOm3uvfHh5bRWlm2-iQUfSh3sGTHetrDos0KJh3YS2Kmz2nyUS8-Zq6a8ECTjFd_CGDqfVQ&_nc_zt=23&_nc_ht=scontent.fdad3-6.fna&_nc_gid=-rLBlUKH_yVnmr4NxLjKRw&oh=00_Aftrn4AjZwjbj78CvsTQK7E5wUDU8hHd36VoUnklpjsvIw&oe=698F683F",
  fullName = "Trần Tiến Quang",
  title = "Chuyên viên tư vấn BĐS",
  tagline =
    "Tư vấn minh bạch, đề xuất sản phẩm phù hợp, hỗ trợ pháp lý & giao dịch trọn gói.",
  email = "contact@example.com",
  phone = "0900 000 000",
  address = "Đà Nẵng, Việt Nam",
  sunGroupProjects = [],
}) => {
  return (
    <footer className="w-full bg-gradient-to-b from-amber-200/20 to-yellow-300/80 border-t border-amber-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 text-center md:text-left flex flex-col items-center md:items-start">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
              <div className="relative shrink-0">
                <div className="absolute -inset-1 rounded-2xl bg-amber-200/60 blur-sm" />
                <img
                  src={profileImageUrl}
                  alt={fullName}
                  className="relative h-20 w-20 rounded-2xl object-cover border border-amber-200 shadow-sm"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://scontent.fdad3-6.fna.fbcdn.net/v/t39.30808-6/616774652_1156655896678102_766339363288306569_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHfibp6aDQdUWZrYHwyeNtmsN1qKP5ljUaw3Woo_mWNRgFvLiV7OOq_2HRyS-S891qC14r5kiEAhmufboiJ7csY&_nc_ohc=0J6VdhNiTJoQ7kNvwFU9U2N&_nc_oc=Adk31oBQXl5YWOUhpsOm3uvfHh5bRWlm2-iQUfSh3sGTHetrDos0KJh3YS2Kmz2nyUS8-Zq6a8ECTjFd_CGDqfVQ&_nc_zt=23&_nc_ht=scontent.fdad3-6.fna&_nc_gid=-rLBlUKH_yVnmr4NxLjKRw&oh=00_Aftrn4AjZwjbj78CvsTQK7E5wUDU8hHd36VoUnklpjsvIw&oe=698F683F";
                    e.currentTarget.onerror = null;
                  }}
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-amber-700 tracking-wide">
                  {title}
                </p>
                <h3 className="text-xl font-bold text-gray-900 truncate">
                  {fullName}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {tagline}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:border-amber-300 hover:shadow-sm transition"
                  >
                    <PhoneIcon className="h-4 w-4 text-amber-700" />
                    {phone}
                  </a>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:border-amber-300 hover:shadow-sm transition"
                  >
                    <MailIcon className="h-4 w-4 text-amber-700" />
                    {email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 text-center md:text-left mx-auto md:mx-0">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
              Liên hệ
            </h4>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <p className="flex items-start gap-2">
                <LocationIcon className="h-4 w-4 mt-0.5 text-amber-700" />
                <span className="leading-relaxed">{address}</span>
              </p>
              <p className="flex items-start gap-2">
                <ClockIcon className="h-4 w-4 mt-0.5 text-amber-700" />
                <span className="leading-relaxed">
                  Thứ 2 - CN: 08:00 - 20:00
                </span>
              </p>
              <p className="flex items-start gap-2">
                <ShieldIcon className="h-4 w-4 mt-0.5 text-amber-700" />
                <span className="leading-relaxed">
                  Cam kết bảo mật thông tin khách hàng
                </span>
              </p>
            </div>
          </div>

          <div className="md:col-span-4 text-center md:text-left mx-auto md:mx-0">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">
              Dự án Sun Group
            </h4>
            <div className="flex flex-col gap-4">
              {sunGroupProjects.length > 0 ? (
                sunGroupProjects.slice(0, 4).map((project) => (
                  <FooterLink key={project} href="#">
                    {project}
                  </FooterLink>
                ))
              ) : (
                <>
                  <FooterLink href="#">Sun Symphony Residence</FooterLink>
                  <FooterLink href="#">Sun Cosmo Residence</FooterLink>
                  <FooterLink href="#">Sun Ponte Residence</FooterLink>
                  <FooterLink href="#">Sun Olalani Đà Nẵng</FooterLink>
                </>
              )}
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                Kết nối
              </h4>
              <div className="mt-3 flex items-center gap-3">
                <SocialButton href="#" label="Facebook">
                  <FacebookIcon className="h-5 w-5" />
                </SocialButton>
                <SocialButton href="#" label="Zalo">
                  <ZaloIcon className="h-5 w-5" />
                </SocialButton>
                <SocialButton href={`tel:${phone.replace(/\s+/g, "")}`} label={`Gọi ${phone}`}>
                  <PhoneIcon className="h-5 w-5" />
                </SocialButton>
                <SocialButton href="#" label="TikTok">
                  <TikTokIcon className="h-5 w-5" />
                </SocialButton>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-amber-100 pt-6">
          <p className="text-xs text-gray-500">
            © 2026 {fullName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const FooterLink: React.FC<React.PropsWithChildren<{ href: string }>> = ({
  href,
  children,
}) => {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-3 text-sm font-semibold text-gray-700 hover:text-gray-900 transition"
    >
      <span className="h-px w-4 bg-amber-300 group-hover:w-8 transition-all duration-300" />
      <span className="leading-none">{children}</span>
    </a>
  );
};

const SocialButton: React.FC<
  React.PropsWithChildren<{ href: string; label: string }>
> = ({ href, label, children }) => {
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50 hover:text-gray-900 transition"
    >
      {children}
    </a>
  );
};

const ZaloIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M22.028 11.23c0-4.63-4.49-8.383-10.028-8.383-5.539 0-10.028 3.753-10.028 8.383 0 1.696.598 3.272 1.621 4.582l-1.464 4.195a.625.625 0 00.865.753l4.634-2.146c1.29.56 2.748.88 4.372.88 5.539 0 10.028-3.753 10.028-8.383z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.525.02c1.31 0 2.57.34 3.66.93V7.1a5.41 5.41 0 01-3.66-1.5V17.5a5.5 5.5 0 11-5.5-5.5c.58 0 1.13.1 1.64.28V4.83a9.4 9.4 0 00-1.64-.15 9.5 9.5 0 109.5 9.5V7.64c.94.7 2.05 1.14 3.27 1.25V5.13a4.01 4.01 0 01-3.66-3.63V.02h-3.61z" />
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z"
      fill="currentColor"
    />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm2-.5a.5.5 0 00-.3.1L12 11l6.3-5.4a.5.5 0 00-.3-.1H6zm13.5 2.1L12.6 13.4a1 1 0 01-1.2 0L4.5 7.6V18a.5.5 0 00.5.5h14a.5.5 0 00.5-.5V7.6z"
      fill="currentColor"
    />
  </svg>
);

const LocationIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 22s7-4.5 7-12a7 7 0 10-14 0c0 7.5 7 12 7 12zm0-9a3 3 0 110-6 3 3 0 010 6z"
      fill="currentColor"
    />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 22a10 10 0 110-20 10 10 0 010 20zm1-10.6V7a1 1 0 10-2 0v5c0 .27.11.52.3.7l3 3a1 1 0 001.4-1.4l-2.7-2.7z"
      fill="currentColor"
    />
  </svg>
);

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2l7 4v6c0 5-3 9.5-7 10-4-.5-7-5-7-10V6l7-4zm-1 6a1 1 0 012 0v5a1 1 0 11-2 0V8zm1 9a1.25 1.25 0 100-2.5A1.25 1.25 0 0012 17z"
      fill="currentColor"
    />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.5 21v-7h2.3l.4-2.7h-2.7V9.6c0-.8.2-1.3 1.3-1.3h1.5V6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V11H7v2.7h2.6v7h3.9z"
      fill="currentColor"
    />
  </svg>
);

export default Footer;
