import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router";

const ProtectedRoutes = () => {
  const { isLoggedIn, isLoading } = useAuth();
  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return isLoggedIn ? <Outlet /> : <Navigate to="auth/login" />;
  }
};

export default ProtectedRoutes;
