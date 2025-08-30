// /* eslint-disable no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState, useEffect, useMemo } from 'react';
// import { 
//   Users, Plus, Edit, Trash2, Search, Filter, RefreshCw, 
//   CheckCircle, XCircle, X, Eye, Shield, User, ChevronLeft, ChevronRight,
//   Mail, Calendar, ToggleLeft, ToggleRight
// } from 'lucide-react';
// import dayjs from "dayjs";

// const UserManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [userStats, setUserStats] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // Pagination and filters
//   const [filters, setFilters] = useState({
//     page: 0,
//     size: 10,
//     sortBy: 'id',
//     sortDir: 'asc'
//   });
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalElements, setTotalElements] = useState(0);

//   // Form state
//   const [showModal, setShowModal] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [userForm, setUserForm] = useState({
//     username: '',
//     email: '',
//     password: '',
//     firstName: '',
//     lastName: '',
//   });

//   // API base URL
//   const API_BASE = 'http://localhost:8080/api/users';

//   // API call helper
// const apiCall = async (url, options = {}) => {
//   const token = sessionStorage.getItem('token');
//   const defaultOptions = {
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token && { 'Authorization': `Bearer ${token}` })
//     }
//   };

//   try {
//     const response = await fetch(`${API_BASE}${url}`, { ...defaultOptions, ...options });
//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//     }
    
//     const data = await response.json();
    
//     // Filter hanya data yang active: true
//     if (data.content && Array.isArray(data.content)) {
//       data.content = data.content.filter(item => item.active === true);
//     }
    
//     return data;
//   } catch (error) {
//     console.error('API call failed:', error);
//     throw error;
//   }
// };
//   // Load users
//   const loadUsers = async () => {
//     try {
//       setLoading(true);
//       setError('');
      
//       const queryParams = new URLSearchParams({
//         page: filters.page.toString(),
//         size: filters.size.toString(),
//         sortBy: filters.sortBy,
//         sortDir: filters.sortDir,
//         ...(searchTerm && { search: searchTerm })
//       });
      
//       const data = await apiCall(`?${queryParams}`);
//       setUsers(data.content || []);
//       setTotalPages(data.totalPages || 0);
//       setTotalElements(data.totalElements || 0);
//     } catch (error) {
//       setError('Gagal memuat data user: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load user stats
//   const loadUserStats = async () => {
//     try {
//       const stats = await apiCall('/stats');
//       setUserStats(stats);
//     } catch (error) {
//       console.error('Gagal memuat statistik user:', error);
//     }
//   };

//   // Search users
//   const searchUsers = async () => {
//     if (!searchTerm.trim()) {
//       loadUsers();
//       return;
//     }

//     try {
//       setLoading(true);
//       setError('');
      
//       const queryParams = new URLSearchParams({
//         search: searchTerm,
//         page: '0',
//         size: filters.size.toString()
//       });
      
//       const data = await apiCall(`/search?${queryParams}`);
//       setUsers(data.content || []);
//       setTotalPages(data.totalPages || 0);
//       setTotalElements(data.totalElements || 0);
//     } catch (error) {
//       setError('Gagal mencari user: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const newUsersThisMonth = useMemo(() => {
//     if (!users || users.length === 0) return 0;

//     const now = dayjs();
//     return users.filter(user => dayjs(user.createdAt).isSame(now, "month")).length;
//   }, [users]);

//   // Create or update user
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       setError('');

//       const payload = {
//         username: userForm.username,
//         email: userForm.email,
//         firstName: userForm.firstName,
//         lastName: userForm.lastName,
//         // role: userForm.role,
//         // isActive: userForm.isActive
//       };

//       // Only include password if it's provided (for new users or when changing password)
//       if (userForm.password) {
//         payload.password = userForm.password;
//       }

//       if (editingUser) {
//         // Update existing user
//         const updatedUser = await apiCall(`/${editingUser.id}`, {
//           method: 'PUT',
//           body: JSON.stringify(payload)
//         });

