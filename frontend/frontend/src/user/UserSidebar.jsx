// src/components/UserSidebar.jsx
import { Home, BookOpen, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const UserSidebar = () => {
  return (
    <div className="h-screen w-64 bg-white shadow-lg border-r flex flex-col">
      {/* Header */}
      <div className="p-4 text-center font-bold text-xl border-b">
        User Dashboard
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/user/home"
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-100"
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>

        <Link
          to="/user/courses"
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-100"
        >
          <BookOpen className="w-5 h-5" />
          <span>My Courses</span>
        </Link>

        <Link
          to="/user/settings"
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-100"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button className="flex items-center w-full space-x-2 p-2 rounded-lg hover:bg-red-100 text-red-500">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
