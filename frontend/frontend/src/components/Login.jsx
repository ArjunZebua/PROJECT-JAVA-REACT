/* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Eye, EyeOff, User, Lock, ArrowLeft, Shield, UserCircle } from 'lucide-react';

// const Login = () => {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     role: 'user' // default role
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   // Load previously selected role from registration if exists
//   useEffect(() => {
//     const savedRole = localStorage.getItem('selectedRole');
//     if (savedRole) {
//       setFormData(prev => ({
//         ...prev,
//         role: savedRole
//       }));
//     }
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const handleRoleChange = (selectedRole) => {
//     setFormData(prev => ({
//       ...prev,
//       role: selectedRole
//     }));
//     if (errors.role) {
//       setErrors(prev => ({
//         ...prev,
//         role: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.username.trim()) {
//       newErrors.username = 'Username is required';
//     } else if (formData.username.length < 3) {
//       newErrors.username = 'Username must be at least 3 characters';
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }

//     if (!formData.role) {
//       newErrors.role = 'Please select a role';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);

//     try {
      
//       // Payload hanya berisi username dan password sesuai backend
//       const payload = { 
//         username: formData.username.trim(), 
//         password: formData.password
//       };

//       console.log('Login attempt:', payload);
      
//       // Try different possible backend URLs - consistent with register
//       const possibleUrls = [
//         '/api/login',                        // Same as register pattern
//         'http://localhost:8080/api/login',   // Spring Boot default port
//         // 'http://localhost:8081/api/login',   // Alternative port
//       ];
      
//       let response;
//       let usedUrl = '';
      
//       // Test each URL until we find one that works
//       for (const url of possibleUrls) {
//         try {
//           console.log(`Trying URL: ${url}`);
//           response = await fetch(url, {
//             method: 'POST',
//             headers: { 
//               'Content-Type': 'application/json',
//               'Accept': 'application/json'
//             },
//             body: JSON.stringify(payload)
//           });
          
          
//           usedUrl = url;
//           console.log(`Response from ${url}:`, response.status);
          
//           // Jika bukan 404, gunakan URL ini
//           if (response.status !== 404) {
//             break;
//           }
//         } catch (err) {
//           console.log(`Failed to connect to ${url}:`, err.message);
//           continue;
//         }
//       }
      
//       console.log('Response status:', response.status);
//       console.log('Response ok:', response.ok);
//       console.log('Used URL:', usedUrl);
      
//       if (response.status === 404) {
//         setErrors({ 
//           general: `❌ Login endpoint tidak ditemukan!\n\nCoba periksa:\n1. Backend Spring Boot sudah running?\n2. Port backend (biasanya 8080 atau 8081)\n3. Controller mapping benar?\n\nURL yang dicoba: ${usedUrl}\n\nJika backend berjalan di port lain, update URL di frontend.` 
//         });
//         return;
//       }
      
//       if (response.ok) {
//         try {
//           const responseText = await response.text();
//           console.log('Login successful:', responseText);
          
//           // Store authentication data dengan simulasi token
//           const token = 'jwt-token-' + Date.now();
//           const userData = {
//             username: formData.username,
//             email: formData.username + '@example.com',
//             role: formData.role
//           };
          
//           // Use sessionStorage instead of localStorage for security
//           sessionStorage.setItem('token', token);
//           sessionStorage.setItem('user', JSON.stringify(userData));
//           sessionStorage.setItem('userRole', formData.role);
          
//           // Show success message
//           alert(`Login berhasil sebagai ${formData.role}!`);
          
//           // Redirect based on role
//           if (formData.role === 'admin') {
//             navigate('/admin-dashboard', { replace: true });
//           } else {
//             navigate('/dashboard', { replace: true });
//           }
//         } catch (textError) {
//           console.error('Error reading response text:', textError);
//           // Jika tidak bisa baca response tapi status ok, anggap berhasil
//           const token = 'jwt-token-' + Date.now();
//           const userData = {
//             username: formData.username,
//             email: formData.username + '@example.com',
//             role: formData.role
//           };
          
//           sessionStorage.setItem('token', token);
//           sessionStorage.setItem('user', JSON.stringify(userData));
//           sessionStorage.setItem('userRole', formData.role);
          
//           alert(`Login berhasil sebagai ${formData.role}!`);
          
//           if (formData.role === 'admin') {
//             navigate('/admin-dashboard', { replace: true });
//           } else {
//             navigate('/dashboard', { replace: true });
//           }
//         }
//       } else {
//         // Handle error response
//         let errorMessage = 'Login gagal';
//         try {
//           const errorText = await response.text();
//           console.log('Error response:', errorText);
//           errorMessage = errorText || `Login gagal (Status: ${response.status})`;
//         } catch (e) {
//           console.error('Error parsing error response:', e);
//           errorMessage = `Login gagal (Status: ${response.status})`;
//         }
        
//         setErrors({ general: errorMessage });
//       }
      
//     } catch (error) {
//       console.error('Login error:', error);
      
//       // Check if it's a network error
//       if (error instanceof TypeError && error.message.includes('fetch')) {
//         setErrors({ general: 'Tidak dapat terhubung ke server. Pastikan backend berjalan pada port yang benar.' });
//       } else {
//         setErrors({ general: 'Terjadi kesalahan saat login. Silakan coba lagi.' });
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSubmit();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
//         {/* Back to Home Button */}
//         <button
//           onClick={() => navigate('/')}
//           className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
//         >
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back to Home
//         </button>

