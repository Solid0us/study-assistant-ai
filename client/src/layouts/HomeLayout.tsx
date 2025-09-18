import { Button } from "@/components/ui/button";
import { Outlet } from "react-router";
import { useNavigate } from "react-router";

const HomeLayout = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-background min-h-screen text-foreground">
      <nav className="flex justify-between items-center px-8 py-4 shadow-sm bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-primary">Recall AI</h1>
        <div className="space-x-6 flex items-center">
          <a href="#features" className="hover:text-secondary transition">
            Features
          </a>
          <a href="#about" className="hover:text-secondary transition">
            About
          </a>
          <Button
            className="bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground rounded-xl shadow"
            onClick={() => navigate("/auth/login")}
          >
            Get Started
          </Button>
        </div>
      </nav>
      <Outlet />
      <footer className="py-8 text-center text-muted-foreground text-sm border-t border-border">
        © {new Date().getFullYear()} Recall AI — All rights reserved.
      </footer>
    </div>
  );
};

export default HomeLayout;
