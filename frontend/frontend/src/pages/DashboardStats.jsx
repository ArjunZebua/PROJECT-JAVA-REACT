/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Award, DollarSign, TrendingUp, Activity, 
  RefreshCw, Calendar, BarChart3, PieChart, ArrowUpRight, ArrowDownRight,
  Eye, Clock, CheckCircle, XCircle, ChevronRight, Download, Filter,
  MoreHorizontal, Sparkles, Target, Zap, Star, Crown, Rocket
} from 'lucide-react';
import { useDarkMode } from "../components/DarkModeContext";

const DashboardStats = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const { isDarkMode } = useDarkMode();

  const API_BASE = "http://localhost:8080/api/admin";

  const apiCall = async (url, options = {}) => {
    const token = sessionStorage.getItem("token");

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      const response = await fetch(`${API_BASE}${url}`, {
        method: options.method || "GET",
        headers: { ...defaultHeaders, ...options.headers },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.error("Unauthorized or forbidden, redirecting to login...");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  };

  // Load dashboard stats
  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiCall('/dashboard/stats');
      setStats(data);
    } catch (error) {
      setError('Gagal memuat statistik dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Format number with K, M suffix
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  useEffect(() => {
    loadStats();
  }, [selectedPeriod]);

  // Data dummy untuk grafik dan chart (akan diganti dengan data real)
  const chartData = {
    revenue: [30, 40, 35, 50, 49, 60, 70, 91, 125, 85, 95, 120],
    users: [15, 22, 18, 25, 30, 28, 35, 40, 36, 42, 48, 55],
    courses: [5, 8, 6, 9, 10, 12, 15, 14, 16, 18, 20, 22]
  };

  const topCourses = [
    { name: 'Web Development Mastery', enrollments: 1250, revenue: 18500, rating: 4.9 },
    { name: 'Data Science Fundamentals', enrollments: 980, revenue: 15200, rating: 4.8 },
    { name: 'UI/UX Design Pro', enrollments: 875, revenue: 13200000, rating: 4.7 },
    { name: 'Digital Marketing Strategy', enrollments: 756, revenue: 11500, rating: 4.6 },
    { name: 'Mobile App Development', enrollments: 632, revenue: 980, rating: 4.5 }
  ];

  const recentActivities = [
    { user: 'Ahmad Rizki', action: 'mendaftar kursus', course: 'Web Development', time: '2 menit lalu' },
    { user: 'Siti Rahayu', action: 'menyelesaikan modul', course: 'Data Science', time: '15 menit lalu' },
    { user: 'Budi Santoso', action: 'membuat kursus baru', course: 'Python untuk Pemula', time: '1 jam lalu' },
    { user: 'Dewi Anggraini', action: 'mendapatkan sertifikat', course: 'UI/UX Design', time: '2 jam lalu' },
    { user: 'Rizky Pratama', action: 'memberikan rating', course: 'Digital Marketing', time: '3 jam lalu' }
  ];

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers || 12458,
      icon: Users,
      color: 'blue',
      growth: '+12.5%',
      isPositive: true,
      trend: 'up'
    },
    {
      title: 'Total Kursus',
      value: stats.totalCourses || 356,
      icon: BookOpen,
      color: 'green',
      growth: '+8.2%',
      isPositive: true,
      trend: 'up'
    },
    {
      title: 'Total Pendaftaran',
      value: stats.totalEnrollments || 285,
      icon: Award,
      color: 'purple',
      growth: '+15.7%',
      isPositive: true,
      trend: 'up'
    },
    {
      title: 'Revenue Bulanan',
      value: stats.monthlyRevenue || 185000,
      icon: DollarSign,
      color: 'yellow',
      growth: '+22.4%',
      isPositive: true,
      isCurrency: true,
      trend: 'up'
    }
  ];

  // Kelas untuk mode gelap
  const darkModeClasses = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    card: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    input: isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-white focus:ring-indigo-500 focus:border-indigo-500' 
      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500',
    button: isDarkMode 
      ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
      : 'bg-indigo-600 hover:bg-indigo-700 text-white',
    error: isDarkMode 
      ? 'bg-red-900/20 border-red-800 text-red-300' 
      : 'bg-red-50 border-red-400 text-red-700'
  };

  // Komponen Chart sederhana (bisa diganti dengan library seperti Chart.js atau Recharts)
  const SimpleBarChart = ({ data, color, height = 100 }) => {
    const maxValue = Math.max(...data);
    
    return (
      <div className={`flex items-end justify-between h-[${height}px] pt-4`}>
        {data.map((value, index) => (
          <div key={index} className="flex flex-col items-center flex-1 mx-1">
            <div
              className={`w-full rounded-t-md ${color}`}
              style={{ height: `${(value / maxValue) * 80}px` }}
            ></div>
            <span className={`text-xs mt-1 ${darkModeClasses.textSecondary}`}>{index + 1}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`min-h-screen p-6 ${darkModeClasses.bg}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className={`text-3xl font-bold ${darkModeClasses.text} mb-2`}>Dashboard Analytics</h1>
          <p className={darkModeClasses.textSecondary}>Pantau performa platform secara real-time</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`relative rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} border ${darkModeClasses.border}`}>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className={`pl-10 pr-8 py-2.5 rounded-lg focus:outline-none appearance-none bg-transparent ${darkModeClasses.text}`}
            >
              <option value="week">Minggu Ini</option>
              <option value="month">Bulan Ini</option>
              <option value="quarter">Kuartal Ini</option>
              <option value="year">Tahun Ini</option>
            </select>
          </div>
          <button
            onClick={loadStats}
            disabled={loading}
            className={`px-4 py-2.5 rounded-lg transition-colors flex items-center disabled:opacity-50 ${darkModeClasses.button}`}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className={`p-2.5 rounded-lg border ${darkModeClasses.border} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Error Notification */}
      {error && (
        <div className={`mb-6 border-l-4 p-4 ${darkModeClasses.error}`}>
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: isDarkMode 
              ? 'from-blue-900/30 to-blue-800/30 text-blue-300' 
              : 'from-blue-100 to-blue-200 text-blue-600',
            green: isDarkMode 
              ? 'from-green-900/30 to-green-800/30 text-green-300' 
              : 'from-green-100 to-green-200 text-green-600',
            purple: isDarkMode 
              ? 'from-purple-900/30 to-purple-800/30 text-purple-300' 
              : 'from-purple-100 to-purple-200 text-purple-600',
            yellow: isDarkMode 
              ? 'from-yellow-900/30 to-yellow-800/30 text-yellow-300' 
              : 'from-yellow-100 to-yellow-200 text-yellow-600'
          };

          const trendIcon = stat.trend === 'up' ? 
            <ArrowUpRight className="w-4 h-4 mr-1" /> : 
            <ArrowDownRight className="w-4 h-4 mr-1" />;

          return (
            <div key={index} className={`rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 ${darkModeClasses.card} border ${darkModeClasses.border} shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[stat.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center text-xs font-medium ${
                  stat.isPositive ? 'text-green-500' : 'text-red-500'
                }`}>
                  {trendIcon}
                  {stat.growth}
                </div>
              </div>
              <div>
                <p className={`text-sm font-medium mb-1 ${darkModeClasses.textSecondary}`}>{stat.title}</p>
                <p className={`text-2xl font-bold mb-2 ${darkModeClasses.text}`}>
                  {stat.isCurrency ? formatCurrency(stat.value) : formatNumber(stat.value)}
                </p>
                <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-2 rounded-full ${
                      stat.color === 'blue' ? 'bg-blue-500' :
                      stat.color === 'green' ? 'bg-green-500' :
                      stat.color === 'purple' ? 'bg-purple-500' : 'bg-yellow-500'
                    }`} 
                    style={{width: `${stat.isPositive ? '75%' : '40%'}`}}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className={`rounded-xl p-6 ${darkModeClasses.card} border ${darkModeClasses.border} lg:col-span-2`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${darkModeClasses.text}`}>Revenue Trends</h3>
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${darkModeClasses.textSecondary}`}>2023</span>
              <div className={`p-1 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="flex items-end mb-4">
            <h4 className={`text-2xl font-bold ${darkModeClasses.text}`}>{formatCurrency(185000000)}</h4>
            <span className="ml-2 text-sm text-green-500 flex items-center">
              <ArrowUpRight className="w-4 h-4 mr-1" /> 22.4%
            </span>
          </div>
          <SimpleBarChart 
            data={chartData.revenue} 
            color={isDarkMode ? 'bg-blue-500' : 'bg-blue-400'} 
            height={150}
          />
        </div>

        {/* User Acquisition */}
        <div className={`rounded-xl p-6 ${darkModeClasses.card} border ${darkModeClasses.border}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${darkModeClasses.text}`}>User Acquisition</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-end mb-4">
            <h4 className={`text-2xl font-bold ${darkModeClasses.text}`}>+1,245</h4>
            <span className="ml-2 text-sm text-green-500 flex items-center">
              <ArrowUpRight className="w-4 h-4 mr-1" /> 12.5%
            </span>
          </div>
          <SimpleBarChart 
            data={chartData.users} 
            color={isDarkMode ? 'bg-green-500' : 'bg-green-400'} 
            height={150}
          />
        </div>
      </div>

      {/* Courses & Activities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Top Courses */}
        <div className={`rounded-xl p-6 ${darkModeClasses.card} border ${darkModeClasses.border} lg:col-span-2`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${darkModeClasses.text}`}>Top Performing Courses</h3>
            <div className="flex items-center text-sm text-indigo-500 cursor-pointer">
              <span>View all</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-4">
            {topCourses.map((course, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700">
                <div className="flex items-center">
                  <div className={`p-2 rounded-md mr-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`font-medium ${darkModeClasses.text}`}>{course.name}</h4>
                    <div className="flex items-center mt-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                      <span className="text-xs text-gray-500">{course.rating}</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{formatNumber(course.enrollments)} enrollments</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${darkModeClasses.text}`}>{formatCurrency(course.revenue)}</p>
                  <div className="flex items-center justify-end mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                    <span className="text-xs text-gray-500">Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className={`rounded-xl p-6 ${darkModeClasses.card} border ${darkModeClasses.border}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${darkModeClasses.text}`}>Recent Activities</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className={`p-2 rounded-full mr-3 mt-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Zap className="w-3 h-3" />
                </div>
                <div>
                  <p className={darkModeClasses.text}>
                    <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">"{activity.course}"</span>
                  </p>
                  <p className={`text-xs ${darkModeClasses.textSecondary} mt-1`}>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className={`rounded-xl p-6 mb-6 ${darkModeClasses.card} border ${darkModeClasses.border}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${darkModeClasses.text}`}>Platform Performance</h3>
          <div className={`flex items-center space-x-2 text-sm ${darkModeClasses.textSecondary}`}>
            <Calendar className="w-4 h-4" />
            <span>Periode: {selectedPeriod === 'week' ? 'Minggu Ini' : 
                           selectedPeriod === 'month' ? 'Bulan Ini' : 
                           selectedPeriod === 'quarter' ? 'Kuartal Ini' : 'Tahun Ini'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* User Growth */}
          <div className={`text-center p-4 rounded-lg border ${darkModeClasses.border}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-100'}`}>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className={`font-semibold mb-2 ${darkModeClasses.text}`}>Pertumbuhan User</h4>
            <p className="text-3xl font-bold text-blue-600 mb-2">+{stats.newUsersThisMonth || 1245}</p>
            <p className={`text-sm ${darkModeClasses.textSecondary}`}>User baru {selectedPeriod === 'week' ? 'minggu ini' : 'bulan ini'}</p>
          </div>

          {/* Course Completion */}
          <div className={`text-center p-4 rounded-lg border ${darkModeClasses.border}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-green-900/20' : 'bg-green-100'}`}>
              <Award className="w-8 h-8 text-green-600" />
            </div>
            <h4 className={`font-semibold mb-2 ${darkModeClasses.text}`}>Tingkat Penyelesaian</h4>
            <p className="text-3xl font-bold text-green-600 mb-2">78%</p>
            <p className={`text-sm ${darkModeClasses.textSecondary}`}>Rata-rata penyelesaian kursus</p>
          </div>

          {/* Engagement Rate */}
          <div className={`text-center p-4 rounded-lg border ${darkModeClasses.border}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-purple-900/20' : 'bg-purple-100'}`}>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className={`font-semibold mb-2 ${darkModeClasses.text}`}>Tingkat Engagement</h4>
            <p className="text-3xl font-bold text-purple-600 mb-2">62%</p>
            <p className={`text-sm ${darkModeClasses.textSecondary}`}>Interaksi pengguna aktif</p>
          </div>

          {/* Revenue Growth */}
          <div className={`text-center p-4 rounded-lg border ${darkModeClasses.border}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-100'}`}>
              <TrendingUp className="w-8 h-8 text-yellow-600" />
            </div>
            <h4 className={`font-semibold mb-2 ${darkModeClasses.text}`}>Pertumbuhan Revenue</h4>
            <p className="text-3xl font-bold text-yellow-600 mb-2">+22.5%</p>
            <p className={`text-sm ${darkModeClasses.textSecondary}`}>Dibanding periode sebelumnya</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`rounded-xl p-6 ${darkModeClasses.card} border ${darkModeClasses.border}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkModeClasses.text}`}>Aksi Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className={`p-4 rounded-lg transition-all duration-300 hover:-translate-y-1 text-left border ${darkModeClasses.border} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
            <div className="flex items-center mb-2">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-3">
                <Users className="w-5 h-5" />
              </div>
              <span className={`font-medium ${darkModeClasses.text}`}>Kelola User</span>
            </div>
            <p className={`text-sm ${darkModeClasses.textSecondary}`}>Tambah atau edit user</p>
          </button>
          
          <button className={`p-4 rounded-lg transition-all duration-300 hover:-translate-y-1 text-left border ${darkModeClasses.border} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
            <div className="flex items-center mb-2">
              <div className="p-2 rounded-lg bg-green-100 text-green-600 mr-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className={`font-medium ${darkModeClasses.text}`}>Tambah Kursus</span>
            </div>
            <p className={`text-sm ${darkModeClasses.textSecondary}`}>Buat kursus baru</p>
          </button>
          
          <button className={`p-4 rounded-lg transition-all duration-300 hover:-translate-y-1 text-left border ${darkModeClasses.border} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
            <div className="flex items-center mb-2">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600 mr-3">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className={`font-medium ${darkModeClasses.text}`}>Lihat Analytics</span>
            </div>
            <p className={`text-sm ${darkModeClasses.textSecondary}`}>Detail laporan</p>
          </button>
          
          <button className={`p-4 rounded-lg transition-all duration-300 hover:-translate-y-1 text-left border ${darkModeClasses.border} ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
            <div className="flex items-center mb-2">
              <div className="p-2 rounded-lg bg-yellow-100 text-yellow-600 mr-3">
                <DollarSign className="w-5 h-5" />
              </div>
              <span className={`font-medium ${darkModeClasses.text}`}>Kelola Pembayaran</span>
            </div>
            <p className={`text-sm ${darkModeClasses.textSecondary}`}>Pantau transaksi</p>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
          <div className={`rounded-xl shadow-lg p-8 max-w-md ${darkModeClasses.card}`}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <h3 className={`text-lg font-medium mb-2 ${darkModeClasses.text}`}>Memuat Dashboard</h3>
              <p className={darkModeClasses.textSecondary}>Harap tunggu sebentar...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardStats;