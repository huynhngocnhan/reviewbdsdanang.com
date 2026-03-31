import { Prisma } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import type {
  CreateProjectDto,
  UpdateProjectDto,
  ProjectQueryDto,
} from "../dto/project.dto";

class ProjectService {
  // Helper to serialize BigInt in objects
  private serializeBigInt(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === "bigint") return obj.toString();
    if (Array.isArray(obj)) return obj.map((item) => this.serializeBigInt(item));
    if (typeof obj === "object") {
      const result: any = {};
      for (const key of Object.keys(obj)) {
        const value = obj[key];
        if (typeof value === "bigint") {
          result[key] = value.toString();
        } else if (value instanceof Prisma.Decimal) {
          result[key] = Number(value);
        } else if (typeof value === "object" && value !== null) {
          result[key] = this.serializeBigInt(value);
        } else {
          result[key] = value;
        }
      }
      return result;
    }
    return obj;
  }

  /**
   * Create a new project
   */
  async createProject(data: CreateProjectDto, adminId: string) {
    const {
      slug,
      title,
      subtitle,
      shortDescription,
      intro,
      longDescription,
      category,
      developerName,
      projectType,
      city,
      district,
      address,
      locationText,
      locationDescription,
      locationImage,
      mapEmbedUrl,
      lat,
      lng,
      priceFrom,
      priceTo,
      priceUnit,
      legal,
      handoverTime,
      highlights,
      heroImage,
      specs,
      gallery,
      extentionDescription,
      extentionImages,
      floorplans,
      customSections,
      reasonToBuyTitle,
      reasonToBuyDescription,
      reasonToBuyImage,
      reasonToBuyImageAlt,
      reasonToBuy,
      salePolicyDes,
      salePolicyImg,
      salePolicyAlt,
      salePolicyDescriptionDetails,
      salePolicy,
      location360Url,
      nearbyGroups,
      nearbyTrafficItems,
      apartmentDesign,
      extentionDestinations,
      handoverStandard,
      progressDescription,
      progressYoutubeUrl,
      progressMilestones,
      progressGallery,
      progressVideoUrl,
      progress,
      faqs,
      legalInfo,
      advertisingDisclaimer,
      floorplanMaster,
      floorplanByFloor,
      unitLayouts,
      showOnHome,
      homeOrder,
      isFeatured,
      stickyMenu,
      heroLeadForm,
      floatingCtas,
      coverImage,
      coverAssetId,
      ogAssetId,
      metaTitle,
      metaDescription,
      seoHead,
    } = data;

    const result = await prisma.project.create({
      data: {
        slug,
        title,
        subtitle,
        shortDescription,
        intro,
        longDescription,
        category,
        developerName,
        projectType,
        city,
        district,
        address,
        locationText,
        locationDescription,
        locationImage,
        mapEmbedUrl,
        lat: lat ? new Prisma.Decimal(lat.toString()) : undefined,
        lng: lng ? new Prisma.Decimal(lng.toString()) : undefined,
        priceFrom: priceFrom ? BigInt(priceFrom) : undefined,
        priceTo: priceTo ? BigInt(priceTo) : undefined,
        priceUnit,
        legal,
        handoverTime,
        highlights: highlights || [],
        heroImage,
        specs: specs as Prisma.InputJsonValue,
        gallery: gallery as Prisma.InputJsonValue,
        extentionDescription,
        extentionImages: extentionImages as Prisma.InputJsonValue,
        floorplans: floorplans as Prisma.InputJsonValue,
        customSections: customSections as Prisma.InputJsonValue,
        // Reason to buy
        reasonToBuy: reasonToBuy as Prisma.InputJsonValue,
        reasonToBuyTitle,
        reasonToBuyDescription,
        reasonToBuyImage,
        reasonToBuyImageAlt,
        // Sale policy
        salePolicy,
        salePolicyDes,
        salePolicyImg,
        salePolicyAlt,
        salePolicyDescriptionDetails: salePolicyDescriptionDetails as Prisma.InputJsonValue,
        // Location 360 & nearby
        location360Url,
        nearbyGroups: nearbyGroups as Prisma.InputJsonValue,
        nearbyTrafficItems: nearbyTrafficItems as Prisma.InputJsonValue,
        // Apartment / extention / handover
        apartmentDesign: apartmentDesign as Prisma.InputJsonValue,
        extentionDestinations: extentionDestinations as Prisma.InputJsonValue,
        handoverStandard: handoverStandard as Prisma.InputJsonValue,
        // Progress
        progress: progress as Prisma.InputJsonValue,
        progressDescription,
        progressYoutubeUrl,
        progressMilestones: progressMilestones as Prisma.InputJsonValue,
        progressGallery: progressGallery as Prisma.InputJsonValue,
        progressVideoUrl,
        // FAQ / Legal / Disclaimer
        faqs: faqs as Prisma.InputJsonValue,
        legalInfo: legalInfo as Prisma.InputJsonValue,
        advertisingDisclaimer,
        // Floorplan
        floorplanMaster: floorplanMaster as Prisma.InputJsonValue,
        floorplanByFloor: floorplanByFloor as Prisma.InputJsonValue,
        // Unit layouts
        unitLayouts: unitLayouts as Prisma.InputJsonValue,
        // UI/UX config
        showOnHome,
        homeOrder,
        isFeatured,
        stickyMenu: stickyMenu as Prisma.InputJsonValue,
        heroLeadForm: heroLeadForm as Prisma.InputJsonValue,
        floatingCtas: floatingCtas as Prisma.InputJsonValue,
        // SEO
        coverImage,
        coverAssetId,
        ogAssetId,
        metaTitle,
        metaDescription,
        seoHead: seoHead as Prisma.InputJsonValue,
        createdByAdminId: adminId,
        status: "DRAFT",
      },
      include: {
        coverAsset: { select: { id: true, url: true } },
        ogAsset: { select: { id: true, url: true } },
        sections: {
          orderBy: { order: "asc" },
        },
        createdByAdmin: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return this.serializeBigInt(result);
  }

  /**
   * Get projects with filtering and pagination
   */
  async getProjects(query: ProjectQueryDto) {
    const { status, category, city, district, search, page, limit } = query;

    const where: Prisma.ProjectWhereInput = {};

    if (status) where.status = status;
    if (category) where.category = category;
    if (city) where.city = city;
    if (district) where.district = district;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
      ];
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          coverAsset: { select: { id: true, url: true } },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return {
      projects: projects.map((p) => this.serializeBigInt({
        ...p,
        coverImage: p.coverImage || p.coverAsset?.url || null,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Get single project by ID
   */
  async getProjectById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        coverAsset: true,
        ogAsset: true,
        sections: { orderBy: { order: "asc" } },
        createdByAdmin: {
          select: { id: true, email: true, profile: { select: { fullName: true } } },
        },
      },
    });

    if (!project) return null;
    return this.transformToFrontendFormat(project);
  }

  /**
   * Get single project by slug
   */
  async getProjectBySlug(slug: string) {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        coverAsset: true,
        ogAsset: true,
        sections: { orderBy: { order: "asc" } },
        createdByAdmin: { select: { id: true, email: true } },
      },
    });

    if (!project) return null;
    return this.transformToFrontendFormat(project);
  }

  /**
   * Update project
   */
  async updateProject(id: string, data: UpdateProjectDto) {
    const {
      slug,
      title,
      subtitle,
      shortDescription,
      intro,
      longDescription,
      category,
      developerName,
      projectType,
      city,
      district,
      address,
      locationText,
      locationDescription,
      locationImage,
      mapEmbedUrl,
      lat,
      lng,
      priceFrom,
      priceTo,
      priceUnit,
      legal,
      handoverTime,
      highlights,
      heroImage,
      specs,
      gallery,
      extentionDescription,
      extentionImages,
      floorplans,
      customSections,
      reasonToBuy,
      reasonToBuyTitle,
      reasonToBuyDescription,
      reasonToBuyImage,
      reasonToBuyImageAlt,
      salePolicy,
      salePolicyDes,
      salePolicyImg,
      salePolicyAlt,
      salePolicyDescriptionDetails,
      location360Url,
      nearbyGroups,
      nearbyTrafficItems,
      apartmentDesign,
      extentionDestinations,
      handoverStandard,
      progress,
      progressDescription,
      progressYoutubeUrl,
      progressMilestones,
      progressGallery,
      progressVideoUrl,
      faqs,
      legalInfo,
      advertisingDisclaimer,
      floorplanMaster,
      floorplanByFloor,
      unitLayouts,
      showOnHome,
      homeOrder,
      isFeatured,
      stickyMenu,
      heroLeadForm,
      floatingCtas,
      coverImage,
      coverAssetId,
      ogAssetId,
      metaTitle,
      metaDescription,
      seoHead,
    } = data;

    const result = await prisma.project.update({
      where: { id },
      data: {
        ...(slug && { slug }),
        ...(title && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(shortDescription && { shortDescription }),
        ...(intro !== undefined && { intro }),
        ...(longDescription !== undefined && { longDescription }),
        ...(category !== undefined && { category }),
        ...(developerName !== undefined && { developerName }),
        ...(projectType !== undefined && { projectType }),
        ...(city !== undefined && { city }),
        ...(district !== undefined && { district }),
        ...(address !== undefined && { address }),
        ...(locationText !== undefined && { locationText }),
        ...(locationDescription !== undefined && { locationDescription }),
        ...(locationImage !== undefined && { locationImage }),
        ...(mapEmbedUrl !== undefined && { mapEmbedUrl }),
        ...(lat !== undefined && { lat: lat ? new Prisma.Decimal(lat.toString()) : undefined }),
        ...(lng !== undefined && { lng: lng ? new Prisma.Decimal(lng.toString()) : undefined }),
        ...(priceFrom !== undefined && { priceFrom: priceFrom ? BigInt(priceFrom) : undefined }),
        ...(priceTo !== undefined && { priceTo: priceTo ? BigInt(priceTo) : undefined }),
        ...(priceUnit !== undefined && { priceUnit }),
        ...(legal !== undefined && { legal }),
        ...(handoverTime !== undefined && { handoverTime }),
        ...(highlights && { highlights }),
        ...(heroImage !== undefined && { heroImage }),
        ...(specs !== undefined && { specs: specs as Prisma.InputJsonValue }),
        ...(gallery !== undefined && { gallery: gallery as Prisma.InputJsonValue }),
        ...(extentionDescription !== undefined && { extentionDescription }),
        ...(extentionImages !== undefined && { extentionImages: extentionImages as Prisma.InputJsonValue }),
        ...(floorplans !== undefined && { floorplans: floorplans as Prisma.InputJsonValue }),
        ...(customSections !== undefined && { customSections: customSections as Prisma.InputJsonValue }),
        // Reason to buy
        ...(reasonToBuy !== undefined && { reasonToBuy: reasonToBuy as Prisma.InputJsonValue }),
        ...(reasonToBuyTitle !== undefined && { reasonToBuyTitle }),
        ...(reasonToBuyDescription !== undefined && { reasonToBuyDescription }),
        ...(reasonToBuyImage !== undefined && { reasonToBuyImage }),
        ...(reasonToBuyImageAlt !== undefined && { reasonToBuyImageAlt }),
        // Sale policy
        ...(salePolicy !== undefined && { salePolicy }),
        ...(salePolicyDes !== undefined && { salePolicyDes }),
        ...(salePolicyImg !== undefined && { salePolicyImg }),
        ...(salePolicyAlt !== undefined && { salePolicyAlt }),
        ...(salePolicyDescriptionDetails !== undefined && { salePolicyDescriptionDetails: salePolicyDescriptionDetails as Prisma.InputJsonValue }),
        // Location 360 & nearby
        ...(location360Url !== undefined && { location360Url }),
        ...(nearbyGroups !== undefined && { nearbyGroups: nearbyGroups as Prisma.InputJsonValue }),
        ...(nearbyTrafficItems !== undefined && { nearbyTrafficItems: nearbyTrafficItems as Prisma.InputJsonValue }),
        // Apartment / extention / handover
        ...(apartmentDesign !== undefined && { apartmentDesign: apartmentDesign as Prisma.InputJsonValue }),
        ...(extentionDestinations !== undefined && { extentionDestinations: extentionDestinations as Prisma.InputJsonValue }),
        ...(handoverStandard !== undefined && { handoverStandard: handoverStandard as Prisma.InputJsonValue }),
        // Progress
        ...(progress !== undefined && { progress: progress as Prisma.InputJsonValue }),
        ...(progressDescription !== undefined && { progressDescription }),
        ...(progressYoutubeUrl !== undefined && { progressYoutubeUrl }),
        ...(progressMilestones !== undefined && { progressMilestones: progressMilestones as Prisma.InputJsonValue }),
        ...(progressGallery !== undefined && { progressGallery: progressGallery as Prisma.InputJsonValue }),
        ...(progressVideoUrl !== undefined && { progressVideoUrl }),
        // FAQ / Legal / Disclaimer
        ...(faqs !== undefined && { faqs: faqs as Prisma.InputJsonValue }),
        ...(legalInfo !== undefined && { legalInfo: legalInfo as Prisma.InputJsonValue }),
        ...(advertisingDisclaimer !== undefined && { advertisingDisclaimer }),
        // Floorplan
        ...(floorplanMaster !== undefined && { floorplanMaster: floorplanMaster as Prisma.InputJsonValue }),
        ...(floorplanByFloor !== undefined && { floorplanByFloor: floorplanByFloor as Prisma.InputJsonValue }),
        // Unit layouts
        ...(unitLayouts !== undefined && { unitLayouts: unitLayouts as Prisma.InputJsonValue }),
        // UI/UX config
        ...(showOnHome !== undefined && { showOnHome }),
        ...(homeOrder !== undefined && { homeOrder }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(stickyMenu !== undefined && { stickyMenu: stickyMenu as Prisma.InputJsonValue }),
        ...(heroLeadForm !== undefined && { heroLeadForm: heroLeadForm as Prisma.InputJsonValue }),
        ...(floatingCtas !== undefined && { floatingCtas: floatingCtas as Prisma.InputJsonValue }),
        // SEO
        ...(coverImage !== undefined && { coverImage }),
        ...(coverAssetId !== undefined && { coverAssetId }),
        ...(ogAssetId !== undefined && { ogAssetId }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(seoHead !== undefined && { seoHead: seoHead as Prisma.InputJsonValue }),
      },
      include: {
        coverAsset: true,
        ogAsset: true,
        sections: { orderBy: { order: "asc" } },
      },
    });

    return this.serializeBigInt(result);
  }

  /**
   * Delete project
   */
  async deleteProject(id: string) {
    const result = await prisma.project.delete({ where: { id } });
    return this.serializeBigInt(result);
  }

  /**
   * Publish project
   */
  async publishProject(id: string) {
    const result = await prisma.project.update({
      where: { id },
      data: { status: "PUBLISHED", publishedAt: new Date() },
    });
    return { id: result.id, status: result.status, publishedAt: result.publishedAt };
  }

  /**
   * Toggle featured status
   */
  async toggleFeatured(id: string) {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return null;

    const result = await prisma.project.update({
      where: { id },
      data: { isFeatured: !project.isFeatured },
    });

    return { id: result.id, isFeatured: result.isFeatured };
  }

  /**
   * Archive project
   */
  async archiveProject(id: string) {
    const result = await prisma.project.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });
    return { id: result.id, status: result.status };
  }

  /**
   * Transform database model to frontend format (matching mockup)
   */
  private transformToFrontendFormat(project: any) {
    return this.serializeBigInt({
      id: project.id,
      slug: project.slug,
      title: project.title,
      subtitle: project.subtitle,
      shortDescription: project.shortDescription,
      intro: project.intro || "",
      longDescription: project.longDescription,
      category: project.category ?? "OTHER",
      developerName: project.developerName,
      projectType: project.projectType,
      city: project.city,
      district: project.district,
      address: project.address,
      locationText: project.locationText || "",
      locationDescription: project.locationDescription || "",
      locationImage: project.locationImage || "",
      mapEmbedUrl: project.mapEmbedUrl || "",
      lat: project.lat ? Number(project.lat) : null,
      lng: project.lng ? Number(project.lng) : null,
      priceFrom: project.priceFrom ? Number(project.priceFrom) : null,
      priceTo: project.priceTo ? Number(project.priceTo) : null,
      priceUnit: project.priceUnit,
      legal: project.legal,
      handoverTime: project.handoverTime,
      highlights: project.highlights || [],
      heroImage: project.heroImage || "",
      specs: project.specs || [],
      coverImage: project.coverImage || project.coverAsset?.url || null,
      ogImage: project.ogAsset?.url || null,
      metaTitle: project.metaTitle,
      metaDescription: project.metaDescription,
      // Gallery & extention
      gallery: project.gallery || [],
      extentionDescription: project.extentionDescription || "",
      extentionImages: project.extentionImages || [],
      extentionDestinations: project.extentionDestinations || [],
      // Floorplan
      floorplans: project.floorplans || [],
      floorplanMaster: project.floorplanMaster || [],
      floorplanByFloor: project.floorplanByFloor || [],
      // Custom sections
      customSections: project.customSections || [],
      // Reason to buy
      reasonToBuy: project.reasonToBuy || null,
      reasonToBuyTitle: project.reasonToBuyTitle || "",
      reasonToBuyDescription: project.reasonToBuyDescription || "",
      reasonToBuyImage: project.reasonToBuyImage || "",
      reasonToBuyImageAlt: project.reasonToBuyImageAlt || "",
      // Sale policy
      salePolicy: project.salePolicy || null,
      salePolicyDes: project.salePolicyDes || "",
      salePolicyImg: project.salePolicyImg || "",
      salePolicyAlt: project.salePolicyAlt || "",
      salePolicyDescriptionDetails: project.salePolicyDescriptionDetails || [],
      // Location 360 & nearby
      location360Url: project.location360Url || "",
      nearbyGroups: project.nearbyGroups || [],
      nearbyTrafficItems: project.nearbyTrafficItems || [],
      // Apartment / handover
      apartmentDesign: project.apartmentDesign || { des: "", desDetails: [], apartmentItems: [] },
      handoverStandard: project.handoverStandard || { des: "", items: [] },
      // Progress
      progress: project.progress || null,
      progressDescription: project.progressDescription || "",
      progressYoutubeUrl: project.progressYoutubeUrl || "",
      progressMilestones: project.progressMilestones || [],
      progressGallery: project.progressGallery || [],
      progressVideoUrl: project.progressVideoUrl || "",
      // FAQ / Legal / Disclaimer
      faqs: project.faqs || [],
      legalInfo: project.legalInfo || [],
      advertisingDisclaimer: project.advertisingDisclaimer || "",
      // Unit layouts
      unitLayouts: project.unitLayouts || [],
      // UI/UX config
      showOnHome: project.showOnHome ?? false,
      homeOrder: project.homeOrder ?? null,
      isFeatured: project.isFeatured ?? false,
      stickyMenu: project.stickyMenu || null,
      heroLeadForm: project.heroLeadForm || null,
      floatingCtas: project.floatingCtas || [],
      // SEO
      seoHead: project.seoHead || null,
      // Meta
      status: project.status,
      publishedAt: project.publishedAt,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      createdBy: project.createdByAdmin
        ? {
            id: project.createdByAdmin.id,
            email: project.createdByAdmin.email,
            fullName: project.createdByAdmin.profile?.fullName,
          }
        : null,
    });
  }
}

export const projectService = new ProjectService();
