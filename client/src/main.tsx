import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import HomePage from "./features/home/HomePage.tsx";
import { BrowserRouter, Routes } from "react-router";
import { Route } from "react-router";
import HomeLayout from "./layouts/HomeLayout.tsx";
import LoginPage from "./features/auth/LoginPage.tsx";
import AuthLayout from "./layouts/AuthLayout.tsx";
import SignupPage from "./features/auth/SignupPage.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardPage from "./features/dashboard/DashboardPage.tsx";
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import CollectionsPage from "./features/dashboard/CollectionsPage.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<HomePage />} />
          </Route>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<SignupPage />} />
          </Route>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="home" element={<DashboardPage />} />
            <Route path="collections" element={<CollectionsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </StrictMode>
  </QueryClientProvider>
);
