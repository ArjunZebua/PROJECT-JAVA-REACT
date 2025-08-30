// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Eye, EyeOff, User, Mail, Lock, UserPlus, Check, ArrowLeft, Shield, UserCircle } from 'lucide-react';

// const Register = () => {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     role: 'user' // default role
//   });
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [acceptTerms, setAcceptTerms] = useState(false);

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
//     } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
//       newErrors.username = 'Username can only contain letters, numbers, and underscores';
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else {
//       const passwordErrors = [];
//       if (formData.password.length < 8) {
//         passwordErrors.push('at least 8 characters');
//       }
//       if (!/(?=.*[a-z])/.test(formData.password)) {
//         passwordErrors.push('one lowercase letter');
//       }
//       if (!/(?=.*[A-Z])/.test(formData.password)) {
//         passwordErrors.push('one uppercase letter');
//       }
//       if (!/(?=.*\d)/.test(formData.password)) {
//         passwordErrors.push('one number');
//       }
//       if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
//         passwordErrors.push('one special character (!@#$%^&*)');
//       }

//       if (passwordErrors.length > 0) {
//         newErrors.password = `Password must contain ${passwordErrors.join(', ')}`;
//       }
//     }

//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'Please confirm your password';
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }

//     if (!formData.role) {
//       newErrors.role = 'Please select a role';
//     }

//     if (!acceptTerms) {
//       newErrors.terms = 'You must accept the terms and conditions';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const getPasswordStrength = () => {
//     const password = formData.password;
//     if (!password) return 0;
    
//     let strength = 0;
//     if (password.length >= 8) strength += 20;
//     if (/(?=.*[a-z])/.test(password)) strength += 20;
//     if (/(?=.*[A-Z])/.test(password)) strength += 20;
//     if (/(?=.*\d)/.test(password)) strength += 20;
//     if (/(?=.*[!@#$%^&*])/.test(password)) strength += 20;
    
//     return strength;
//   };

//   const getPasswordStrengthLabel = (strength) => {
//     if (strength === 0) return '';
//     if (strength <= 40) return 'Weak';
//     if (strength <= 80) return 'Medium';
//     return 'Strong';
//   };

//   const getPasswordStrengthColor = (strength) => {
//     if (strength <= 40) return 'bg-red-500';
//     if (strength <= 80) return 'bg-yellow-500';
//     return 'bg-green-500';
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Payload sesuai dengan model User di backend
//       const payload = { 
//         username: formData.username.trim(), 
//         email: formData.email.trim(), 
//         password: formData.password
//       };

//       console.log('Register attempt:', payload);
      
//       // Try different possible backend URLs - consistent with login
//       const possibleUrls = [
//         '/api/register',                        // Same as login
//         'http://localhost:8080/api/register',   // Spring Boot default port
//         'http://localhost:8081/api/register',   // Alternative port
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
//           general: `❌ Register endpoint tidak ditemukan!\n\nCoba periksa:\n1. Backend Spring Boot sudah running?\n2. Port backend (biasanya 8080 atau 8081)\n3. Controller mapping benar?\n\nURL yang dicoba: ${usedUrl}\n\nJika backend berjalan di port lain, update URL di frontend.` 
//         });
//         return;
//       }
      
//       if (response.ok) {
//         try {
//           const responseText = await response.text();
//           console.log('Registration successful:', responseText);
          
//           // Store role selection locally for demo purposes
//           localStorage.setItem('selectedRole', formData.role);
          
//           alert(`Registrasi berhasil sebagai ${formData.role}! Silakan login dengan akun yang sudah dibuat.`);
//           navigate('/login');
//         } catch (textError) {
//           console.error('Error reading response text:', textError);
//           // Jika tidak bisa baca response tapi status ok, anggap berhasil
//           localStorage.setItem('selectedRole', formData.role);
//           alert(`Registrasi berhasil sebagai ${formData.role}! Silakan login dengan akun yang sudah dibuat.`);
//           navigate('/login');
//         }
//       } else {
//         // Handle error response
//         let errorMessage = 'Registrasi gagal';
//         try {
//           const errorText = await response.text();
//           console.log('Error response:', errorText);
//           errorMessage = errorText || `Registrasi gagal (Status: ${response.status})`;
//         } catch (e) {
//           console.error('Error parsing error response:', e);
//           errorMessage = `Registrasi gagal (Status: ${response.status})`;
//         }
        
//         setErrors({ general: errorMessage });
//       }
      
//     } catch (error) {
//       console.error('Registration error:', error);
      
