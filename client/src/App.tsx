import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjectDetail from "./components/ProjectDetail/ProjectDetail";
import ContactOverlay from "./components/ContactOverlay/ContactOverlay";
import AdminLogin from "./components/AdminLogin/AdminLogin";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/:slug" element={<ProjectDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ContactOverlay
        phoneNumber="0901830909"
        zaloUrl="https://zalo.me/0901830909"
      />
    </BrowserRouter>
  );
}

export default App;
