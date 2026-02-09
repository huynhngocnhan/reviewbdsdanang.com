import HomePage from "./pages/homePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
