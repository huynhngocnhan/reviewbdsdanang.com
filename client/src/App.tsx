import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjectDetailV2 from "./components/ProjectDetailV2/ProjectDetailV2";
import AdminLogin from "./components/AdminLogin/AdminLogin";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import TopProgressBar from "./components/TopProgressBar";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <TopProgressBar />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<HomePage />} />
        
        <Route path="/du-an/:slug" element={<ProjectDetailV2 />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

    </BrowserRouter>
  );
};

export default App;
