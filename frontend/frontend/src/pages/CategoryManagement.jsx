// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, Search, RefreshCw, CheckCircle, XCircle, X } from 'lucide-react';

// const CategoryManagement = () => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // Form state
//   const [showModal, setShowModal] = useState(false);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [categoryForm, setCategoryForm] = useState({
//     name: '',
//     description: '',
//     isActive: true
//   });

//   // API base URL
//   const API_BASE = 'http://localhost:8080/api';

//   // API call helper
//   const apiCall = async (url, options = {}) => {
//     const token = sessionStorage.getItem('token');
//     const defaultOptions = {
//       headers: {
//         'Content-Type': 'application/json',
//         ...(token && { 'Authorization': `Bearer ${token}` })
//       }
//     };

//     try {
//       const response = await fetch(`${API_BASE}${url}`, { ...defaultOptions, ...options });
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//       return await response.json();
//     } catch (error) {
//       console.error('API call failed:', error);
//       throw error;
//     }
//   };

//   // Load categories
//   const loadCategories = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const data = await apiCall('/categories');
//       setCategories(data);
//     } catch (error) {
//       setError('Gagal memuat kategori');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create or update category
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       setError('');
      
//       if (editingCategory) {
//         await apiCall(`/categories/${editingCategory.id}`, {
//           method: 'PUT',
//           body: JSON.stringify(categoryForm)
//         });
//         setSuccess('Kategori berhasil diperbarui');
//       } else {
//         await apiCall('/categories', {
//           method: 'POST',
//           body: JSON.stringify(categoryForm)
//         });
//         setSuccess('Kategori berhasil ditambahkan');
//       }
      
//       resetForm();
//       loadCategories();
//     } catch (error) {
//       setError('Gagal menyimpan kategori');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete category
//   const handleDelete = async (id) => {
//     if (!window.confirm('Yakin ingin menghapus kategori ini?')) return;
    
//     try {
//       setLoading(true);
//       setError('');
//       await apiCall(`/categories/${id}`, { method: 'DELETE' });
//       setSuccess('Kategori berhasil dihapus');
//       loadCategories();
//     } catch (error) {
//       setError('Gagal menghapus kategori');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setCategoryForm({ name: '', description: '', isActive: true });
//     setEditingCategory(null);
//     setShowModal(false);
//   };

//   // Edit category
//   const handleEdit = (category) => {
//     setCategoryForm({
//       name: category.name,
//       description: category.description || '',
//       isActive: category.isActive
//     });
//     setEditingCategory(category);
//     setShowModal(true);
//   };

//   // Filter categories based on search
//   const filteredCategories = categories.filter(category =>
//     category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   useEffect(() => {
//     loadCategories();
//   }, []);

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Kelola Kategori</h2>
//           <p className="text-gray-600">Kelola kategori kursus yang tersedia di platform</p>
//         </div>
//         <button
//           onClick={() => {
//             resetForm();
//             setShowModal(true);
//           }}
//           className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
//         >
//           <Plus className="w-4 h-4 mr-2" />
//           Tambah Kategori
//         </button>
//       </div>

//       {/* Notifications */}
//       {error && (
//         <div className="bg-red-50 border-l-4 border-red-400 p-4">
//           <div className="flex justify-between">
//             <div className="flex">
//               <XCircle className="h-5 w-5 text-red-400" />
//               <p className="ml-3 text-sm text-red-700">{error}</p>
//             </div>
//             <button onClick={() => setError('')} className="text-red-400 hover:text-red-500">
//               <X className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
//       )}

