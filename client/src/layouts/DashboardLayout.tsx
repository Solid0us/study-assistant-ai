import { useState } from "react";
import { Menu, X, Home, Folder, Layers, Settings } from "lucide-react";
import { Outlet } from "react-router";
import SidebarItem from "@/features/dashboard/components/SidebarItem";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-amber-50 to-rose-50 text-gray-800">
      <div
        className={`${
          isOpen ? "w-64" : "w-0 sm:w-20"
        } bg-white/90 backdrop-blur-md shadow-md transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-white/90 shadow-md hover:bg-amber-100 transition"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1
            className={`text-2xl font-bold text-primary transition-opacity duration-300 mt-10 ${
              !isOpen && "opacity-0"
            }`}
          >
            RecallAI
          </h1>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          <SidebarItem
            icon={<Home size={20} />}
            text="Home"
            isOpen={isOpen}
            path="/dashboard/home"
          />
          <SidebarItem
            icon={<Folder size={20} />}
            text="Collections"
            isOpen={isOpen}
            path="/dashboard/collections"
          />
          <SidebarItem
            icon={<Layers size={20} />}
            text="Flashcards"
            isOpen={isOpen}
            path="/dashboard/flashcards"
          />
          <SidebarItem
            icon={<Settings size={20} />}
            text="Settings"
            isOpen={isOpen}
            path="/dashboard/settings"
          />
        </nav>
      </div>
      <main className="flex-1 p-6 pt-14">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
