import { api } from "../api/client";

type PresignPayload = {
  fileName: string;
  contentType: string;
  folder?: string;
};

type PresignResponse = {
  uploadUrl: string;
  key: string;
  publicUrl: string;
  /** Must be sent as `Cache-Control` on the PUT to R2 when present (matches presigned signature). */
  cacheControl?: string;
};

/** Headers for PUT to presigned R2 URL (Content-Type + optional Cache-Control from presign). */
export function presignedR2PutHeaders(contentType: string, presign: Pick<PresignResponse, "cacheControl">) {
  const headers: Record<string, string> = { "Content-Type": contentType };
  if (presign.cacheControl) headers["Cache-Control"] = presign.cacheControl;
  return headers;
}

type CreateAssetPayload = {
  key: string;
  url: string;
  contentType: string;
  size: number;
  type: "IMAGE" | "VIDEO" | "FILE";
  width?: number;
  height?: number;
  alt?: string;
};

type UpdateAdminProfilePayload = {
  fullName: string;
  title: string;
  tagline: string;
  phone: string;
  address: string;
  workHours: string;
  avatarAssetId: string;
  mediaLinks: string[];
};

export const adminService = {
  async getAdmin() {
    const response = await api.get(`/admin/`);
    return response.data;
  },
  async getAdminById(id: string) {
    const response = await api.get(`/admin/${id}`);
    return response.data;
  },

  async updateAdminProfile(id: string, payload: UpdateAdminProfilePayload) {
    const response = await api.patch(`/admin/${id}/profile`, payload);
    return response.data;
  },

  async getPresignedUrl(payload: PresignPayload) {
    const response = await api.post<PresignResponse>("/uploads/presign", payload);
    return response.data;
  },

  async createAsset(payload: CreateAssetPayload) {
    const response = await api.post("/assets", payload);
    return response.data;
  },
};
