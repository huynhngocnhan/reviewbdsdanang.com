import type React from "react";
import {
  CalendarDaysIcon,
  ChartPieIcon,
  DocumentTextIcon,
  FolderIcon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", icon: HomeIcon, count: "5", current: true },
  { name: "Team", icon: UserGroupIcon, current: false },
  { name: "Projects", icon: FolderIcon, count: "12", current: false },
  { name: "Calendar", icon: CalendarDaysIcon, count: "20+", current: false },
  { name: "Documents", icon: DocumentTextIcon, current: false },
  { name: "Reports", icon: ChartPieIcon, current: false },
];

const teams = [
  { name: "Heroicons", initial: "H" },
  { name: "Tailwind Labs", initial: "T" },
  { name: "Workcation", initial: "W" },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 p-3 sm:p-4">
      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] w-full max-w-[1400px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <aside className="flex w-72 shrink-0 flex-col border-r border-gray-200 bg-gray-50">
          <div className="px-6 py-6">
            <div className="h-8 w-8 rounded-md bg-indigo-600" />
          </div>

          <nav className="flex-1 px-4">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href="#"
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      item.current ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </span>
                    {item.count && (
                      <span className="rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-600">
                        {item.count}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <p className="px-3 text-xs font-semibold text-gray-400">Your teams</p>
              <ul className="mt-3 space-y-1">
                {teams.map((team) => (
                  <li key={team.name}>
                    <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-300 text-xs text-gray-500">
                        {team.initial}
                      </span>
                      {team.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="border-t border-gray-200 px-4 py-4">
            <div className="flex items-center justify-between rounded-lg px-2 py-2">
              <div className="flex items-center gap-3">
                <img
                  src="https://i.pravatar.cc/100?img=68"
                  alt="Admin avatar"
                  className="h-9 w-9 rounded-full object-cover"
                />
                <span className="text-sm font-semibold text-gray-800">Tom Cook</span>
              </div>
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                Login
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-gray-100 p-6">
          <div className="h-full rounded-xl border-2 border-dashed border-gray-300 bg-white/30" />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
