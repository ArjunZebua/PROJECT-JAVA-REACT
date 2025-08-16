// App.jsx - Versi yang sudah diperbaiki
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';
import Header from "./components/Header";

function App() {
  // Helper function untuk cek auth
  const isLoggedIn = () => !!sessionStorage.getItem('token');
  
  // Dapatkan lokasi saat ini
  const location = useLocation();
  
  // Halaman yang tidak perlu header/footer
  const authPages = ['/login', '/register'];
  const showHeaderFooter = !authPages.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header hanya muncul di halaman selain login/register */}
      {showHeaderFooter && <Header />}
      
      <main className="flex-grow">
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          
          <Route 
            path="/login" 
            element={isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          
          <Route 
            path="/register" 
            element={isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Register />}
          />
          
          <Route 
            path="/dashboard" 
            element={isLoggedIn() ? <Dashboard /> : <Navigate to="/login" replace />}
          />
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      
      {/* Footer hanya muncul di halaman selain login/register */}
      {showHeaderFooter && <Footer />}
    </div>
  );
}

export default App;