/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, Upload, BookOpen, Users, TrendingUp, DollarSign, Filter, X } from 'lucide-react';
import { useDarkMode } from "../components/DarkModeContext";

const CourseDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    categoryId: '',
    isActive: '',
    level: ''
  });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });
  const { isDarkMode } = useDarkMode();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    level: 'BEGINNER',
    duration: '',
    categoryId: '',
    isActive: true,
    imageFile: null
  });

  const API_BASE = 'http://localhost:8080/api';

  // Kelas untuk mode gelap
  const darkModeClasses = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    card: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    input: isDarkMode 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' 
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
    tableHeader: isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500',
    tableRow: isDarkMode ? 'bg-gray-800 hover:bg-gray-750 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200',
    button: isDarkMode 
      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
      : 'bg-blue-600 hover:bg-blue-700 text-white',
    buttonSecondary: isDarkMode 
      ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' 
      : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    debugPanel: isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800'
  };

  // Load initial data
  useEffect(() => {
    loadCourses();
    loadStats();
    loadCategories();
  }, []);

  // Load courses when filters change
  useEffect(() => {
    loadCourses();
  }, [pagination.page, pagination.size, filters, searchQuery]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      let url = `${API_BASE}/allCourses?page=${pagination.page}&size=${pagination.size}&sortBy=createdAt&sortDir=desc`;
      
      if (filters.categoryId) url += `&categoryId=${filters.categoryId}`;
      if (filters.isActive !== '') url += `&isActive=${filters.isActive}`;
      if (filters.level) url += `&level=${filters.level}`;
      
      if (searchQuery) {
        url = `${API_BASE}/courses/search?query=${searchQuery}&page=${pagination.page}&size=${pagination.size}`;
      }

      console.log('Fetching courses from:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Courses data received:', data);
      
      // Handle Spring Boot Page format
      if (data.content) {
        // Transform the data to include proper category information
        const transformedCourses = data.content.map(course => {
          // Find the category from our loaded categories
          const category = categories.find(cat => cat.id === course.categoryId);
          
          return {
            ...course,
            id: course.id,
            isActive: course.isActive !== null ? course.isActive : true,
            category: category || { id: course.categoryId, name: `Category ${course.categoryId}` }
          };
        });
        
        setCourses(transformedCourses);
        setPagination(prev => ({
          ...prev,
          totalElements: data.totalElements || 0,
          totalPages: data.totalPages || 0
        }));
      } else {
        setCourses([]);
        console.warn('Unexpected data format:', data);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      setCourses([]);
      alert('Failed to load courses. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/courses/stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats({
        totalCourses: 0,
        activeCourses: 0,
        totalEnrollments: 0,
        totalRevenue: 0
      });
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/categories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Categories loaded:', data);
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback to mock data if API fails
      setCategories([
        { id: 1, name: 'Java' },
        { id: 2, name: 'C#' },
        { id: 3, name: 'Basis Data' },
        { id: 4, name: 'algoritma' }
      ]);
    }
  };

  const handleCreateCourse = async () => {
    try {
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      formDataObj.append('price', formData.price);
      formDataObj.append('level', formData.level);
      formDataObj.append('duration', formData.duration.toString());
      formDataObj.append('isActive', formData.isActive.toString());
      formDataObj.append('categoryId', formData.categoryId);
      if (formData.imageFile) {
        formDataObj.append('image', formData.imageFile);
      }

      console.log('Creating course with data:', {
        title: formData.title,
        categoryId: formData.categoryId,
        level: formData.level
      });

      const response = await fetch(`${API_BASE}/courses/upload`, {
        method: 'POST',
        body: formDataObj
      });

      const result = await response.json();
      console.log('Create course response:', result);
      
      if (result.success) {
        setShowModal(false);
        resetForm();
        loadCourses();
        alert('Course created successfully!');
      } else {
        alert(result.message || 'Failed to create course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course');
    }
  };

  const handleUpdateCourse = async () => {
    if (!selectedCourse) return;

    try {
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      formDataObj.append('price', formData.price);
      formDataObj.append('level', formData.level);
      formDataObj.append('duration', formData.duration.toString());
      formDataObj.append('isActive', formData.isActive.toString());
      formDataObj.append('categoryId', formData.categoryId);
      if (formData.imageFile) {
        formDataObj.append('image', formData.imageFile);
      }

      const response = await fetch(`${API_BASE}/courses/${selectedCourse.id}/upload`, {
        method: 'PUT',
        body: formDataObj
      });

      const result = await response.json();
      if (result.success) {
        setShowModal(false);
        resetForm();
        loadCourses();
        alert('Course updated successfully!');
      } else {
        alert(result.message || 'Failed to update course');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm(`Are you sure you want to delete this course? ${courseId}`)) return;
    
    try {
      const response = await fetch(`${API_BASE}/courses/${courseId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        loadCourses();
        alert('Course deleted successfully!');
      } else {
        alert(result.message || 'Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  const handleToggleStatus = async (courseId) => {
    try {
      const response = await fetch(`${API_BASE}/courses/${courseId}/status`, {
        method: 'PATCH'
      });

      const result = await response.json();
      if (result.success) {
        loadCourses();
        alert('Course status updated!');
      } else {
        alert(result.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const openModal = (type, course = null) => {
    setModalType(type);
    setSelectedCourse(course);
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        price: course.price || '',
        level: course.level || 'BEGINNER',
        duration: course.duration || '',
        categoryId: course.category?.id || course.categoryId || '',
        isActive: course.isActive !== undefined ? course.isActive : true,
        imageFile: null
      });
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        level: 'BEGINNER',
        duration: '',
        categoryId: '',
        isActive: true,
        imageFile: null
      });
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      level: 'BEGINNER',
      duration: '',
      categoryId: '',
      isActive: true,
      imageFile: null
    });
    setSelectedCourse(null);
  };

  const formatPrice = (price) => {
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice === 0) {
      return 'Free';
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numPrice);
  };

  // Re-load courses when categories change to update category names
  useEffect(() => {
    if (categories.length > 0) {
      loadCourses();
    }
  }, [categories]);

  return (
    <div className={`min-h-screen ${darkModeClasses.bg}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className={`text-3xl font-bold ${darkModeClasses.text}`}>Course Management</h1>
              <p className={darkModeClasses.textSecondary}>Manage your online courses</p>
            </div>
            <button
              onClick={() => openModal('create')}
              className={`inline-flex items-center px-4 py-2 font-medium rounded-lg transition-colors ${darkModeClasses.button}`}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Course
            </button>
          </div>
        </div>
      </div>

      {/* Debug Panel - Remove this in production */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className={`p-4 rounded-lg text-sm ${darkModeClasses.debugPanel}`}>
          <p><strong>Debug Info:</strong></p>
          <p>API Base: {API_BASE}</p>
          <p>Courses Count: {courses.length}</p>
          <p>Categories Count: {categories.length}</p>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Current Page: {pagination.page}</p>
          <p>Total Elements: {pagination.totalElements}</p>
          <button 
            onClick={() => {
              console.log('Current courses:', courses);
              console.log('Current categories:', categories);
              loadCourses();
              loadCategories();
            }}
            className={`mt-2 px-3 py-1 rounded text-xs ${darkModeClasses.buttonSecondary}`}
          >
            Reload Data & Log
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`rounded-xl shadow-sm p-6 ${darkModeClasses.card}`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-100'}`}>
                <BookOpen className={`w-6 h-6 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${darkModeClasses.textSecondary}`}>Total Courses</p>
                <p className={`text-2xl font-bold ${darkModeClasses.text}`}>{stats.totalCourses || 0}</p>
              </div>
            </div>
          </div>

          <div className={`rounded-xl shadow-sm p-6 ${darkModeClasses.card}`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-green-900/20' : 'bg-green-100'}`}>
                <TrendingUp className={`w-6 h-6 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`} />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${darkModeClasses.textSecondary}`}>Active Courses</p>
                <p className={`text-2xl font-bold ${darkModeClasses.text}`}>{stats.activeCourses || 0}</p>
              </div>
            </div>
          </div>

          <div className={`rounded-xl shadow-sm p-6 ${darkModeClasses.card}`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-900/20' : 'bg-purple-100'}`}>
                <Users className={`w-6 h-6 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${darkModeClasses.textSecondary}`}>Enrollments</p>
                <p className={`text-2xl font-bold ${darkModeClasses.text}`}>{stats.totalEnrollments || 0}</p>
              </div>
            </div>
          </div>

          <div className={`rounded-xl shadow-sm p-6 ${darkModeClasses.card}`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-100'}`}>
                <DollarSign className={`w-6 h-6 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`} />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${darkModeClasses.textSecondary}`}>Revenue</p>
                <p className={`text-2xl font-bold ${darkModeClasses.text}`}>{formatPrice(stats.totalRevenue || 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={`rounded-xl shadow-sm p-6 mb-6 ${darkModeClasses.card}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${darkModeClasses.input}`}
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={filters.categoryId}
                onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value }))}
                className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${darkModeClasses.input}`}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <select
                value={filters.isActive}
                onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value }))}
                className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${darkModeClasses.input}`}
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

              <select
                value={filters.level}
                onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
                className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${darkModeClasses.input}`}
              >
                <option value="">All Levels</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className={`rounded-xl shadow-sm overflow-hidden ${darkModeClasses.card}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={darkModeClasses.tableHeader}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {loading ? (
                  <tr className={darkModeClasses.tableRow}>
                    <td colSpan="6" className={`px-6 py-4 text-center ${darkModeClasses.textSecondary}`}>
                      Loading courses...
                    </td>
                  </tr>
                ) : courses.length === 0 ? (
                  <tr className={darkModeClasses.tableRow}>
                    <td colSpan="6" className={`px-6 py-4 text-center ${darkModeClasses.textSecondary}`}>
                      No courses found
                    </td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <tr key={course.id} className={darkModeClasses.tableRow}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {course.imageUrl ? (
                            <img 
                              src={course.imageUrl} 
                              alt={course.title}
                              className="h-12 w-12 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} style={{display: course.imageUrl ? 'none' : 'flex'}}>
                            <BookOpen className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                          </div>
                          <div className="ml-4">
                            <div className={`text-sm font-medium ${darkModeClasses.text}`}>{course.title}</div>
                            <div className={`text-sm ${darkModeClasses.textSecondary}`}>{course.category?.name || 'No Category'}</div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkModeClasses.text}`}>
                        {formatPrice(course.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          course.level === 'BEGINNER' ? (isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800') :
                          course.level === 'INTERMEDIATE' ? (isDarkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800') :
                          (isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800')
                        }`}>
                          {course.level}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkModeClasses.text}`}>
                        {course.duration} hours
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(course.id)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                            course.isActive 
                              ? (isDarkMode ? 'bg-green-900/30 text-green-300 hover:bg-green-900/50' : 'bg-green-100 text-green-800 hover:bg-green-200') 
                              : (isDarkMode ? 'bg-red-900/30 text-red-300 hover:bg-red-900/50' : 'bg-red-100 text-red-800 hover:bg-red-200')
                          }`}
                        >
                          {course.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal('edit', course)}
                            className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'} p-1 rounded`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'} p-1 rounded`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={`px-6 py-3 flex items-center justify-between border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex-1 flex justify-between items-center">
              <div>
                <p className={`text-sm ${darkModeClasses.textSecondary}`}>
                  Showing <span className="font-medium">{pagination.page * pagination.size + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)}
                  </span>{' '}
                  of <span className="font-medium">{pagination.totalElements}</span> results
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
                  disabled={pagination.page === 0}
                  className={`px-3 py-1 text-sm border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= pagination.totalPages - 1}
                  className={`px-3 py-1 text-sm border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${darkModeClasses.card}`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-semibold ${darkModeClasses.text}`}>
                  {modalType === 'create' ? 'Create New Course' : 'Edit Course'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className={darkModeClasses.textSecondary}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkModeClasses.text}`}>Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${darkModeClasses.input}`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkModeClasses.text}`}>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${darkModeClasses.input}`}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkModeClasses.text}`}>Price (IDR)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${darkModeClasses.input}`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkModeClasses.text}`}>Duration (hours)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${darkModeClasses.input}`}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkModeClasses.text}`}>Level</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${darkModeClasses.input}`}
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkModeClasses.text}`}>Category</label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${darkModeClasses.input}`}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkModeClasses.text}`}>Course Image</label>
                  <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                    <div className="space-y-1 text-center">
                      <Upload className={`mx-auto h-12 w-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <div className="flex text-sm">
                        <label className={`relative cursor-pointer rounded-md font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500`}>
                          <span>Upload a file</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFormData(prev => ({ ...prev, imageFile: e.target.files[0] }))}
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>PNG, JPG, GIF up to 2MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className={`h-4 w-4 text-blue-600 focus:ring-blue-500 rounded ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                  />
                  <label className={`ml-2 block text-sm ${darkModeClasses.text}`}>Active Course</label>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${darkModeClasses.buttonSecondary}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => modalType === 'create' ? handleCreateCourse() : handleUpdateCourse()}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${darkModeClasses.button}`}
                  >
                    {modalType === 'create' ? 'Create Course' : 'Update Course'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDashboard;