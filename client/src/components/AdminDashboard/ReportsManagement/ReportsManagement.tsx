import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  PhoneIcon,
  EyeIcon,
  TrashIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { registrationService } from "../../../services/registration.service";
import type { Report, ReportStats, ReportStatus } from "../../../services/registration.service";

const FILTER_OPTIONS: Array<"ALL" | ReportStatus> = ["ALL", "NEW", "CONTACTED", "COMPLETED", "CANCELLED"];

const ReportsManagement: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filterStatus, setFilterStatus] = useState<"ALL" | ReportStatus>("ALL");

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await registrationService.getAllReports();
      setReports(data);
    } catch {
      toast.error("Không thể tải danh sách đăng ký");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await registrationService.getStats();
      setStats(data);
    } catch {
      // Silently fail for stats
    }
  };

  const handleStatusChange = async (
    reportId: string,
    status: "CONTACTED" | "COMPLETED" | "CANCELLED"
  ) => {
    try {
      await registrationService.updateStatus(reportId, status);
      toast.success("Cập nhật trạng thái thành công");
      fetchReports();
      fetchStats();
    } catch {
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đăng ký này?")) return;

    try {
      await registrationService.deleteReport(reportId);
      toast.success("Xóa thành công");
      fetchReports();
      fetchStats();
    } catch {
      toast.error("Không thể xóa");
    }
  };

  const filteredReports =
    filterStatus === "ALL"
      ? reports
      : reports.filter((r) => r.status === (filterStatus as ReportStatus));

  const getStatusBadge = (status: ReportStatus) => {
    const styles = {
      NEW: "bg-yellow-100 text-yellow-800",
      CONTACTED: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    const labels = {
      NEW: "Mới",
      CONTACTED: "Đã liên hệ",
      COMPLETED: "Hoàn thành",
      CANCELLED: "Đã hủy",
    };
    return (
      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getStatusBg = (status: ReportStatus) => {
    const styles = {
      NEW: "bg-yellow-100 text-yellow-600",
      CONTACTED: "bg-blue-100 text-blue-600",
      COMPLETED: "bg-green-100 text-green-600",
      CANCELLED: "bg-red-100 text-red-600",
    };
    return styles[status];
  };

  const getStatusLabel = (status: ReportStatus) => {
    const labels = {
      NEW: "Mới",
      CONTACTED: "Đã liên hệ",
      COMPLETED: "Hoàn thành",
      CANCELLED: "Đã hủy",
    };
    return labels[status];
  };

  return (
    <div className="h-full flex flex-col min-w-0">
      {/* Stats Cards */}
      {stats && (
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="min-w-[100px] flex-1 rounded-lg bg-white p-3 shadow">
            <p className="text-xs text-gray-500">Tổng đăng ký</p>
            <p className="text-xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="min-w-[100px] flex-1 rounded-lg bg-white p-3 shadow">
            <p className="text-xs text-gray-500">Mới</p>
            <p className="text-xl font-bold text-yellow-600">{stats.new}</p>
          </div>
          <div className="min-w-[100px] flex-1 rounded-lg bg-white p-3 shadow">
            <p className="text-xs text-gray-500">Đã liên hệ</p>
            <p className="text-xl font-bold text-blue-600">{stats.contacted}</p>
          </div>
          <div className="min-w-[100px] flex-1 rounded-lg bg-white p-3 shadow">
            <p className="text-xs text-gray-500">Hoàn thành</p>
            <p className="text-xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="min-w-[100px] flex-1 rounded-lg bg-white p-3 shadow">
            <p className="text-xs text-gray-500">Đã hủy</p>
            <p className="text-xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="mb-4 flex gap-2">
        {FILTER_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filterStatus === status
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {status === "ALL" ? "Tất cả" : getStatusBadge(status as ReportStatus)}
          </button>
        ))}
      </div>

      {/* Reports Table */}
      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Họ tên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Điện thoại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Dự án
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                Ngày đăng ký
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : filteredReports.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  Chưa có đăng ký nào
                </td>
              </tr>
            ) : (
              filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                    {report.fullname}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="truncate max-w-[150px]">{report.email}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <PhoneIcon className="h-4 w-4 text-gray-400 shrink-0" />
                      {report.phonenum}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-[180px] truncate">
                    {report.project || "-"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="rounded p-1 text-indigo-600 hover:bg-indigo-50"
                        title="Xem chi tiết"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="rounded p-1 text-red-600 hover:bg-red-50"
                        title="Xóa"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Chi tiết đăng ký</h3>
                  <p className="mt-0.5 text-xs text-white/80">
                    Mã: #{selectedReport.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Status Banner */}
              <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <div className="flex items-center gap-2">
                  <div className={`rounded-full p-1.5 ${getStatusBg(selectedReport.status)}`}>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Trạng thái</p>
                    <p className="text-xs font-semibold text-gray-900">{getStatusLabel(selectedReport.status)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500">Ngày đăng ký</p>
                  <p className="text-xs font-medium text-gray-900">
                    {new Date(selectedReport.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="space-y-2">
                {/* Họ tên */}
                <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-2.5 shadow-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-medium text-gray-400 uppercase">Họ và tên</label>
                    <p className="text-sm font-semibold text-gray-900 truncate">{selectedReport.fullname}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-2.5 shadow-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-medium text-gray-400 uppercase">Email</label>
                    <p className="text-sm font-medium text-gray-900 truncate">{selectedReport.email}</p>
                  </div>
                </div>

                {/* Số điện thoại */}
                <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-2.5 shadow-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-medium text-gray-400 uppercase">Điện thoại</label>
                    <p className="text-sm font-semibold text-gray-900">{selectedReport.phonenum}</p>
                  </div>
                </div>

                {/* Dự án quan tâm */}
                <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-2.5 shadow-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] font-medium text-gray-400 uppercase">Dự án</label>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {selectedReport.project || "Chưa chọn"}
                    </p>
                  </div>
                </div>

                {/* Ghi chú */}
                {selectedReport.note && (
                  <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-2.5 shadow-sm">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-[10px] font-medium text-gray-400 uppercase">Ghi chú</label>
                      <p className="text-sm text-gray-600 truncate">{selectedReport.note}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-4 border-t border-gray-100 pt-3">
                <p className="mb-2 text-xs font-medium text-gray-500">Cập nhật trạng thái:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedReport.status !== "CONTACTED" && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedReport.id, "CONTACTED");
                        setSelectedReport(null);
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-md transition-all hover:bg-blue-700 active:scale-95"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Đã liên hệ
                    </button>
                  )}
                  {selectedReport.status !== "COMPLETED" && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedReport.id, "COMPLETED");
                        setSelectedReport(null);
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white shadow-md transition-all hover:bg-green-700 active:scale-95"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Hoàn thành
                    </button>
                  )}
                  {selectedReport.status !== "CANCELLED" && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedReport.id, "CANCELLED");
                        setSelectedReport(null);
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white shadow-md transition-all hover:bg-red-600 active:scale-95"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Hủy
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsManagement;
