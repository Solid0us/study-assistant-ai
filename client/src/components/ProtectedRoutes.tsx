import { useAuth } from "../context/AuthContext";
import { Outlet } from "react-router";

const ProtectedRoutes = () => {
  const { authState } = useAuth();
  switch (authState) {
    case "loading":
      return <div>Loading...</div>;
    case "authenticated":
      return <Outlet />;
    default:
      window.location.replace("/auth/login");
      return null;
  }
};

export default ProtectedRoutes;
