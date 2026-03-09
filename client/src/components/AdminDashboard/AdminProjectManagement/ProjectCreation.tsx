import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  Squares2X2Icon,
  PhotoIcon as GalleryIcon,
  CloudArrowUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { ProjectData, ProjectCategory, ProjectExtentionImage } from "../../../constants/projectData";
import { adminService } from "../../../services/admin.service";
import { projectService } from "../../../services/project.service";

// Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
};

type ProjectCreationProps = {
  onBack?: () => void;
  onSave?: () => void; // Called after successful save
  projectId?: string; // For edit mode
};

type ProjectFormData = Omit<ProjectData, "id"> & {
  id?: string;
};

const defaultFormData: ProjectFormData = {
  slug: "",
  title: "",
  subtitle: "",
  shortDescription: "",
  intro: "",
  category: "SUN",
  projectType: "",
  locationText: "",
  locationDescription: "",
  locationImage: "",
  mapEmbedUrl: "",
  coverImage: "",
  heroImage: "",
  specs: [],
  gallery: [],
  extentionDescription: "",
  extentionImages: [],
  floorplans: [],
  highlights: [],
};

type TabType = "basic" | "overview" | "location" | "extention" | "floorplan" | "gallery";

// Image preview component
const ImagePreview = ({
  src,
  alt,
  onRemove,
  height = "h-48"
}: {
  src: string;
  alt?: string;
  onRemove: () => void;
  height?: string;
}) => (
  <div className="relative group">
    <div className={`${height} w-full overflow-hidden rounded-xl border border-gray-200`}>
      <img src={src} alt={alt || "Preview"} className="h-full w-full object-cover" />
    </div>
    <button
      type="button"
      onClick={onRemove}
      className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
    >
      <XMarkIcon className="h-4 w-4" />
    </button>
  </div>
);

