import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ChartPieIcon, FolderIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { adminService } from "../../services/admin.service";
import { authService } from "../../services/auth.service";
import AdminProfile from "./AdminProfile/AdminProfile";
import ProjectDashboard from "./AdminProjectManagement/ProjectDashboard";
type AdminProfileInfo = {
  fullName?: string;
  avatarUrl?: string;
};

type AdminData = {
  id: string;
  email: string;
  profile?: AdminProfileInfo;
};

type NavItem = {
  name: "Dashboard" | "Profile" | "Projects" | "Reports";
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const navigation: NavItem[] = [
  // { name: "Dashboard", icon: HomeIcon },
  { name: "Profile", icon: UserGroupIcon },
  { name: "Projects", icon: FolderIcon },
  { name: "Reports", icon: ChartPieIcon },
];

const AdminDashboard: React.FC = () => {
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<NavItem["name"]>("Profile");

  useEffect(() => {
    const fetchAdmin = async () => {
      const adminId = localStorage.getItem("adminId");

      if (!adminId) {
        return;
      }

      try {
        setIsLoadingAdmin(true);
        const data = await adminService.getAdminById(adminId);
        setAdmin(data?.admin ?? data);
      } catch {
        toast.error("Không thể tải thông tin admin");
      } finally {
        setIsLoadingAdmin(false);
      }
    };

    void fetchAdmin();
  }, []);

  const handleLogout = async () => {
    try {
      const logoutPromise = authService.logout(localStorage.getItem("refreshToken") ?? "");
      await toast.promise(logoutPromise, {
        loading: "Đang đăng xuất...",
        success: <b>Đăng xuất thành công!</b>,
        error: <b>Đăng xuất thất bại. Vui lòng kiểm tra lại token.</b>,
      });

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("adminId");
      setTimeout(() => {
        window.location.href = "/admin/login";
      }, 1000);
    } catch {
      toast.error("Không thể đăng xuất");
    }
  };

  const renderContent = () => {
    if (activeTab === "Profile") {
      return <AdminProfile />;
    }else if (activeTab === "Projects") {
      return <ProjectDashboard/>
    }

    return <div className="h-full rounded-xl border-2 border-dashed border-gray-300 bg-white/30" />;
  };

  return (
    <div className="h-screen overflow-hidden p-1 sm:p-2">
      <div className="mx-auto flex h-full w-full overflow-hidden rounded-2xl bg-white shadow-xl">
        <aside className="flex w-72 shrink-0 flex-col border-r border-gray-200 bg-gray-50">
          <div className="px-6 py-6">
            <p className="text-xl font-bold text-yellow-800">reviewbdsdanang.com</p>
          </div>

          <nav className="flex-1 px-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = activeTab === item.name;

                return (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => setActiveTab(item.name)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition ${
                        isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-gray-200 px-4 py-4">
            <div className="flex items-center justify-between rounded-lg px-2 py-2">
              <div className="flex items-center gap-3">
                <img
                  src={admin?.profile?.avatarUrl ?? ""}
                  alt="Admin avatar"
                  className="h-9 w-9 rounded-full object-cover"
                />
                <span className="text-sm font-semibold text-gray-800">
                  {isLoadingAdmin ? "Đang tải..." : admin?.profile?.fullName ?? admin?.email ?? "Admin"}
                </span>
              </div>
              {admin ? (
                <button
                  type="button"
                  className="rounded-md bg-yellow-600 px-2 py-1 text-xs font-semibold text-white hover:bg-yellow-500"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : null}
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
