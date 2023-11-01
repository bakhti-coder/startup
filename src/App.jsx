import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import { authName } from "./redux/slices/auth";

import AdminLayout from "./components/layout/admin";
import FrontLayout from "./components/layout/public";

import LoginPage from "./pages/public/login";
import HomePage from "./pages/public/home";
import DashboardPage from "./pages/admin/dashboard";
import SkillsPage from "./pages/admin/skills";
import RegisterPage from "./pages/public/register";
import ExperiencesPage from "./pages/admin/experiences";
import EducationPage from "./pages/admin/education";
import PortfoliosPage from "./pages/admin/portfolios";
import UsersPage from "./pages/admin/users";
import AccountPage from "./pages/account";
import AdminAccountPage from "./pages/admin/account";
import MessagesPage from "./pages/admin/messages";
import FrontMessagesPage from "./pages/public/messages";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state[authName]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<FrontLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/account"
            element={
              isAuthenticated ? <AccountPage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/messagess"
            element={
              isAuthenticated ? <FrontMessagesPage /> : <Navigate to="/login" />
            }
          />
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
          <Route path="accountadmin" element={<AdminAccountPage />} />
          <Route path="messages" element={<MessagesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