// Upload button component
const UploadButton = ({
  onClick,
  isUploading,
  label,
  hasImage,
}: {
  onClick: () => void;
  isUploading: boolean;
  label: string;
  hasImage: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={isUploading}
    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm font-medium text-gray-600 transition hover:border-yellow-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <CloudArrowUpIcon className="h-5 w-5" />
    {isUploading ? "Đang upload..." : hasImage ? "Thay đổi ảnh" : label}
  </button>
);

const ProjectCreation: React.FC<ProjectCreationProps> = ({ onBack, onSave, projectId }) => {
  const navigate = useNavigate();
  const isEditMode = !!projectId;
  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [formData, setFormData] = useState<ProjectFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({});

  // Refs for file inputs
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const locationImageInputRef = useRef<HTMLInputElement>(null);
  const extentionImageInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const floorplanImageInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const galleryImageInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  // Fetch project data when in edit mode
  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        setIsLoadingProject(true);
        const response = await projectService.getProjectById(projectId);
        if (response.success && response.data) {
          const project = response.data;
          setFormData({
            id: project.id,
            slug: project.slug || "",
            title: project.title || "",
            subtitle: project.subtitle || "",
            shortDescription: project.shortDescription || "",
            intro: project.intro || "",
            category: project.category || "SUN",
            projectType: project.projectType || "",
            locationText: project.locationText || "",
            locationDescription: project.locationDescription || "",
            locationImage: project.locationImage || "",
            mapEmbedUrl: project.mapEmbedUrl || "",
            coverImage: project.coverImage || "",
            heroImage: project.heroImage || "",
            specs: project.specs || [],
            gallery: project.gallery || [],
            extentionDescription: project.extentionDescription || "",
            extentionImages: project.extentionImages || [],
            floorplans: project.floorplans || [],
            highlights: project.highlights || [],
          });
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Không thể tải thông tin dự án");
      } finally {
        setIsLoadingProject(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const tabs: { id: TabType; label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[] = [
    { id: "basic", label: "Thông tin cơ bản", icon: BuildingOfficeIcon },
    { id: "overview", label: "Tổng quan & Specs", icon: Squares2X2Icon },
    { id: "location", label: "Vị trí", icon: MapPinIcon },
    { id: "extention", label: "Tiện ích", icon: BuildingOfficeIcon },
    { id: "floorplan", label: "Mặt bằng", icon: Squares2X2Icon },
    { id: "gallery", label: "Thư viện ảnh", icon: GalleryIcon },
  ];

  const updateField = <K extends keyof ProjectFormData>(field: K, value: ProjectFormData[K]) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug when title changes
      if (field === "title" && typeof value === "string") {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  // Upload image helper
  const handleImageUpload = async (
    file: File,
    folder: string,
    onSuccess: (url: string) => void,
    uploadKey: string
  ) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Chỉ cho phép upload file hình ảnh");
      return;
    }

    try {
      setUploadingImages((prev) => ({ ...prev, [uploadKey]: true }));

      const presign = await adminService.getPresignedUrl({
        fileName: file.name,
        contentType: file.type,
        folder,
      });

      await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      const createdAsset = await adminService.createAsset({
        key: presign.key,
        url: presign.publicUrl,
        contentType: file.type,
        size: file.size,
        type: "IMAGE",
      });

      onSuccess(createdAsset?.url ?? presign.publicUrl);
      toast.success("Upload ảnh thành công");
    } catch {
      toast.error("Upload ảnh thất bại");
    } finally {
      setUploadingImages((prev) => ({ ...prev, [uploadKey]: false }));
    }
  };

  const addSpec = () => {
    updateField("specs", [...formData.specs, { label: "", value: "" }]);
  };

  const updateSpec = (index: number, field: "label" | "value", value: string) => {
    const newSpecs = [...formData.specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    updateField("specs", newSpecs);
  };

  const removeSpec = (index: number) => {
    updateField("specs", formData.specs.filter((_, i) => i !== index));
  };

  const addHighlight = () => {
    updateField("highlights", [...formData.highlights, ""]);
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    updateField("highlights", newHighlights);
  };

  const removeHighlight = (index: number) => {
    updateField("highlights", formData.highlights.filter((_, i) => i !== index));
  };

  const addGalleryImage = () => {
    updateField("gallery", [...formData.gallery, { src: "", alt: "" }]);
  };

  const updateGalleryImage = (index: number, field: "src" | "alt", value: string) => {
    const newGallery = [...formData.gallery];
    newGallery[index] = { ...newGallery[index], [field]: value };
    updateField("gallery", newGallery);
  };

  const removeGalleryImage = (index: number) => {
    updateField("gallery", formData.gallery.filter((_, i) => i !== index));
  };

  const addExtentionImage = () => {
    updateField("extentionImages", [
      ...(formData.extentionImages || []),
      { src: "", alt: "", title: "", description: "" },
    ]);
  };

  const updateExtentionImage = (index: number, field: keyof ProjectExtentionImage, value: string) => {
    const currentImages = formData.extentionImages || [];
    const newExtentionImages = [...currentImages];
    newExtentionImages[index] = { ...newExtentionImages[index], [field]: value };
    updateField("extentionImages", newExtentionImages);
  };

  const removeExtentionImage = (index: number) => {
    const currentImages = formData.extentionImages || [];
    updateField("extentionImages", currentImages.filter((_, i) => i !== index));
  };

  const addFloorplan = () => {
    updateField("floorplans", [
      ...formData.floorplans,
      { description: "", floorPlanImage: [] },
    ]);
  };

  const updateFloorplan = (index: number, field: "description", value: string) => {
    const newFloorplans = [...formData.floorplans];
    newFloorplans[index] = { ...newFloorplans[index], [field]: value };
    updateField("floorplans", newFloorplans);
  };

  const addFloorplanImage = (floorplanIndex: number) => {
    const newFloorplans = [...formData.floorplans];
    newFloorplans[floorplanIndex].floorPlanImage.push({ src: "", alt: "" });
    updateField("floorplans", newFloorplans);
  };

  const updateFloorplanImage = (floorplanIndex: number, imageIndex: number, field: "src" | "alt", value: string) => {
    const newFloorplans = [...formData.floorplans];
    newFloorplans[floorplanIndex].floorPlanImage[imageIndex] = {
      ...newFloorplans[floorplanIndex].floorPlanImage[imageIndex],
      [field]: value,
    };
    updateField("floorplans", newFloorplans);
  };

  const removeFloorplanImage = (floorplanIndex: number, imageIndex: number) => {
    const newFloorplans = [...formData.floorplans];
    newFloorplans[floorplanIndex].floorPlanImage = newFloorplans[floorplanIndex].floorPlanImage.filter(
      (_, i) => i !== imageIndex
    );
    updateField("floorplans", newFloorplans);
  };

  const removeFloorplan = (index: number) => {
    updateField("floorplans", formData.floorplans.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.slug || !formData.title || !formData.shortDescription) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc (Slug, Title, Short Description)");
      return;
    }

    setIsSubmitting(true);
    try {
      const projectData = {
        slug: formData.slug,
        title: formData.title,
        subtitle: formData.subtitle || undefined,
        shortDescription: formData.shortDescription,
        longDescription: formData.intro || undefined,
        category: formData.category,
        projectType: formData.projectType || undefined,
        city: "Đà Nẵng", // Default city
        locationText: formData.locationText || undefined,
        locationDescription: formData.locationDescription || undefined,
        locationImage: formData.locationImage || undefined,
        mapEmbedUrl: formData.mapEmbedUrl || undefined,
        coverImage: formData.coverImage || undefined,
        heroImage: formData.heroImage || undefined,
        specs: formData.specs,
        gallery: formData.gallery.filter(g => g.src),
        extentionDescription: formData.extentionDescription || undefined,
        extentionImages: formData.extentionImages?.filter(e => e.title || e.src),
        floorplans: formData.floorplans.filter(f => f.floorPlanImage.some(img => img.src)),
        highlights: formData.highlights,
      };

      let response;
      if (isEditMode && projectId) {
        response = await projectService.updateProject(projectId, projectData);
        if (response.success) {
          toast.success("Cập nhật dự án thành công!");
        }
      } else {
        response = await projectService.createProject(projectData);
        if (response.success) {
          toast.success("Tạo dự án thành công!");
          // Reset form
          setFormData(defaultFormData);
        }
      }

      if (response.success) {
        onSave?.();
        // Navigate to project list or detail
        setTimeout(() => {
          if (onBack) {
            onBack();
          } else {
            navigate("/admin/projects");
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Error saving project:", error);
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err?.response?.data?.error || (isEditMode ? "Không thể cập nhật dự án" : "Không thể tạo dự án"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Tên dự án <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="Sun Symphony Residence"
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Slug <span className="text-green-500">(Auto-generate)</span>
        </label>
        <input
          type="text"
          value={formData.slug}
          readOnly
          placeholder="sun-symphony-residence-da-nang"
          className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-600 cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-gray-500">Tự động tạo từ tên dự án</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Tiêu đề phụ</label>
        <input
          type="text"
          value={formData.subtitle || ""}
          onChange={(e) => updateField("subtitle", e.target.value)}
          placeholder="Căn hộ cao cấp bên sông Hàn - Sở hữu lâu dài"
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.category}
          onChange={(e) => updateField("category", e.target.value as ProjectCategory)}
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500"
        >
          <option value="SUN">Sun Group</option>
          <option value="VIN">Vin Group</option>
          <option value="OTHER">Khác</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Loại hình dự án</label>
        <input
          type="text"
          value={formData.projectType || ""}
          onChange={(e) => updateField("projectType", e.target.value)}
          placeholder="Căn hộ cao cấp"
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Mô tả ngắn <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.shortDescription}
          onChange={(e) => updateField("shortDescription", e.target.value)}
          rows={3}
          placeholder="Mô tả ngắn gọn về dự án..."
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Giới thiệu chi tiết</label>
        <textarea
          value={formData.intro}
          onChange={(e) => updateField("intro", e.target.value)}
          rows={4}
          placeholder="Giới thiệu chi tiết về dự án..."
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Tags nổi bật</label>
        <div className="flex flex-wrap gap-2">
          {formData.highlights.map((highlight, index) => (
            <div key={index} className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5">
              <input
                type="text"
                value={highlight}
                onChange={(e) => updateHighlight(index, e.target.value)}
                placeholder="View sông Hàn"
                className="w-24 bg-transparent text-sm text-gray-900 outline-none"
              />
              <button
                type="button"
                onClick={() => removeHighlight(index)}
                className="text-red-500 hover:text-red-700 transition"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addHighlight}
            className="inline-flex items-center gap-1 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            <PlusIcon className="h-3 w-3" />
            Thêm
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Ảnh Cover</label>
        <input
          ref={coverImageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              await handleImageUpload(
                file,
                "projects/cover",
                (url) => updateField("coverImage", url),
                "coverImage"
              );
              if (coverImageInputRef.current) coverImageInputRef.current.value = "";
            }
          }}
        />
        {!formData.coverImage ? (
          <UploadButton
            onClick={() => coverImageInputRef.current?.click()}
            isUploading={uploadingImages.coverImage || false}
            label="Upload ảnh Cover"
            hasImage={false}
          />
        ) : (
          <div className="space-y-3">
            <ImagePreview
              src={formData.coverImage}
              alt="Cover preview"
              height="h-64"
              onRemove={() => updateField("coverImage", "")}
            />
            <UploadButton
              onClick={() => coverImageInputRef.current?.click()}
              isUploading={uploadingImages.coverImage || false}
              label="Upload ảnh Cover"
              hasImage={true}
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Ảnh Hero (Tổng quan)</label>
        <input
          ref={heroImageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              await handleImageUpload(
                file,
                "projects/hero",
                (url) => updateField("heroImage", url),
                "heroImage"
              );
              if (heroImageInputRef.current) heroImageInputRef.current.value = "";
            }
          }}
        />
        {!formData.heroImage ? (
          <UploadButton
            onClick={() => heroImageInputRef.current?.click()}
            isUploading={uploadingImages.heroImage || false}
            label="Upload ảnh Hero"
            hasImage={false}
          />
        ) : (
          <div className="space-y-3">
            <ImagePreview
              src={formData.heroImage}
              alt="Hero preview"
              height="h-80"
              onRemove={() => updateField("heroImage", "")}
            />
            <UploadButton
              onClick={() => heroImageInputRef.current?.click()}
              isUploading={uploadingImages.heroImage || false}
              label="Upload ảnh Hero"
              hasImage={true}
            />
          </div>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Thông tin chi tiết (Specs)</label>
        <div className="space-y-4">
          {formData.specs.map((spec, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={spec.label}
                onChange={(e) => updateSpec(index, "label", e.target.value)}
                placeholder="Tên dự án"
                className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => updateSpec(index, "value", e.target.value)}
                placeholder="Sun Symphony Residence"
                className="flex-1 rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500"
              />
              <button
                type="button"
                onClick={() => removeSpec(index)}
                className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSpec}
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            <PlusIcon className="h-4 w-4" />
            Thêm thông tin
          </button>
        </div>
      </div>
    </div>
  );

  const renderLocation = () => (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Địa chỉ hiển thị</label>
        <input
          type="text"
          value={formData.locationText}
          onChange={(e) => updateField("locationText", e.target.value)}
          placeholder="Trần Hưng Đạo, Sơn Trà, Đà Nẵng"
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Mô tả vị trí</label>
        <textarea
          value={formData.locationDescription}
          onChange={(e) => updateField("locationDescription", e.target.value)}
          rows={5}
          placeholder="Mô tả chi tiết về vị trí và tiện ích xung quanh..."
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">URL bản đồ nhúng</label>
        <input
          type="url"
          value={formData.mapEmbedUrl}
          onChange={(e) => updateField("mapEmbedUrl", e.target.value)}
          placeholder="https://www.google.com/maps?q=Da%20Nang&output=embed"
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500"
        />
        {formData.mapEmbedUrl && (
          <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
            <iframe
              src={formData.mapEmbedUrl}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>

      {/* Location Image Upload */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Hình ảnh vị trí</label>
        <p className="mb-3 text-xs text-gray-500">Upload hình ảnh bản đồ vệ tinh hoặc quy hoạch vị trí dự án</p>
        {formData.locationImage ? (
          <div className="space-y-3">
            <ImagePreview
              src={formData.locationImage}
              alt="Hình ảnh vị trí"
              onRemove={() => updateField("locationImage", "")}
              height="h-64"
            />
            <button
              type="button"
              onClick={() => locationImageInputRef.current?.click()}
              className="text-sm text-yellow-600 hover:text-yellow-700"
            >
              Thay đổi ảnh
            </button>
          </div>
        ) : (
          <UploadButton
            onClick={() => locationImageInputRef.current?.click()}
            isUploading={uploadingImages["locationImage"] || false}
            label="Tải lên hình ảnh vị trí"
            hasImage={!!formData.locationImage}
          />
        )}
        <input
          ref={locationImageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              setUploadingImages((prev) => ({ ...prev, locationImage: true }));
              try {
                // Simulate URL upload (replace with actual upload logic)
                const reader = new FileReader();
                reader.onload = (event) => {
                  updateField("locationImage", event.target?.result as string);
                  setUploadingImages((prev) => ({ ...prev, locationImage: false }));
                };
                reader.readAsDataURL(file);
              } catch (error) {
                console.error("Error uploading location image:", error);
                setUploadingImages((prev) => ({ ...prev, locationImage: false }));
              }
            }
          }}
        />
      </div>
    </div>
  );

  const renderExtention = () => (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Mô tả tiện ích</label>
        <textarea
          value={formData.extentionDescription || ""}
          onChange={(e) => updateField("extentionDescription", e.target.value)}
          rows={3}
          placeholder="Chuỗi tiện ích nội khu được quy hoạch theo tiêu chuẩn nghỉ dưỡng..."
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Tiện ích</label>
        <div className="space-y-4">
          {(formData.extentionImages || []).map((image, index) => (
            <div key={index} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3">
                <label className="mb-1 block text-xs font-medium text-gray-600">Tiêu đề</label>
                <input
                  type="text"
                  value={image.title}
                  onChange={(e) => updateExtentionImage(index, "title", e.target.value)}
                  placeholder="Hồ bơi vô cực"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Hình ảnh</label>
                <input
                  ref={(el) => {
                    extentionImageInputRefs.current[index] = el;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      await handleImageUpload(
                        file,
                        `projects/extention/${index}`,
                        (url) => updateExtentionImage(index, "src", url),
                        `extentionImage-${index}`
                      );
                      if (extentionImageInputRefs.current[index]) {
                        extentionImageInputRefs.current[index]!.value = "";
                      }
                    }
                  }}
                />
                {!image.src ? (
                  <UploadButton
                    onClick={() => extentionImageInputRefs.current[index]?.click()}
                    isUploading={uploadingImages[`extentionImage-${index}`] || false}
                    label="Upload ảnh"
                    hasImage={false}
                  />
                ) : (
                  <div className="space-y-3">
                    <ImagePreview
                      src={image.src}
                      alt={image.alt}
                      height="h-48"
                      onRemove={() => updateExtentionImage(index, "src", "")}
                    />
                    <UploadButton
                      onClick={() => extentionImageInputRefs.current[index]?.click()}
                      isUploading={uploadingImages[`extentionImage-${index}`] || false}
                      label="Upload ảnh"
                      hasImage={true}
                    />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeExtentionImage(index)}
                className="mt-3 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 transition"
              >
                Xóa tiện ích này
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addExtentionImage}
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            <PlusIcon className="h-4 w-4" />
            Thêm tiện ích
          </button>
        </div>
      </div>
    </div>
  );

  const renderFloorplan = () => (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Mặt bằng</label>
        <div className="space-y-6">
          {formData.floorplans.map((floorplan, floorplanIndex) => (
            <div key={floorplanIndex} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-4">
                <label className="mb-2 block text-xs font-medium text-gray-600">Mô tả</label>
                <textarea
                  value={floorplan.description}
                  onChange={(e) => updateFloorplan(floorplanIndex, "description", e.target.value)}
                  rows={2}
                  placeholder="Mặt bằng căn hộ được tối ưu công năng..."
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-medium text-gray-600">Hình ảnh mặt bằng</label>
                {floorplan.floorPlanImage.map((image, imageIndex) => {
                  const inputKey = `${floorplanIndex}-${imageIndex}`;
                  return (
                    <div key={imageIndex} className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={image.alt}
                          onChange={(e) => updateFloorplanImage(floorplanIndex, imageIndex, "alt", e.target.value)}
                          placeholder="Mặt bằng phương án 1"
                          className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeFloorplanImage(floorplanIndex, imageIndex)}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50 transition"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <input
                        ref={(el) => {
                          floorplanImageInputRefs.current[inputKey] = el;
                        }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            await handleImageUpload(
                              file,
                              `projects/floorplan/${floorplanIndex}`,
                              (url) => updateFloorplanImage(floorplanIndex, imageIndex, "src", url),
                              `floorplan-${inputKey}`
                            );
                            if (floorplanImageInputRefs.current[inputKey]) {
                              floorplanImageInputRefs.current[inputKey]!.value = "";
                            }
                          }
                        }}
                      />
                      {!image.src ? (
                        <UploadButton
                          onClick={() => floorplanImageInputRefs.current[inputKey]?.click()}
                          isUploading={uploadingImages[`floorplan-${inputKey}`] || false}
                          label="Upload ảnh mặt bằng"
                          hasImage={false}
                        />
                      ) : (
                        <div className="space-y-2">
                          <ImagePreview
                            src={image.src}
                            alt={image.alt}
                            height="h-40"
                            onRemove={() => updateFloorplanImage(floorplanIndex, imageIndex, "src", "")}
                          />
                          <UploadButton
                            onClick={() => floorplanImageInputRefs.current[inputKey]?.click()}
                            isUploading={uploadingImages[`floorplan-${inputKey}`] || false}
                            label="Thay đổi ảnh"
                            hasImage={true}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={() => addFloorplanImage(floorplanIndex)}
                  className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  <PlusIcon className="h-3 w-3" />
                  Thêm ảnh
                </button>
              </div>

              <button
                type="button"
                onClick={() => removeFloorplan(floorplanIndex)}
                className="mt-4 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 transition"
              >
                Xóa mặt bằng này
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFloorplan}
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            <PlusIcon className="h-4 w-4" />
            Thêm mặt bằng
          </button>
        </div>
      </div>
    </div>
  );

  const renderGallery = () => (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Thư viện ảnh (Phối cảnh)</label>
        <div className="space-y-4">
          {formData.gallery.map((image, index) => (
            <div key={index} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3">
                <input
                  type="text"
                  value={image.alt}
                  onChange={(e) => updateGalleryImage(index, "alt", e.target.value)}
                  placeholder="Phối cảnh 1"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <input
                ref={(el) => {
                  galleryImageInputRefs.current[index] = el;
                }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await handleImageUpload(
                      file,
                      `projects/gallery/${index}`,
                      (url) => updateGalleryImage(index, "src", url),
                      `gallery-${index}`
                    );
                    if (galleryImageInputRefs.current[index]) {
                      galleryImageInputRefs.current[index]!.value = "";
                    }
                  }
                }}
              />
              {!image.src ? (
                <UploadButton
                  onClick={() => galleryImageInputRefs.current[index]?.click()}
                  isUploading={uploadingImages[`gallery-${index}`] || false}
                  label="Upload ảnh"
                  hasImage={false}
                />
              ) : (
                <div className="space-y-3">
                  <ImagePreview
                    src={image.src}
                    alt={image.alt}
                    height="h-56"
                    onRemove={() => updateGalleryImage(index, "src", "")}
                  />
                  <UploadButton
                    onClick={() => galleryImageInputRefs.current[index]?.click()}
                    isUploading={uploadingImages[`gallery-${index}`] || false}
                    label="Thay đổi ảnh"
                    hasImage={true}
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => removeGalleryImage(index)}
                className="mt-3 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 transition"
              >
                Xóa ảnh này
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addGalleryImage}
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            <PlusIcon className="h-4 w-4" />
            Thêm ảnh
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return renderBasicInfo();
      case "overview":
        return renderOverview();
      case "location":
        return renderLocation();
      case "extention":
        return renderExtention();
      case "floorplan":
        return renderFloorplan();
      case "gallery":
        return renderGallery();
      default:
        return null;
    }
  };

  // Show loading state when fetching project data in edit mode
  if (isEditMode && isLoadingProject) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-600 border-t-transparent"></div>
          <p className="mt-4 text-sm text-gray-500">Đang tải thông tin dự án...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={onBack || (() => window.history.back())}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Quay lại
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? "Chỉnh sửa dự án" : "Tạo dự án mới"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEditMode ? "Cập nhật thông tin dự án bất động sản" : "Điền thông tin chi tiết về dự án bất động sản"}
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Đang lưu..." : "Lưu dự án"}
        </button>
      </div>

      {/* Tabs */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "border-yellow-600 text-yellow-700 bg-yellow-50"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default ProjectCreation;