//       // Check if it's a network error
//       if (error instanceof TypeError && error.message.includes('fetch')) {
//         setErrors({ general: 'Tidak dapat terhubung ke server. Pastikan backend berjalan pada port yang benar.' });
//       } else {
//         setErrors({ general: 'Terjadi kesalahan saat registrasi. Silakan coba lagi.' });
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const passwordStrength = getPasswordStrength();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
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
//           <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//             <UserPlus className="w-8 h-8 text-purple-600" />
//           </div>
//           <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
//           <p className="text-gray-600 mt-2">Sign up for a new account</p>
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
//               Register as
//             </label>
//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 type="button"
//                 onClick={() => handleRoleChange('user')}
//                 className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
//                   formData.role === 'user'
//                     ? 'border-purple-500 bg-purple-50 text-purple-700'
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
//                     ? 'border-purple-500 bg-purple-50 text-purple-700'
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
//             <p className="text-xs text-gray-500 mt-2">
//               *Role selection will be stored locally for demo purposes
//             </p>
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
//                 className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
//                   errors.username ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 placeholder="Choose a username"
//                 autoComplete="username"
//               />
//             </div>
//             {errors.username && (
//               <p className="text-red-500 text-sm mt-1">{errors.username}</p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//               Email
//             </label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
//                   errors.email ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 placeholder="Enter your email"
//                 autoComplete="email"
//               />
//             </div>
//             {errors.email && (
//               <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
//                 className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
//                   errors.password ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 placeholder="Create a strong password"
//                 autoComplete="new-password"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//               </button>
//             </div>

//             {formData.password && (
//               <div className="mt-2">
//                 <div className="flex justify-between text-xs text-gray-600 mb-1">
//                   <span>Password Strength</span>
//                   <span className={`font-medium ${
//                     passwordStrength <= 40 ? 'text-red-600' : 
//                     passwordStrength <= 80 ? 'text-yellow-600' : 'text-green-600'
//                   }`}>
//                     {getPasswordStrengthLabel(passwordStrength)}
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div 
//                     className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
//                     style={{ width: `${passwordStrength}%` }}
//                   ></div>
//                 </div>
//               </div>
//             )}

//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
//               Confirm Password
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleInputChange}
//                 className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
//                   errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 placeholder="Confirm your password"
//                 autoComplete="new-password"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//               </button>
//             </div>
//             {errors.confirmPassword && (
//               <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
//             )}
//           </div>

//           <div>
//             <div className="flex items-start">
//               <button
//                 type="button"
//                 onClick={() => setAcceptTerms(!acceptTerms)}
//                 className={`flex-shrink-0 w-5 h-5 rounded border-2 mr-3 mt-0.5 transition-colors ${
//                   acceptTerms 
//                     ? 'bg-purple-600 border-purple-600 text-white' 
//                     : 'border-gray-300 hover:border-purple-500'
//                 }`}
//               >
//                 {acceptTerms && <Check className="w-3 h-3" />}
//               </button>
//               <div className="text-sm text-gray-600">
//                 I agree to the{' '}
//                 <button type="button" className="text-purple-600 hover:text-purple-700 underline">
//                   Terms and Conditions
//                 </button>
//                 {' '}and{' '}
//                 <button type="button" className="text-purple-600 hover:text-purple-700 underline">
//                   Privacy Policy
//                 </button>
//               </div>
//             </div>
//             {errors.terms && (
//               <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
//             )}
//           </div>

//           <button
//             type="button"
//             onClick={handleSubmit}
//             disabled={isLoading}
//             className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed font-medium"
//           >
//             {isLoading ? (
//               <div className="flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                 Creating Account...
//               </div>
//             ) : (
//               `Create ${formData.role === 'admin' ? 'Admin' : 'User'} Account`
//             )}
//           </button>
//         </div>

//         <div className="mt-8 text-center">
//           <p className="text-gray-600">Already have an account?</p>
//           <button
//             type="button"
//             className="mt-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
//             onClick={() => navigate('/login')}
//           >
//             Sign In
//           </button>
//         </div>

//         {/* Backend Info */}
//         <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//           <h4 className="text-sm font-medium text-gray-700 mb-2">Backend Integration:</h4>
//           <div className="text-xs text-gray-600 space-y-1">
//             <p>Register URL: <code>/api/register</code></p>
//             <p>Required fields: username, email, password</p>
//             <p>Role selection stored locally for demo</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;



