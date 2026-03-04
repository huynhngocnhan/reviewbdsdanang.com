import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjectDetail from "./components/ProjectDetail/ProjectDetail";
import ContactOverlay from "./components/ContactOverlay/ContactOverlay";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/:slug" element={<ProjectDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ContactOverlay
        phoneNumber="0905123456"
        zaloUrl="https://zalo.me/0905123456"
      />
    </BrowserRouter>
  );
}

export default App;