//         setUsers(users.map(user =>
//           user.id === editingUser.id ? updatedUser : user
//         ));
//         setSuccess('User berhasil diperbarui');
//       } else {
//         // Create new user - password is required for new users
//         if (!userForm.password) {
//           setError('Password wajib diisi untuk user baru');
//           setLoading(false);
//           return;
//         }

//         const newUser = await apiCall('', {
//           method: 'POST',
//           body: JSON.stringify(payload)
//         });

//         setUsers([newUser, ...users]);
//         setSuccess('User berhasil ditambahkan');
//       }

//       resetForm();
//       loadUserStats();
//     } catch (error) {
//       setError('Gagal menyimpan user: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete user
//   const handleDelete = async (id) => {
//     if (!window.confirm('Yakin ingin menghapus user ini?')) return;
    
//     try {
//       setLoading(true);
//       setError('');
      
//       await apiCall(`/${id}`, {
//         method: 'DELETE'
//       });
      
//       setUsers(users.filter(user => user.id !== id));
//       setSuccess('User berhasil dihapus');
//       loadUserStats(); // Reload stats after changes
//     } catch (error) {
//       setError('Gagal menghapus user: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Toggle user status
//   const handleToggleStatus = async (id) => {
//     try {
//       setLoading(true);
//       setError('');
      
//       const userToUpdate = users.find(user => user.id === id);
//       const updatedUser = await apiCall(`/${id}/status`, {
//         method: 'PATCH',
//         body: JSON.stringify({ active: !userToUpdate.active })
//       });
      
//       setUsers(users.map(user => 
//         user.id === id ? updatedUser : user
//       ));
//       setSuccess('Status user berhasil diperbarui');
//     } catch (error) {
//       setError('Gagal mengubah status user: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Reset form
//   const resetForm = () => {
//     setUserForm({
//       username: '',
//       email: '',
//       password: '',
//       firstName: '',
//       lastName: '',
//       role: 'STUDENT',
//       isActive: true
//     });
//     setEditingUser(null);
//     setShowModal(false);
//   };

//   // Edit user
//   const handleEdit = (user) => {
//     setUserForm({
//       username: user.username || '',
//       email: user.email || '',
//       password: '', // Don't populate password for security
//       firstName: user.firstName || '',
//       lastName: user.lastName || '',
//       role: user.role || 'STUDENT',
//       isActive: user.active !== false
//     });
//     setEditingUser(user);
//     setShowModal(true);
//   };

//   // Handle filter changes
//   const handleFilterChange = (key, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [key]: value,
//       ...(key !== 'page' && { page: 0 })
//     }));
//   };

