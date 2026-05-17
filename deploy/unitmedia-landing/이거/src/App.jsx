import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import PortfolioPage from "./pages/PortfolioPage";
import ServicesPage from "./pages/ServicesPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="Portfolio" element={<Navigate to="/portfolio" replace />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
    </Routes>
  );
}
