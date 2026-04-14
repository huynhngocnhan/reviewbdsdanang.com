import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { CameraIcon, CheckCircleIcon, MapPinIcon, PhoneIcon, PlusIcon, TrashIcon, ClockIcon, EnvelopeIcon, LinkIcon } from "@heroicons/react/24/outline";
import { adminService, presignedR2PutHeaders } from "../../../services/admin.service";
import { compressImageToWebP } from "../../../utils/compressImageToWebP";

type MediaLink = {
  label: string;
  url: string;
};

type AdminProfileForm = {
  fullName: string;
  title: string;
  tagline: string;
  phone: string;
  address: string;
  workHours: string;
  email: string;
  isActive: boolean;
  avatarUrl: string;
  mediaLinks: MediaLink[];
};

type AdminApiResponse = {
  id: string;
  email?: string;
  isActive?: boolean;
  profile?: {
    fullName?: string;
    title?: string;
    tagline?: string;
    phone?: string;
    address?: string;
    workHours?: string;
    avatarAssetId?: string;
    avatarUrl?: string;
    mediaLinks?: unknown;
  } | null;
};

const defaultForm: AdminProfileForm = {
  fullName: "",
  title: "",
  tagline: "",
  phone: "",
  address: "",
  workHours: "08:00 - 17:30 (Thứ 2 - Thứ 7)",
  email: "",
  isActive: true,
  avatarUrl: "",
  mediaLinks: [],
};