//       {success && (
//         <div className="bg-green-50 border-l-4 border-green-400 p-4">
//           <div className="flex justify-between">
//             <div className="flex">
//               <CheckCircle className="h-5 w-5 text-green-400" />
//               <p className="ml-3 text-sm text-green-700">{success}</p>
//             </div>
//             <button onClick={() => setSuccess('')} className="text-green-400 hover:text-green-500">
//               <X className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Search and Actions */}
//       <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Cari kategori..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//           </div>
//           <button
//             onClick={loadCategories}
//             disabled={loading}
//             className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center disabled:opacity-50"
//           >
//             <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* Categories Grid */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//         <div className="p-6">
//           {loading && categories.length === 0 ? (
//             <div className="text-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
//               <p className="mt-2 text-gray-500">Memuat kategori...</p>
//             </div>
//           ) : filteredCategories.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-gray-500">
//                 {searchTerm ? 'Tidak ada kategori yang sesuai dengan pencarian' : 'Belum ada kategori'}
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredCategories.map((category) => (
//                 <div key={category.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                   <div className="flex items-center justify-between mb-3">
//                     <h3 className="font-semibold text-gray-900 truncate">{category.name}</h3>
//                     <div className="flex items-center space-x-2">
//                       <button
//                         onClick={() => handleEdit(category)}
//                         className="text-indigo-600 hover:text-indigo-700 p-1 rounded hover:bg-indigo-50"
//                         title="Edit kategori"
//                       >
//                         <Edit className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(category.id)}
//                         className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
//                         title="Hapus kategori"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
                  
//                   {category.description && (
//                     <p className="text-sm text-gray-600 mb-3 line-clamp-2">{category.description}</p>
//                   )}
                  
//                   <div className="flex items-center justify-between">
//                     <span className={`px-2 py-1 text-xs rounded-full ${
//                       category.isActive 
//                         ? 'text-green-800' 
//                         : 'text-red-800'
//                     }`}>
//                       {/* {category.isActive ? 'Aktif' : 'Nonaktif'} */}
//                     </span>
//                     <span className="text-xs text-gray-500">ID: {category.id}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl w-full max-w-md">
//             <div className="p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">
//                 {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
//               </h3>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Nama Kategori *
//                   </label>
//                   <input
//                     type="text"
//                     value={categoryForm.name}
//                     onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     placeholder="Masukkan nama kategori"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Deskripsi
//                   </label>
//                   <textarea
//                     value={categoryForm.description}
//                     onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     placeholder="Deskripsi kategori (opsional)"
//                     rows="3"
//                   />
//                 </div>
                
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="isActive"
//                     checked={categoryForm.isActive}
//                     onChange={(e) => setCategoryForm({...categoryForm, isActive: e.target.checked})}
//                     className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                   />
//                   <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
//                     Kategori aktif
//                   </label>
//                 </div>
                
//                 <div className="flex justify-end space-x-3 pt-4">
                  
//                   <button
//                     type="button"
//                     onClick={resetForm}
//                     className="px-4 py-2 text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
//                   >
//                     Batal
//                   </button>
//                   <button
//                     onClick={handleSubmit}
//                     disabled={loading || !categoryForm.name.trim()}
//                     className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center"
//                   >
//                     {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
//                     {loading ? 'Menyimpan...' : 'Simpan'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CategoryManagement;


/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, RefreshCw, CheckCircle, XCircle, X } from 'lucide-react';
import { useDarkMode } from "../components/DarkModeContext";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    isActive: true
  });

  // Dark mode context
  const { isDarkMode } = useDarkMode();

  // API base URL
  const API_BASE = 'http://localhost:8080/api';

  // API call helper
  const apiCall = async (url, options = {}) => {
    const token = sessionStorage.getItem('token');
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    try {
      const response = await fetch(`${API_BASE}${url}`, { ...defaultOptions, ...options });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  // Load categories
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiCall('/categories');
      setCategories(data);
    } catch (error) {
      setError('Gagal memuat kategori');
    } finally {
      setLoading(false);
    }
  };

  // Create or update category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      if (editingCategory) {
        await apiCall(`/categories/${editingCategory.id}`, {
          method: 'PUT',
          body: JSON.stringify(categoryForm)
        });
        setSuccess('Kategori berhasil diperbarui');
      } else {
        await apiCall('/categories', {
          method: 'POST',
          body: JSON.stringify(categoryForm)
        });
        setSuccess('Kategori berhasil ditambahkan');
      }
      
      resetForm();
      loadCategories();
    } catch (error) {
      setError('Gagal menyimpan kategori');
    } finally {
      setLoading(false);
    }
  };

  // Delete category