//   // Get role badge class
//   const getRoleBadgeClass = (role) => {
//     switch (role) {
//       case 'ADMIN':
//         return 'bg-red-100 text-red-800';
//       case 'INSTRUCTOR':
//         return 'bg-blue-100 text-blue-800';
//       case 'STUDENT':
//         return 'bg-green-100 text-green-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   // Get role icon
//   const getRoleIcon = (role) => {
//     switch (role) {
//       case 'ADMIN':
//         return <Shield className="w-4 h-4" />;
//       case 'INSTRUCTOR':
//         return <User className="w-4 h-4" />;
//       case 'STUDENT':
//         return <User className="w-4 h-4" />;
//       default:
//         return <User className="w-4 h-4" />;
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('id-ID', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setUserForm(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   // Load data on component mount and when filters change
//   useEffect(() => {
//     loadUsers();
//     loadUserStats();
//   }, [filters]);

//   // Search with debounce
//   useEffect(() => {
//     const delayedSearch = setTimeout(() => {
//       if (searchTerm) {
//         searchUsers();
//       } else {
//         loadUsers();
//       }
//     }, 500);

//     return () => clearTimeout(delayedSearch);
//   }, [searchTerm]);

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Kelola User</h2>
//           <p className="text-gray-600">Kelola pengguna platform pembelajaran</p>
//         </div>
//         <button
//           onClick={() => {
//             resetForm();
//             setShowModal(true);
//           }}
//           className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
//         >
//           <Plus className="w-4 h-4 mr-2" />
//           Tambah User
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

//       {/* User Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total User</p>
//               <p className="text-2xl font-bold text-gray-900">{totalElements || 0}</p>
//             </div>
//             <div className="bg-blue-100 p-3 rounded-xl">
//               <Users className="w-6 h-6 text-blue-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">User Aktif</p>
//               <p className="text-2xl font-bold text-green-600">
//                 {users ? users.filter(user => user.active).length : 0}
//               </p>
//             </div>
//             <div className="bg-green-100 p-3 rounded-xl">
//               <CheckCircle className="w-6 h-6 text-green-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">User Baru Bulan Ini</p>
//               <p className="text-2xl font-bold text-purple-600">{newUsersThisMonth || 0}</p>
//             </div>
//             <div className="bg-purple-100 p-3 rounded-xl">
//               <Calendar className="w-6 h-6 text-purple-600" />
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Instructor</p>
//               <p className="text-2xl font-bold text-yellow-600">
//                 {users ? users.filter(user => user.role === 'INSTRUCTOR').length : 0}
//               </p>
//             </div>
//             <div className="bg-yellow-100 p-3 rounded-xl">
//               <Shield className="w-6 h-6 text-yellow-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Search and Filters */}
//       <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Cari user..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
          
//           <div>
//             <select
//               value={filters.sortBy}
//               onChange={(e) => handleFilterChange('sortBy', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="id">Urutkan ID</option>
//               <option value="username">Username</option>
//               <option value="email">Email</option>
//               <option value="createdAt">Tanggal Daftar</option>
//             </select>
//           </div>

//           <div>
//             <select
//               value={filters.sortDir}
//               onChange={(e) => handleFilterChange('sortDir', e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="asc">A-Z / Lama-Baru</option>
//               <option value="desc">Z-A / Baru-Lama</option>
//             </select>
//           </div>

//           <div>
//             <select
//               value={filters.size}
//               onChange={(e) => handleFilterChange('size', parseInt(e.target.value))}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             >
//               <option value="10">10 per halaman</option>
//               <option value="25">25 per halaman</option>
//               <option value="50">50 per halaman</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Users Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Daftar</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {loading && users.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-8 text-center">
//                     <div className="flex items-center justify-center">
//                       <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mr-2"></div>
//                       Memuat data user...
//                     </div>
//                   </td>
//                 </tr>
//               ) : users.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
//                     {searchTerm ? 'Tidak ada user yang sesuai dengan pencarian' : 'Belum ada user'}
//                   </td>
//                 </tr>
//               ) : (
//                 users.map((user) => (
//                   <tr key={user.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
//                           <User className="w-5 h-5 text-gray-600" />
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{user.username}</div>
//                           <div className="text-sm text-gray-500">
//                             {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'N/A'}
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center text-sm text-gray-900">
//                         <Mail className="w-4 h-4 mr-2 text-gray-400" />
//                         {user.email}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getRoleBadgeClass(user.role)}`}>
//                         {getRoleIcon(user.role)}
//                         <span className="ml-1">{user.role}</span>
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <button
//                         onClick={() => handleToggleStatus(user.id)}
//                         className={`flex items-center ${user.active ? 'text-green-600' : 'text-red-600'}`}
//                       >
//                         {user.active ? (
//                           <>
//                             <ToggleRight className="w-5 h-5 mr-1" />
//                             <span className="text-xs font-medium">Aktif</span>
//                           </>
//                         ) : (
//                           <>
//                             <ToggleLeft className="w-5 h-5 mr-1" />
//                             <span className="text-xs font-medium">Nonaktif</span>
//                           </>
//                         )}
//                       </button>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {formatDate(user.createdAt)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex items-center space-x-2">
//                         <button
//                           onClick={() => alert(`Detail user ${user.username} akan ditampilkan`)}
//                           className="text-indigo-600 hover:text-indigo-700 p-1 rounded hover:bg-indigo-50"
//                           title="Lihat Detail"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleEdit(user)}
//                           className="text-green-600 hover:text-green-700 p-1 rounded hover:bg-green-50"
//                           title="Edit User"
//                         >
//                           <Edit className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(user.id)}
//                           className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
//                           title="Hapus User"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
//           <div className="flex-1 flex justify-between sm:hidden">
//             <button
//               onClick={() => handleFilterChange('page', Math.max(0, filters.page - 1))}
//               disabled={filters.page === 0}
//               className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Previous
//             </button>
//             <button
//               onClick={() => handleFilterChange('page', Math.min(totalPages - 1, filters.page + 1))}
//               disabled={filters.page >= totalPages - 1}
//               className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next
//             </button>
//           </div>
//           <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//             <div>
//               <p className="text-sm text-gray-700">
//                 Menampilkan{' '}
//                 <span className="font-medium">{filters.page * filters.size + 1}</span> sampai{' '}
//                 <span className="font-medium">
//                   {Math.min((filters.page + 1) * filters.size, totalElements)}
//                 </span> dari{' '}
//                 <span className="font-medium">{totalElements}</span> hasil
//               </p>
//             </div>
//             <div>
//               <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                 <button
//                   onClick={() => handleFilterChange('page', Math.max(0, filters.page - 1))}
//                   disabled={filters.page === 0}
//                   className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <ChevronLeft className="h-5 w-5" />
//                 </button>
                
//                 {/* Page numbers */}
//                 {[...Array(Math.min(5, totalPages))].map((_, i) => {
//                   const pageNum = Math.max(0, Math.min(totalPages - 5, filters.page - 2)) + i;
//                   if (pageNum >= totalPages) return null;
                  
//                   return (
//                     <button
//                       key={pageNum}
//                       onClick={() => handleFilterChange('page', pageNum)}
//                       className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                         pageNum === filters.page
//                           ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
//                           : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                       }`}
//                     >
//                       {pageNum + 1}
//                     </button>
//                   );
//                 })}

//                 <button
//                   onClick={() => handleFilterChange('page', Math.min(totalPages - 1, filters.page + 1))}
//                   disabled={filters.page >= totalPages - 1}
//                   className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <ChevronRight className="h-5 w-5" />
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* User Form Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-20 mx-auto p-5 border w-full max-w-md bg-white rounded-xl shadow-lg">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 {editingUser ? 'Edit User' : 'Tambah User Baru'}
//               </h3>
//               <button
//                 onClick={resetForm}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Username *
//                 </label>
//                 <input
//                   type="text"
//                   name="username"
//                   value={userForm.username}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Masukkan username"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Email *
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={userForm.email}
//                   onChange={handleInputChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Masukkan email"
//                 />
//               </div>

//               {!editingUser && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Password *
//                   </label>
//                   <input
//                     type="password"
//                     name="password"
//                     value={userForm.password}
//                     onChange={handleInputChange}
//                     required={!editingUser}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     placeholder="Masukkan password"
//                   />
//                 </div>
//               )}

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Nama Depan
//                   </label>
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={userForm.firstName}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     placeholder="Nama depan"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Nama Belakang
//                   </label>
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={userForm.lastName}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     placeholder="Nama belakang"
//                   />
//                 </div>
//               </div>

//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="isActive"
//                   id="isActive"
//                   checked={userForm.isActive}
//                   onChange={handleInputChange}
//                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
//                   User aktif
//                 </label>
//               </div>

//               <div className="flex justify-end space-x-3 pt-4 border-t">
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//                 >
//                   Batal
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                 >
//                   {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
//                   {editingUser ? 'Perbarui' : 'Simpan'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserManagement;




/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Plus, Edit, Trash2, Search, Filter, RefreshCw, 
  CheckCircle, XCircle, X, Eye, Shield, User, ChevronLeft, ChevronRight,
  Mail, Calendar, ToggleLeft, ToggleRight
} from 'lucide-react';
import dayjs from "dayjs";
import { useDarkMode } from "../components/DarkModeContext";

const UserManagement = () => {
  const { isDarkMode } = useDarkMode();
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination and filters
  const [filters, setFilters] = useState({
    page: 0,
    size: 10,
    sortBy: 'id',
    sortDir: 'asc'
  });
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Form state
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'STUDENT',
    isActive: true
  });
  const [formErrors, setFormErrors] = useState({});

  // API base URL
  const API_BASE = 'http://localhost:8080/api/users';

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
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      // For DELETE requests, there might be no content
      if (options.method === 'DELETE' && response.status === 204) {
        return {};
      }
      
      const data = await response.json();
      
      // Filter hanya data yang active: true
      if (data.content && Array.isArray(data.content)) {
        data.content = data.content.filter(item => item.active === true);
      }
      
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  // Validasi form
  const validateForm = () => {
    const errors = {};
    
    if (!userForm.username.trim()) {
      errors.username = 'Username wajib diisi';
    } else if (userForm.username.length < 3) {
      errors.username = 'Username minimal 3 karakter';
    }
    
    if (!userForm.email.trim()) {
      errors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(userForm.email)) {
      errors.email = 'Format email tidak valid';
    }
    
    if (!editingUser && !userForm.password) {
      errors.password = 'Password wajib diisi';
    } else if (!editingUser && userForm.password.length < 6) {
      errors.password = 'Password minimal 6 karakter';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        size: filters.size.toString(),
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
        ...(searchTerm && { search: searchTerm })
      });
      
      const data = await apiCall(`?${queryParams}`);
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      setError('Gagal memuat data user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load user stats
  const loadUserStats = async () => {
    try {
      const stats = await apiCall('/stats');
      setUserStats(stats);
    } catch (error) {
      console.error('Gagal memuat statistik user:', error);
    }
  };

  // Search users
  const searchUsers = async () => {
    if (!searchTerm.trim()) {
      loadUsers();
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams({
        search: searchTerm,
        page: '0',
        size: filters.size.toString()
      });
      
      const data = await apiCall(`/search?${queryParams}`);
      setUsers(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      setError('Gagal mencari user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const newUsersThisMonth = useMemo(() => {
    if (!users || users.length === 0) return 0;

    const now = dayjs();
    return users.filter(user => dayjs(user.createdAt).isSame(now, "month")).length;
  }, [users]);

  // Create or update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');

      const payload = {
        username: userForm.username,
        email: userForm.email,
        firstName: userForm.firstName,
        lastName: userForm.lastName,
        role: userForm.role,
        active: userForm.isActive
      };

      // Only include password if it's provided (for new users or when changing password)
      if (userForm.password) {
        payload.password = userForm.password;
      }

      if (editingUser) {
        // Update existing user
        const updatedUser = await apiCall(`/${editingUser.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });

        setUsers(users.map(user =>
          user.id === editingUser.id ? updatedUser : user
        ));
        setSuccess('User berhasil diperbarui');
      } else {
        // Create new user - password is required for new users
        if (!userForm.password) {
          setError('Password wajib diisi untuk user baru');
          setLoading(false);
          return;
        }

        const newUser = await apiCall('', {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        setUsers([newUser, ...users]);
        setSuccess('User berhasil ditambahkan');
      }

      resetForm();
      loadUserStats();
    } catch (error) {
      setError('Gagal menyimpan user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus user ini?')) return;
    
    try {
      setLoading(true);
      setError('');
      
      await apiCall(`/${id}`, {
        method: 'DELETE'
      });
      
      setUsers(users.filter(user => user.id !== id));
      setSuccess('User berhasil dihapus');
      loadUserStats(); // Reload stats after changes
    } catch (error) {
      setError('Gagal menghapus user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle user status
  const handleToggleStatus = async (id) => {
    try {
      setLoading(true);
      setError('');
      
      const userToUpdate = users.find(user => user.id === id);
      const updatedUser = await apiCall(`/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !userToUpdate.active })
      });
      
      setUsers(users.map(user => 
        user.id === id ? updatedUser : user
      ));
      setSuccess('Status user berhasil diperbarui');
    } catch (error) {
      setError('Gagal mengubah status user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setUserForm({
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'STUDENT',
      isActive: true
    });
    setFormErrors({});
    setEditingUser(null);
    setShowModal(false);
  };

  // Edit user
  const handleEdit = (user) => {
    setUserForm({
      username: user.username || '',
      email: user.email || '',
      password: '', // Don't populate password for security
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role || 'STUDENT',
      isActive: user.active !== false
    });
    setEditingUser(user);
    setShowModal(true);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key !== 'page' && { page: 0 })
    }));
  };

  // Get role badge class
  const getRoleBadgeClass = (role) => {
    if (isDarkMode) {
      switch (role) {
        case 'ADMIN':
          return 'bg-red-900/20 text-red-300';
        case 'INSTRUCTOR':
          return 'bg-blue-900/20 text-blue-300';
        case 'STUDENT':
          return 'bg-green-900/20 text-green-300';
        default:
          return 'bg-gray-900/20 text-gray-300';
      }
    } else {
      switch (role) {
        case 'ADMIN':
          return 'bg-red-100 text-red-800';
        case 'INSTRUCTOR':
          return 'bg-blue-100 text-blue-800';
        case 'STUDENT':
          return 'bg-green-100 text-green-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="w-4 h-4" />;
      case 'INSTRUCTOR':
        return <User className="w-4 h-4" />;
      case 'STUDENT':
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    loadUsers();
    loadUserStats();
  }, [filters]);

  // Search with debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm) {
        searchUsers();
      } else {
        loadUsers();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, filters.page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    // Adjust if we're at the beginning
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  // CSS classes based on dark mode
  const containerClass = isDarkMode 
    ? "bg-gray-900 text-gray-100 min-h-screen" 
    : "bg-gray-50 text-gray-900 min-h-screen";
    
  const cardClass = isDarkMode 
    ? "bg-gray-800 border-gray-700" 
    : "bg-white border-gray-100";
    
  const tableHeaderClass = isDarkMode 
    ? "bg-gray-700 text-gray-300" 
    : "bg-gray-50 text-gray-500";
    
  const tableRowClass = isDarkMode 
    ? "hover:bg-gray-700" 
    : "hover:bg-gray-50";
    
  const inputClass = isDarkMode 
    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500" 
    : "border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <div className={`p-6 ${containerClass}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Kelola User</h2>
            <p className="text-gray-500">Kelola pengguna platform pembelajaran</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah User
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex justify-between">
              <div className="flex">
                <XCircle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-700">{error}</p>
              </div>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-500">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex justify-between">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <p className="ml-3 text-sm text-green-700">{success}</p>
              </div>
              <button onClick={() => setSuccess('')} className="text-green-400 hover:text-green-500">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`rounded-xl shadow-sm p-6 border ${cardClass}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total User</p>
                <p className="text-2xl font-bold">{totalElements || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className={`rounded-xl shadow-sm p-6 border ${cardClass}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">User Aktif</p>
                <p className="text-2xl font-bold text-green-600">
                  {users ? users.filter(user => user.active).length : 0}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className={`rounded-xl shadow-sm p-6 border ${cardClass}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">User Baru Bulan Ini</p>
                <p className="text-2xl font-bold text-purple-600">{newUsersThisMonth || 0}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className={`rounded-xl shadow-sm p-6 border ${cardClass}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Instructor</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {users ? users.filter(user => user.role === 'INSTRUCTOR').length : 0}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-xl">
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className={`rounded-xl shadow-sm p-4 border ${cardClass}`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 ${inputClass}`}
              />
            </div>
            
            <div>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClass}`}
              >
                <option value="id">Urutkan ID</option>
                <option value="username">Username</option>
                <option value="email">Email</option>
                <option value="createdAt">Tanggal Daftar</option>
              </select>
            </div>

            <div>
              <select
                value={filters.sortDir}
                onChange={(e) => handleFilterChange('sortDir', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClass}`}
              >
                <option value="asc">A-Z / Lama-Baru</option>
                <option value="desc">Z-A / Baru-Lama</option>
              </select>
            </div>

            <div>
              <select
                value={filters.size}
                onChange={(e) => handleFilterChange('size', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${inputClass}`}
              >
                <option value="10">10 per halaman</option>
                <option value="25">25 per halaman</option>
                <option value="50">50 per halaman</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className={`rounded-xl shadow-sm border overflow-hidden ${cardClass}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={tableHeaderClass}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tanggal Daftar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading && users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mr-2"></div>
                        Memuat data user...
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      {searchTerm ? 'Tidak ada user yang sesuai dengan pencarian' : 'Belum ada user'}
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className={tableRowClass}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium">{user.username}</div>
                            <div className="text-sm text-gray-500">
                              {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getRoleBadgeClass(user.role)}`}>
                          {getRoleIcon(user.role)}
                          <span className="ml-1">{user.role}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`flex items-center ${user.active ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {user.active ? (
                            <>
                              <ToggleRight className="w-5 h-5 mr-1" />
                              <span className="text-xs font-medium">Aktif</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-5 h-5 mr-1" />
                              <span className="text-xs font-medium">Nonaktif</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => alert(`Detail user ${user.username} akan ditampilkan`)}
                            className="text-indigo-600 hover:text-indigo-700 p-1 rounded hover:bg-indigo-50"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-green-600 hover:text-green-700 p-1 rounded hover:bg-green-50"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
                            title="Hapus User"
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
          <div className={`px-6 py-3 border-t flex items-center justify-between ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handleFilterChange('page', Math.max(0, filters.page - 1))}
                disabled={filters.page === 0}
                className="relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handleFilterChange('page', Math.min(totalPages - 1, filters.page + 1))}
                disabled={filters.page >= totalPages - 1}
                className="ml-3 relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm">
                  Menampilkan{' '}
                  <span className="font-medium">{filters.page * filters.size + 1}</span> sampai{' '}
                  <span className="font-medium">
                    {Math.min((filters.page + 1) * filters.size, totalElements)}
                  </span> dari{' '}
                  <span className="font-medium">{totalElements}</span> hasil
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handleFilterChange('page', Math.max(0, filters.page - 1))}
                    disabled={filters.page === 0}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {/* Page numbers */}
                  {generatePageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handleFilterChange('page', pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === filters.page
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handleFilterChange('page', Math.min(totalPages - 1, filters.page + 1))}
                    disabled={filters.page >= totalPages - 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* User Form Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-md bg-white rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingUser ? 'Edit User' : 'Tambah User Baru'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={userForm.username}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Masukkan username"
                  />
                  {formErrors.username && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Masukkan email"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={userForm.password}
                      onChange={handleInputChange}
                      required={!editingUser}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Masukkan password"
                    />
                    {formErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Depan
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={userForm.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Nama depan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Belakang
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={userForm.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Nama belakang"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={userForm.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="INSTRUCTOR">Instructor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={userForm.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    User aktif
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
                    {editingUser ? 'Perbarui' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;