// App.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";
import Header from "./components/Header";
import CategoryManagement from "./pages/CategoryManagement";
import CourseManagement from "./pages/CourseManagement";
import DashboardStats from "./pages/DashboardStats";
import MainDashboard from "./pages/MainDashboard";
import PaymentManagement from "./pages/PaymentManagement";
import UserManagement from "./pages/UserManagement";
import QuizApp from "./pages/Quiz";
import AboutPage from "./pages/About";




import UserDashboard from "./user/UserDashboard";

import { DarkModeProvider } from "./components/DarkModeContext";





function App() {
  const isLoggedIn = () => !!sessionStorage.getItem("token");
  const location = useLocation();

  // halaman tanpa header/footer
  const authPages = ["/login", "/register"];
  // Quiz juga bisa tanpa header/footer jika diinginkan sebagai fullscreen
  const quizPages = ["/quiz"];
  const showHeaderFooter = !authPages.includes(location.pathname) && !quizPages.includes(location.pathname);

  return (
    <DarkModeProvider>
    <div className="min-h-screen flex flex-col">
      {/* Header hanya muncul selain login/register/quiz */}
      {showHeaderFooter && <Header />}

      {/* ✅ tambahkan pt-16 supaya konten turun ke bawah header */}
      <main className={`flex-grow ${showHeaderFooter ? "pt-16" : ""}`}>
        <Routes>
          {/* Auth */}
          <Route
            path="/login"
            element={
              isLoggedIn() ? <Navigate to="/dashboard/main" replace /> : <Login />
            }
          />
          <Route
            path="/register"
            element={
              isLoggedIn() ? <Navigate to="/dashboard/main" replace /> : <Register />
            }
          />

          {/* Quiz - bisa diakses dengan atau tanpa login tergantung requirement */}
          <Route
            path="/quiz"
            element={<QuizApp />}
          />

          {/* Quiz dengan proteksi login (alternatif) */}
          <Route
            path="/quiz-protected"
            element={
              isLoggedIn() ? <QuizApp /> : <Navigate to="/login" replace />
            }
          />

          {/* Dashboard dengan nested route */}
          <Route
            path="/dashboard"
            element={
              isLoggedIn() ? <MainDashboard /> : <Navigate to="/login" replace />
            }
          >
            <Route index element={<Navigate to="main" replace />} />
            <Route path="main" element={<DashboardStats />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="payments" element={<PaymentManagement />} />
            <Route path="users" element={<UserManagement />} />
            {/* Quiz sebagai bagian dari dashboard */}
            <Route path="quiz" element={<QuizApp />} />
            <Route path="about" element={<AboutPage />} />

            


            <Route path="UserDashboard" element={<UserDashboard />} />

          </Route>

          {/* Root redirect */}
          <Route 
            path="/" 
            element={
              isLoggedIn() ? <Navigate to="/dashboard/main" replace /> : <Navigate to="/login" replace />
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      {showHeaderFooter && <Footer />}
    </div>
    </DarkModeProvider>
  );
}

export default App;