import { api } from "../api/client";
import type {
  ProjectData,
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

// Create/Update input type — matches backend CreateProjectDto fully (V2)
interface ProjectInput {
  // Basic
  slug: string;
  title: string;
  subtitle?: string;
  shortDescription: string;
  intro?: string;
  longDescription?: string;
  category: "SUN" | "VIN" | "OTHER";
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

  /**
   * Toggle featured status — only returns { id, isFeatured }
   */
  async toggleFeatured(id: string): Promise<ApiResponse<{ id: string; isFeatured: boolean }>> {
    const response = await api.post(`/projects/${id}/featured`);
    return response.data;
  },
};
