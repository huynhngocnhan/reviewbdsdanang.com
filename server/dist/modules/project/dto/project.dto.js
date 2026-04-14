"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectParamsDtoSchema = exports.ProjectQueryDtoSchema = exports.UpdateProjectDtoSchema = exports.CreateProjectDtoSchema = exports.FloatingCtaSchema = exports.HeroLeadFormSchema = exports.StickyMenuConfigSchema = exports.FloorplanByFloorItemSchema = exports.FloorplanMasterItemSchema = exports.UnitLayoutItemSchema = exports.ProgressGalleryItemSchema = exports.ProgressMilestoneSchema = exports.LegalInfoItemSchema = exports.FaqItemSchema = exports.SeoHeadSchema = exports.HandoverStandardSchema = exports.HandoverItemSchema = exports.ExtentionDestinationSchema = exports.ApartmentDesignSchema = exports.ApartmentItemSchema = exports.NearbyTrafficItemSchema = exports.NearbyGroupSchema = exports.CustomSectionSchema = exports.CustomContentSchema = exports.FloorplanCategorySchema = exports.ProjectExtentionImageSchema = exports.ProjectGallerySchema = exports.ProjectSpecSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
// Project Spec schema
exports.ProjectSpecSchema = zod_1.z.object({
    label: zod_1.z.string(),
    value: zod_1.z.string(),
});
// Project Gallery schema
exports.ProjectGallerySchema = zod_1.z.object({
    src: zod_1.z.string(),
    alt: zod_1.z.string(),
});
// Project Extention Image schema
exports.ProjectExtentionImageSchema = zod_1.z.object({
    src: zod_1.z.string(),
    alt: zod_1.z.string(),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
});
// Floorplan Category schema
exports.FloorplanCategorySchema = zod_1.z.object({
    description: zod_1.z.string(),
    floorPlanImage: zod_1.z.array(exports.ProjectGallerySchema),
});
// Custom Section Content schema
exports.CustomContentSchema = zod_1.z.object({
    contentTitle: zod_1.z.string(),
    contentDes: zod_1.z.string(),
    images: zod_1.z.array(exports.ProjectGallerySchema),
});
// Custom Section schema
exports.CustomSectionSchema = zod_1.z.object({
    customTitle: zod_1.z.string(),
    customDes: zod_1.z.string().optional(),
    contents: zod_1.z.array(exports.CustomContentSchema),
});
// Nearby group schema
exports.NearbyGroupSchema = zod_1.z.object({
    minute: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
});
// Nearby traffic item schema
exports.NearbyTrafficItemSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    des: zod_1.z.string().optional(),
    img: zod_1.z.string().optional(),
});
// Apartment design schemas
exports.ApartmentItemSchema = zod_1.z.object({
    name: zod_1.z.string(),
    label: zod_1.z.string(),
    description: zod_1.z.string(),
    price: zod_1.z.string(),
    image: zod_1.z.string(),
});
exports.ApartmentDesignSchema = zod_1.z.object({
    des: zod_1.z.string().optional(),
    desDetails: zod_1.z.array(zod_1.z.string()).default([]),
    apartmentItems: zod_1.z.array(exports.ApartmentItemSchema).default([]),
});
// Extention destination schema
exports.ExtentionDestinationSchema = zod_1.z.object({
    des: zod_1.z.string().optional(),
    img: zod_1.z.string().optional(),
});
// Handover standard schemas
exports.HandoverItemSchema = zod_1.z.object({
    subtitle: zod_1.z.string().optional(),
    title: zod_1.z.string(),
    des: zod_1.z.string(),
    imgUrl: zod_1.z.string().optional(),
});
exports.HandoverStandardSchema = zod_1.z.object({
    des: zod_1.z.string().optional(),
    items: zod_1.z.array(exports.HandoverItemSchema).default([]),
});
// SEO head schema
exports.SeoHeadSchema = zod_1.z.object({
    canonicalUrl: zod_1.z.string().optional(),
    noIndex: zod_1.z.boolean().default(false),
    noFollow: zod_1.z.boolean().default(false),
    ogImage: zod_1.z.string().optional(),
    schemaOrg: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
});
// FAQ schema
exports.FaqItemSchema = zod_1.z.object({
    question: zod_1.z.string(),
    answer: zod_1.z.string(),
});
// Legal info schema
exports.LegalInfoItemSchema = zod_1.z.object({
    title: zod_1.z.string(),
    value: zod_1.z.string(),
    fileUrl: zod_1.z.string().optional(),
});
// Progress milestone schema
exports.ProgressMilestoneSchema = zod_1.z.object({
    label: zod_1.z.string(),
    date: zod_1.z.string(),
    description: zod_1.z.string(),
    completed: zod_1.z.boolean().default(false),
});
// Progress gallery item schema
exports.ProgressGalleryItemSchema = zod_1.z.object({
    src: zod_1.z.string(),
    alt: zod_1.z.string().optional(),
    capturedAt: zod_1.z.string().optional(),
});
// Unit layout schema
exports.UnitLayoutItemSchema = zod_1.z.object({
    name: zod_1.z.string(),
    area: zod_1.z.string(),
    description: zod_1.z.string(),
    images: zod_1.z.array(exports.ProjectGallerySchema).default([]),
});
// Floorplan master schema
exports.FloorplanMasterItemSchema = zod_1.z.object({
    src: zod_1.z.string(),
    alt: zod_1.z.string().optional(),
    title: zod_1.z.string().optional(),
});
// Floorplan by floor schema
exports.FloorplanByFloorItemSchema = zod_1.z.object({
    floor: zod_1.z.string(),
    images: zod_1.z.array(exports.ProjectGallerySchema).default([]),
});
// Sticky menu schema
exports.StickyMenuConfigSchema = zod_1.z.object({
    position: zod_1.z.enum(["left", "right"]).default("left"),
    items: zod_1.z
        .array(zod_1.z.object({
        label: zod_1.z.string(),
        href: zod_1.z.string(),
    }))
        .default([]),
});
// Hero lead form schema
exports.HeroLeadFormSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    subtitle: zod_1.z.string().optional(),
    enabled: zod_1.z.boolean().default(true),
});
// Floating CTA schema
exports.FloatingCtaSchema = zod_1.z.object({
    type: zod_1.z.enum(["phone", "zalo", "facebook", "messenger", "email", "link"]),
    label: zod_1.z.string(),
    value: zod_1.z.string(),
    enabled: zod_1.z.boolean().default(true),
});
// Create Project DTO - matching mockup data format
exports.CreateProjectDtoSchema = zod_1.z.object({
    slug: zod_1.z.string().min(1).max(200),
    title: zod_1.z.string().min(1).max(200),
    subtitle: zod_1.z.string().optional(),
    shortDescription: zod_1.z.string().min(1),
    intro: zod_1.z.string().optional(),
    longDescription: zod_1.z.string().optional(),
    category: zod_1.z.nativeEnum(client_1.ProjectCategory).optional(),
    developerName: zod_1.z.string().optional(),
    projectType: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    district: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    locationText: zod_1.z.string().optional(),
    locationDescription: zod_1.z.string().optional(),
    locationImage: zod_1.z.string().optional(),
    mapEmbedUrl: zod_1.z.string().optional(),
    lat: zod_1.z.number().optional(),
    lng: zod_1.z.number().optional(),
    priceFrom: zod_1.z.number().optional(),
    priceTo: zod_1.z.number().optional(),
    priceUnit: zod_1.z.string().optional(),
    legal: zod_1.z.string().optional(),
    handoverTime: zod_1.z.string().optional(),
    // Matching mockup: highlights (not highlightTags)
    highlights: zod_1.z.array(zod_1.z.string()).default([]),
    // Overview section fields
    heroImage: zod_1.z.string().optional(),
    specs: zod_1.z.array(exports.ProjectSpecSchema).default([]),
    // Gallery section
    gallery: zod_1.z.array(exports.ProjectGallerySchema).default([]),
    // Extention section
    extentionDescription: zod_1.z.string().optional(),
    extentionImages: zod_1.z.array(exports.ProjectExtentionImageSchema).default([]),
    // Floorplan section
    floorplans: zod_1.z.array(exports.FloorplanCategorySchema).default([]),
    // Custom Sections
    customSections: zod_1.z.array(exports.CustomSectionSchema).default([]),
    // Reason to buy / sale policy / 360 / nearby
    reasonToBuyTitle: zod_1.z.string().optional(),
    reasonToBuyDescription: zod_1.z.string().optional(),
    reasonToBuyImage: zod_1.z.string().optional(),
    reasonToBuyImageAlt: zod_1.z.string().optional(),
    salePolicyDes: zod_1.z.string().optional(),
    salePolicyImg: zod_1.z.string().optional(),
    salePolicyAlt: zod_1.z.string().optional(),
    salePolicyDescriptionDetails: zod_1.z.array(zod_1.z.string()).default([]),
    location360Url: zod_1.z.string().optional(),
    nearbyGroups: zod_1.z.array(exports.NearbyGroupSchema).default([]),
    nearbyTrafficItems: zod_1.z.array(exports.NearbyTrafficItemSchema).default([]),
    // Apartment design / extention destinations / handover standard
    apartmentDesign: exports.ApartmentDesignSchema.optional(),
    extentionDestinations: zod_1.z.array(exports.ExtentionDestinationSchema).default([]),
    handoverStandard: exports.HandoverStandardSchema.optional(),
    // Progress
    progressDescription: zod_1.z.string().optional(),
    progressYoutubeUrl: zod_1.z.string().optional(),
    progressVideoUploadDate: zod_1.z.string().optional(),
    progressVideoThumbnailUrl: zod_1.z.string().optional(),
    progressMilestones: zod_1.z.array(exports.ProgressMilestoneSchema).default([]),
    progressGallery: zod_1.z.array(exports.ProgressGalleryItemSchema).default([]),
    progressVideoUrl: zod_1.z.string().optional(),
    progress: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
    // FAQ / Legal info
    faqs: zod_1.z.array(exports.FaqItemSchema).default([]),
    legalInfo: zod_1.z.array(exports.LegalInfoItemSchema).default([]),
    advertisingDisclaimer: zod_1.z.string().optional(),
    // Reason to buy legacy
    reasonToBuy: zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()).optional(),
    // Sale policy legacy
    salePolicy: zod_1.z.string().optional(),
    // Floorplan master / by floor
    floorplanMaster: zod_1.z.array(exports.FloorplanMasterItemSchema).default([]),
    floorplanByFloor: zod_1.z.array(exports.FloorplanByFloorItemSchema).default([]),
    // Unit layouts
    unitLayouts: zod_1.z.array(exports.UnitLayoutItemSchema).default([]),
    // UI/UX config
    showOnHome: zod_1.z.boolean().default(false),
    homeOrder: zod_1.z.number().int().optional(),
    isFeatured: zod_1.z.boolean().default(false),
    stickyMenu: exports.StickyMenuConfigSchema.optional(),
    heroLeadForm: exports.HeroLeadFormSchema.optional(),
    floatingCtas: zod_1.z.array(exports.FloatingCtaSchema).default([]),
    // SEO fields
    coverImage: zod_1.z.string().optional(),
    coverAssetId: zod_1.z.string().optional(),
    ogAssetId: zod_1.z.string().optional(),
    metaTitle: zod_1.z.string().optional(),
    metaDescription: zod_1.z.string().optional(),
    seoHead: exports.SeoHeadSchema.optional(),
});
exports.UpdateProjectDtoSchema = exports.CreateProjectDtoSchema.partial();
// Query DTOs
exports.ProjectQueryDtoSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(client_1.ProjectStatus).optional(),
    category: zod_1.z.nativeEnum(client_1.ProjectCategory).optional(),
    city: zod_1.z.string().optional(),
    district: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(10),
});
exports.ProjectParamsDtoSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
