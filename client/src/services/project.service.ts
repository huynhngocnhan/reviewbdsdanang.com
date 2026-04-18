import { api } from "../api/client";
import type {
  ProjectData,
  ProjectCategory,
  ProjectSpec,
  ProjectGallery,
  ProjectExtentionImage,
  FloorplanCategory,
  SeoHead,
  FaqItem,
  LegalInfoItem,
  ProgressMilestone,
  ProgressGalleryItem,
  UnitLayoutItem,
  FloorplanMasterItem,
  FloorplanByFloorItem,
  StickyMenuConfig,
  HeroLeadForm,
  FloatingCta,
  NearbyGroup,
  NearbyTrafficItem,
  ApartmentDesign,
  ExtentionDestination,
  HandoverStandard,
  CustomSectionData,
} from "../constants/projectData";

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

const PUBLISHED_CACHE_TTL_MS = 60_000;
let publishedProjectsCache: { data: ProjectData[]; expiresAt: number } | null = null;
let publishedProjectsInFlight: Promise<ProjectData[]> | null = null;

const projectBySlugCache = new Map<string, { data: ProjectData; expiresAt: number }>();
const projectBySlugInFlight = new Map<string, Promise<ProjectData | null>>();

// Query params
type ProjectQueryParams = {
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  category?: ProjectCategory;
  city?: string;
  district?: string;
  search?: string;
  page?: number;
  limit?: number;
  view?: "summary" | "full";
};

// Create/Update input type — matches backend CreateProjectDto fully (V2)
interface ProjectInput {
  // Basic
  slug: string;
  title: string;
  subtitle?: string;
  shortDescription: string;
  intro?: string;
  longDescription?: string;
  category: ProjectCategory;
  developerName?: string;
  projectType?: string;

  // Location
  city?: string;
  district?: string;
  address?: string;
  locationText?: string;
  locationDescription?: string;
  locationImage?: string;
  mapEmbedUrl?: string;
  location360Url?: string;
  lat?: number;
  lng?: number;

  // Nearby
  nearbyGroups?: NearbyGroup[];
  nearbyTrafficItems?: NearbyTrafficItem[];

  // Price & legal
  priceFrom?: number;
  priceTo?: number;
  priceUnit?: string;
  legal?: string;
  handoverTime?: string;

  // Content sections
  highlights?: string[];
  heroImage?: string;
  specs?: ProjectSpec[];
  gallery?: ProjectGallery[];

  // Extention
  extentionDescription?: string;
  extentionImages?: ProjectExtentionImage[];
  extentionDestinations?: ExtentionDestination[];

  // Floorplan
  floorplans?: FloorplanCategory[];
  floorplanMaster?: FloorplanMasterItem[];
  floorplanByFloor?: FloorplanByFloorItem[];

  // Custom sections
  customSections?: CustomSectionData[];

  // Reason to buy
  reasonToBuy?: Record<string, unknown>;
  reasonToBuyTitle?: string;
  reasonToBuyDescription?: string;
  reasonToBuyImage?: string;
  reasonToBuyImageAlt?: string;

  // Sale policy
  salePolicy?: Record<string, unknown>;
  salePolicyDes?: string;
  salePolicyImg?: string;
  salePolicyAlt?: string;
  salePolicyDescriptionDetails?: string[];

  // Apartment design
  apartmentDesign?: ApartmentDesign;

  // Handover standard
  handoverStandard?: HandoverStandard;

  // Progress
  progress?: Record<string, unknown>;
  progressDescription?: string;
  progressYoutubeUrl?: string;
  progressMilestones?: ProgressMilestone[];
  progressGallery?: ProgressGalleryItem[];
  progressVideoUrl?: string;

  // FAQ / Legal / Disclaimer
  faqs?: FaqItem[];
  legalInfo?: LegalInfoItem[];
  advertisingDisclaimer?: string;

  // Unit layouts
  unitLayouts?: UnitLayoutItem[];

