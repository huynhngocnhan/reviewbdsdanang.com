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

// Create Project DTO - matching mockup data format
export const CreateProjectDtoSchema = z.object({
  slug: z.string().min(1).max(200),
  title: z.string().min(1).max(200),
  subtitle: z.string().optional(),

  shortDescription: z.string().min(1),
  intro: z.string().optional(),
  longDescription: z.string().optional(),

  category: z.nativeEnum(ProjectCategory).default("OTHER"),
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

  // SEO fields
  coverImage: z.string().optional(),
  coverAssetId: z.string().optional(),
  ogAssetId: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const UpdateProjectDtoSchema = CreateProjectDtoSchema.partial();

// Query DTOs
export const ProjectQueryDtoSchema = z.object({
  status: z.nativeEnum(ProjectStatus).optional(),
  category: z.nativeEnum(ProjectCategory).optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  search: z.string().optional(),
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
