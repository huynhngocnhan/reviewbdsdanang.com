import type React from "react";
import { useState, useRef } from "react";
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
} from "@heroicons/react/24/outline";
import type { ProjectData, ProjectCategory, ProjectExtentionImage } from "../../../constants/projectData";
import { adminService } from "../../../services/admin.service";

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

const ProjectCreation: React.FC<ProjectCreationProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [formData, setFormData] = useState<ProjectFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({});
  const [locationImage, setLocationImage] = useState<string>("");

  // Refs for file inputs
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const locationImageInputRef = useRef<HTMLInputElement>(null);
  const extentionImageInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const floorplanImageInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const galleryImageInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

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
      // TODO: Call API to save project
      console.log("Project data:", formData);
      toast.success("Tạo dự án thành công!");
      // Reset form or navigate back
      setTimeout(() => {
        setFormData(defaultFormData);
      }, 1000);
    } catch {
      toast.error("Không thể tạo dự án");
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
          Slug <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => updateField("slug", e.target.value)}
          placeholder="sun-symphony-residence-da-nang"
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500"
        />
        <p className="mt-1 text-xs text-gray-500">Tự động tạo từ tên dự án (có thể chỉnh sửa)</p>
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
        <button
          type="button"
          onClick={() => coverImageInputRef.current?.click()}
          disabled={uploadingImages.coverImage}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-sm font-medium text-gray-600 transition hover:border-yellow-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CloudArrowUpIcon className="h-5 w-5" />
          {uploadingImages.coverImage ? "Đang upload..." : formData.coverImage ? "Thay đổi ảnh" : "Upload ảnh Cover"}
        </button>
        {formData.coverImage && (
          <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
            <img src={formData.coverImage} alt="Cover preview" className="h-48 w-full object-cover" />
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
        <button
          type="button"
          onClick={() => heroImageInputRef.current?.click()}
          disabled={uploadingImages.heroImage}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-sm font-medium text-gray-600 transition hover:border-yellow-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CloudArrowUpIcon className="h-5 w-5" />
          {uploadingImages.heroImage ? "Đang upload..." : formData.heroImage ? "Thay đổi ảnh" : "Upload ảnh Hero"}
        </button>
        {formData.heroImage && (
          <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
            <img src={formData.heroImage} alt="Hero preview" className="h-64 w-full object-cover" />
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
        <label className="mb-2 block text-sm font-semibold text-gray-700">Hình ảnh vị trí</label>
        <input
          ref={locationImageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              await handleImageUpload(
                file,
                "projects/location",
                (url) => setLocationImage(url),
                "locationImage"
              );
              if (locationImageInputRef.current) locationImageInputRef.current.value = "";
            }
          }}
        />
        <button
          type="button"
          onClick={() => locationImageInputRef.current?.click()}
          disabled={uploadingImages.locationImage}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-sm font-medium text-gray-600 transition hover:border-yellow-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CloudArrowUpIcon className="h-5 w-5" />
          {uploadingImages.locationImage ? "Đang upload..." : locationImage ? "Thay đổi ảnh" : "Upload ảnh vị trí"}
        </button>
        {locationImage && (
          <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
            <img src={locationImage} alt="Location preview" className="h-64 w-full object-cover" />
          </div>
        )}
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
              <div className="mb-3">
                <label className="mb-1 block text-xs font-medium text-gray-600">Mô tả</label>
                <textarea
                  value={image.description}
                  onChange={(e) => updateExtentionImage(index, "description", e.target.value)}
                  rows={2}
                  placeholder="Tầm nhìn mở rộng hướng sông..."
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
                <button
                  type="button"
                  onClick={() => extentionImageInputRefs.current[index]?.click()}
                  disabled={uploadingImages[`extentionImage-${index}`]}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 py-4 text-sm font-medium text-gray-600 transition hover:border-yellow-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CloudArrowUpIcon className="h-4 w-4" />
                  {uploadingImages[`extentionImage-${index}`]
                    ? "Đang upload..."
                    : image.src
                      ? "Thay đổi ảnh"
                      : "Upload ảnh"}
                </button>
                {image.src && (
                  <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
                    <img src={image.src} alt={image.alt} className="h-32 w-full object-cover" />
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
                      <button
                        type="button"
                        onClick={() => floorplanImageInputRefs.current[inputKey]?.click()}
                        disabled={uploadingImages[`floorplan-${inputKey}`]}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white px-3 py-3 text-xs font-medium text-gray-600 transition hover:border-yellow-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <CloudArrowUpIcon className="h-4 w-4" />
                        {uploadingImages[`floorplan-${inputKey}`]
                          ? "Đang upload..."
                          : image.src
                            ? "Thay đổi ảnh"
                            : "Upload ảnh"}
                      </button>
                      {image.src && (
                        <div className="overflow-hidden rounded-lg border border-gray-200">
                          <img src={image.src} alt={image.alt} className="h-32 w-full object-cover" />
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
              <button
                type="button"
                onClick={() => galleryImageInputRefs.current[index]?.click()}
                disabled={uploadingImages[`gallery-${index}`]}
                className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white px-4 py-4 text-sm font-medium text-gray-600 transition hover:border-yellow-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CloudArrowUpIcon className="h-4 w-4" />
                {uploadingImages[`gallery-${index}`]
                  ? "Đang upload..."
                  : image.src
                    ? "Thay đổi ảnh"
                    : "Upload ảnh"}
              </button>
              {image.src && (
                <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
                  <img src={image.src} alt={image.alt} className="h-48 w-full object-cover" />
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
          <h1 className="text-2xl font-bold text-gray-900">Tạo dự án mới</h1>
          <p className="mt-1 text-sm text-gray-500">Điền thông tin chi tiết về dự án bất động sản</p>
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
