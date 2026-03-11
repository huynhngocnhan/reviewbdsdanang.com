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
      coverImage,
      coverAssetId,
      ogAssetId,
      metaTitle,
      metaDescription,
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
        specs: specs ? specs as Prisma.InputJsonValue : undefined,
        gallery: gallery as Prisma.InputJsonValue,
        extentionDescription,
        extentionImages: extentionImages as Prisma.InputJsonValue,
        floorplans: floorplans as Prisma.InputJsonValue,
        customSections: customSections as Prisma.InputJsonValue,
        coverImage,
        coverAssetId,
        ogAssetId,
        metaTitle,
        metaDescription,
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
      coverImage,
      coverAssetId,
      ogAssetId,
      metaTitle,
      metaDescription,
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
        ...(category && { category }),
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
        ...(coverImage !== undefined && { coverImage }),
        ...(coverAssetId !== undefined && { coverAssetId }),
        ...(ogAssetId !== undefined && { ogAssetId }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
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
      include: { sections: true },
    });
    return this.serializeBigInt(result);
  }

  /**
   * Archive project
   */
  async archiveProject(id: string) {
    const result = await prisma.project.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });
    return this.serializeBigInt(result);
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
      category: project.category,
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
      // Matching mockup: highlights
      highlights: project.highlights || [],
      heroImage: project.heroImage || "",
      specs: project.specs || [],
      coverImage: project.coverImage || project.coverAsset?.url || null,
      ogImage: project.ogAsset?.url || null,
      metaTitle: project.metaTitle,
      metaDescription: project.metaDescription,
      // Matching mockup: gallery, extentionImages, floorplans
      gallery: project.gallery || [],
      extentionDescription: project.extentionDescription || "",
      extentionImages: project.extentionImages || [],
      floorplans: project.floorplans || [],
      customSections: project.customSections || [],
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