//         <div className="text-center mb-8">
//           <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//             <User className="w-8 h-8 text-indigo-600" />
//           </div>
//           <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
//           <p className="text-gray-600 mt-2">Sign in to access your account</p>
//         </div>

//         {errors.general && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//             <p className="text-red-800 text-sm whitespace-pre-line">{errors.general}</p>
//           </div>
//         )}

//         <div className="space-y-6">
//           {/* Role Selection */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-3">
//               Login as
//             </label>
//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 type="button"
//                 onClick={() => handleRoleChange('user')}
//                 className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
//                   formData.role === 'user'
//                     ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
//                     : 'border-gray-200 hover:border-gray-300 text-gray-600'
//                 }`}
//               >
//                 <UserCircle className="w-8 h-8 mb-2" />
//                 <span className="text-sm font-medium">User</span>
//                 <span className="text-xs text-gray-500">Student Dashboard</span>
//               </button>
              
//               <button
//                 type="button"
//                 onClick={() => handleRoleChange('admin')}
//                 className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
//                   formData.role === 'admin'
//                     ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
//                     : 'border-gray-200 hover:border-gray-300 text-gray-600'
//                 }`}
//               >
//                 <Shield className="w-8 h-8 mb-2" />
//                 <span className="text-sm font-medium">Admin</span>
//                 <span className="text-xs text-gray-500">Admin Panel</span>
//               </button>
//             </div>
//             {errors.role && (
//               <p className="text-red-500 text-sm mt-2">{errors.role}</p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
//               Username
//             </label>
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 id="username"
//                 name="username"
//                 value={formData.username}
//                 onChange={handleInputChange}
//                 onKeyPress={handleKeyPress}
//                 className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
//                   errors.username ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 placeholder="Enter your username"
//                 autoComplete="username"
//               />
//             </div>
//             {errors.username && (
//               <p className="text-red-500 text-sm mt-1">{errors.username}</p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleInputChange}
//                 onKeyPress={handleKeyPress}
//                 className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
//                   errors.password ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 placeholder="Enter your password"
//                 autoComplete="current-password"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//               </button>
//             </div>
//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//             )}
//           </div>

//           <div className="flex justify-end">
//             <button
//               type="button"
//               className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
//             >
//               Forgot password?
//             </button>
//           </div>

//           <button
//             type="button"
//             onClick={handleSubmit}
//             disabled={isLoading}
//             className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed font-medium"
//           >
//             {isLoading ? (
//               <div className="flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                 Signing In...
//               </div>
//             ) : (
//               `Sign In as ${formData.role === 'admin' ? 'Admin' : 'User'}`
//             )}
//           </button>
//         </div>

//         <div className="mt-8 text-center">
//           <p className="text-gray-600">Don't have an account?</p>
//           <button
//             type="button"
//             className="mt-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
//             onClick={() => navigate('/register')}
//           >
//             Create Account
//           </button>
//         </div>

