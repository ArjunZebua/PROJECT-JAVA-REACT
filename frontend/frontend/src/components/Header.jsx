// components/Header.jsx - Komponen Header terpisah
import { useState, useEffect } from 'react';
import { Menu, X, LogIn, UserPlus, Users } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = sessionStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleNavigation = (path) => {
    // In real app, use navigate(path) from react-router-dom
    console.log(`Navigate to: ${path}`);
    if (path === '/login') {
      window.location.href = '/login';
    } else if (path === '/register') {
      window.location.href = '/register';
    } else if (path === '/dashboard') {
      window.location.href = '/dashboard';
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">𝓚𝓤𝓡𝓢𝓤𝓢 𝓞𝓝𝓛𝓘𝓝𝓔</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                onClick={() => handleNavigation('/dashboard')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center"
              >
                <Users className="w-4 h-4 mr-2" />
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation('/login')}
                  className="text-gray-600 hover:text-gray-900 transition-colors flex items-center"
                >
                  <LogIn className="w-4 h-4 mr-1" />
                  Sign In
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
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
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-2">
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Contact
            </button>
            <hr className="my-2" />
            
            {/* Auth Buttons - Mobile */}
            {isAuthenticated ? (
              <button
                onClick={() => handleNavigation('/dashboard')}
                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all duration-300 text-center"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation('/login')}
                  className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
                  className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all duration-300 text-center"
                >
                  Get Started
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