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
                      <span className="truncate max-w-[150px]">{report.email && report.email.trim() ? report.email : "Chưa cung cấp"}</span>
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 px-6 py-4">
              <div className="absolute inset-0 bg-black/5"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white drop-shadow-sm">Chi tiết đăng ký</h3>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-110 active:scale-95"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Status Banner với design đẹp hơn */}
              <div className="mb-6 flex items-center justify-between rounded-xl border-2 border-gray-100 bg-gradient-to-r from-gray-50 to-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`rounded-xl p-2.5 shadow-sm ${getStatusBg(selectedReport.status)}`}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Trạng thái</p>
                    <p className="mt-0.5 text-sm font-bold text-gray-900">{getStatusLabel(selectedReport.status)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Ngày đăng ký</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-900">
                    {new Date(selectedReport.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric"
                    })}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {new Date(selectedReport.createdAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>

              {/* Info Grid với hover effects */}
              <div className="space-y-3">
                {/* Họ tên */}
                <div className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-amber-300 hover:shadow-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 shadow-sm transition-transform group-hover:scale-110">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="mb-1 block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Họ và tên</label>
                    <p className="text-base font-bold text-gray-900 truncate">{selectedReport.fullname}</p>
                  </div>
                </div>

                {/* Email với copy button */}
                <div className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 shadow-sm transition-transform group-hover:scale-110">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="mb-1 block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Email</label>
                    <p className="text-base font-semibold text-gray-900 truncate">
                      {selectedReport.email && selectedReport.email.trim() ? (
                        <a 
                          href={`mailto:${selectedReport.email}`}
                          className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                        >
                          {selectedReport.email}
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">Chưa cung cấp</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Số điện thoại với click-to-call */}
                <div className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-green-300 hover:shadow-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-200 text-green-600 shadow-sm transition-transform group-hover:scale-110">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="mb-1 block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Điện thoại</label>
                    <a 
                      href={`tel:${selectedReport.phonenum}`}
                      className="text-base font-bold text-gray-900 hover:text-green-600 transition-colors"
                    >
                      {selectedReport.phonenum}
                    </a>
                  </div>
                </div>

                {/* Dự án quan tâm */}
                <div className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-purple-300 hover:shadow-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 shadow-sm transition-transform group-hover:scale-110">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="mb-1 block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Dự án</label>
                    <p className="text-base font-semibold text-gray-900 truncate">
                      {selectedReport.project || <span className="text-gray-400 italic">Chưa chọn</span>}
                    </p>
                  </div>
                </div>

                {/* Ghi chú với design đẹp hơn */}
                {selectedReport.note && (
                  <div className="group flex items-start gap-4 rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white p-4 shadow-sm transition-all hover:border-orange-300 hover:shadow-md">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600 shadow-sm transition-transform group-hover:scale-110">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="mb-1 block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Ghi chú</label>
                      <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{selectedReport.note}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions với design đẹp hơn */}
              <div className="mt-6 rounded-xl border-t-2 border-gray-100 bg-gradient-to-br from-gray-50 to-white pt-5">
                <p className="mb-3 text-xs font-bold text-gray-600 uppercase tracking-wider">Cập nhật trạng thái</p>
                <div className="flex flex-wrap gap-2.5">
                  {selectedReport.status !== "CONTACTED" && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedReport.id, "CONTACTED");
                        setSelectedReport(null);
                      }}
                      className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105 active:scale-95"
                    >
                      <svg className="h-4 w-4 transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:scale-105 active:scale-95"
                    >
                      <svg className="h-4 w-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:scale-105 active:scale-95"
                    >
                      <svg className="h-4 w-4 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
