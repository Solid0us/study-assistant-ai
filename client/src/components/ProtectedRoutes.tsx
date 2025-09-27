import { useAuth } from "../context/AuthContext";
import { Outlet } from "react-router";

const ProtectedRoutes = () => {
  const { isLoggedIn, isLoading } = useAuth();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    window.location.replace("/auth/login");
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
