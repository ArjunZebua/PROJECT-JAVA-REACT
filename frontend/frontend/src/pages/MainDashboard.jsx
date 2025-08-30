// import React, { useState, useEffect } from "react";
// import { useNavigate, Outlet } from "react-router-dom";
// import { Home, BookOpen, Users, Tag, CreditCard, Settings, LogOut, Brain,Info } from "lucide-react";

// function MainDashboard() {
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState({
//     name: "Demo User",
//     role: "Premium Member",
//     avatar: null
//   });
//   const [currentPath, setCurrentPath] = useState(window.location.pathname);

//   // Ambil data user dari sessionStorage saat komponen dimount
//   useEffect(() => {
//     const storedUser = sessionStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const user = JSON.parse(storedUser);
//         setUserData({
//           name: user.name || user.fullName || user.username || "Demo User",
//           role: user.role || user.membershipType || "Premium Member",
//           avatar: user.avatar || user.profilePicture || null
//         });
//       } catch (error) {
//         console.error("Error parsing user data:", error);
//       }
//     }
//   }, []);

// const menuItems = [
//   { label: "Dashboard", icon: <Home size={18} />, path: "/dashboard/main" },
//   { label: "Kelola Kursus", icon: <BookOpen size={18} />, path: "/dashboard/courses" },
//   { label: "Kelola User", icon: <Users size={18} />, path: "/dashboard/users" },
//   { label: "Kelola Kategori", icon: <Tag size={18} />, path: "/dashboard/categories" },
//   { label: "Kelola Pembayaran", icon: <CreditCard size={18} />, path: "/dashboard/payments" },
//   { label: "Quiz", icon: <Brain size={18} />, path: "/dashboard/quiz" },
//   { label: "About", icon: <Info size={18} />, path: "/about" },
//   { label: "Pengaturan", icon: <Settings size={18} />, path: "/dashboard/settings" },
// ];

//   const handleLogout = () => {
//     sessionStorage.removeItem("token");
//     sessionStorage.removeItem("user");
//     navigate("/login");
//   };

//   const handleNavigate = (path) => {
//     setCurrentPath(path);
//     navigate(path);
//   };

//   // Fungsi untuk mendapatkan inisial nama
//   const getInitials = (name) => {
//     return name
//       .split(' ')
//       .map(word => word.charAt(0))
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   return (
//     <div className="flex h-screen ">
//       {/* Sidebar */}
//       <aside className="w-72  border-r flex flex-col h-full">
//         {/* User Profile */}
//         <div className="p-6 border-b">
//           <div className="text-center">
//             {userData.avatar ? (
//               <img
//                 src={userData.avatar}
//                 alt={userData.name}
//                 className="w-16 h-16 mx-auto rounded-full object-cover"
//               />
//             ) : (
//               <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 text-white flex items-center justify-center text-lg font-medium">
//                 {getInitials(userData.name)}
//               </div>
//             )}
//             <h2 className="mt-3 text-lg font-semibold text-gray-900">{userData.name}</h2>
//             <p className="text-sm text-gray-500 mt-1">{userData.role}</p>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 px-6 py-4">
//           <div className="space-y-1">
//             {menuItems.map((item, index) => {
//               const isActive = currentPath === item.path;
//               return (
//                 <button
//                   key={index}
//                   onClick={() => handleNavigate(item.path)}
//                   className={`
//                     w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200
//                     ${isActive 
//                       ? 'bg-slate-900 text-white' 
//                       : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
//                     }
//                   `}
//                 >
//                   <span className="mr-3">{item.icon}</span>
//                   {item.label}
//                 </button>
//               );
//             })}
//           </div>
//         </nav>

//         {/* Logout - Fixed at bottom */}
//         <div className="p-4 border-t border-gray-100 bg-white">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center px-3 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 shadow-sm"
//           >
//             <LogOut size={16} className="mr-2" />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 flex flex-col overflow-hidden">
//         {/* Content */}
//         <div className="flex-1 overflow-auto">
//           <div className="p-8">
//             <div className=" rounded-2xl border border-gray-200 min-h-[600px] p-8">
//               <Outlet />
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default MainDashboard;



import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Home, BookOpen, Users, Tag, CreditCard, Settings, LogOut, Brain, Info, Moon, Sun } from "lucide-react";
import { useDarkMode } from "../components/DarkModeContext";

function MainDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "Demo User",
    role: "Premium Member",
    avatar: null
  });
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Ambil data user dari sessionStorage saat komponen dimount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserData({
          name: user.name || user.fullName || user.username || "Demo User",
          role: user.role || user.membershipType || "Premium Member",
          avatar: user.avatar || user.profilePicture || null
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const menuItems = [
    { label: "Dashboard", icon: <Home size={18} />, path: "/dashboard/main" },
    { label: "Kelola Kursus", icon: <BookOpen size={18} />, path: "/dashboard/courses" },
    { label: "Kelola User", icon: <Users size={18} />, path: "/dashboard/users" },
    { label: "Kelola Kategori", icon: <Tag size={18} />, path: "/dashboard/categories" },
    { label: "Kelola Pembayaran", icon: <CreditCard size={18} />, path: "/dashboard/payments" },
    { label: "Quiz", icon: <Brain size={18} />, path: "/dashboard/quiz" },
    { label: "About", icon: <Info size={18} />, path: "/dashboard/about" },
    { label: "Pengaturan", icon: <Settings size={18} />, path: "/dashboard/settings" },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  const handleNavigate = (path) => {
    setCurrentPath(path);
    navigate(path);
  };

  // Fungsi untuk mendapatkan inisial nama
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <aside className={`w-72 border-r flex flex-col h-screen shadow-sm relative z-10 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        {/* User Profile */}
        <div className={`p-6 border-b flex-shrink-0 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="text-center">
            {userData.avatar ? (
              <img
                src={userData.avatar}
                alt={userData.name}
                className="w-16 h-16 mx-auto rounded-full object-cover"
              />
            ) : (
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-lg font-medium ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-800 text-white'}`}>
                {getInitials(userData.name)}
              </div>
            )}
            <h2 className={`mt-3 text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{userData.name}</h2>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{userData.role}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 py-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={index}
                  onClick={() => handleNavigate(item.path)}
                  className={`
                    w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isActive 
                      ? isDarkMode 
                        ? 'bg-slate-700 text-white' 
                        : 'bg-slate-900 text-white'
                      : isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Dark Mode Toggle */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={toggleDarkMode}
            className={`w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 mb-2 ${
              isDarkMode 
                ? '' 
                : ''
            }`}
          >
            {/* {isDarkMode ? (
              <>
                <Sun size={18} className="mr-2" />
                Mode Terang
              </>
            ) : (
              <>
                <Moon size={18} className="mr-2" />
                Mode Gelap
              </>
            )} */}
          </button>
        </div>

        {/* Logout - Fixed at bottom dengan styling yang lebih kontras */}
        <div className={`p-4 border-t flex-shrink-0 mt-auto ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 focus:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className={`rounded-2xl border min-h-[600px] p-8 shadow-sm ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainDashboard;