import { z } from "zod";
import { ProjectCategory, ProjectStatus } from "@prisma/client";

// Project Spec schema
export const ProjectSpecSchema = z.object({
  label: z.string(),
  value: z.string(),
});

// Project Gallery schema
export const ProjectGallerySchema = z.object({
  src: z.string(),
  alt: z.string(),
});

// Project Extention Image schema
export const ProjectExtentionImageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  title: z.string(),
  description: z.string(),
});

// Floorplan Category schema
export const FloorplanCategorySchema = z.object({
  description: z.string(),
  floorPlanImage: z.array(ProjectGallerySchema),
});

// Custom Section Content schema
export const CustomContentSchema = z.object({
  contentTitle: z.string(),
  contentDes: z.string(),
  images: z.array(ProjectGallerySchema),
});

// Custom Section schema
export const CustomSectionSchema = z.object({
  customTitle: z.string(),
  customDes: z.string().optional(),
  contents: z.array(CustomContentSchema),
});

// Nearby group schema
export const NearbyGroupSchema = z.object({
  minute: z.string().optional(),
  description: z.string().optional(),
});

// Nearby traffic item schema
export const NearbyTrafficItemSchema = z.object({
  title: z.string().optional(),
  des: z.string().optional(),
  img: z.string().optional(),
});

// Apartment design schemas
export const ApartmentItemSchema = z.object({
  name: z.string(),
  label: z.string(),
  description: z.string(),
  price: z.string(),
  image: z.string(),
});

export const ApartmentDesignSchema = z.object({
  des: z.string().optional(),
  desDetails: z.array(z.string()).default([]),
  apartmentItems: z.array(ApartmentItemSchema).default([]),
});

// Extention destination schema
export const ExtentionDestinationSchema = z.object({
  des: z.string().optional(),
  img: z.string().optional(),
});

// Handover standard schemas
export const HandoverItemSchema = z.object({
  subtitle: z.string().optional(),
  title: z.string(),
  des: z.string(),
  imgUrl: z.string().optional(),
});

export const HandoverStandardSchema = z.object({
  des: z.string().optional(),
  items: z.array(HandoverItemSchema).default([]),
});

// SEO head schema
export const SeoHeadSchema = z.object({
  canonicalUrl: z.string().optional(),
  noIndex: z.boolean().default(false),
  noFollow: z.boolean().default(false),
  ogImage: z.string().optional(),
  schemaOrg: z.record(z.string(), z.unknown()).optional(),
});

// FAQ schema
export const FaqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

// Legal info schema
export const LegalInfoItemSchema = z.object({
  title: z.string(),
  value: z.string(),
  fileUrl: z.string().optional(),
});

// Progress milestone schema
export const ProgressMilestoneSchema = z.object({
  label: z.string(),
  date: z.string(),
  description: z.string(),
  completed: z.boolean().default(false),
});

// Progress gallery item schema
export const ProgressGalleryItemSchema = z.object({
  src: z.string(),
  alt: z.string().optional(),
  capturedAt: z.string().optional(),
});

// Unit layout schema
export const UnitLayoutItemSchema = z.object({
  name: z.string(),
  area: z.string(),
  description: z.string(),
  images: z.array(ProjectGallerySchema).default([]),
});

// Floorplan master schema
export const FloorplanMasterItemSchema = z.object({
  src: z.string(),
  alt: z.string().optional(),
  title: z.string().optional(),
});

// Floorplan by floor schema
export const FloorplanByFloorItemSchema = z.object({
  floor: z.string(),
  images: z.array(ProjectGallerySchema).default([]),
});

// Sticky menu schema
export const StickyMenuConfigSchema = z.object({
  position: z.enum(["left", "right"]).default("left"),
  items: z
    .array(
      z.object({
        label: z.string(),
        href: z.string(),
      })
    )
    .default([]),
});

// Hero lead form schema
export const HeroLeadFormSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  enabled: z.boolean().default(true),
});

// Floating CTA schema
export const FloatingCtaSchema = z.object({
  type: z.enum(["phone", "zalo", "facebook", "messenger", "email", "link"]),
  label: z.string(),
  value: z.string(),
  enabled: z.boolean().default(true),
});

