import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopProgressBar from "./components/TopProgressBar";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

const HomePage = lazy(() => import("./pages/HomePage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProjectDetailV2 = lazy(() => import("./components/ProjectDetailV2/ProjectDetailV2"));
const AdminLogin = lazy(() => import("./components/AdminLogin/AdminLogin"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard/AdminDashboard"));

const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-[#F3E8DC] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-amber-200/80" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-700 border-r-amber-500 animate-spin" />
      </div>
      <p className="text-sm font-semibold tracking-[0.14em] uppercase text-[#6B4E3D]">
        Đang tải nội dung...
      </p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <TopProgressBar />
      <ScrollToTop />

      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/du-an/:slug" element={<ProjectDetailV2 />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

    </BrowserRouter>
  );
};

export default App;
