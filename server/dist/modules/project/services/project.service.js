"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = require("../../../lib/prisma");
class ProjectService {
    // Helper to serialize BigInt in objects
    serializeBigInt(obj) {
        if (obj === null || obj === undefined)
            return obj;
        if (typeof obj === "bigint")
            return obj.toString();
        if (Array.isArray(obj))
            return obj.map((item) => this.serializeBigInt(item));
        if (typeof obj === "object") {
            const result = {};
            for (const key of Object.keys(obj)) {
                const value = obj[key];
                if (typeof value === "bigint") {
                    result[key] = value.toString();
                }
                else if (value instanceof client_1.Prisma.Decimal) {
                    result[key] = Number(value);
                }
                else if (typeof value === "object" && value !== null) {
                    result[key] = this.serializeBigInt(value);
                }
                else {
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
    async createProject(data, adminId) {
        const { slug, title, subtitle, shortDescription, intro, longDescription, category, developerName, projectType, city, district, address, locationText, locationDescription, locationImage, mapEmbedUrl, lat, lng, priceFrom, priceTo, priceUnit, legal, handoverTime, highlights, heroImage, specs, gallery, extentionDescription, extentionImages, floorplans, customSections, reasonToBuyTitle, reasonToBuyDescription, reasonToBuyImage, reasonToBuyImageAlt, reasonToBuy, salePolicyDes, salePolicyImg, salePolicyAlt, salePolicyDescriptionDetails, salePolicy, location360Url, nearbyGroups, nearbyTrafficItems, apartmentDesign, extentionDestinations, handoverStandard, progressDescription, progressYoutubeUrl, progressVideoUploadDate, progressVideoThumbnailUrl, progressMilestones, progressGallery, progressVideoUrl, progress, faqs, legalInfo, advertisingDisclaimer, floorplanMaster, floorplanByFloor, unitLayouts, showOnHome, homeOrder, isFeatured, stickyMenu, heroLeadForm, floatingCtas, coverImage, coverAssetId, ogAssetId, metaTitle, metaDescription, seoHead, } = data;
        const createData = {
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
            lat: lat ? new client_1.Prisma.Decimal(lat.toString()) : undefined,
            lng: lng ? new client_1.Prisma.Decimal(lng.toString()) : undefined,
            priceFrom: priceFrom ? BigInt(priceFrom) : undefined,
            priceTo: priceTo ? BigInt(priceTo) : undefined,
            priceUnit,
            legal,
            handoverTime,
            highlights: highlights || [],
            heroImage,
            specs: specs,
            gallery: gallery,
            extentionDescription,
            extentionImages: extentionImages,
            floorplans: floorplans,
            customSections: customSections,
            reasonToBuy: reasonToBuy,
            reasonToBuyTitle,
            reasonToBuyDescription,
            reasonToBuyImage,
            reasonToBuyImageAlt,
            salePolicy,
            salePolicyDes,
            salePolicyImg,
            salePolicyAlt,
            salePolicyDescriptionDetails: salePolicyDescriptionDetails,
            location360Url,
            nearbyGroups: nearbyGroups,
            nearbyTrafficItems: nearbyTrafficItems,
            apartmentDesign: apartmentDesign,
            extentionDestinations: extentionDestinations,
            handoverStandard: handoverStandard,
            progress: progress,
            progressDescription,
            progressYoutubeUrl,
            progressMilestones: progressMilestones,
            progressGallery: progressGallery,
            progressVideoUrl,
            faqs: faqs,
            legalInfo: legalInfo,
            advertisingDisclaimer,
            floorplanMaster: floorplanMaster,
            floorplanByFloor: floorplanByFloor,
            unitLayouts: unitLayouts,
            showOnHome,
            homeOrder,
            isFeatured,
            stickyMenu: stickyMenu,
            heroLeadForm: heroLeadForm,
            floatingCtas: floatingCtas,
            coverImage,
            coverAssetId,
            ogAssetId,
            metaTitle,
            metaDescription,
            seoHead: seoHead,
            createdByAdminId: adminId,
            status: "DRAFT",
        };
        if (progressVideoUploadDate !== undefined) {
            createData.progressVideoUploadDate = progressVideoUploadDate;
        }
        if (progressVideoThumbnailUrl !== undefined) {
            createData.progressVideoThumbnailUrl = progressVideoThumbnailUrl;
        }
        const result = await prisma_1.prisma.project.create({
            data: createData,
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
    async getProjects(query) {
        const { status, category, city, district, search, page, limit } = query;
        const where = {};
        if (status)
            where.status = status;
        if (category)
            where.category = category;
        if (city)
            where.city = city;
        if (district)
            where.district = district;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { slug: { contains: search, mode: "insensitive" } },
                { shortDescription: { contains: search, mode: "insensitive" } },
            ];
        }
        const [projects, total] = await Promise.all([
            prisma_1.prisma.project.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    coverAsset: { select: { id: true, url: true } },
                },
            }),
            prisma_1.prisma.project.count({ where }),
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
    async getProjectById(id) {
        const project = await prisma_1.prisma.project.findUnique({
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
        if (!project)
            return null;
        return this.transformToFrontendFormat(project);
    }
    /**
     * Get single project by slug
     */
    async getProjectBySlug(slug) {
        const project = await prisma_1.prisma.project.findUnique({
            where: { slug },
            include: {
                coverAsset: true,
                ogAsset: true,
                sections: { orderBy: { order: "asc" } },
                createdByAdmin: { select: { id: true, email: true } },
            },
        });
        if (!project)
            return null;
        return this.transformToFrontendFormat(project);
    }
    /**
     * Update project
     */
    async updateProject(id, data) {
        const { slug, title, subtitle, shortDescription, intro, longDescription, category, developerName, projectType, city, district, address, locationText, locationDescription, locationImage, mapEmbedUrl, lat, lng, priceFrom, priceTo, priceUnit, legal, handoverTime, highlights, heroImage, specs, gallery, extentionDescription, extentionImages, floorplans, customSections, reasonToBuy, reasonToBuyTitle, reasonToBuyDescription, reasonToBuyImage, reasonToBuyImageAlt, salePolicy, salePolicyDes, salePolicyImg, salePolicyAlt, salePolicyDescriptionDetails, location360Url, nearbyGroups, nearbyTrafficItems, apartmentDesign, extentionDestinations, handoverStandard, progress, progressDescription, progressYoutubeUrl, progressVideoUploadDate, progressVideoThumbnailUrl, progressMilestones, progressGallery, progressVideoUrl, faqs, legalInfo, advertisingDisclaimer, floorplanMaster, floorplanByFloor, unitLayouts, showOnHome, homeOrder, isFeatured, stickyMenu, heroLeadForm, floatingCtas, coverImage, coverAssetId, ogAssetId, metaTitle, metaDescription, seoHead, } = data;
        const result = await prisma_1.prisma.project.update({
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
                ...(lat !== undefined && { lat: lat ? new client_1.Prisma.Decimal(lat.toString()) : undefined }),
                ...(lng !== undefined && { lng: lng ? new client_1.Prisma.Decimal(lng.toString()) : undefined }),
                ...(priceFrom !== undefined && { priceFrom: priceFrom ? BigInt(priceFrom) : undefined }),
                ...(priceTo !== undefined && { priceTo: priceTo ? BigInt(priceTo) : undefined }),
                ...(priceUnit !== undefined && { priceUnit }),
                ...(legal !== undefined && { legal }),
                ...(handoverTime !== undefined && { handoverTime }),
                ...(highlights && { highlights }),
                ...(heroImage !== undefined && { heroImage }),
                ...(specs !== undefined && { specs: specs }),
                ...(gallery !== undefined && { gallery: gallery }),
                ...(extentionDescription !== undefined && { extentionDescription }),
                ...(extentionImages !== undefined && { extentionImages: extentionImages }),
                ...(floorplans !== undefined && { floorplans: floorplans }),
                ...(customSections !== undefined && { customSections: customSections }),
                // Reason to buy
                ...(reasonToBuy !== undefined && { reasonToBuy: reasonToBuy }),
                ...(reasonToBuyTitle !== undefined && { reasonToBuyTitle }),
                ...(reasonToBuyDescription !== undefined && { reasonToBuyDescription }),
                ...(reasonToBuyImage !== undefined && { reasonToBuyImage }),
                ...(reasonToBuyImageAlt !== undefined && { reasonToBuyImageAlt }),
                // Sale policy
                ...(salePolicy !== undefined && { salePolicy }),
                ...(salePolicyDes !== undefined && { salePolicyDes }),
                ...(salePolicyImg !== undefined && { salePolicyImg }),
                ...(salePolicyAlt !== undefined && { salePolicyAlt }),
                ...(salePolicyDescriptionDetails !== undefined && { salePolicyDescriptionDetails: salePolicyDescriptionDetails }),
                // Location 360 & nearby
                ...(location360Url !== undefined && { location360Url }),
                ...(nearbyGroups !== undefined && { nearbyGroups: nearbyGroups }),
                ...(nearbyTrafficItems !== undefined && { nearbyTrafficItems: nearbyTrafficItems }),
                // Apartment / extention / handover
                ...(apartmentDesign !== undefined && { apartmentDesign: apartmentDesign }),
                ...(extentionDestinations !== undefined && { extentionDestinations: extentionDestinations }),
                ...(handoverStandard !== undefined && { handoverStandard: handoverStandard }),
                // Progress
                ...(progress !== undefined && { progress: progress }),
                ...(progressDescription !== undefined && { progressDescription }),
                ...(progressYoutubeUrl !== undefined && { progressYoutubeUrl }),
                ...(progressVideoUploadDate !== undefined && { progressVideoUploadDate }),
                ...(progressVideoThumbnailUrl !== undefined && { progressVideoThumbnailUrl }),
                ...(progressMilestones !== undefined && { progressMilestones: progressMilestones }),
                ...(progressGallery !== undefined && { progressGallery: progressGallery }),
                ...(progressVideoUrl !== undefined && { progressVideoUrl }),
                // FAQ / Legal / Disclaimer
                ...(faqs !== undefined && { faqs: faqs }),
                ...(legalInfo !== undefined && { legalInfo: legalInfo }),
                ...(advertisingDisclaimer !== undefined && { advertisingDisclaimer }),
                // Floorplan
                ...(floorplanMaster !== undefined && { floorplanMaster: floorplanMaster }),
                ...(floorplanByFloor !== undefined && { floorplanByFloor: floorplanByFloor }),
                // Unit layouts
                ...(unitLayouts !== undefined && { unitLayouts: unitLayouts }),
                // UI/UX config
                ...(showOnHome !== undefined && { showOnHome }),
                ...(homeOrder !== undefined && { homeOrder }),
                ...(isFeatured !== undefined && { isFeatured }),
                ...(stickyMenu !== undefined && { stickyMenu: stickyMenu }),
                ...(heroLeadForm !== undefined && { heroLeadForm: heroLeadForm }),
                ...(floatingCtas !== undefined && { floatingCtas: floatingCtas }),
                // SEO
                ...(coverImage !== undefined && { coverImage }),
                ...(coverAssetId !== undefined && { coverAssetId }),
                ...(ogAssetId !== undefined && { ogAssetId }),
                ...(metaTitle !== undefined && { metaTitle }),
                ...(metaDescription !== undefined && { metaDescription }),
                ...(seoHead !== undefined && { seoHead: seoHead }),
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
    async deleteProject(id) {
        const result = await prisma_1.prisma.project.delete({ where: { id } });
        return this.serializeBigInt(result);
    }
    /**
     * Publish project
     */
    async publishProject(id) {
        const result = await prisma_1.prisma.project.update({
            where: { id },
            data: { status: "PUBLISHED", publishedAt: new Date() },
        });
        return { id: result.id, status: result.status, publishedAt: result.publishedAt };
    }
    /**
     * Toggle featured status
     */
    async toggleFeatured(id) {
        const project = await prisma_1.prisma.project.findUnique({ where: { id } });
        if (!project)
            return null;
        const result = await prisma_1.prisma.project.update({
            where: { id },
            data: { isFeatured: !project.isFeatured },
        });
        return { id: result.id, isFeatured: result.isFeatured };
    }
    /**
     * Archive project
     */
    async archiveProject(id) {
        const result = await prisma_1.prisma.project.update({
            where: { id },
            data: { status: "ARCHIVED" },
        });
        return { id: result.id, status: result.status };
    }
    /**
     * Transform database model to frontend format (matching mockup)
     */
    transformToFrontendFormat(project) {
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
            progressVideoUploadDate: project.progressVideoUploadDate || "",
            progressVideoThumbnailUrl: project.progressVideoThumbnailUrl || "",
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
exports.projectService = new ProjectService();
