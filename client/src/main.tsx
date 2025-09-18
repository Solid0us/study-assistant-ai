import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import HomePage from "./features/home/HomePage.tsx";
import { BrowserRouter, Routes } from "react-router";
import { Route } from "react-router";
import HomeLayout from "./layouts/HomeLayout.tsx";
import LoginPage from "./features/auth/LoginPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="/auth">
          <Route path="login" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
