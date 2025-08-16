/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, Home, ArrowLeft, BarChart3, BookOpen, Bell, Search, Menu, X, Play, Clock, Award, Star, Users, Shield } from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from sessionStorage
    const userData = sessionStorage.getItem('user');
    const roleData = sessionStorage.getItem('userRole');
    
    if (userData) {
      const parsedUser = JSON.parse(userData);
      const role = roleData || parsedUser.role || 'user';
      
      // Set user data with defaults
      setUser({
        username: parsedUser.username || 'User',
        email: parsedUser.email || 'user@example.com',
        level: role === 'admin' ? 'Administrator' : 'Premium Member',
        role: role,
        coursesCompleted: role === 'admin' ? 15 : 5,
        totalCourses: role === 'admin' ? 25 : 12,
        studyHours: role === 'admin' ? 120 : 45
      });
      
      setUserRole(role);
    } else {
      // Redirect to login if no user data
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleBackToHome = () => {
    console.log('Back to home clicked');
    navigate('/');
  };

  // Different sidebar items based on role
  const getSidebarItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'courses', label: userRole === 'admin' ? 'Kelola Kursus' : 'Kursus Saya', icon: BookOpen },
      { id: 'progress', label: userRole === 'admin' ? 'Analytics' : 'Progress', icon: BarChart3 },
    ];

    if (userRole === 'admin') {
      return [
        ...baseItems,
        { id: 'users', label: 'Kelola User', icon: Users },
        { id: 'certificates', label: 'Kelola Sertifikat', icon: Award },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Pengaturan Sistem', icon: Settings },
      ];
    } else {
      return [
        ...baseItems,
        { id: 'certificates', label: 'Sertifikat', icon: Award },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Pengaturan', icon: Settings },
      ];
    }
  };

  const ongoingCourses = [
    {
      id: 1,
      title: 'React.js untuk Pemula',
      instructor: 'Dr. Budi Prakoso',
      progress: 75,
      totalLessons: 24,
      completedLessons: 18,
      nextLesson: 'State Management dengan Redux',
      category: 'Programming'
    },
    {
      id: 2,
      title: 'Digital Marketing Strategy',
      instructor: 'Sarah Wijaya',
      progress: 45,
      totalLessons: 16,
      completedLessons: 7,
      nextLesson: 'Social Media Analytics',
      category: 'Marketing'
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Andi Kurniawan',
      progress: 60,
      totalLessons: 20,
      completedLessons: 12,
      nextLesson: 'User Research Methods',
      category: 'Design'
    }
  ];

  const completedCourses = [
    {
      id: 4,
      title: 'HTML & CSS Basics',
      instructor: 'Lisa Permata',
      rating: 4.8,
      completedDate: '2024-07-15',
      certificate: true
    },
    {
      id: 5,
      title: 'JavaScript Fundamentals',
      instructor: 'Rudi Hermawan',
      rating: 4.9,
      completedDate: '2024-06-20',
      certificate: true
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Welcome Section with Role Badge */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    Selamat datang kembali, {user.username}!
                  </h2>
                  <p className="text-indigo-100 mb-4">
                    {userRole === 'admin' 
                      ? 'Kelola platform pembelajaran dan pantau aktivitas pengguna.'
                      : 'Lanjutkan perjalanan belajar Anda dan raih tujuan karir impian.'
                    }
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full ${
                  userRole === 'admin' 
                    ? 'bg-yellow-400 text-yellow-900' 
                    : 'bg-green-400 text-green-900'
                } font-semibold flex items-center`}>
                  {userRole === 'admin' ? (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Administrator
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 mr-2" />
                      Student
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  {user.coursesCompleted} {userRole === 'admin' ? 'Kursus Dikelola' : 'Kursus Selesai'}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {user.studyHours} {userRole === 'admin' ? 'Jam Online' : 'Jam Belajar'}
                </div>
                {userRole === 'admin' && (
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    142 Users Aktif
                  </div>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {userRole === 'admin' ? 'Total Kursus Platform' : 'Total Kursus'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{user.totalCourses}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {userRole === 'admin' ? 'Kursus Aktif' : 'Selesai'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{user.coursesCompleted}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-xl">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {userRole === 'admin' ? 'Jam Online' : 'Jam Belajar'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{user.studyHours}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {userRole === 'admin' ? 'Total Users' : 'Rating Rata-rata'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {userRole === 'admin' ? '142' : '4.8'}
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-xl">
                    {userRole === 'admin' ? (
                      <Users className="w-6 h-6 text-yellow-600" />
                    ) : (
                      <Star className="w-6 h-6 text-yellow-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Content Based on Role */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {userRole === 'admin' ? 'Aktivitas Terbaru Platform' : 'Kursus Berlangsung'}
                </h3>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  {userRole === 'admin' ? 'Lihat Semua Activity' : 'Lihat Semua'}
                </button>
              </div>

              {userRole === 'admin' ? (
                // Admin view - recent activities
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-lg mr-4">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">5 user baru mendaftar hari ini</p>
                      <p className="text-sm text-gray-600">Total registrasi minggu ini: 23 user</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-green-50 rounded-lg">
                    <div className="bg-green-100 p-2 rounded-lg mr-4">
                      <BookOpen className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">3 kursus baru dipublikasi</p>
                      <p className="text-sm text-gray-600">React Advanced, Python ML, Digital Marketing 2.0</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                    <div className="bg-yellow-100 p-2 rounded-lg mr-4">
                      <Award className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">28 sertifikat diterbitkan minggu ini</p>
                      <p className="text-sm text-gray-600">Rata-rata completion rate: 78%</p>
                    </div>
                  </div>
                </div>
              ) : (
                // User view - ongoing courses
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ongoingCourses.map((course) => (
                    <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                          {course.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {course.completedLessons}/{course.totalLessons} Pelajaran
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">oleh {course.instructor}</p>
                      
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600">Progress</span>
                          <span className="text-xs font-medium text-gray-900">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-3">
                        Selanjutnya: <span className="font-medium">{course.nextLesson}</span>
                      </p>
                      
                      <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center">
                        <Play className="w-4 h-4 mr-2" />
                        Lanjutkan Belajar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      // Add other cases for different tabs...
      default:
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {userRole === 'admin' ? `Admin ${activeTab}` : activeTab}
            </h2>
            <p className="text-gray-600">
              Konten untuk bagian {activeTab} {userRole === 'admin' ? '(Admin View)' : ''} akan ditampilkan di sini.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex-shrink-0">
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              {userRole === 'admin' ? 'AdminHub' : 'LearnHub'}
            </span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {getSidebarItems().map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center px-3 py-2 mb-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              userRole === 'admin' ? 'bg-yellow-100' : 'bg-indigo-100'
            }`}>
              {userRole === 'admin' ? (
                <Shield className="w-4 h-4 text-yellow-600" />
              ) : (
                <User className="w-4 h-4 text-indigo-600" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user.username}</p>
              <p className="text-xs text-gray-500">{user.level}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={handleBackToHome}
              className="w-full flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-3" />
              Kembali ke Home
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 capitalize">
                {activeTab === 'courses' ? (userRole === 'admin' ? 'Kelola Kursus' : 'Kursus Saya') : 
                 activeTab === 'progress' ? (userRole === 'admin' ? 'Analytics' : 'Progress Belajar') :
                 activeTab === 'certificates' ? (userRole === 'admin' ? 'Kelola Sertifikat' : 'Sertifikat') :
                 activeTab === 'profile' ? 'Profile' :
                 activeTab === 'settings' ? (userRole === 'admin' ? 'Pengaturan Sistem' : 'Pengaturan') :
                 activeTab === 'users' ? 'Kelola User' : 'Dashboard'}
              </h1>
              {userRole === 'admin' && (
                <span className="ml-3 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  Admin
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={userRole === 'admin' ? 'Cari users, kursus...' : 'Cari kursus...'}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;