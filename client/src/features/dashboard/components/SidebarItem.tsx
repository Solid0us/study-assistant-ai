import { useNavigate } from "react-router";
import type { SidebarItemProps } from "../types";

const SidebarItem = ({ icon, isOpen, text, path }: SidebarItemProps) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(path)}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
        path === window.location.pathname
          ? `${isOpen ? "bg-amber-200" : "sm:bg-amber-200"} `
          : "hover:bg-amber-100"
      }`}
    >
      {icon}
      {isOpen && <span className="font-medium">{text}</span>}
    </div>
  );
};

export default SidebarItem;