const getSocialIcon = (url: string) => {
  if (url.includes("twitter.com") || url.includes("x.com")) {
    return (
      <svg className="h-5 w-5 text-[#bad9fc]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
    );
  }

  if (url.includes("facebook.com")) {
    return (
      <svg className="h-5 w-5 text-[#bad9fc]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }

  if (url.includes("linkedin.com")) {
    return (
      <svg className="h-5 w-5 text-[#bad9fc]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }

  if (url.includes("github.com")) {
    return (
      <svg className="h-5 w-5 text-[#bad9fc]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    );
  }

  if (url.includes("youtube.com")) {
    return (
      <svg className="h-5 w-5 text-[#bad9fc]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }

  return (
    <svg className="h-5 w-5 text-[#bad9fc]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7h2v2h-2v-2zm0-8h2v6h-2V7z" />
    </svg>
  );
};

const detectSocialLabel = (url: string) => {
  if (url.includes("twitter.com") || url.includes("x.com")) return "X / Twitter";
  if (url.includes("facebook.com")) return "Facebook";
  if (url.includes("linkedin.com")) return "LinkedIn";
  if (url.includes("github.com")) return "GitHub";
  if (url.includes("youtube.com")) return "YouTube";
  if (url.includes("zalo.me")) return "Zalo";

  try {
    const hostname = new URL(url).hostname.replace("www.", "");
    return hostname;
  } catch {
    return "Khác";
  }
};

const AdminProfile: React.FC = () => {
  const [form, setForm] = useState<AdminProfileForm>(defaultForm);
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarAssetId, setAvatarAssetId] = useState("");
  const [adminId, setAdminId] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("adminId") ?? "";
    setAdminId(id);

    if (!id) {
      toast.error("Không tìm thấy adminId");
      return;
    }

    const fetchAdmin = async () => {
      try {
        setIsLoading(true);
        const data: AdminApiResponse = await adminService.getAdminById(id);
        const admin = (data?.id ? data : (data as { admin?: AdminApiResponse })?.admin) as AdminApiResponse;
        const profile = admin?.profile;

        const mediaLinks = Array.isArray(profile?.mediaLinks)
          ? (profile?.mediaLinks as string[]).map((url) => ({ label: detectSocialLabel(url), url }))
          : [];

        setForm((prev) => ({
          ...prev,
          fullName: profile?.fullName ?? "",
          title: profile?.title ?? "",
          tagline: profile?.tagline ?? "",
          phone: profile?.phone ?? "",
          address: profile?.address ?? "",
          workHours: profile?.workHours ?? defaultForm.workHours,
          avatarUrl: profile?.avatarUrl ?? "",
          mediaLinks,
          email: admin?.email ?? "",
          isActive: admin?.isActive ?? true,
        }));

        setAvatarAssetId(profile?.avatarAssetId ?? "");
      } catch {
        toast.error("Không thể tải thông tin profile");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchAdmin();
  }, []);

  const initials = useMemo(() => {
    return form.fullName
      .split(" ")
      .filter(Boolean)
      .slice(-2)
      .map((word) => word[0]?.toUpperCase())
      .join("");
  }, [form.fullName]);

  const handleFieldChange = (field: keyof AdminProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addMediaLink = () => {
    const url = newMediaUrl.trim();
    if (!url) return;

    setForm((prev) => ({
      ...prev,
      mediaLinks: [...prev.mediaLinks, { label: detectSocialLabel(url), url }],
    }));
    setNewMediaUrl("");
  };

  const removeMediaLink = (index: number) => {
    setForm((prev) => ({
      ...prev,
      mediaLinks: prev.mediaLinks.filter((_, i) => i !== index),
    }));
  };

  const handleAvatarPick = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Chỉ cho phép upload file hình ảnh");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (!adminId) {
      toast.error("Không tìm thấy adminId");
      return;
    }

    try {
      setIsUploadingAvatar(true);

      const fileToUpload = await compressImageToWebP(file, {
        maxWidth: 1024,
        maxHeight: 1024,
      });

      const presign = await adminService.getPresignedUrl({
        fileName: fileToUpload.name,
        contentType: fileToUpload.type,
        folder: "admin/avatar",
      });

      await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: presignedR2PutHeaders(fileToUpload.type, presign),
        body: fileToUpload,
      });

      const createdAsset = await adminService.createAsset({
        key: presign.key,
        url: presign.publicUrl,
        contentType: fileToUpload.type,
        size: fileToUpload.size,
        type: "IMAGE",
      });

      setAvatarAssetId(createdAsset?.id ?? "");
      setForm((prev) => ({ ...prev, avatarUrl: createdAsset?.url ?? presign.publicUrl }));
      toast.success("Upload avatar thành công");
    } catch {
      toast.error("Upload avatar thất bại");
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!adminId) {
      toast.error("Không tìm thấy adminId");
      return;
    }

    const payload = {
      fullName: form.fullName.trim(),
      title: form.title.trim(),
      tagline: form.tagline.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      workHours: form.workHours.trim(),
      avatarAssetId: avatarAssetId.trim(),
      mediaLinks: form.mediaLinks.map((item) => item.url.trim()).filter(Boolean),
    };

    if (Object.values(payload).some((value) => (Array.isArray(value) ? value.length === 0 : value.length === 0))) {
      toast.error("Vui lòng nhập đầy đủ tất cả trường bắt buộc");
      return;
    }

    try {
      setIsSaving(true);
      await adminService.updateAdminProfile(adminId, payload);
      toast.success("Cập nhật profile thành công");
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Cập nhật profile thất bại";

      toast.error(message ?? "Cập nhật profile thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
            <p className="mt-1 text-sm text-gray-500">Cập nhật thông tin cá nhân hiển thị công khai của quản trị viên.</p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
            <CheckCircleIcon className="h-4 w-4" />
            {form.isActive ? "Đang hoạt động" : "Tạm ngưng"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg sm:p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {form.avatarUrl ? (
                <img src={form.avatarUrl} alt="Admin avatar" className="h-28 w-28 rounded-2xl object-cover" />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-yellow-100 text-2xl font-bold text-yellow-700">
                  {initials || "AD"}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarPick}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute -bottom-2 -right-2 rounded-full bg-gray-900 p-2 text-white shadow-md hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CameraIcon className="h-4 w-4" />
              </button>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">{form.fullName || "Chưa cập nhật"}</h2>
            <p className="text-sm text-gray-500">{form.title || "Chưa cập nhật chức danh"}</p>
            <p className="mt-2 text-xs text-gray-500">{form.tagline || "Chưa cập nhật tagline"}</p>

            <div className="mt-5 w-full rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 text-left shadow-sm">
              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-start gap-2.5 rounded-lg bg-white p-2.5 ring-1 ring-slate-100">
                  <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <span>{form.phone || "Chưa cập nhật số điện thoại"}</span>
                </div>

                <div className="flex items-start gap-2.5 rounded-lg bg-white p-2.5 ring-1 ring-slate-100">
                  <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <span>{form.address || "Chưa cập nhật địa chỉ"}</span>
                </div>

                <div className="flex items-start gap-2.5 rounded-lg bg-white p-2.5 ring-1 ring-slate-100">
                  <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <span>{form.workHours || "Chưa cập nhật giờ làm việc"}</span>
                </div>

                <div className="flex items-start gap-2.5 rounded-lg bg-white p-2.5 ring-1 ring-slate-100">
                  <EnvelopeIcon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <span className="break-all">{form.email || "Chưa cập nhật email"}</span>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <LinkIcon className="h-4 w-4 text-slate-500" />
                  Mạng xã hội ({form.mediaLinks.length})
                </div>

                {form.mediaLinks.length === 0 ? (
                  <p className="text-xs text-slate-500">Chưa có liên kết mạng xã hội.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {form.mediaLinks.map((item, index) => (
                      <a
                        key={`${item.url}-${index}`}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-slate-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-slate-800"
                        title={item.url}
                      >
                        {getSocialIcon(item.url)}
                        <span className="max-w-[140px] truncate">{item.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
          {isLoading ? <p className="text-sm text-gray-500">Đang tải dữ liệu...</p> : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Họ và tên</label>
              <input
                value={form.fullName}
                onChange={(event) => handleFieldChange("fullName", event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Chức danh</label>
              <input
                value={form.title}
                onChange={(event) => handleFieldChange("title", event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Số điện thoại</label>
              <input
                value={form.phone}
                onChange={(event) => handleFieldChange("phone", event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Tagline</label>
              <input
                value={form.tagline}
                onChange={(event) => handleFieldChange("tagline", event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Địa chỉ làm việc</label>
              <textarea
                rows={2}
                value={form.address}
                onChange={(event) => handleFieldChange("address", event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Thời gian làm việc</label>
              <input
                value={form.workHours}
                onChange={(event) => handleFieldChange("workHours", event.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500"
                placeholder="Ví dụ: 08:00 - 17:30 (Thứ 2 - Thứ 7)"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email (không chỉnh sửa)</label>
              <input
                value={form.email}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Mật khẩu</label>
              <input
                type="password"
                value="••••••••••"
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-700">Media Links</p>
            <p className="mt-1 text-xs text-gray-500">Dán link và bấm + Media, hệ thống tự nhận diện icon theo URL.</p>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                value={newMediaUrl}
                onChange={(event) => setNewMediaUrl(event.target.value)}
                placeholder="Ví dụ: https://facebook.com/your-page"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500"
              />
              <button
                type="button"
                onClick={addMediaLink}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <PlusIcon className="h-4 w-4" />
                Media
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {form.mediaLinks.map((item, index) => (
                <div key={`${item.url}-${index}`} className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
                      {getSocialIcon(item.url)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                      <p className="truncate text-xs text-gray-500">{item.url}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeMediaLink(index)}
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Huỷ
            </button>
            <button
              type="button"
              disabled={isSaving || isUploadingAvatar}
              onClick={handleSave}
              className="rounded-xl bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