import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, UserPlus, Check, ArrowLeft, UserCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' // fixed role as user only
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

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
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordErrors = [];
      if (formData.password.length < 8) {
        passwordErrors.push('at least 8 characters');
      }
      if (!/(?=.*[a-z])/.test(formData.password)) {
        passwordErrors.push('one lowercase letter');
      }
      if (!/(?=.*[A-Z])/.test(formData.password)) {
        passwordErrors.push('one uppercase letter');
      }
      if (!/(?=.*\d)/.test(formData.password)) {
        passwordErrors.push('one number');
      }
      if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
        passwordErrors.push('one special character (!@#$%^&*)');
      }

      if (passwordErrors.length > 0) {
        newErrors.password = `Password must contain ${passwordErrors.join(', ')}`;
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/(?=.*[a-z])/.test(password)) strength += 20;
    if (/(?=.*[A-Z])/.test(password)) strength += 20;
    if (/(?=.*\d)/.test(password)) strength += 20;
    if (/(?=.*[!@#$%^&*])/.test(password)) strength += 20;
    
    return strength;
  };

  const getPasswordStrengthLabel = (strength) => {
    if (strength === 0) return '';
    if (strength <= 40) return 'Weak';
    if (strength <= 80) return 'Medium';
    return 'Strong';
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 40) return 'bg-red-500';
    if (strength <= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Payload sesuai dengan model User di backend
      const payload = { 
        username: formData.username.trim(), 
        email: formData.email.trim(), 
        password: formData.password
      };

      console.log('Register attempt:', payload);
      
      // Try different possible backend URLs - consistent with login
      const possibleUrls = [
        '/api/register',                        // Same as login
        'http://localhost:8080/api/register',   // Spring Boot default port
        'http://localhost:8081/api/register',   // Alternative port
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
          general: `❌ Register endpoint tidak ditemukan!\n\nCoba periksa:\n1. Backend Spring Boot sudah running?\n2. Port backend (biasanya 8080 atau 8081)\n3. Controller mapping benar?\n\nURL yang dicoba: ${usedUrl}\n\nJika backend berjalan di port lain, update URL di frontend.` 
        });
        return;
      }
      
      if (response.ok) {
        try {
          const responseText = await response.text();
          console.log('Registration successful:', responseText);
          
          alert('Registrasi berhasil! Silakan login dengan akun yang sudah dibuat.');
          navigate('/login');
        } catch (textError) {
          console.error('Error reading response text:', textError);
          // Jika tidak bisa baca response tapi status ok, anggap berhasil
          alert('Registrasi berhasil! Silakan login dengan akun yang sudah dibuat.');
          navigate('/login');
        }
      } else {
        // Handle error response
        let errorMessage = 'Registrasi gagal';
        try {
          const errorText = await response.text();
          console.log('Error response:', errorText);
          errorMessage = errorText || `Registrasi gagal (Status: ${response.status})`;
        } catch (e) {
          console.error('Error parsing error response:', e);
          errorMessage = `Registrasi gagal (Status: ${response.status})`;
        }
        
        setErrors({ general: errorMessage });
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setErrors({ general: 'Tidak dapat terhubung ke server. Pastikan backend berjalan pada port yang benar.' });
      } else {
        setErrors({ general: 'Terjadi kesalahan saat registrasi. Silakan coba lagi.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
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
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCircle className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Sign up for a new student account</p>
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm whitespace-pre-line">{errors.general}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* User Info Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-center">
              <UserCircle className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-blue-900">Student Account</h3>
                <p className="text-sm text-blue-700">Access to student dashboard and features</p>
              </div>
            </div>
          </div>

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
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Choose a username"
                autoComplete="username"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Create a strong password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {formData.password && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Password Strength</span>
                  <span className={`font-medium ${
                    passwordStrength <= 40 ? 'text-red-600' : 
                    passwordStrength <= 80 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {getPasswordStrengthLabel(passwordStrength)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
              </div>
            )}

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div>
            <div className="flex items-start">
              <button
                type="button"
                onClick={() => setAcceptTerms(!acceptTerms)}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 mr-3 mt-0.5 transition-colors ${
                  acceptTerms 
                    ? 'bg-purple-600 border-purple-600 text-white' 
                    : 'border-gray-300 hover:border-purple-500'
                }`}
              >
                {acceptTerms && <Check className="w-3 h-3" />}
              </button>
              <div className="text-sm text-gray-600">
                I agree to the{' '}
                <button type="button" className="text-purple-600 hover:text-purple-700 underline">
                  Terms and Conditions
                </button>
                {' '}and{' '}
                <button type="button" className="text-purple-600 hover:text-purple-700 underline">
                  Privacy Policy
                </button>
              </div>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Student Account'
            )}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">Already have an account?</p>
          <button
            type="button"
            className="mt-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        </div>

        {/* Backend Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Backend Integration:</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Register URL: <code>/api/register</code></p>
            <p>Required fields: username, email, password</p>
            <p>Account type: Student User</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;