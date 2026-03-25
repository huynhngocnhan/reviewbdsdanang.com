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

export interface CustomContent {
  contentTitle: string;
  contentDes: string;
  images: ProjectGallery[];
}

export interface CustomSectionData {
  customTitle: string;
  customDes: string;
  contents: CustomContent[];
}

export interface CustomSectionItem extends CustomSectionData {
  id?: string;
}

export interface SalePolicyItem {
  title: string;
  value?: string;
  subItems?: string[];
}

export interface SalePolicyData {
  heading?: string;
  subheading?: string;
  description?: string;
  items?: SalePolicyItem[];
  footerNote?: string;
  contactPhone?: string;
  policyImage?: string;
}

export interface ProjectData {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  shortDescription: string;
  intro: string;
  reasonToBuyTitle?: string;
  reasonToBuyDescription?: string;
  reasonToBuyImage?: string;
  reasonToBuyImageAlt?: string;
  category: ProjectCategory;
  developerName?: string;
  projectType?: string;
  locationText: string;
  locationDescription: string;
  locationImage?: string;
  location360Url?: string;
  mapEmbedUrl: string;
  coverImage: string;
  subCoverImage?: string;
  heroImage: string;
  specs: ProjectSpec[];
  gallery: ProjectGallery[];
  extentionDescription?: string;
  extentionImages?: ProjectExtentionImage[];
  floorplans: FloorplanCategory[];
  customSections?: CustomSectionItem[];
  salePolicy?: SalePolicyData;
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
    shortDescription:
      "Sun Symphony Residence Đà Nẵng là một dự án bất động sản cao cấp do tập đoàn Sun Group đầu tư và phát triển...",
    intro:
      "Sun Symphony Residence Đà Nẵng là dự án căn hộ hạng sang với vị trí đắc địa ven sông Hàn, thiết kế hiện đại, tối ưu trải nghiệm sống và tiềm năng khai thác cho thuê.",
    reasonToBuyTitle: "3 lý do mua là thắng tại",
    reasonToBuyDescription: `Bất động sản không chỉ là tài sản – với người biết nhìn xa, đó là GIA TÀI ĐỂ ĐỜI. Và Sun Symphony Residence chính là lựa chọn mua trước – thắng lớn dành cho nhà đầu tư thông thái:

💥 Nền giá hấp dẫn, thấp hơn mặt bằng lân cận – biên lợi nhuận rõ ràng ngay từ khi xuống tiền.
💥 Mua khi hạ tầng đang bứt tốc – đón trọn dư địa tăng giá theo từng giai đoạn hoàn thiện.
💥 Mua ở giai đoạn đầu triển khai – tối ưu cơ hội tăng trưởng khi dự án thành hình.

💎 TẠI SAO LẠI LỰA CHỌN SUN SYMPHONY RESIDENCE?
✨Vị trí ven sông Hàn đắt giá, kết nối nhanh đến trung tâm thành phố.
✨Chủ đầu tư uy tín, quy hoạch đồng bộ, tiện ích nội khu chất lượng cao.
✨Sản phẩm phù hợp cả nhu cầu an cư sang trọng và đầu tư dài hạn.
⏳ Trong bất động sản, thời điểm là TẤT CẢ. Người chiến thắng luôn là người đi trước.`,
    reasonToBuyImage:
      "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Can-ho-Sun-Symphony-Da-Nang-so-huu-tam-view-thoang-dang-tron-song-Han-va-TP-Da-Nang.jpg",
    reasonToBuyImageAlt: "Lý do nên chọn Sun Symphony Residence",
    locationText: "Trần Hưng Đạo, Sơn Trà, Đà Nẵng",
    locationDescription:
      "Dự án Sun Cosmo Residence được thiết kế để tận dụng tối đa tiện ích đa dạng của thành phố Đà Nẵng...",
    location360Url: "https://kuula.co/post/LpyGP",
    mapEmbedUrl: "https://www.google.com/maps?q=Da%20Nang%20Viet%20Nam&output=embed",
    coverImage:
      "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Can-ho-Sun-Symphony-Da-Nang-so-huu-tam-view-thoang-dang-tron-song-Han-va-TP-Da-Nang.jpg",
    subCoverImage:
      "https://tanthoidai.com.vn/images/articles/2025/11/24/z7255908727691-a4ba0900782c4036b91edfdce1ef4f52-968.jpg?w=100",
    heroImage:
      "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Can-ho-Sun-Symphony-Da-Nang-so-huu-tam-view-thoang-dang-tron-song-Han-va-TP-Da-Nang.jpg",
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
      {
        src: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Anh-06-min.jpg",
        alt: "Phối cảnh 1",
      },
      {
        src: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Can-ho-Sun-Symphony-Da-Nang-so-huu-tam-view-thoang-dang-tron-song-Han-va-TP-Da-Nang.jpg",
        alt: "Phối cảnh 2",
      },
    ],
    extentionDescription:
      "Chuỗi tiện ích nội khu được quy hoạch theo tiêu chuẩn nghỉ dưỡng, cân bằng giữa trải nghiệm sống, thư giãn và kết nối cộng đồng cư dân.",
    extentionImages: [
      {
        src: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Anh-06-min.jpg",
        alt: "Hồ bơi nội khu",
        title: "Hồ bơi vô cực",
        description: "Tầm nhìn mở rộng hướng sông, khu vực thư giãn riêng tư.",
      },
      {
        src: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Can-ho-Sun-Symphony-Da-Nang-so-huu-tam-view-thoang-dang-tron-song-Han-va-TP-Da-Nang.jpg",
        alt: "Sky lounge",
        title: "Sky Lounge",
        description: "Không gian tiếp khách sang trọng, ngắm toàn cảnh thành phố.",
      },
    ],
    floorplans: [
      {
        description: "Mặt bằng căn hộ được tối ưu công năng, đón gió và ánh sáng tự nhiên cho không gian sống thoáng đãng.",
        floorPlanImage: [
          {
            src: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/sdmb-1-min.png",
            alt: "Mặt bằng phương án 1",
          },
          {
            src: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/sdmb-1-min.png",
            alt: "Mặt bằng phương án 2",
          },
        ],
      },
    ],
    salePolicy: {
      heading: "CHÍNH SÁCH BÁN HÀNG",
      subheading: "Sun Symphony Residence",
      description:
        "Dự án áp dụng chính sách bán hàng và hỗ trợ tài chính linh hoạt dành cho khách hàng, bao gồm nhiều phương thức thanh toán và ưu đãi theo từng giai đoạn.",
      items: [
        { title: "Tòa căn hộ", value: "The Symphony" },
        { title: "Loại hình căn hộ", value: "Studio, 1PN, 2PN, 3PN, Duplex, Penthouse" },
        { title: "Diện tích căn hộ", value: "34m² – 130m²" },
        { title: "Giá bán tham khảo", value: "Từ 5,1 tỷ/căn" },
        {
          title: "Hỗ trợ vay vốn",
          subItems: ["Vay tối đa 70% – hỗ trợ lãi suất 0% đến 03/2029", "Vay tối đa 50% – hỗ trợ lãi suất 0% đến 06/2029"],
        },
        {
          title: "Chiết khấu thanh toán",
          subItems: ["8% khi thanh toán theo tiến độ", "Lên tới 17% khi thanh toán sớm"],
        },
        { title: "Quà tặng", value: "24 tháng phí quản lý dịch vụ" },
      ],
      footerNote:
        "Chính sách bán hàng và ưu đãi có thể được cập nhật theo từng giai đoạn. Quý khách vui lòng liên hệ để nhận thông tin chi tiết.",
      contactPhone: "0962114613",
      policyImage:
        "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Can-ho-Sun-Symphony-Da-Nang-so-huu-tam-view-thoang-dang-tron-song-Han-va-TP-Da-Nang.jpg",
    },
  },
  {
    id: "2",
    slug: "sun-cosmo-residence-da-nang",
    title: "Sun Cosmo Residence",
    subtitle: "Biểu tượng sống mới tại trung tâm Đà Nẵng",
    category: "SUN",
    developerName: "Sun Group",
    projectType: "Căn hộ & thương mại",
    shortDescription:
      "Sun Cosmo Residence mang đến chuẩn sống cao cấp với hệ tiện ích đa tầng, kết nối nhanh ra biển...",
    intro:
      "Sun Cosmo Residence mang đến chuẩn sống cao cấp với hệ tiện ích đa tầng, kết nối nhanh ra biển và trung tâm hành chính.",
    reasonToBuyTitle: "3 lý do nên chọn Sun Cosmo Residence",
    reasonToBuyDescription: `Sun Cosmo Residence là dự án nổi bật cho khách hàng tìm kiếm cả giá trị sống lẫn giá trị đầu tư dài hạn:

💥 Vị trí trung tâm giúp gia tăng khả năng kết nối, thuận tiện an cư và khai thác cho thuê.
💥 Hệ tiện ích đa tầng và quy hoạch hiện đại tạo lợi thế cạnh tranh bền vững.
💥 Tiến độ và pháp lý minh bạch giúp nhà đầu tư an tâm trong mọi giai đoạn xuống tiền.

Dự án phù hợp với nhóm khách hàng ưu tiên thanh khoản, khả năng khai thác và tiềm năng tăng giá theo tốc độ phát triển đô thị Đà Nẵng.`,
    reasonToBuyImage: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Anh-06-min.jpg",
    reasonToBuyImageAlt: "Lý do nên chọn Sun Cosmo Residence",
    locationText: "Trung tâm thành phố, Đà Nẵng",
    locationDescription:
      "Sun Cosmo Residence mang đến chuẩn sống cao cấp với hệ tiện ích đa tầng, kết nối nhanh ra biển...",
    location360Url: "https://kuula.co/post/LpyGP",
    mapEmbedUrl: "https://www.google.com/maps?q=Da%20Nang%20Viet%20Nam&output=embed",
    coverImage: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Anh-06-min.jpg",
    subCoverImage: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Anh-06-min.jpg",
    heroImage: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Anh-06-min.jpg",
    highlights: ["Vị trí trung tâm", "Thiết kế sang trọng", "Tiềm năng cho thuê"],
    specs: [
      { label: "Chủ đầu tư", value: "Sun Group" },
      { label: "Pháp lý", value: "Minh bạch" },
    ],
    gallery: [],
    extentionDescription:
      "Hệ tiện ích đa tầng hướng đến nhịp sống hiện đại, đáp ứng nhu cầu thư giãn, vận động và kết nối cư dân.",
    extentionImages: [
      {
        src: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Anh-06-min.jpg",
        alt: "Khu tiện ích nội khu",
        title: "Khu tiện ích nội khu",
        description: "Tổ hợp tiện ích cộng đồng với thiết kế hiện đại, phục vụ cư dân đa thế hệ.",
      },
    ],
    floorplans: [
      {
        description: "Các phương án mặt bằng mẫu đang được cập nhật chi tiết theo từng dòng sản phẩm.",
        floorPlanImage: [
          { src: "https://via.placeholder.com/1200x800?text=Sun+Cosmo+FloorPlan+1", alt: "Mặt bằng Sun Cosmo 1" },
          { src: "https://via.placeholder.com/1200x800?text=Sun+Cosmo+FloorPlan+2", alt: "Mặt bằng Sun Cosmo 2" },
        ],
      },
    ],
  },
  {
    id: "3",
    slug: "vinhome-ocean-park",
    title: "VinHome Ocean Park",
    category: "VIN",
    developerName: "Vinhomes",
    shortDescription:
      "Dự án Vin Home tại Đà Nẵng. Sun Symphony Residence Đà Nẵng là một dự án bất động sản cao cấp...",
    intro: "Dự án Vin Home tại Đà Nẵng mang lại không gian sống đẳng cấp.",
    reasonToBuyTitle: "Lý do nên cân nhắc VinHome Ocean Park",
    reasonToBuyDescription: `VinHome Ocean Park được định vị theo tiêu chuẩn đô thị hiện đại với hệ sinh thái tiện ích toàn diện.

💥 Không gian sống xanh, phù hợp nhu cầu ở thực lâu dài cho gia đình.
💥 Hạ tầng và tiện ích đồng bộ giúp nâng cao chất lượng sống mỗi ngày.
💥 Thương hiệu vận hành uy tín hỗ trợ duy trì giá trị tài sản theo thời gian.

Đây là lựa chọn phù hợp cho khách hàng tìm kiếm nơi an cư ổn định và tích lũy tài sản bền vững.`,
    reasonToBuyImage: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Anh-06-min.jpg",
    reasonToBuyImageAlt: "Lý do nên chọn VinHome Ocean Park",
    locationText: "Đà Nẵng",
    locationDescription: "",
    location360Url: "https://kuula.co/post/LpyGP",
    mapEmbedUrl: "",
    coverImage: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Anh-06-min.jpg",
    heroImage: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Anh-06-min.jpg",
    highlights: [],
    specs: [],
    gallery: [],
    extentionDescription:
      "Tiện ích đang trong giai đoạn hoàn thiện, định hướng xây dựng không gian sống xanh và cộng đồng cư dân văn minh.",
    extentionImages: [
      {
        src: "https://bdscaocapdanang.com/wp-content/uploads/2025/03/Anh-06-min.jpg",
        alt: "Tiện ích cảnh quan",
        title: "Tiện ích cảnh quan",
        description: "Không gian cảnh quan xanh mát, phù hợp cho thư giãn và hoạt động ngoài trời.",
      },
    ],
    floorplans: [
      {
        description: "Mặt bằng dự án sẽ được công bố theo từng giai đoạn mở bán.",
        floorPlanImage: [
          {
            src: "https://via.placeholder.com/1200x800?text=Vinhome+Ocean+Park+FloorPlan",
            alt: "Mặt bằng tổng thể",
          },
        ],
      },
    ],
  },
];
