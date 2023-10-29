import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import LoginPage from "./pages/public/login";
import HomePage from "./pages/public/home";
import DashboardPage from "./pages/admin/dashboard";
import SkillsPage from "./pages/admin/skills";

import AdminLayout from "./components/layout/admin";

import FrontLayout from "./components/layout/public";
import RegisterPage from "./pages/public/register";
import ExperiencesPage from "./pages/admin/experiences";
import EducationPage from "./pages/admin/education";
import PortfoliosPage from "./pages/admin/portfolios";
import UsersPage from "./pages/admin/users";

import { authName } from "./redux/slices/auth";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state[authName]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<FrontLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route
          path="/"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminLayout />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="experiences" element={<ExperiencesPage />} />
          <Route path="education" element={<EducationPage />} />
          <Route path="portfolios" element={<PortfoliosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