const handleDelete = async (id) => {
  if (!window.confirm(`Yakin ingin menghapus kategori ini? ${id}`)) return;

  try {
    const response = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('Category deleted successfully!');
      loadCategories(); 
    } else {
      alert('Failed to delete category');
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    alert('Failed to delete category');
  }
};

  // Reset form
  const resetForm = () => {
    setCategoryForm({ name: '', description: '', isActive: true });
    setEditingCategory(null);
    setShowModal(false);
  };

  // Edit category
  const handleEdit = (category) => {
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive
    });
    setEditingCategory(category);
    setShowModal(true);
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    loadCategories();
  }, []);

  // Classes for dark mode
  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondaryClass = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-100';
  const cardBgClass = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const inputBgClass = isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300';
  const buttonSecondaryClass = isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200';

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold ${textClass}`}>Kelola Kategori</h2>
            <p className={textSecondaryClass}>Kelola kategori kursus yang tersedia di platform</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kategori
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className={`${isDarkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-400'} border-l-4 p-4`}>
            <div className="flex justify-between">
              <div className="flex">
                <XCircle className="h-5 w-5 text-red-400" />
                <p className={`ml-3 text-sm ${isDarkMode ? 'text-red-200' : 'text-red-700'}`}>{error}</p>
              </div>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-500">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className={`${isDarkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-400'} border-l-4 p-4`}>
            <div className="flex justify-between">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <p className={`ml-3 text-sm ${isDarkMode ? 'text-green-200' : 'text-green-700'}`}>{success}</p>
              </div>
              <button onClick={() => setSuccess('')} className="text-green-400 hover:text-green-500">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Search and Actions */}
        <div className={`${cardBgClass} rounded-xl shadow-sm p-4 border ${borderClass}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari kategori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputBgClass}`}
                />
              </div>
            </div>
            <button
              onClick={loadCategories}
              disabled={loading}
              className={`${buttonSecondaryClass} px-4 py-2 rounded-lg transition-colors flex items-center disabled:opacity-50`}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className={`${cardBgClass} rounded-xl shadow-sm border ${borderClass}`}>
          <div className="p-6">
            {loading && categories.length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className={`mt-2 ${textSecondaryClass}`}>Memuat kategori...</p>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-8">
                <p className={textSecondaryClass}>
                  {searchTerm ? 'Tidak ada kategori yang sesuai dengan pencarian' : 'Belum ada kategori'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCategories.map((category) => (
                  <div key={category.id} className={`border ${isDarkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'} rounded-lg p-4 transition-all`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`font-semibold truncate ${textClass}`}>{category.name}</h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className={`text-indigo-600 hover:text-indigo-700 p-1 rounded ${isDarkMode ? 'hover:bg-indigo-900' : 'hover:bg-indigo-50'}`}
                          title="Edit kategori"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className={`text-red-600 hover:text-red-700 p-1 rounded ${isDarkMode ? 'hover:bg-red-900' : 'hover:bg-red-50'}`}
                          title="Hapus kategori"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {category.description && (
                      <p className={`text-sm mb-3 line-clamp-2 ${textSecondaryClass}`}>{category.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        category.isActive 
                          ? (isDarkMode ? 'text-green-300 bg-green-900' : 'text-green-800 bg-green-100') 
                          : (isDarkMode ? 'text-red-300 bg-red-900' : 'text-red-800 bg-red-100')
                      }`}>
                        {category.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                      <span className={`text-xs ${textSecondaryClass}`}>ID: {category.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${cardBgClass} rounded-xl w-full max-w-md`}>
              <div className="p-6">
                <h3 className={`text-lg font-semibold mb-4 ${textClass}`}>
                  {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textClass}`}>
                      Nama Kategori *
                    </label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputBgClass}`}
                      placeholder="Masukkan nama kategori"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${textClass}`}>
                      Deskripsi
                    </label>
                    <textarea
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${inputBgClass}`}
                      placeholder="Deskripsi kategori (opsional)"
                      rows="3"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={categoryForm.isActive}
                      onChange={(e) => setCategoryForm({...categoryForm, isActive: e.target.checked})}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className={`ml-2 text-sm font-medium ${textClass}`}>
                      Kategori aktif
                    </label>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className={`px-4 py-2 border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'} rounded-lg`}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !categoryForm.name.trim()}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                    >
                      {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                      {loading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;