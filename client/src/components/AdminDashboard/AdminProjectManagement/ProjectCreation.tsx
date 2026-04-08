import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  Squares2X2Icon,
  CloudArrowUpIcon,
  XMarkIcon,
  DocumentTextIcon,
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

type NearbyGroupFormItem = {
  minute?: string;
  description?: string;
};

type NearbyTrafficFormItem = {
  title?: string;
  img?: string;
  des?: string;
};

type ApartmentItemForm = {
  name: string;
  label: string;
  description: string;
  price: string;
  image: string;
};

type ApartmentDesignForm = {
  des?: string;
  desDetails?: string[];
  apartmentItems?: ApartmentItemForm[];
};

type ExtentionDestinationForm = {
  des?: string;
  img?: string;
};

type SalePolicyLiteForm = {
  des: string;
  img: string;
  alt: string;
  descriptionDetails: string[];
};

type ProjectFormData = Omit<ProjectData, "id"> & {
  id?: string;
  reasonToBuyTitle?: string;
  reasonToBuyDescription?: string;
  reasonToBuyImage?: string;
  reasonToBuyImageAlt?: string;
  salePolicyDes?: string;
  salePolicyImg?: string;
  salePolicyAlt?: string;
  salePolicyDescriptionDetails?: string[];
  location360Url?: string;
  nearbyGroups?: NearbyGroupFormItem[];
  nearbyTrafficItems?: NearbyTrafficFormItem[];
  apartmentDesign?: ApartmentDesignForm;
  extentionDestinations?: ExtentionDestinationForm[];
  progressDescription?: string;
  progressYoutubeUrl?: string;
  salePolicyLite?: SalePolicyLiteForm;
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
  extentionDestinations: [],
  floorplans: [{ description: "", floorPlanImage: [] }],
  customSections: [],
  highlights: [],
  reasonToBuyTitle: "",
  reasonToBuyDescription: "",
  reasonToBuyImage: "",
  reasonToBuyImageAlt: "",
  salePolicyDes: "",
  salePolicyImg: "",
  salePolicyAlt: "",
  salePolicyDescriptionDetails: [],
  location360Url: "",
  nearbyGroups: [],
  nearbyTrafficItems: [],
  apartmentDesign: {
    des: "",
    desDetails: [],
    apartmentItems: [],
  },
  handoverStandard: {
    des: "",
    items: [] as Array<{ subtitle: string; title: string; des: string; imgUrl: string }>,
  },
  progressDescription: "",
  progressYoutubeUrl: "",
};

type TabType =
  | "basic"
  | "reason"
  | "overview"
  | "salePolicy"
  | "location"
  | "extention"
  | "apartment"
  | "handover"
  | "progress"
  | "floorplan"
  | "gallery"
  | "custom";

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

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["link", "clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "color",
  "background",
  "link",
];

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
  const reasonToBuyImageInputRef = useRef<HTMLInputElement>(null);
  const salePolicyImageInputRef = useRef<HTMLInputElement>(null);
  const extentionImageInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const floorplanImageInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const galleryImageInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const customImageInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const nearbyTrafficImageInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const extentionDestinationImageInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const apartmentItemImageInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const handoverItemImageInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  // Fetch project data when in edit mode
  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        setIsLoadingProject(true);
        const response = await projectService.getProjectById(projectId);
        if (response.success && response.data) {
          const project = response.data as ProjectFormData;
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
            extentionDestinations: project.extentionDestinations || [],
            floorplans: project.floorplans || [],
            customSections: project.customSections || [],
            highlights: project.highlights || [],
            reasonToBuyTitle: project.reasonToBuyTitle || "",
            reasonToBuyDescription: project.reasonToBuyDescription || "",
            reasonToBuyImage: project.reasonToBuyImage || "",
            reasonToBuyImageAlt: project.reasonToBuyImageAlt || "",
            salePolicyDes: project.salePolicyDes || "",
            salePolicyImg: project.salePolicyImg || "",
            salePolicyAlt: project.salePolicyAlt || "",
            salePolicyDescriptionDetails: project.salePolicyDescriptionDetails || [],
            location360Url: project.location360Url || "",
            nearbyGroups: project.nearbyGroups || [],
            nearbyTrafficItems: project.nearbyTrafficItems || [],
            apartmentDesign: project.apartmentDesign || {
              des: "",
              desDetails: [],
              apartmentItems: [],
            },
            handoverStandard: project.handoverStandard || {
              des: "",
              items: [],
            },
            progressDescription: project.progressDescription || "",
            progressYoutubeUrl: project.progressYoutubeUrl || "",
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
    { id: "reason", label: "Giá trị cốt lõi", icon: DocumentTextIcon },
    { id: "salePolicy", label: "Chính sách bán hàng", icon: DocumentTextIcon },
    { id: "basic", label: "Thông tin cơ bản", icon: BuildingOfficeIcon },
    { id: "overview", label: "Tổng quan & Specs", icon: Squares2X2Icon },
    { id: "location", label: "Vị trí", icon: MapPinIcon },
    { id: "floorplan", label: "Mặt bằng", icon: Squares2X2Icon },
    { id: "apartment", label: "Thiết kế căn hộ", icon: BuildingOfficeIcon },
    { id: "extention", label: "Tiện ích", icon: BuildingOfficeIcon },
    { id: "handover", label: "Tiêu chuẩn bàn giao", icon: DocumentTextIcon },
    { id: "progress", label: "Tiến độ", icon: DocumentTextIcon },
    // { id: "custom", label: "Custom", icon: DocumentTextIcon },
  ];

  const updateField = <K extends keyof ProjectFormData>(field: K, value: ProjectFormData[K]) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug when title changes
      if (field === "title" && typeof value === "string") {
        updated.slug = generateSlug(value);
      }
      // Auto-generate mapEmbedUrl when locationText changes
      if (field === "locationText" && typeof value === "string") {
        updated.mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(value)}&output=embed`;
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

  const updateFloorplan = (index: number, field: "description", value: string) => {
    const newFloorplans = [...(formData.floorplans || [{ description: "", floorPlanImage: [] }])];
    if (!newFloorplans[index]) {
      newFloorplans[index] = { description: "", floorPlanImage: [] };
    }
    newFloorplans[index] = { ...newFloorplans[index], [field]: value };
    updateField("floorplans", newFloorplans);
  };

  const addFloorplanImage = (floorplanIndex: number) => {
    const newFloorplans = [...(formData.floorplans || [{ description: "", floorPlanImage: [] }])];
    if (!newFloorplans[floorplanIndex]) {
      newFloorplans[floorplanIndex] = { description: "", floorPlanImage: [] };
    }
    newFloorplans[floorplanIndex].floorPlanImage = [
      ...(newFloorplans[floorplanIndex].floorPlanImage || []),
      { src: "", alt: "" },
    ];
    updateField("floorplans", newFloorplans);
  };

  const updateFloorplanImage = (floorplanIndex: number, imageIndex: number, field: "src" | "alt", value: string) => {
    const newFloorplans = [...(formData.floorplans || [{ description: "", floorPlanImage: [] }])];
    if (!newFloorplans[floorplanIndex]) {
      newFloorplans[floorplanIndex] = { description: "", floorPlanImage: [] };
    }
    const images = [...(newFloorplans[floorplanIndex].floorPlanImage || [])];
    if (!images[imageIndex]) {
      images[imageIndex] = { src: "", alt: "" };
    }
    images[imageIndex] = {
      ...images[imageIndex],
      [field]: value,
    };
    newFloorplans[floorplanIndex].floorPlanImage = images;
    updateField("floorplans", newFloorplans);
  };

  const removeFloorplanImage = (floorplanIndex: number, imageIndex: number) => {
    const newFloorplans = [...(formData.floorplans || [{ description: "", floorPlanImage: [] }])];
    if (!newFloorplans[floorplanIndex]) {
      return;
    }
    newFloorplans[floorplanIndex].floorPlanImage = (newFloorplans[floorplanIndex].floorPlanImage || []).filter(
      (_, i) => i !== imageIndex
    );
    updateField("floorplans", newFloorplans);
  };

  const addNearbyGroup = () => {
    updateField("nearbyGroups", [...(formData.nearbyGroups || []), { minute: "", description: "" }]);
  };

  const updateNearbyGroup = (index: number, field: "minute" | "description", value: string) => {
    const groups = [...(formData.nearbyGroups || [])];
    groups[index] = { ...groups[index], [field]: value };
    updateField("nearbyGroups", groups);
  };

  const removeNearbyGroup = (index: number) => {
    updateField("nearbyGroups", ((formData.nearbyGroups || []) as Array<{ minute?: string; description?: string }>).filter((_, i) => i !== index));
  };

  const addNearbyTrafficItem = () => {
    updateField("nearbyTrafficItems", [...(formData.nearbyTrafficItems || []), { title: "", img: "", des: "" }]);
  };

  const updateNearbyTrafficItem = (index: number, field: "title" | "img" | "des", value: string) => {
    const items = [...(formData.nearbyTrafficItems || [])];
    items[index] = { ...items[index], [field]: value };
    updateField("nearbyTrafficItems", items);
  };

  const removeNearbyTrafficItem = (index: number) => {
    updateField("nearbyTrafficItems", (formData.nearbyTrafficItems || []).filter((_, i) => i !== index));
  };

  const addApartmentDetail = () => {
    const model = formData.apartmentDesign ?? { des: "", desDetails: [] as string[], apartmentItems: [] };
    updateField("apartmentDesign", { ...model, desDetails: [...(model.desDetails ?? []), ""] });
  };

  const updateApartmentDetail = (index: number, value: string) => {
    const model = formData.apartmentDesign ?? { des: "", desDetails: [] as string[], apartmentItems: [] };
    const desDetails = [...(model.desDetails ?? [])];
    desDetails[index] = value;
    updateField("apartmentDesign", { ...model, desDetails });
  };

  const removeApartmentDetail = (index: number) => {
    const model = formData.apartmentDesign ?? { des: "", desDetails: [] as string[], apartmentItems: [] };
    updateField("apartmentDesign", { ...model, desDetails: (model.desDetails ?? []).filter((_, i) => i !== index) });
  };

  const addApartmentItem = () => {
    const model = formData.apartmentDesign ?? { des: "", desDetails: [] as string[], apartmentItems: [] };
    updateField("apartmentDesign", {
      ...model,
      apartmentItems: [...(model.apartmentItems ?? []), { name: "", label: "", description: "", price: "", image: "" }],
    });
  };

  const updateApartmentItem = (
    index: number,
    field: "name" | "label" | "description" | "price" | "image",
    value: string
  ) => {
    const model = formData.apartmentDesign ?? { des: "", desDetails: [] as string[], apartmentItems: [] };
    const apartmentItems = [...(model.apartmentItems ?? [])];
    apartmentItems[index] = { ...apartmentItems[index], [field]: value };
    updateField("apartmentDesign", { ...model, apartmentItems });
  };

  const removeApartmentItem = (index: number) => {
    const model = formData.apartmentDesign ?? { des: "", desDetails: [] as string[], apartmentItems: [] };
    updateField("apartmentDesign", {
      ...model,
      apartmentItems: (model.apartmentItems ?? []).filter((_, i) => i !== index),
    });
  };

  const addExtentionDestination = () => {
    updateField("extentionDestinations", [...(formData.extentionDestinations || []), { des: "", img: "" }]);
  };

  const updateExtentionDestination = (index: number, field: "des" | "img", value: string) => {
    const destinations = [...(formData.extentionDestinations || [])];
    destinations[index] = { ...destinations[index], [field]: value };
    updateField("extentionDestinations", destinations);
  };

  const removeExtentionDestination = (index: number) => {
    updateField("extentionDestinations", (formData.extentionDestinations || []).filter((_, i) => i !== index));
  };

  const addHandoverItem = () => {
    const model = formData.handoverStandard ?? { des: "", items: [] };
    updateField("handoverStandard", {
      ...model,
      items: [...(model.items ?? []), { subtitle: "", title: "", des: "", imgUrl: "" }],
    });
  };

  const updateHandoverItem = (
    index: number,
    field: "subtitle" | "title" | "des" | "imgUrl",
    value: string
  ) => {
    const model = formData.handoverStandard ?? { des: "", items: [] };
    const items = [...(model.items ?? [])];
    items[index] = { ...items[index], [field]: value };
    updateField("handoverStandard", { ...model, items });
  };

  const removeHandoverItem = (index: number) => {
    const model = formData.handoverStandard ?? { des: "", items: [] };
    updateField("handoverStandard", {
      ...model,
      items: (model.items ?? []).filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.slug || !formData.title || !formData.shortDescription) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc (Slug, Title, Short Description)");
      return;
    }

    const apartmentDesign = formData.apartmentDesign;

    const emptyApartmentDetailIndex = (apartmentDesign?.desDetails || []).findIndex((detail) => !detail.trim());
    if (emptyApartmentDetailIndex !== -1) {
      toast.error(`Mô tả chi tiết căn hộ dòng ${emptyApartmentDetailIndex + 1} đang trống`);
      return;
    }

    const emptyApartmentItemIndex = (apartmentDesign?.apartmentItems || []).findIndex(
      (item) =>
        !item.name?.trim() ||
        !item.label?.trim() ||
        !item.price?.trim() ||
        !item.description?.trim() ||
        !item.image?.trim()
    );
    if (emptyApartmentItemIndex !== -1) {
      toast.error(`Căn hộ #${emptyApartmentItemIndex + 1} chưa điền đủ thông tin (tên, nhãn, giá, mô tả, ảnh)`);
      return;
    }

    const emptyExtentionDestinationIndex = (formData.extentionDestinations || []).findIndex(
      (dest) => !dest.des?.trim() || !dest.img?.trim()
    );
    if (emptyExtentionDestinationIndex !== -1) {
      toast.error(`Tiện ích xung quanh #${emptyExtentionDestinationIndex + 1} chưa có đủ mô tả và ảnh`);
      return;
    }

    const emptyHandoverItemIndex = (formData.handoverStandard?.items || []).findIndex(
      (item) => !item.subtitle?.trim() || !item.title?.trim() || !item.des?.trim() || !item.imgUrl?.trim()
    );
    if (emptyHandoverItemIndex !== -1) {
      toast.error(`Tiêu chuẩn bàn giao #${emptyHandoverItemIndex + 1} chưa điền đủ subtitle, title, mô tả, ảnh`);
      return;
    }

    setIsSubmitting(true);
    try {
      const projectData = {
        slug: formData.slug,
        title: formData.title,
        subtitle: formData.subtitle || undefined,
        shortDescription: formData.shortDescription,
        intro: formData.intro || undefined,
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
        customSections: formData.customSections
          ?.filter(cs => cs.customTitle)
          .map(cs => ({
            customTitle: cs.customTitle,
            customDes: cs.customDes || undefined,
            contents: cs.contents
              ?.filter(c => c.contentTitle || c.contentDes || (c.images ?? []).some(img => img.src))
              .map(c => ({
                contentTitle: c.contentTitle,
                contentDes: c.contentDes,
                images: (c.images ?? []).filter(img => img.src),
              })),
          })),
        highlights: formData.highlights,
        reasonToBuyTitle: formData.reasonToBuyTitle || undefined,
        reasonToBuyDescription: formData.reasonToBuyDescription || undefined,
        reasonToBuyImage: formData.reasonToBuyImage || undefined,
        reasonToBuyImageAlt: formData.reasonToBuyImageAlt || undefined,
        salePolicyDes: formData.salePolicyDes || undefined,
        salePolicyImg: formData.salePolicyImg || undefined,
        salePolicyAlt: formData.salePolicyAlt || undefined,
        salePolicyDescriptionDetails: formData.salePolicyDescriptionDetails?.filter(Boolean),
        location360Url: formData.location360Url || undefined,
        nearbyGroups: formData.nearbyGroups?.filter((g) => g.minute || g.description),
        nearbyTrafficItems: formData.nearbyTrafficItems?.filter((i) => i.title || i.des || i.img),
        apartmentDesign: formData.apartmentDesign,
        extentionDestinations: formData.extentionDestinations?.filter((d) => d.des || d.img),
        handoverStandard: formData.handoverStandard,
        progressDescription: formData.progressDescription?.trim() || undefined,
        // Với update: gửi chuỗi rỗng để backend thực sự ghi đè và xóa giá trị cũ
        progressYoutubeUrl: formData.progressYoutubeUrl?.trim() ?? "",
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
          Mô tả ngắn (hiển thị ở trang chủ) <span className="text-red-500">*</span>
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
        <label className="mb-2 block text-sm font-semibold text-gray-700">Giới thiệu chi tiết (hiển thị phần Tổng quan dự án)</label>
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
        <label className="mb-2 block text-sm font-semibold text-gray-700">Ảnh bìa dự án</label>
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

  const renderReasonToBuy = () => (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Tiêu đề (ví dụ: Giá trị cốt lõi, Lý do nên đầu tư, ...)</label>
        <input
          type="text"
          value={formData.reasonToBuyTitle || ""}
          onChange={(e) => updateField("reasonToBuyTitle", e.target.value)}
          placeholder="Giá trị cốt lõi"
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Mô tả</label>
        <textarea
          value={formData.reasonToBuyDescription || ""}
          onChange={(e) => updateField("reasonToBuyDescription", e.target.value)}
          rows={10}
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Hình ảnh</label>
        <input
          ref={reasonToBuyImageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              await handleImageUpload(
                file,
                "projects/reason-to-buy",
                (url) => updateField("reasonToBuyImage", url),
                "reasonToBuyImage"
              );
              if (reasonToBuyImageInputRef.current) reasonToBuyImageInputRef.current.value = "";
            }
          }}
        />

        {!formData.reasonToBuyImage ? (
          <UploadButton
            onClick={() => reasonToBuyImageInputRef.current?.click()}
            isUploading={uploadingImages.reasonToBuyImage || false}
            label="Upload ảnh lý do chọn mua"
            hasImage={false}
          />
        ) : (
          <div className="space-y-3">
            <ImagePreview
              src={formData.reasonToBuyImage}
              alt={formData.reasonToBuyImageAlt || "Reason to buy preview"}
              height="h-64"
              onRemove={() => updateField("reasonToBuyImage", "")}
            />
            <UploadButton
              onClick={() => reasonToBuyImageInputRef.current?.click()}
              isUploading={uploadingImages.reasonToBuyImage || false}
              label="Upload ảnh lý do chọn mua"
              hasImage={true}
            />
          </div>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Alt ảnh</label>
        <input
          type="text"
          value={formData.reasonToBuyImageAlt || ""}
          onChange={(e) => updateField("reasonToBuyImageAlt", e.target.value)}
          placeholder="Lý do nên đầu tư dự án"
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500"
        />
      </div>
    </div>
  );

  const renderSalePolicy = () => (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Mô tả chính sách</label>
        <div className="rounded-xl border border-gray-300 bg-white">
          <ReactQuill
            theme="snow"
            value={formData.salePolicyDes || ""}
            onChange={(value: string) => updateField("salePolicyDes", value)}
            placeholder="Mô tả chính sách"
            modules={quillModules}
            formats={quillFormats}
            className="text-gray-800"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Ảnh chính sách bán hàng</label>
        <input
          ref={salePolicyImageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              await handleImageUpload(
                file,
                "projects/sale-policy",
                (url) => updateField("salePolicyImg", url),
                "salePolicyImg"
              );
              if (salePolicyImageInputRef.current) salePolicyImageInputRef.current.value = "";
            }
          }}
        />

        {!formData.salePolicyImg ? (
          <UploadButton
            onClick={() => salePolicyImageInputRef.current?.click()}
            isUploading={uploadingImages.salePolicyImg || false}
            label="Upload ảnh chính sách"
            hasImage={false}
          />
        ) : (
          <div className="space-y-3">
            <ImagePreview
              src={formData.salePolicyImg}
              alt={formData.salePolicyAlt || "Sale policy preview"}
              height="h-64"
              onRemove={() => updateField("salePolicyImg", "")}
            />
            <UploadButton
              onClick={() => salePolicyImageInputRef.current?.click()}
              isUploading={uploadingImages.salePolicyImg || false}
              label="Upload ảnh chính sách"
              hasImage={true}
            />
          </div>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Alt ảnh</label>
        <input
          type="text"
          value={formData.salePolicyAlt || ""}
          onChange={(e) => updateField("salePolicyAlt", e.target.value)}
          placeholder="Chính sách bán hàng dự án"
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500"
        />
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Ảnh tổng quan:</label>
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
        <label className="mb-2 block text-sm font-semibold text-gray-700">Thông tin chi tiết (trái Key - phải Value)</label>
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
            className="inline-flex bg-amber-400 items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
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
        <label className="mb-2 block text-sm font-semibold text-gray-700">Địa chỉ (hiển thị trên phần ảnh bìa)</label>
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

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">URL bản đồ nhúng <span className="text-xs text-gray-400">(auto-gen từ địa chỉ)</span></label>
        <input
          type="url"
          value={formData.mapEmbedUrl}
          readOnly
          placeholder="Auto từ địa chỉ..."
          className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">URL vị trí 360°</label>
        <input
          type="url"
          value={formData.location360Url || ""}
          onChange={(e) => updateField("location360Url", e.target.value)}
          placeholder="https://kuula.co/post/..."
          className="w-full rounded-xl border text-gray-700 border-gray-300 bg-gray-50 px-4 py-2.5 text-sm"
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

      <div className="space-y-3 rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Khoảng thời gian tới các địa điểm nổi bật (4 items để hiển thị tốt hơn)</p>
          <button type="button" onClick={addNearbyGroup} className="bg-amber-400 inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs text-gray-800">
            <PlusIcon className="h-3 w-3 text-gray-800" /> Thêm
          </button>
        </div>
        {(formData.nearbyGroups || []).map((group, index) => (
          <div key={index} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[160px_1fr_auto] sm:items-start">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={group.minute}
                  onChange={(e) => updateNearbyGroup(index, "minute", e.target.value)}
                  placeholder="05"
                  className="w-full rounded-lg border border-gray-300 text-gray-800 bg-white px-3 py-2 pr-12 text-sm"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">phút</span>
              </div>
              <textarea
                value={group.description}
                onChange={(e) => updateNearbyGroup(index, "description", e.target.value)}
                placeholder="Mô tả tiện ích trong số phút tương ứng"
                rows={4}
                className="rounded-lg border border-gray-300 text-gray-800 bg-white px-3 py-2 text-sm"
              />
              <button type="button" onClick={() => removeNearbyGroup(index)} className="rounded-lg p-2 text-red-500">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Các đô thị liền kề (đẹp nhất là 4 items)</p>
          <button type="button" onClick={addNearbyTrafficItem} className="bg-amber-400 inline-flex text-gray-800 items-center gap-1 rounded-lg border px-3 py-1.5 text-xs">
            <PlusIcon className="h-3 w-3 text-gray-800" /> Thêm
          </button>
        </div>
        {(formData.nearbyTrafficItems || []).map((item, index) => (
          <div key={index} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <div className="grid grid-cols-1 gap-2">
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateNearbyTrafficItem(index, "title", e.target.value)}
                placeholder="Tiêu đề"
                className="rounded-lg text-gray-800 border border-gray-300 bg-white px-3 py-2 text-sm"
              />
              <textarea
                value={item.des}
                onChange={(e) => updateNearbyTrafficItem(index, "des", e.target.value)}
                placeholder="Mô tả"
                rows={2}
                className="rounded-lg text-gray-800 border border-gray-300 bg-white px-3 py-2 text-sm"
              />
              <div>
                <input
                  ref={(el) => {
                    nearbyTrafficImageInputRefs.current[index] = el;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      await handleImageUpload(
                        file,
                        `projects/nearby-traffic/${index}`,
                        (url) => updateNearbyTrafficItem(index, "img", url),
                        `nearbyTraffic-${index}`
                      );
                      if (nearbyTrafficImageInputRefs.current[index]) {
                        nearbyTrafficImageInputRefs.current[index]!.value = "";
                      }
                    }
                  }}
                />
                {!item.img ? (
                  <UploadButton
                    onClick={() => nearbyTrafficImageInputRefs.current[index]?.click()}
                    isUploading={uploadingImages[`nearbyTraffic-${index}`] || false}
                    label="Upload ảnh"
                    hasImage={false}
                  />
                ) : (
                  <div className="space-y-3">
                    <ImagePreview
                      src={item.img}
                      alt={item.title}
                      height="h-40"
                      onRemove={() => updateNearbyTrafficItem(index, "img", "")}
                    />
                    <UploadButton
                      onClick={() => nearbyTrafficImageInputRefs.current[index]?.click()}
                      isUploading={uploadingImages[`nearbyTraffic-${index}`] || false}
                      label="Thay đổi ảnh"
                      hasImage={true}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => removeNearbyTrafficItem(index)} className="rounded-lg p-2 text-red-500">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
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
          rows={6}
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
            className="inline-flex bg-amber-400 items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            <PlusIcon className="h-4 w-4" />
            Thêm tiện ích
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Tiện ích xung quanh:</label>
        <div className="space-y-4">
          {(formData.extentionDestinations || []).map((dest, index) => (
            <div key={index} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <textarea
                value={dest.des}
                onChange={(e) => updateExtentionDestination(index, "des", e.target.value)}
                rows={2}
                placeholder="vd: Vincom: Không gian mua sắm - giải trí đa tầng"
                className="w-full text-gray-700 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
              />

              <input
                ref={(el) => {
                  extentionDestinationImageInputRefs.current[index] = el;
                }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await handleImageUpload(
                      file,
                      `projects/extention-destination/${index}`,
                      (url) => updateExtentionDestination(index, "img", url),
                      `extentionDestination-${index}`
                    );
                    if (extentionDestinationImageInputRefs.current[index]) {
                      extentionDestinationImageInputRefs.current[index]!.value = "";
                    }
                  }
                }}
              />

              {!dest.img ? (
                <UploadButton
                  onClick={() => extentionDestinationImageInputRefs.current[index]?.click()}
                  isUploading={uploadingImages[`extentionDestination-${index}`] || false}
                  label="Upload ảnh tiện ích xung quanh"
                  hasImage={false}
                />
              ) : (
                <div className="mt-2 space-y-3">
                  <ImagePreview
                    src={dest.img}
                    alt={dest.des || "Tiện ích xung quanh"}
                    height="h-40"
                    onRemove={() => updateExtentionDestination(index, "img", "")}
                  />
                  <UploadButton
                    onClick={() => extentionDestinationImageInputRefs.current[index]?.click()}
                    isUploading={uploadingImages[`extentionDestination-${index}`] || false}
                    label="Thay đổi ảnh tiện ích xung quanh"
                    hasImage={true}
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() => removeExtentionDestination(index)}
                className="mt-3 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 transition"
              >
                Xóa tiện ích xung quanh này
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addExtentionDestination}
            className="inline-flex bg-amber-400 items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            <PlusIcon className="h-4 w-4" />
            Thêm tiện ích xung quanh
          </button>
        </div>
      </div>
    </div>
  );

  const renderApartment = () => (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Mô tả thiết kế căn hộ</label>
        <textarea
          value={formData.apartmentDesign?.des || ""}
          onChange={(e) =>
            updateField("apartmentDesign", {
              ...(formData.apartmentDesign || { des: "", desDetails: [], apartmentItems: [] }),
              des: e.target.value,
            })
          }
          rows={4}
          className="w-full text-gray-800 rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm"
        />
      </div>

      <div className="space-y-3 rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-700">Mô tả chi tiết (thêm từng dòng để hiển thị dưới dạng liệt kê)</p>
            <p className="text-xs text-gray-500">
              Ví dụ: Studio: 34.4m² – 40.3m², linh hoạt cho người độc thân
            </p>
          </div>
          <button
            type="button"
            onClick={addApartmentDetail}
            className="inline-flex bg-amber-400 items-center gap-1 rounded-lg border px-3 py-1.5 text-xs text-gray-800"
          >
            <PlusIcon className="h-3 w-3" /> Thêm dòng
          </button>
        </div>
        {(formData.apartmentDesign?.desDetails || []).map((detail, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={detail}
              onChange={(e) => updateApartmentDetail(index, e.target.value)}
              placeholder="1PN+: 45m² – 52m², tối ưu công năng cho gia đình trẻ"
              className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-800"
            />
            <button type="button" onClick={() => removeApartmentDetail(index)} className="rounded-lg p-2 text-red-500">
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-gray-700">
          <p className="text-sm font-semibold text-gray-700">Danh sách căn hộ (thêm từng căn)</p>
          <button
            type="button"
            onClick={addApartmentItem}
            className="inline-flex bg-amber-400 items-center gap-1 rounded-lg border px-3 py-1.5 text-xs"
          >
            <PlusIcon className="h-3 w-3" /> Thêm căn hộ
          </button>
        </div>
        {(formData.apartmentDesign?.apartmentItems || []).map((item, index) => (
          <div key={index} className="rounded-xl border border-gray-200 p-3">
            <div className="mb-3 grid gap-2 sm:grid-cols-2">
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateApartmentItem(index, "name", e.target.value)}
                placeholder="Tên căn hộ (VD: Studio, 4PN)"
                className="w-full text-gray-700 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={item.label || ""}
                onChange={(e) => updateApartmentItem(index, "label", e.target.value)}
                placeholder="Nhãn hiển thị (VD: Studio, 1PN)"
                className="w-full text-gray-700 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
              />
            </div>

            <input
              type="text"
              value={item.price}
              onChange={(e) => updateApartmentItem(index, "price", e.target.value)}
              placeholder="Khoảng giá (VD: 3.2 tỷ/căn)"
              className="mb-2 w-full text-gray-700 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
            />

            <textarea
              value={item.description}
              onChange={(e) => updateApartmentItem(index, "description", e.target.value)}
              placeholder="Mô tả căn hộ"
              rows={2}
              className="mb-2 w-full text-gray-700 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
            />

            <input
              ref={(el) => {
                apartmentItemImageInputRefs.current[index] = el;
              }}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  await handleImageUpload(
                    file,
                    `projects/apartment-items/${index}`,
                    (url) => updateApartmentItem(index, "image", url),
                    `apartmentItem-${index}`
                  );
                  if (apartmentItemImageInputRefs.current[index]) {
                    apartmentItemImageInputRefs.current[index]!.value = "";
                  }
                }
              }}
            />

            {!item.image ? (
              <UploadButton
                onClick={() => apartmentItemImageInputRefs.current[index]?.click()}
                isUploading={uploadingImages[`apartmentItem-${index}`] || false}
                label="Upload ảnh căn hộ"
                hasImage={false}
              />
            ) : (
              <div className="space-y-2">
                <ImagePreview
                  src={item.image}
                  alt={item.label || item.name || "Apartment item"}
                  height="h-44"
                  onRemove={() => updateApartmentItem(index, "image", "")}
                />
                <UploadButton
                  onClick={() => apartmentItemImageInputRefs.current[index]?.click()}
                  isUploading={uploadingImages[`apartmentItem-${index}`] || false}
                  label="Thay đổi ảnh căn hộ"
                  hasImage={true}
                />
              </div>
            )}

            <div className="mt-2 flex justify-end">
              <button type="button" onClick={() => removeApartmentItem(index)} className="rounded-lg p-2 text-red-500">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHandover = () => (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Mô tả tiêu chuẩn bàn giao</label>
        <textarea
          value={formData.handoverStandard?.des || ""}
          onChange={(e) =>
            updateField("handoverStandard", {
              ...(formData.handoverStandard || { des: "", items: [] }),
              des: e.target.value,
            })
          }
          rows={4}
          className="w-full text-gray-700 rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm"
        />
      </div>

      <div className="space-y-3 rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Danh sách tiêu chuẩn bàn giao</p>
          <button
            type="button"
            onClick={addHandoverItem}
            className="inline-flex bg-amber-400 items-center gap-1 rounded-lg border px-3 py-1.5 text-xs text-gray-800"
          >
            <PlusIcon className="h-3 w-3" /> Thêm tiêu chuẩn
          </button>
        </div>

        {(formData.handoverStandard?.items || []).map((item, index) => (
          <div key={index} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <div className="mb-2 grid gap-2 sm:grid-cols-2">
              <input
                type="text"
                value={item.subtitle || ""}
                onChange={(e) => updateHandoverItem(index, "subtitle", e.target.value)}
                placeholder="Subtitle (VD: Không gian)"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
              />
              <input
                type="text"
                value={item.title || ""}
                onChange={(e) => updateHandoverItem(index, "title", e.target.value)}
                placeholder="Title (VD: Phòng bếp)"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
              />
            </div>

            <textarea
              value={item.des || ""}
              onChange={(e) => updateHandoverItem(index, "des", e.target.value)}
              placeholder="Mô tả tiêu chuẩn"
              rows={2}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
            />

            <input
              ref={(el) => {
                handoverItemImageInputRefs.current[index] = el;
              }}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  await handleImageUpload(
                    file,
                    `projects/handover/${index}`,
                    (url) => updateHandoverItem(index, "imgUrl", url),
                    `handoverItem-${index}`
                  );
                  if (handoverItemImageInputRefs.current[index]) {
                    handoverItemImageInputRefs.current[index]!.value = "";
                  }
                }
              }}
            />

            {!item.imgUrl ? (
              <div className="mt-2">
                <UploadButton
                  onClick={() => handoverItemImageInputRefs.current[index]?.click()}
                  isUploading={uploadingImages[`handoverItem-${index}`] || false}
                  label="Upload ảnh tiêu chuẩn"
                  hasImage={false}
                />
              </div>
            ) : (
              <div className="mt-2 space-y-2">
                <ImagePreview
                  src={item.imgUrl}
                  alt={item.title || item.subtitle || "Handover item"}
                  height="h-40"
                  onRemove={() => updateHandoverItem(index, "imgUrl", "")}
                />
                <UploadButton
                  onClick={() => handoverItemImageInputRefs.current[index]?.click()}
                  isUploading={uploadingImages[`handoverItem-${index}`] || false}
                  label="Thay đổi ảnh tiêu chuẩn"
                  hasImage={true}
                />
              </div>
            )}

            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => removeHandoverItem(index)}
                className="rounded-lg p-2 text-red-500"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-4">
      <textarea
        value={formData.progressDescription || ""}
        onChange={(e) => updateField("progressDescription", e.target.value)}
        rows={4}
        placeholder="Mô tả tiến độ"
        className="w-full rounded-xl border text-gray-800 border-gray-300 bg-gray-50 px-4 py-2.5 text-sm"
      />
      <input
        type="url"
        value={formData.progressYoutubeUrl || ""}
        onChange={(e) => updateField("progressYoutubeUrl", e.target.value)}
        placeholder="Youtube URL"
        className="w-full rounded-xl border text-gray-800 border-gray-300 bg-gray-50 px-4 py-2.5 text-sm"
      />
    </div>
  );

  const renderFloorplan = () => {
    const floorplan = formData.floorplans?.[0] ?? { description: "", floorPlanImage: [] };
    const floorplanIndex = 0;

    return (
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">Mặt bằng</label>
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-4">
                <label className="mb-2 block text-xs font-medium text-gray-600">Mô tả chung</label>
                <textarea
                  value={floorplan.description || ""}
                  onChange={(e) => updateFloorplan(floorplanIndex, "description", e.target.value)}
                  rows={4}
                  placeholder="Mặt bằng căn hộ được tối ưu công năng..."
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-medium text-gray-600">Hình ảnh mặt bằng</label>
                {(floorplan.floorPlanImage || []).map((image, imageIndex) => {
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
                  className="inline-flex bg-amber-400 items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  <PlusIcon className="h-3 w-3" />
                  Thêm ảnh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCustom = () => {
    const customSections = formData.customSections || [];

    const addCustomSection = () => {
      setFormData((prev) => ({
        ...prev,
        customSections: [
          ...(prev.customSections || []),
          { customTitle: "", customDes: "", contents: [] },
        ],
      }));
    };

    const removeCustomSection = (sectionIndex: number) => {
      setFormData((prev) => ({
        ...prev,
        customSections: (prev.customSections || []).filter((_, i) => i !== sectionIndex),
      }));
    };

    const updateCustomSectionField = (sectionIndex: number, field: "customTitle" | "customDes", value: string) => {
      setFormData((prev) => ({
        ...prev,
        customSections: (prev.customSections || []).map((cs, i) =>
          i === sectionIndex ? { ...cs, [field]: value } : cs
        ),
      }));
    };

    const addContentToSection = (sectionIndex: number) => {
      setFormData((prev) => ({
        ...prev,
        customSections: (prev.customSections || []).map((cs, i) =>
          i === sectionIndex
            ? { ...cs, contents: [...(cs.contents || []), { contentTitle: "", contentDes: "", images: [] }] }
            : cs
        ),
      }));
    };

    const removeContentFromSection = (sectionIndex: number, contentIndex: number) => {
      setFormData((prev) => ({
        ...prev,
        customSections: (prev.customSections || []).map((cs, i) =>
          i === sectionIndex
            ? { ...cs, contents: (cs.contents || []).filter((_, ci) => ci !== contentIndex) }
            : cs
        ),
      }));
    };

    const updateContentField = (sectionIndex: number, contentIndex: number, field: "contentTitle" | "contentDes", value: string) => {
      setFormData((prev) => ({
        ...prev,
        customSections: (prev.customSections || []).map((cs, si) =>
          si === sectionIndex
            ? {
                ...cs,
                contents: (cs.contents || []).map((c, ci) =>
                  ci === contentIndex ? { ...c, [field]: value } : c
                ),
              }
            : cs
        ),
      }));
    };

    const addImageToContent = (sectionIndex: number, contentIndex: number) => {
      setFormData((prev) => ({
        ...prev,
        customSections: (prev.customSections || []).map((cs, si) =>
          si === sectionIndex
            ? {
                ...cs,
                contents: (cs.contents || []).map((c, ci) =>
                  ci === contentIndex
                    ? { ...c, images: [...(c.images || []), { src: "", alt: "" }] }
                    : c
                ),
              }
            : cs
        ),
      }));
    };

    const updateContentImage = (sectionIndex: number, contentIndex: number, imageIndex: number, field: "src" | "alt", value: string) => {
      setFormData((prev) => ({
        ...prev,
        customSections: (prev.customSections || []).map((cs, si) =>
          si === sectionIndex
            ? {
                ...cs,
                contents: (cs.contents || []).map((c, ci) =>
                  ci === contentIndex
                    ? {
                        ...c,
                        images: (c.images || []).map((img, ii) =>
                          ii === imageIndex ? { ...img, [field]: value } : img
                        ),
                      }
                    : c
                ),
              }
            : cs
        ),
      }));
    };

    const handleCustomImageUpload = async (
      _sectionIndex: number,
      _contentIndex: number,
      _imageIndex: number,
      folder: string,
      onSuccess: (url: string) => void,
      inputKey: string
    ) => {
      const file = customImageInputRefs.current[inputKey]?.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Chỉ cho phép upload file hình ảnh");
        return;
      }

      try {
        setUploadingImages((prev) => ({ ...prev, [inputKey]: true }));

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
        if (customImageInputRefs.current[inputKey]) {
          customImageInputRefs.current[inputKey]!.value = "";
        }
      } catch {
        toast.error("Upload ảnh thất bại");
      } finally {
        setUploadingImages((prev) => ({ ...prev, [inputKey]: false }));
      }
    };

    return (
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Custom Sections</h3>
          <button
            type="button"
            onClick={addCustomSection}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
          >
            <PlusIcon className="h-4 w-4" />
            Thêm Custom Section
          </button>
        </div>

        {/* Custom Sections List */}
        {customSections.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-gray-500">Chưa có custom section nào.</p>
            <p className="text-sm text-gray-400">Bấm "Thêm Custom Section" để tạo.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {customSections.map((customSection, sectionIndex) => (
              <div key={sectionIndex} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                {/* Section Header */}
                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                  <h4 className="font-semibold text-gray-700">Custom Section {sectionIndex + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeCustomSection(sectionIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Custom Title */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Tiêu đề Custom
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="Layout tổng thể của dự án"
                    value={customSection.customTitle || ""}
                    onChange={(e) => updateCustomSectionField(sectionIndex, "customTitle", e.target.value)}
                  />
                </div>

                {/* Custom Description */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Mô tả Custom
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-900 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="Nhập mô tả custom section"
                    rows={3}
                    value={customSection.customDes || ""}
                    onChange={(e) => updateCustomSectionField(sectionIndex, "customDes", e.target.value)}
                  />
                </div>

                {/* Contents */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      Danh sách Content
                    </label>
                    <button
                      type="button"
                      onClick={() => addContentToSection(sectionIndex)}
                      className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-200"
                    >
                      <PlusIcon className="h-4 w-4" />
                      Thêm Content
                    </button>
                  </div>

                  {(customSection.contents || []).map((content, contentIndex) => (
                    <div
                      key={contentIndex}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <h5 className="font-medium text-gray-700">Content {contentIndex + 1}</h5>
                        <button
                          type="button"
                          onClick={() => removeContentFromSection(sectionIndex, contentIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Content Title */}
                      <div className="mb-3">
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Tiêu đề Content
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          placeholder="LAYOUT Tòa S1"
                          value={content.contentTitle || ""}
                          onChange={(e) =>
                            updateContentField(sectionIndex, contentIndex, "contentTitle", e.target.value)
                          }
                        />
                      </div>

                      {/* Content Description */}
                      <div className="mb-4">
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                          Mô tả Content
                        </label>
                        <textarea
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          placeholder="Nhập mô tả content"
                          rows={2}
                          value={content.contentDes || ""}
                          onChange={(e) =>
                            updateContentField(sectionIndex, contentIndex, "contentDes", e.target.value)
                          }
                        />
                      </div>

                      {/* Images */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-medium text-gray-600">
                            Hình ảnh
                          </label>
                          <button
                            type="button"
                            onClick={() => addImageToContent(sectionIndex, contentIndex)}
                            className="inline-flex items-center gap-1 rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300"
                          >
                            <PlusIcon className="h-3 w-3" />
                            Thêm ảnh
                          </button>
                        </div>

                        {content.images?.map((image, imageIndex) => {
                          const inputKey = `custom-${sectionIndex}-${contentIndex}-${imageIndex}`;
                          return (
                            <div
                              key={imageIndex}
                              className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3"
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex-1">
                                  {image.src ? (
                                    <ImagePreview
                                      src={image.src}
                                      alt={image.alt}
                                      height="h-32"
                                      onRemove={() =>
                                        updateContentImage(sectionIndex, contentIndex, imageIndex, "src", "")
                                      }
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4">
                                      <label className="cursor-pointer inline-flex flex-col items-center gap-1 text-sm text-gray-500 hover:text-amber-600">
                                        <CloudArrowUpIcon className="h-6 w-6" />
                                        <span>Tải ảnh lên</span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          ref={(el) => {
                                            customImageInputRefs.current[inputKey] = el;
                                          }}
                                          onChange={() =>
                                            handleCustomImageUpload(
                                              sectionIndex,
                                              contentIndex,
                                              imageIndex,
                                              `projects/custom/${sectionIndex}/${contentIndex}`,
                                              (url: string) =>
                                                updateContentImage(
                                                  sectionIndex,
                                                  contentIndex,
                                                  imageIndex,
                                                  "src",
                                                  url
                                                ),
                                              inputKey
                                            )
                                          }
                                        />
                                      </label>
                                    </div>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateContentImage(sectionIndex, contentIndex, imageIndex, "src", "")
                                  }
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <XMarkIcon className="h-5 w-5" />
                                </button>
                              </div>
                              <input
                                type="text"
                                className="w-full rounded-lg border bg-white border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                                placeholder="Mô tả ảnh (alt)"
                                value={image.alt || ""}
                                onChange={(e) =>
                                  updateContentImage(
                                    sectionIndex,
                                    contentIndex,
                                    imageIndex,
                                    "alt",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {(customSection.contents || []).length === 0 && (
                    <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-gray-500 text-sm">
                      Chưa có content nào.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

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
      case "reason":
        return renderReasonToBuy();
      case "overview":
        return renderOverview();
      case "salePolicy":
        return renderSalePolicy();
      case "location":
        return renderLocation();
      case "extention":
        return renderExtention();
      case "apartment":
        return renderApartment();
      case "handover":
        return renderHandover();
      case "progress":
        return renderProgress();
      case "floorplan":
        return renderFloorplan();
      case "gallery":
        return renderGallery();
      case "custom":
        return renderCustom();
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