// Create Project DTO - matching mockup data format
export const CreateProjectDtoSchema = z.object({
  slug: z.string().min(1).max(200),
  title: z.string().min(1).max(200),
  subtitle: z.string().optional(),

  shortDescription: z.string().min(1),
  intro: z.string().optional(),
  longDescription: z.string().optional(),

  category: z.nativeEnum(ProjectCategory).optional(),
  developerName: z.string().optional(),
  projectType: z.string().optional(),

  city: z.string().optional(),
  district: z.string().optional(),
  address: z.string().optional(),

  locationText: z.string().optional(),
  locationDescription: z.string().optional(),
  locationImage: z.string().optional(),
  mapEmbedUrl: z.string().optional(),

  lat: z.number().optional(),
  lng: z.number().optional(),

  priceFrom: z.number().optional(),
  priceTo: z.number().optional(),
  priceUnit: z.string().optional(),

  legal: z.string().optional(),
  handoverTime: z.string().optional(),

  // Matching mockup: highlights (not highlightTags)
  highlights: z.array(z.string()).default([]),

  // Overview section fields
  heroImage: z.string().optional(),
  specs: z.array(ProjectSpecSchema).default([]),

  // Gallery section
  gallery: z.array(ProjectGallerySchema).default([]),

  // Extention section
  extentionDescription: z.string().optional(),
  extentionImages: z.array(ProjectExtentionImageSchema).default([]),

  // Floorplan section
  floorplans: z.array(FloorplanCategorySchema).default([]),

  // Custom Sections
  customSections: z.array(CustomSectionSchema).default([]),

  // Reason to buy / sale policy / 360 / nearby
  reasonToBuyTitle: z.string().optional(),
  reasonToBuyDescription: z.string().optional(),
  reasonToBuyImage: z.string().optional(),
  reasonToBuyImageAlt: z.string().optional(),
  salePolicyDes: z.string().optional(),
  salePolicyImg: z.string().optional(),
  salePolicyAlt: z.string().optional(),
  salePolicyDescriptionDetails: z.array(z.string()).default([]),
  location360Url: z.string().optional(),
  nearbyGroups: z.array(NearbyGroupSchema).default([]),
  nearbyTrafficItems: z.array(NearbyTrafficItemSchema).default([]),

  // Apartment design / extention destinations / handover standard
  apartmentDesign: ApartmentDesignSchema.optional(),
  extentionDestinations: z.array(ExtentionDestinationSchema).default([]),
  handoverStandard: HandoverStandardSchema.optional(),

  // Progress
  progressDescription: z.string().optional(),
  progressYoutubeUrl: z.string().optional(),
  progressVideoUploadDate: z.string().optional(),
  progressVideoThumbnailUrl: z.string().optional(),
  progressMilestones: z.array(ProgressMilestoneSchema).default([]),
  progressGallery: z.array(ProgressGalleryItemSchema).default([]),
  progressVideoUrl: z.string().optional(),
  progress: z.record(z.string(), z.unknown()).optional(),

  // FAQ / Legal info
  faqs: z.array(FaqItemSchema).default([]),
  legalInfo: z.array(LegalInfoItemSchema).default([]),
  advertisingDisclaimer: z.string().optional(),

  // Reason to buy legacy
  reasonToBuy: z.record(z.string(), z.unknown()).optional(),

  // Sale policy legacy
  salePolicy: z.string().optional(),

  // Floorplan master / by floor
  floorplanMaster: z.array(FloorplanMasterItemSchema).default([]),
  floorplanByFloor: z.array(FloorplanByFloorItemSchema).default([]),

  // Unit layouts
  unitLayouts: z.array(UnitLayoutItemSchema).default([]),

  // UI/UX config
  showOnHome: z.boolean().default(false),
  homeOrder: z.number().int().optional(),
  isFeatured: z.boolean().default(false),
  stickyMenu: StickyMenuConfigSchema.optional(),
  heroLeadForm: HeroLeadFormSchema.optional(),
  floatingCtas: z.array(FloatingCtaSchema).default([]),

  // SEO fields
  coverImage: z.string().optional(),
  coverAssetId: z.string().optional(),
  ogAssetId: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  seoHead: SeoHeadSchema.optional(),
});

export const UpdateProjectDtoSchema = CreateProjectDtoSchema.partial();

// Query DTOs
export const ProjectQueryDtoSchema = z.object({
  status: z.nativeEnum(ProjectStatus).optional(),
  category: z.nativeEnum(ProjectCategory).optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  search: z.string().optional(),
  /** Response shape hint for performance-sensitive pages (e.g. homepage). */
  view: z.enum(["summary", "full"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const ProjectParamsDtoSchema = z.object({
  id: z.string().uuid(),
});

// Type exports
export type CreateProjectDto = z.infer<typeof CreateProjectDtoSchema>;
export type UpdateProjectDto = z.infer<typeof UpdateProjectDtoSchema>;
export type ProjectQueryDto = z.infer<typeof ProjectQueryDtoSchema>;
export type ProjectParamsDto = z.infer<typeof ProjectParamsDtoSchema>;