  // UI/UX config
  showOnHome?: boolean;
  homeOrder?: number;
  isFeatured?: boolean;
  stickyMenu?: StickyMenuConfig;
  heroLeadForm?: HeroLeadForm;
  floatingCtas?: FloatingCta[];

  // SEO
  coverImage?: string;
  coverAssetId?: string;
  ogAssetId?: string;
  metaTitle?: string;
  metaDescription?: string;
  seoHead?: SeoHead;
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
   * Shared cached list for published projects (avoid duplicate fetch in Header/Home).
   */
  async getPublishedProjectsCached(limit = 100): Promise<ProjectData[]> {
    // Backward compatible alias: published list used by public pages should be summary.
    return this.getPublishedProjectsSummaryCached(limit);
  },

  /**
   * Homepage/header-friendly published list (small payload).
   */
  async getPublishedProjectsSummaryCached(limit = 100): Promise<ProjectData[]> {
    const now = Date.now();
    if (publishedProjectsCache && publishedProjectsCache.expiresAt > now) {
      return publishedProjectsCache.data;
    }

    if (publishedProjectsInFlight) {
      return publishedProjectsInFlight;
    }

    publishedProjectsInFlight = this.getProjects({ status: "PUBLISHED", limit, view: "summary" })
      .then((res) => {
        const data = res.success && res.data ? res.data : [];
        publishedProjectsCache = {
          data,
          expiresAt: Date.now() + PUBLISHED_CACHE_TTL_MS,
        };
        return data;
      })
      .finally(() => {
        publishedProjectsInFlight = null;
      });

    return publishedProjectsInFlight;
  },

  /**
   * Invalidate published projects cache when needed.
   */
  invalidatePublishedProjectsCache() {
    publishedProjectsCache = null;
    publishedProjectsInFlight = null;
    // Ensure detail pages refetch after admin CRUD/publish changes.
    projectBySlugCache.clear();
    projectBySlugInFlight.clear();
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
   * Cached project detail by slug.
   */
  async getProjectBySlugCached(slug: string): Promise<ProjectResponse> {
    const key = slug.trim();
    const now = Date.now();
    const cached = projectBySlugCache.get(key);
    if (cached && cached.expiresAt > now) {
      return { success: true, data: cached.data };
    }

    const inFlight = projectBySlugInFlight.get(key);
    if (inFlight) {
      const data = await inFlight;
      return data ? { success: true, data } : { success: false, error: "Project not found" };
    }

    const promise = this.getProjectBySlug(key)
      .then((res) => {
        if (res.success && res.data) {
          projectBySlugCache.set(key, {
            data: res.data,
            expiresAt: Date.now() + PUBLISHED_CACHE_TTL_MS,
          });
          return res.data;
        }
        return null;
      })
      .catch(() => null)
      .finally(() => {
        projectBySlugInFlight.delete(key);
      });

    projectBySlugInFlight.set(key, promise);
    const data = await promise;
    return data ? { success: true, data } : { success: false, error: "Project not found" };
  },

  /**
   * Prefetch project detail by slug (best effort).
   */
  prefetchProjectBySlug(slug: string) {
    const key = slug.trim();
    if (!key) return;
    const now = Date.now();
    const cached = projectBySlugCache.get(key);
    if (cached && cached.expiresAt > now) return;
    if (projectBySlugInFlight.has(key)) return;

    const promise = this.getProjectBySlug(key)
      .then((res) => {
        if (res.success && res.data) {
          projectBySlugCache.set(key, {
            data: res.data,
            expiresAt: Date.now() + PUBLISHED_CACHE_TTL_MS,
          });
          return res.data;
        }
        return null;
      })
      .catch(() => null)
      .finally(() => {
        projectBySlugInFlight.delete(key);
      });

    projectBySlugInFlight.set(key, promise);
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

  /**
   * Toggle featured status — only returns { id, isFeatured }
   */
  async toggleFeatured(id: string): Promise<ApiResponse<{ id: string; isFeatured: boolean }>> {
    const response = await api.post(`/projects/${id}/featured`);
    return response.data;
  },
};
