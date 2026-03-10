import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon, ArchiveBoxIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { projectService } from "../../../services/project.service";
import type { ProjectCategory } from "../../../constants/projectData";
import ProjectCreation from "./ProjectCreation";

type ProjectStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

// Project type matching API response
type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  shortDescription: string;
  status: ProjectStatus;
  category: ProjectCategory;
  developerName?: string;
  city?: string;
  district?: string;
  coverImage?: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
};

const ProjectDashboard = () => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "ALL">("ALL");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreation, setShowCreation] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const categories: { value: ProjectCategory | "ALL"; label: string; color: string }[] = [
    { value: "ALL", label: "Tất cả", color: "bg-purple-500" },
    { value: "SUN", label: "Sun Group", color: "bg-yellow-500" },
    { value: "VIN", label: "Vin Group", color: "bg-blue-500" },
    { value: "OTHER", label: "Các dự án khác", color: "bg-gray-500" },
  ];

  const fetchProjects = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await projectService.getProjects({ limit: 100 });
      console.log(response);
      

      if (response.success && response.data) {
        // Transform API data to match component format
        const transformedProjects: Project[] = response.data.map((project: any) => ({
          id: project.id,
          slug: project.slug,
          title: project.title,
          subtitle: project.subtitle,
          shortDescription: project.shortDescription,
          status: project.status as ProjectStatus,
          category: project.category as ProjectCategory,
          developerName: project.developerName,
          city: project.city,
          district: project.district,
          coverImage: project.coverImage,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
          publishedAt: project.publishedAt,
        }));

        setProjects(transformedProjects);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Không thể tải danh sách dự án");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Refresh projects when coming back from creation
  useEffect(() => {
    if (!showCreation) {
      fetchProjects(true);
    }
  }, [showCreation, fetchProjects]);

  const handleRefresh = () => {
    fetchProjects(true);
  };

  const handleCreateProject = () => {
    setShowCreation(true);
  };

  const handleEditProject = async (projectId: string) => {
    setEditingProjectId(projectId);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa dự án này?")) return;

    try {
      const response = await projectService.deleteProject(projectId);
      if (response.success) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
        toast.success("Xóa dự án thành công");
      } else {
        toast.error(response.error || "Không thể xóa dự án");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Không thể xóa dự án");
    }
  };

  const handleToggleStatus = async (projectId: string, currentStatus: ProjectStatus) => {
    try {
      let response;
      if (currentStatus === "PUBLISHED") {
        response = await projectService.archiveProject(projectId);
      } else {
        response = await projectService.publishProject(projectId);
      }

      if (response.success && response.data) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  status: (response.data as any).status as ProjectStatus,
                  publishedAt: (response.data as any).publishedAt,
                }
              : p
          )
        );
        toast.success(
          currentStatus === "PUBLISHED" ? "Đã lưu trữ dự án" : "Đã xuất bản dự án"
        );
      } else {
        toast.error(response.error || "Không thể cập nhật trạng thái");
      }
    } catch (error) {
      console.error("Error toggling project status:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const getStatusBadge = (status: ProjectStatus) => {
    const statusConfig = {
      DRAFT: { label: "Nháp", color: "bg-gray-100 text-gray-700" },
      PUBLISHED: { label: "Đã xuất bản", color: "bg-green-100 text-green-700" },
      ARCHIVED: { label: "Đã lưu trữ", color: "bg-yellow-100 text-yellow-700" },
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filteredProjects = useMemo(() => {
    if (activeCategory === "ALL") return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  if (showCreation) {
    return <ProjectCreation onBack={() => setShowCreation(false)} onSave={() => fetchProjects(true)} />;
  }

  if (editingProjectId) {
    return <ProjectCreation projectId={editingProjectId} onBack={() => setEditingProjectId(null)} onSave={() => fetchProjects(true)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý dự án</h1>
          <p className="mt-1 text-sm text-gray-500">Quản lý và theo dõi tất cả các dự án bất động sản</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <ArrowPathIcon className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleCreateProject}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Tạo dự án</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
        <div className="flex flex-wrap gap-1 sm:flex-nowrap">
          {categories.map((category) => {
            const isActive = activeCategory === category.value;
            const count = category.value === "ALL"
              ? projects.length
              : projects.filter((p) => p.category === category.value).length;

            return (
              <button
                key={category.value}
                onClick={() => setActiveCategory(category.value)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-yellow-50 text-yellow-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${category.color}`} />
                <span className="truncate">{category.label}</span>
                {isActive && (
                  <span className="ml-1 rounded-full bg-yellow-600 px-2 py-0.5 text-xs text-white">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects List */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <ArrowPathIcon className="h-8 w-8 animate-spin text-yellow-600" />
            <p className="mt-4 text-sm text-gray-500">Đang tải dự án...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="rounded-full bg-gray-100 p-4">
              <ArchiveBoxIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-gray-900">Chưa có dự án nào</h3>
            <p className="mt-2 text-sm text-gray-500">Bắt đầu bằng cách tạo dự án mới</p>
            <button
              onClick={handleCreateProject}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-500"
            >
              <PlusIcon className="h-4 w-4" />
              Tạo dự án đầu tiên
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="transition hover:bg-gray-50"
              >
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
                  {/* Cover Image */}
                  <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-20 sm:w-32">
                    {project.coverImage ? (
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                        <span className="text-xs font-semibold text-gray-500">Không có ảnh</span>
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start gap-2 sm:items-center">
                      <h3 className="text-base font-semibold text-gray-900 sm:text-lg">{project.title}</h3>
                      {getStatusBadge(project.status)}
                    </div>
                    {project.subtitle && (
                      <p className="mt-1 text-sm text-gray-600">{project.subtitle}</p>
                    )}
                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">{project.shortDescription}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      {project.developerName && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Chủ đầu tư:</span>
                          {project.developerName}
                        </span>
                      )}
                      {(project.city || project.district) && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Địa điểm:</span>
                          {[project.district, project.city].filter(Boolean).join(", ") || "Chưa cập nhật"}
                        </span>
                      )}
                      {project.publishedAt && (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Xuất bản:</span>
                          {new Date(project.publishedAt).toLocaleDateString("vi-VN")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(project.id, project.status)}
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                      title={project.status === "PUBLISHED" ? "Lưu trữ" : "Xuất bản"}
                    >
                      {project.status === "PUBLISHED" ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEditProject(project.id)}
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                      title="Chỉnh sửa"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                      title="Xóa"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {!loading && filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-500">Tổng số dự án</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{filteredProjects.length}</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-500">Đã xuất bản</div>
            <div className="mt-1 text-2xl font-bold text-green-600">
              {filteredProjects.filter((p) => p.status === "PUBLISHED").length}
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-500">Nháp</div>
            <div className="mt-1 text-2xl font-bold text-gray-600">
              {filteredProjects.filter((p) => p.status === "DRAFT").length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDashboard;
