// components/Header.jsx - Komponen Header terpisah
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, LogIn, UserPlus, Users, Sun, Moon } from "lucide-react";
import { useDarkMode } from "../components/DarkModeContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    // Check if user is authenticated
    const token = sessionStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className={`fixed top-0 w-full backdrop-blur-sm border-b z-50 transition-colors duration-300 ${
      isDarkMode 
        ? "bg-gray-900/95 border-gray-700" 
        : "bg-white/95 border-gray-200"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className={`ml-2 text-xl font-bold transition-colors duration-300 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              𝓚𝓤𝓡𝓢𝓤𝓢 𝓞𝓝𝓛𝓘𝓝𝓔
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("features")}
              className={`transition-colors duration-300 ${
                isDarkMode 
                  ? "text-gray-300 hover:text-white" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className={`transition-colors duration-300 ${
                isDarkMode 
                  ? "text-gray-300 hover:text-white" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className={`transition-colors duration-300 ${
                isDarkMode 
                  ? "text-gray-300 hover:text-white" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
            </button>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isDarkMode 
                  ? "hover:bg-gray-700 text-yellow-400" 
                  : "hover:bg-gray-100 text-gray-600"
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <button
                  onClick={() => handleNavigation("/dashboard")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigation("/login")}
                    className={`transition-colors duration-300 flex items-center ${
                      isDarkMode 
                        ? "text-gray-300 hover:text-white" 
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <LogIn className="w-4 h-4 mr-1" />
                    Sign In
                  </button>
                  <button
                    onClick={() => handleNavigation("/register")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center"
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Get Started
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
                isDarkMode 
                  ? "hover:bg-gray-700 text-white" 
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className={`md:hidden border-t transition-colors duration-300 ${
          isDarkMode 
            ? "bg-gray-900 border-gray-700" 
            : "bg-white border-gray-200"
        }`}>
          <div className="px-4 py-2 space-y-2">
            <button
              onClick={() => scrollToSection("features")}
              className={`block w-full text-left px-3 py-2 rounded-lg transition-colors duration-300 ${
                isDarkMode 
                  ? "text-gray-300 hover:text-white hover:bg-gray-800" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
            </button>
            <button
              onClick={() => scrollToSection("aboutpage")}
              className={`block w-full text-left px-3 py-2 rounded-lg transition-colors duration-300 ${
                isDarkMode 
                  ? "text-gray-300 hover:text-white hover:bg-gray-800" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className={`block w-full text-left px-3 py-2 rounded-lg transition-colors duration-300 ${
                isDarkMode 
                  ? "text-gray-300 hover:text-white hover:bg-gray-800" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
            </button>
            <hr className={`my-2 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`} />

            {/* Dark Mode Toggle - Mobile */}
            <button
              onClick={toggleDarkMode}
              className={`block w-full text-left px-3 py-2 rounded-lg transition-colors duration-300 ${
                isDarkMode 
                  ? "text-gray-300 hover:text-white hover:bg-gray-800" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center">
                {isDarkMode ? (
                  <>
                    <Sun className="w-4 h-4 mr-2" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 mr-2" />
                    Dark Mode
                  </>
                )}
              </div>
            </button>

            {/* Auth Buttons - Mobile */}
            {isAuthenticated ? (
              <button
                onClick={() => handleNavigation("/dashboard")}
                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all duration-300 text-center"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation("/login")}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors duration-300 ${
                    isDarkMode 
                      ? "text-gray-300 hover:text-white hover:bg-gray-800" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                </button>
                <button
                  onClick={() => handleNavigation("/register")}
                  className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all duration-300 text-center"
                >
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;