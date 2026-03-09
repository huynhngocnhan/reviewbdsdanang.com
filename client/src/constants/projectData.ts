export type ProjectCategory = "SUN" | "VIN" | "OTHER";

export interface ProjectSpec {
  label: string;
  value: string;
}

export interface ProjectGallery {
  src: string;
  alt: string;
}

export interface ProjectExtentionImage {
  src: string;
  alt: string;
  title: string;
  description: string;
}

export interface FloorplanCategory {
  description: string;
  floorPlanImage: ProjectGallery[];
}

export interface ProjectData {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  shortDescription: string;
  intro: string;
  category: ProjectCategory;
  developerName?: string;
  projectType?: string;
  locationText: string;
  locationDescription: string;
  locationImage?: string;
  mapEmbedUrl: string;
  coverImage: string; // Map to coverAsset later
  heroImage: string;
  specs: ProjectSpec[];
  gallery: ProjectGallery[];
  extentionDescription?: string;
  extentionImages?: ProjectExtentionImage[];
  floorplans: FloorplanCategory[];
  highlights: string[];
}

export const MOCK_PROJECTS: ProjectData[] = [
  {
    id: "1",
    slug: "sun-symphony-residence-da-nang",
    title: "Sun Symphony Residence",
    subtitle: "Căn hộ cao cấp bên sông Hàn - Sở hữu lâu dài",
    category: "SUN",
    developerName: "Sun Group",
    projectType: "Căn hộ cao cấp",
    shortDescription: "Sun Symphony Residence Đà Nẵng là một dự án bất động sản cao cấp do tập đoàn Sun Group đầu tư và phát triển...Dự án Vin Home tại Đà Nẵng. Sun Symphony Residence Đà Nẵng là một dự án bất động sản cao cấp...",
    intro: "Sun Symphony Residence Đà Nẵng là dự án căn hộ hạng sang với vị trí đắc địa ven sông Hàn, thiết kế hiện đại, tối ưu trải nghiệm sống và tiềm năng khai thác cho thuê.",
    locationText: "Trần Hưng Đạo, Sơn Trà, Đà Nẵng",
    locationDescription: "Dự án Sun Cosmo Residence được thiết kế để tận dụng tối đa tiện ích đa dạng của thành phố Đà Nẵng về hành chính, y tế, giáo dục, văn hóa, du lịch, mua sắm và giải trí. Với sự kết nối chặt chẽ với các điểm đến nổi tiếng như du thuyền sông Hàn, Tượng Cá chép hóa Rồng, Bảo tàng Nghệ thuật Điêu khắc Chăm, TTTM Parkson, Công viên Asia Park, Bệnh viện Quốc tế Vinmec, Bãi biển Mỹ Khê, Sân vận động Quân khu 5 và Sân bay Đà Nẵng.",
    mapEmbedUrl: "https://www.google.com/maps?q=Da%20Nang%20Viet%20Nam&output=embed",
    coverImage: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Can-ho-Sun-Symphony-Da-Nang-so-huu-tam-view-thoang-dang-tron-song-Han-va-TP-Da-Nang.jpg",
    heroImage: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Can-ho-Sun-Symphony-Da-Nang-so-huu-tam-view-thoang-dang-tron-song-Han-va-TP-Da-Nang.jpg",
    highlights: ["View sông Hàn", "Trung tâm Đà Nẵng", "Pháp lý rõ ràng", "Tiện ích chuẩn resort"],
    specs: [
      { label: "Tên dự án", value: "Sun Symphony Residence" },
      { label: "Vị trí", value: "Đường Trần Hưng Đạo, P. Nại Hiên Đông, Q. Sơn Trà, TP. Đà Nẵng" },
      { label: "Chủ đầu tư", value: "Sun Group – Tư vấn thiết kế: Aedas" },
      { label: "Quản lý vận hành", value: "Sun Property Management" },
      { label: "Quy mô", value: "8ha – Loại hình: Căn hộ, Shophouse, Villa" },
      { label: "Phân khu", value: "The Symphony (Căn hộ) và The Sonata (Thấp tầng)" },
      { label: "Hình thức sở hữu", value: "Sở hữu lâu dài với người Việt Nam, 50 năm với người nước ngoài" },
      { label: "Triển khai", value: "Quý 2/2024" },
    ],
    gallery: [
      { src: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Anh-06-min.jpg", alt: "Phối cảnh 1" },
      { src: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Can-ho-Sun-Symphony-Da-Nang-so-huu-tam-view-thoang-dang-tron-song-Han-va-TP-Da-Nang.jpg", alt: "Phối cảnh 2" }
    ],
    extentionDescription: "Chuỗi tiện ích nội khu được quy hoạch theo tiêu chuẩn nghỉ dưỡng, cân bằng giữa trải nghiệm sống, thư giãn và kết nối cộng đồng cư dân.",
    extentionImages: [
      {
        src: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Anh-06-min.jpg",
        alt: "Hồ bơi nội khu",
        title: "Hồ bơi vô cực",
        description: "Tầm nhìn mở rộng hướng sông, khu vực thư giãn riêng tư."
      },
      {
        src: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Can-ho-Sun-Symphony-Da-Nang-so-huu-tam-view-thoang-dang-tron-song-Han-va-TP-Da-Nang.jpg",
        alt: "Sky lounge",
        title: "Sky Lounge",
        description: "Không gian tiếp khách sang trọng, ngắm toàn cảnh thành phố."
      }
    ],
    floorplans: [
      {
        description: "Mặt bằng căn hộ được tối ưu công năng, đón gió và ánh sáng tự nhiên cho không gian sống thoáng đãng.",
        floorPlanImage: [
          { src: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/sdmb-1-min.png", alt: "Mặt bằng phương án 1" },
          { src: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/sdmb-1-min.png", alt: "Mặt bằng phương án 2" },
        ]
      }
    ]
  },
  {
    id: "2",
    slug: "sun-cosmo-residence-da-nang",
    title: "Sun Cosmo Residence",
    subtitle: "Biểu tượng sống mới tại trung tâm Đà Nẵng",
    category: "SUN",
    developerName: "Sun Group",
    projectType: "Căn hộ & thương mại",
    shortDescription: "Sun Cosmo Residence mang đến chuẩn sống cao cấp với hệ tiện ích đa tầng, kết nối nhanh ra biển...Sun Cosmo Residence mang đến chuẩn sống cao cấp với hệ tiện ích đa tầng, kết nối nhanh ra biển...",
    intro: "Sun Cosmo Residence mang đến chuẩn sống cao cấp với hệ tiện ích đa tầng, kết nối nhanh ra biển và trung tâm hành chính.",
    locationText: "Trung tâm thành phố, Đà Nẵng",
    locationDescription: "Sun Cosmo Residence mang đến chuẩn sống cao cấp với hệ tiện ích đa tầng, kết nối nhanh ra biển...Sun Cosmo Residence mang đến chuẩn sống cao cấp với hệ tiện ích đa tầng, kết nối nhanh ra biển...",
    mapEmbedUrl: "https://www.google.com/maps?q=Da%20Nang%20Viet%20Nam&output=embed",
    coverImage: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Anh-06-min.jpg",
    heroImage: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Anh-06-min.jpg",
    highlights: ["Vị trí trung tâm", "Thiết kế sang trọng", "Tiềm năng cho thuê"],
    specs: [
      { label: "Chủ đầu tư", value: "Sun Group" },
      { label: "Pháp lý", value: "Minh bạch" }
    ],
    gallery: [],
    extentionDescription: "Hệ tiện ích đa tầng hướng đến nhịp sống hiện đại, đáp ứng nhu cầu thư giãn, vận động và kết nối cư dân.",
    extentionImages: [
      {
        src: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Anh-06-min.jpg",
        alt: "Khu tiện ích nội khu",
        title: "Khu tiện ích nội khu",
        description: "Tổ hợp tiện ích cộng đồng với thiết kế hiện đại, phục vụ cư dân đa thế hệ."
      }
    ],
    floorplans: [
      {
        description: "Các phương án mặt bằng mẫu đang được cập nhật chi tiết theo từng dòng sản phẩm.",
        floorPlanImage: [
          { src: "https://via.placeholder.com/1200x800?text=Sun+Cosmo+FloorPlan+1", alt: "Mặt bằng Sun Cosmo 1" },
          { src: "https://via.placeholder.com/1200x800?text=Sun+Cosmo+FloorPlan+2", alt: "Mặt bằng Sun Cosmo 2" }
        ]
      }
    ]
  },
  {
    id: "3",
    slug: "vinhome-ocean-park",
    title: "VinHome Ocean Park",
    category: "VIN",
    developerName: "Vinhomes",
    shortDescription: "Dự án Vin Home tại Đà Nẵng. Sun Symphony Residence Đà Nẵng là một dự án bất động sản cao cấp...Dự án Vin Home tại Đà Nẵng. Sun Symphony Residence Đà Nẵng là một dự án bất động sản cao cấp...",
    intro: "Dự án Vin Home tại Đà Nẵng mang lại không gian sống đẳng cấp.",
    locationText: "Đà Nẵng",
    locationDescription: "",
    mapEmbedUrl: "",
    coverImage: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Anh-06-min.jpg",
    heroImage: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Anh-06-min.jpg",
    highlights: [],
    specs: [],
    gallery: [],
    extentionDescription: "Tiện ích đang trong giai đoạn hoàn thiện, định hướng xây dựng không gian sống xanh và cộng đồng cư dân văn minh.",
    extentionImages: [
      {
        src: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Anh-06-min.jpg",
        alt: "Tiện ích cảnh quan",
        title: "Tiện ích cảnh quan",
        description: "Không gian cảnh quan xanh mát, phù hợp cho thư giãn và hoạt động ngoài trời."
      }
    ],
    floorplans: [
      {
        description: "Mặt bằng dự án sẽ được công bố theo từng giai đoạn mở bán.",
        floorPlanImage: [
          { src: "https://via.placeholder.com/1200x800?text=Vinhome+Ocean+Park+FloorPlan", alt: "Mặt bằng tổng thể" }
        ]
      }
    ]
  }
];
