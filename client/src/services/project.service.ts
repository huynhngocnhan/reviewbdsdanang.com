import { api } from "../api/client";
import type { ProjectData, ProjectSpec, ProjectGallery, ProjectExtentionImage, FloorplanCategory } from "../constants/projectData";

// API Response types
type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type ProjectListResponse = ApiResponse<ProjectData[]>;
type ProjectResponse = ApiResponse<ProjectData>;

// Query params
type ProjectQueryParams = {
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  category?: "SUN" | "VIN" | "OTHER";
  city?: string;
  district?: string;
  search?: string;
  page?: number;
  limit?: number;
};

// Create/Update input type (matching server DTO and mockup format)
interface ProjectInput {
  slug: string;
  title: string;
  subtitle?: string;
  shortDescription: string;
  intro?: string;
  longDescription?: string;
  category: "SUN" | "VIN" | "OTHER";
  developerName?: string;
  projectType?: string;
  city?: string;
  district?: string;
  address?: string;
  locationText?: string;
  locationDescription?: string;
  locationImage?: string;
  mapEmbedUrl?: string;
  lat?: number;
  lng?: number;
  priceFrom?: number;
  priceTo?: number;
  priceUnit?: string;
  legal?: string;
  handoverTime?: string;
  // Matching mockup: highlights (not highlightTags)
  highlights?: string[];
  showOnHome?: boolean;
  homeOrder?: number;
  heroImage?: string;
  specs?: ProjectSpec[];
  coverImage?: string;
  coverAssetId?: string;
  ogAssetId?: string;
  metaTitle?: string;
  metaDescription?: string;
  // Gallery section
  gallery?: ProjectGallery[];
  // Extention section
  extentionDescription?: string;
  extentionImages?: ProjectExtentionImage[];
  // Floorplan section
  floorplans?: FloorplanCategory[];
}

export const projectService = {
  /**
   * Get all projects with filtering and pagination
   */
  async getProjects(params?: ProjectQueryParams): Promise<ProjectListResponse> {
    const response = await api.get("/projects", { params });
    return response.data;
  },

  /**
   * Get single project by ID
   */
  async getProjectById(id: string): Promise<ProjectResponse> {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  /**
   * Get single project by slug
   */
  async getProjectBySlug(slug: string): Promise<ProjectResponse> {
    const response = await api.get(`/projects/slug/${slug}`);
    return response.data;
  },

  /**
   * Create a new project
   */
  async createProject(data: ProjectInput): Promise<ProjectResponse> {
    const response = await api.post("/projects", data);
    return response.data;
  },

  /**
   * Update a project
   */
  async updateProject(id: string, data: Partial<ProjectInput>): Promise<ProjectResponse> {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<ApiResponse<null>> {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  /**
   * Publish a project
   */
  async publishProject(id: string): Promise<ProjectResponse> {
    const response = await api.post(`/projects/${id}/publish`);
    return response.data;
  },

  /**
   * Archive a project
   */
  async archiveProject(id: string): Promise<ProjectResponse> {
    const response = await api.post(`/projects/${id}/archive`);
    return response.data;
  },
};