//         {/* Backend Info */}
//         <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//           <h4 className="text-sm font-medium text-gray-700 mb-2">Backend Integration:</h4>
//           <div className="text-xs text-gray-600 space-y-1">
//             <p>Login URL: <code>/api/login</code></p>
//             <p>Required fields: username, password</p>
//             <p>Role selected: <strong>{formData.role}</strong></p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;







import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, ArrowLeft, UserCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user' // fixed role as user only
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      
      // Payload hanya berisi username dan password sesuai backend
      const payload = { 
        username: formData.username.trim(), 
        password: formData.password
      };

      console.log('Login attempt:', payload);
      
      // Try different possible backend URLs - consistent with register
      const possibleUrls = [
        '/api/login',                        // Same as register pattern
        'http://localhost:8080/api/login',   // Spring Boot default port
        // 'http://localhost:8081/api/login',   // Alternative port
      ];
      
      let response;
      let usedUrl = '';
      
      // Test each URL until we find one that works
      for (const url of possibleUrls) {
        try {
          console.log(`Trying URL: ${url}`);
          response = await fetch(url, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });
          
          
          usedUrl = url;
          console.log(`Response from ${url}:`, response.status);
          
          // Jika bukan 404, gunakan URL ini
          if (response.status !== 404) {
            break;
          }
        } catch (err) {
          console.log(`Failed to connect to ${url}:`, err.message);
          continue;
        }
      }
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Used URL:', usedUrl);
      
      if (response.status === 404) {
        setErrors({ 
          general: `❌ Login endpoint tidak ditemukan!\n\nCoba periksa:\n1. Backend Spring Boot sudah running?\n2. Port backend (biasanya 8080 atau 8081)\n3. Controller mapping benar?\n\nURL yang dicoba: ${usedUrl}\n\nJika backend berjalan di port lain, update URL di frontend.` 
        });
        return;
      }
      
      if (response.ok) {
        try {
          const responseText = await response.text();
          console.log('Login successful:', responseText);
          
          // Store authentication data dengan simulasi token
          const token = 'jwt-token-' + Date.now();
          const userData = {
            username: formData.username,
            email: formData.username + '@example.com',
            role: 'user'
          };
          
          // Use sessionStorage instead of localStorage for security
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('user', JSON.stringify(userData));
          sessionStorage.setItem('userRole', 'user');
          
          // Show success message
          alert(`Login berhasil!`);
          
          // Redirect to user dashboard only
          navigate('/dashboard', { replace: true });
        } catch (textError) {
          console.error('Error reading response text:', textError);
          // Jika tidak bisa baca response tapi status ok, anggap berhasil
          const token = 'jwt-token-' + Date.now();
          const userData = {
            username: formData.username,
            email: formData.username + '@example.com',
            role: 'user'
          };
          
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('user', JSON.stringify(userData));
          sessionStorage.setItem('userRole', 'user');
          
          alert(`Login berhasil!`);
          navigate('/dashboard', { replace: true });
        }
      } else {
        // Handle error response
        let errorMessage = 'Login gagal';
        try {
          const errorText = await response.text();
          console.log('Error response:', errorText);
          errorMessage = errorText || `Login gagal (Status: ${response.status})`;
        } catch (e) {
          console.error('Error parsing error response:', e);
          errorMessage = `Login gagal (Status: ${response.status})`;
        }
        
        setErrors({ general: errorMessage });
      }
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setErrors({ general: 'Tidak dapat terhubung ke server. Pastikan backend berjalan pada port yang benar.' });
      } else {
        setErrors({ general: 'Terjadi kesalahan saat login. Silakan coba lagi.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        <div className="text-center mb-8">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCircle className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your student account</p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm whitespace-pre-line">{errors.general}</p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">Don't have an account?</p>
          <button
            type="button"
            className="mt-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            onClick={() => navigate('/register')}
          >
            Create Account
          </button>
        </div>

        {/* Backend Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Backend Integration:</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Login URL: <code>/api/login</code></p>
            <p>Required fields: username, password</p>
            <p>Account type: Student User</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;