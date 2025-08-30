// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState, useEffect } from 'react';
// import { 
//   Plus, 
//   Edit, 
//   Trash2, 
//   Download, 
//   Eye, 
//   Search, 
//   Filter,
//   BookOpen,
//   Users,
//   TrendingUp,
//   Settings,
//   Save,
//   X,
//   AlertCircle,
//   CheckCircle,
//   BarChart3,
//   FileText,
//   Calendar,
//   Loader
// } from 'lucide-react';

// const API_BASE_URL = 'http://localhost:8080/api/quiz';

// const AdminQuizSystem = () => {
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [questions, setQuestions] = useState([]);
//   const [quizResults, setQuizResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterCategory, setFilterCategory] = useState('ALL');
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState('add');
//   const [currentQuestion, setCurrentQuestion] = useState(null);
//   const [notification, setNotification] = useState({ show: false, message: '', type: '' });

//   // Categories matching your backend enum
//   const categories = [
//     { value: 'ALL', label: 'All Categories' },
//     { value: 'SPRING_BOOT', label: 'Spring Boot' },
//     { value: 'DATABASE', label: 'Database' },
//     { value: 'SECURITY', label: 'Security' },
//     { value: 'API', label: 'API' },
//     { value: 'ARCHITECTURE', label: 'Architecture' },
//     { value: 'JAVA', label: 'Java' },
//     { value: 'JAVASCRIPT', label: 'JavaScript' },
//     { value: 'HTML', label: 'HTML' },
//   ];

//   const showNotification = (message, type = 'success') => {
//     setNotification({ show: true, message, type });
//     setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
//   };

//   // Fixed API calls to match your backend
//   const fetchQuestions = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/questions`);
//       if (!response.ok) throw new Error('Failed to fetch questions');
//       const data = await response.json();
      
//       // Transform DTO back to full question format for editing
//       // Handle both DTO format (from backend) and full Question format
//       const transformedData = data.map(item => ({
//         id: item.id,
//         questionText: item.questionText || item.question || '',
//         options: Array.isArray(item.options) ? item.options : ['', '', '', ''],
//         correctAnswer: item.correctAnswer || 0,
//         explanation: item.explanation || '',
//         category: item.category || 'SPRING_BOOT',
//         difficulty: item.difficulty || 1,
//         createdAt: item.createdAt || new Date().toISOString()
//       }));
      
//       setQuestions(transformedData);
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//       showNotification('Failed to fetch questions', 'error');
//       setQuestions([]); // Ensure questions is always an array
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchQuizResults = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/leaderboard`);
//       if (!response.ok) throw new Error('Failed to fetch quiz results');
//       const data = await response.json();
//       setQuizResults(data);
//     } catch (error) {
//       console.error('Error fetching quiz results:', error);
//       showNotification('Failed to fetch quiz results', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (activeTab === 'questions') {
//       fetchQuestions();
//     } else if (activeTab === 'results') {
//       fetchQuizResults();
//     } else if (activeTab === 'dashboard') {
//       fetchQuestions();
//       fetchQuizResults();
//     }
//   }, [activeTab]);

//   const filteredQuestions = questions.filter(q => {
//     // Safety check for questionText
//     const questionText = q.questionText || q.question || '';
//     const matchesSearch = questionText.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = filterCategory === 'ALL' || q.category === filterCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const handleAddQuestion = () => {
//     setCurrentQuestion({
//       questionText: '',
//       options: ['', '', '', ''],
//       correctAnswer: 0,
//       explanation: '',
//       category: 'SPRING_BOOT',
//       difficulty: 1
//     });
//     setModalType('add');
//     setShowModal(true);
//   };

//   const handleEditQuestion = (question) => {
//     setCurrentQuestion({ 
//       ...question,
//       options: question.options && question.options.length === 4 
//         ? question.options 
//         : ['', '', '', '']
//     });
//     setModalType('edit');
//     setShowModal(true);
//   };

//   const handleViewQuestion = (question) => {
//     setCurrentQuestion(question);
//     setModalType('view');
//     setShowModal(true);
//   };

//   const handleDeleteQuestion = async (id) => {
//     if (window.confirm('Are you sure you want to delete this question?')) {
//       try {
//         const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
//           method: 'DELETE'
//         });
        
//         if (!response.ok) throw new Error('Failed to delete question');
        
//         setQuestions(questions.filter(q => q.id !== id));
//         showNotification('Question deleted successfully');
//       } catch (error) {
//         console.error('Error deleting question:', error);
//         showNotification('Failed to delete question', 'error');
//       }
//     }
//   };

//   const handleSaveQuestion = async () => {
//     if (!currentQuestion.questionText.trim()) {
//       showNotification('Please enter a question text', 'error');
//       return;
//     }

//     if (currentQuestion.options.some(opt => !opt.trim())) {
//       showNotification('Please fill all options', 'error');
//       return;
//     }

//     try {
//       let response;
      
//       if (modalType === 'add') {
//         // Transform data to match backend Question entity structure
//         const questionData = {
//           questionText: currentQuestion.questionText,
//           options: currentQuestion.options,
//           correctAnswer: currentQuestion.correctAnswer,
//           explanation: currentQuestion.explanation || '',
//           category: currentQuestion.category,
//           difficulty: currentQuestion.difficulty
//         };

//         console.log('Sending question data:', questionData); // Debug log

//         response = await fetch(`${API_BASE_URL}/questions`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(questionData)
//         });

//         // Log response details for debugging
//         if (!response.ok) {
//           const errorText = await response.text();
//           console.error('Backend error response:', errorText);
//           throw new Error(`Failed to add question: ${response.status} - ${errorText}`);
//         }
//       } else {
//         // Note: Your controller doesn't have PUT endpoint, only POST and DELETE
//         // You may need to add PUT endpoint or use POST for updates
//         showNotification('Edit functionality requires PUT endpoint in backend', 'error');
//         return;
//       }

//       const savedQuestion = await response.json();
      
//       if (modalType === 'add') {
//         // Transform the saved question to include all fields for display
//         const fullQuestion = {
//           id: savedQuestion.id,
//           questionText: savedQuestion.questionText,
//           options: currentQuestion.options,
//           correctAnswer: currentQuestion.correctAnswer,
//           explanation: currentQuestion.explanation,
//           category: currentQuestion.category,
//           difficulty: currentQuestion.difficulty,
//           createdAt: new Date().toISOString()
//         };
//         setQuestions([...questions, fullQuestion]);
//         showNotification('Question added successfully');
//       }

//       setShowModal(false);
//       setCurrentQuestion(null);
//     } catch (error) {
//       console.error('Error saving question:', error);
//       showNotification(`Failed to ${modalType === 'add' ? 'add' : 'update'} question`, 'error');
//     }
//   };

//   const downloadData = (type) => {
//     const data = type === 'questions' ? questions : quizResults;
//     const filename = type === 'questions' ? 'quiz-questions.json' : 'quiz-results.json';
    
//     const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
    
//     showNotification(`${type} data downloaded successfully`);
//   };

//   const downloadCSV = (type) => {
//     let csvContent = '';
    
//     if (type === 'questions') {
//       csvContent = 'ID,Question,Category,Difficulty,Created Date\n';
//       csvContent += questions.map(q => 
//         `"${q.id || 'N/A'}","${q.questionText}","${q.category}","${q.difficulty}","${q.createdAt}"`
//       ).join('\n');
//     } else {
//       csvContent = 'ID,User Name,Score,Total Questions,Percentage,Duration (s),Completed At\n';
//       csvContent += quizResults.map(r => 
//         `"${r.id}","${r.userName}","${r.score}","${r.totalQuestions}","${Math.round((r.score/r.totalQuestions)*100)}%","${r.duration || 0}","${r.completedAt}"`
//       ).join('\n');
//     }

//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${type}-${new Date().toISOString().split('T')[0]}.csv`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
    
//     showNotification(`${type} CSV downloaded successfully`);
//   };

//   const getDashboardStats = () => {
//     const totalQuestions = questions.length;
//     const totalAttempts = quizResults.length;
//     const averageScore = quizResults.length > 0 
//       ? Math.round(quizResults.reduce((sum, r) => sum + (r.score / r.totalQuestions * 100), 0) / quizResults.length)
//       : 0;
//     const passRate = quizResults.length > 0
//       ? Math.round((quizResults.filter(r => (r.score / r.totalQuestions) >= 0.6).length / quizResults.length) * 100)
//       : 0;

//     return { totalQuestions, totalAttempts, averageScore, passRate };
//   };

//   const stats = getDashboardStats();

//   const renderDashboard = () => (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Questions</p>
//               <p className="text-3xl font-bold text-gray-900">{stats.totalQuestions}</p>
//             </div>
//             <BookOpen className="text-blue-500" size={32} />
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Quiz Attempts</p>
//               <p className="text-3xl font-bold text-gray-900">{stats.totalAttempts}</p>
//             </div>
//             <Users className="text-green-500" size={32} />
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Average Score</p>
//               <p className="text-3xl font-bold text-gray-900">{stats.averageScore}%</p>
//             </div>
//             <TrendingUp className="text-yellow-500" size={32} />
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Pass Rate</p>
//               <p className="text-3xl font-bold text-gray-900">{stats.passRate}%</p>
//             </div>
//             <BarChart3 className="text-purple-500" size={32} />
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
//           <Calendar className="mr-2 text-blue-500" />
//           Recent Quiz Attempts
//         </h2>
//         {loading ? (
//           <div className="flex justify-center py-8">
//             <Loader className="animate-spin text-blue-500" size={32} />
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-gray-200">
//                   <th className="text-left py-3 px-4 font-semibold text-gray-600">User</th>
//                   <th className="text-left py-3 px-4 font-semibold text-gray-600">Score</th>
//                   <th className="text-left py-3 px-4 font-semibold text-gray-600">Percentage</th>
//                   <th className="text-left py-3 px-4 font-semibold text-gray-600">Duration</th>
//                   <th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {quizResults.slice(0, 5).map((result) => (
//                   <tr key={result.id} className="border-b border-gray-100 hover:bg-gray-50">
//                     <td className="py-3 px-4 font-medium">{result.userName}</td>
//                     <td className="py-3 px-4">{result.score}/{result.totalQuestions}</td>
//                     <td className="py-3 px-4">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         (result.score / result.totalQuestions) >= 0.8 ? 'bg-green-100 text-green-800' :
//                         (result.score / result.totalQuestions) >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-red-100 text-red-800'
//                       }`}>
//                         {Math.round((result.score / result.totalQuestions) * 100)}%
//                       </span>
//                     </td>
//                     <td className="py-3 px-4">
//                       {result.duration ? `${Math.floor(result.duration / 60)}:${(result.duration % 60).toString().padStart(2, '0')}` : 'N/A'}
//                     </td>
//                     <td className="py-3 px-4">{new Date(result.completedAt).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {quizResults.length === 0 && (
//               <div className="text-center py-8 text-gray-500">
//                 No quiz attempts yet
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   const renderQuestions = () => (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">Question Management</h2>
//           <p className="text-gray-600">Create, edit, and manage quiz questions</p>
//         </div>
//         <button
//           onClick={handleAddQuestion}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
//         >
//           <Plus size={16} />
//           <span>Add Question</span>
//         </button>
//       </div>

//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
//               <input
//                 type="text"
//                 placeholder="Search questions..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//           <select
//             value={filterCategory}
//             onChange={(e) => setFilterCategory(e.target.value)}
//             className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             {categories.map(cat => (
//               <option key={cat.value} value={cat.value}>{cat.label}</option>
//             ))}
//           </select>
//           <div className="flex space-x-2">
//             <button
//               onClick={() => downloadData('questions')}
//               className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
//             >
//               <Download size={16} />
//               <span>JSON</span>
//             </button>
//             <button
//               onClick={() => downloadCSV('questions')}
//               className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
//             >
//               <FileText size={16} />
//               <span>CSV</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//         {loading ? (
//           <div className="flex justify-center py-12">
//             <Loader className="animate-spin text-blue-500" size={32} />
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="text-left py-4 px-6 font-semibold text-gray-600">Question</th>
//                   <th className="text-left py-4 px-6 font-semibold text-gray-600">Category</th>
//                   <th className="text-left py-4 px-6 font-semibold text-gray-600">Difficulty</th>
//                   <th className="text-left py-4 px-6 font-semibold text-gray-600">Created</th>
//                   <th className="text-left py-4 px-6 font-semibold text-gray-600">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {filteredQuestions.map((question) => (
//                   <tr key={question.id} className="hover:bg-gray-50">
//                     <td className="py-4 px-6">
//                       <div className="max-w-xs">
//                         <p className="font-medium text-gray-900 truncate">{question.questionText}</p>
//                         <p className="text-sm text-gray-500">{question.options?.length || 0} options</p>
//                       </div>
//                     </td>
//                     <td className="py-4 px-6">
//                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         question.category === 'SPRING_BOOT' ? 'bg-blue-100 text-blue-800' :
//                         question.category === 'DATABASE' ? 'bg-green-100 text-green-800' :
//                         question.category === 'SECURITY' ? 'bg-red-100 text-red-800' :
//                         'bg-purple-100 text-purple-800'
//                       }`}>
//                         {question.category?.replace('_', ' ') || 'GENERAL'}
//                       </span>
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className="flex items-center space-x-1">
//                         {[...Array(5)].map((_, i) => (
//                           <div
//                             key={i}
//                             className={`w-2 h-2 rounded-full ${
//                               i < question.difficulty ? 'bg-orange-400' : 'bg-gray-200'
//                             }`}
//                           />
//                         ))}
//                       </div>
//                     </td>
//                     <td className="py-4 px-6 text-sm text-gray-600">
//                       {question.createdAt ? new Date(question.createdAt).toLocaleDateString() : 'N/A'}
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => handleViewQuestion(question)}
//                           className="text-blue-600 hover:text-blue-800 p-1 rounded"
//                         >
//                           <Eye size={16} />
//                         </button>
//                         <button
//                           onClick={() => handleEditQuestion(question)}
//                           className="text-green-600 hover:text-green-800 p-1 rounded"
//                           disabled={true} // Disabled until PUT endpoint is added
//                           title="Edit requires PUT endpoint in backend"
//                         >
//                           <Edit size={16} />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteQuestion(question.id)}
//                           className="text-red-600 hover:text-red-800 p-1 rounded"
//                         >
//                           <Trash2 size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {!loading && filteredQuestions.length === 0 && (
//           <div className="text-center py-12">
//             <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
//             <p className="text-gray-500">No questions found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   const renderResults = () => (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">Quiz Results</h2>
//           <p className="text-gray-600">View and analyze quiz performance data</p>
//         </div>
//         <div className="flex space-x-2">
//           <button
//             onClick={() => downloadData('results')}
//             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
//           >
//             <Download size={16} />
//             <span>JSON</span>
//           </button>
//           <button
//             onClick={() => downloadCSV('results')}
//             className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
//           >
//             <FileText size={16} />
//             <span>CSV</span>
//           </button>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//         {loading ? (
//           <div className="flex justify-center py-12">
//             <Loader className="animate-spin text-blue-500" size={32} />
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="text-left py-4 px-6 font-semibold text-gray-600">User</th>
//                   <th className="text-left py-4 px-6 font-semibold text-gray-600">Score</th>
//                   <th className="text-left py-4 px-6 font-semibold text-gray-600">Percentage</th>
//                   <th className="text-left py-4 px-6 font-semibold text-gray-600">Duration</th>
//                   <th className="text-left py-4 px-6 font-semibold text-gray-600">Status</th>
//                   <th className="text-left py-4 px-6 font-semibold text-gray-600">Date</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {quizResults.map((result) => {
//                   const percentage = Math.round((result.score / result.totalQuestions) * 100);
//                   const passed = percentage >= 60;
                  
//                   return (
//                     <tr key={result.id} className="hover:bg-gray-50">
//                       <td className="py-4 px-6 font-medium text-gray-900">{result.userName}</td>
//                       <td className="py-4 px-6">{result.score}/{result.totalQuestions}</td>
//                       <td className="py-4 px-6">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           percentage >= 80 ? 'bg-green-100 text-green-800' :
//                           percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
//                           'bg-red-100 text-red-800'
//                         }`}>
//                           {percentage}%
//                         </span>
//                       </td>
//                       <td className="py-4 px-6">
//                         {result.duration ? `${Math.floor(result.duration / 60)}:${(result.duration % 60).toString().padStart(2, '0')}` : 'N/A'}
//                       </td>
//                       <td className="py-4 px-6">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${
//                           passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                         }`}>
//                           {passed ? <CheckCircle size={12} /> : <X size={12} />}
//                           <span>{passed ? 'Passed' : 'Failed'}</span>
//                         </span>
//                       </td>
//                       <td className="py-4 px-6 text-sm text-gray-600">
//                         {new Date(result.completedAt).toLocaleDateString()}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {!loading && quizResults.length === 0 && (
//           <div className="text-center py-12">
//             <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
//             <p className="text-gray-500">No quiz results yet</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   const renderModal = () => {
//     if (!showModal || !currentQuestion) return null;

//     const isReadOnly = modalType === 'view';

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <h3 className="text-xl font-bold text-gray-800">
//                 {modalType === 'add' ? 'Add New Question' :
//                  modalType === 'edit' ? 'Edit Question' : 'View Question'}
//               </h3>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X size={20} />
//               </button>
//             </div>
//           </div>

//           <div className="p-6 space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
//               <textarea
//                 value={currentQuestion.questionText}
//                 onChange={(e) => setCurrentQuestion({...currentQuestion, questionText: e.target.value})}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 rows="3"
//                 disabled={isReadOnly}
//                 placeholder="Enter your question here..."
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
//               {currentQuestion.options.map((option, index) => (
//                 <div key={index} className="flex items-center space-x-2 mb-2">
//                   <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
//                     {String.fromCharCode(65 + index)}
//                   </span>
//                   <input
//                     type="text"
//                     value={option}
//                     onChange={(e) => {
//                       const newOptions = [...currentQuestion.options];
//                       newOptions[index] = e.target.value;
//                       setCurrentQuestion({...currentQuestion, options: newOptions});
//                     }}
//                     className={`flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                       currentQuestion.correctAnswer === index ? 'border-green-500 bg-green-50' : 'border-gray-300'
//                     }`}
//                     disabled={isReadOnly}
//                     placeholder={`Option ${String.fromCharCode(65 + index)}`}
//                   />
//                   {!isReadOnly && (
//                     <button
//                       onClick={() => setCurrentQuestion({...currentQuestion, correctAnswer: index})}
//                       className={`p-2 rounded-lg transition-colors ${
//                         currentQuestion.correctAnswer === index
//                           ? 'bg-green-500 text-white'
//                           : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
//                       }`}
//                       title="Mark as correct answer"
//                     >
//                       <CheckCircle size={16} />
//                     </button>
//                   )}
//                 </div>
//               ))}
//               {currentQuestion.correctAnswer !== undefined && (
//                 <p className="text-sm text-green-600 mt-2">
//                   Correct Answer: Option {String.fromCharCode(65 + currentQuestion.correctAnswer)}
//                 </p>
//               )}
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                 <select
//                   value={currentQuestion.category}
//                   onChange={(e) => setCurrentQuestion({...currentQuestion, category: e.target.value})}
//                   className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   disabled={isReadOnly}
//                 >
//                   {categories.slice(1).map(cat => (
//                     <option key={cat.value} value={cat.value}>{cat.label}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
//                 <select
//                   value={currentQuestion.difficulty}
//                   onChange={(e) => setCurrentQuestion({...currentQuestion, difficulty: parseInt(e.target.value)})}
//                   className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   disabled={isReadOnly}
//                 >
//                   {[1, 2, 3, 4, 5].map(level => (
//                     <option key={level} value={level}>Level {level}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (Optional)</label>
//               <textarea
//                 value={currentQuestion.explanation || ''}
//                 onChange={(e) => setCurrentQuestion({...currentQuestion, explanation: e.target.value})}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 rows="3"
//                 disabled={isReadOnly}
//                 placeholder="Provide an explanation for the correct answer..."
//               />
//             </div>
//           </div>

//           <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
//             <button
//               onClick={() => setShowModal(false)}
//               className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
//             >
//               Cancel
//             </button>
//             {!isReadOnly && (
//               <button
//                 onClick={handleSaveQuestion}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
//               >
//                 <Save size={16} />
//                 <span>{modalType === 'add' ? 'Add Question' : 'Update Question'}</span>
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Notification */}
//       {notification.show && (
//         <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
//           notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
//         }`}>
//           {notification.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
//           <span>{notification.message}</span>
//         </div>
//       )}

//       {/* Header */}
//       <div className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center space-x-3">
//               <Settings className="text-blue-600" size={32} />
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Quiz Admin Panel</h1>
//                 <p className="text-sm text-gray-600">Manage questions and view results</p>
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-4">
//               <div className="text-sm text-gray-600">
//                 Admin Dashboard
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
//         <div className="border-b border-gray-200">
//           <nav className="-mb-px flex space-x-8">
//             <button
//               onClick={() => setActiveTab('dashboard')}
//               className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'dashboard'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Dashboard
//             </button>
//             <button
//               onClick={() => setActiveTab('questions')}
//               className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'questions'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Questions
//             </button>
//             <button
//               onClick={() => setActiveTab('results')}
//               className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === 'results'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               Results
//             </button>
//           </nav>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {activeTab === 'dashboard' && renderDashboard()}
//         {activeTab === 'questions' && renderQuestions()}
//         {activeTab === 'results' && renderResults()}
//       </div>

//       {/* Modal */}
//       {renderModal()}
//     </div>
//   );
// };

// export default AdminQuizSystem;



/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Eye, 
  Search, 
  Filter,
  BookOpen,
  Users,
  TrendingUp,
  Settings,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  BarChart3,
  FileText,
  Calendar,
  Loader
} from 'lucide-react';
import { useDarkMode } from "../components/DarkModeContext";

const API_BASE_URL = 'http://localhost:8080/api/quiz';

const AdminQuizSystem = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [questions, setQuestions] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Categories matching your backend enum
  const categories = [
    { value: 'ALL', label: 'All Categories' },
    { value: 'SPRING_BOOT', label: 'Spring Boot' },
    { value: 'DATABASE', label: 'Database' },
    { value: 'SECURITY', label: 'Security' },
    { value: 'API', label: 'API' },
    { value: 'ARCHITECTURE', label: 'Architecture' },
    { value: 'JAVA', label: 'Java' },
    { value: 'JAVASCRIPT', label: 'JavaScript' },
    { value: 'HTML', label: 'HTML' },
  ];

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  // Fixed API calls to match your backend
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/questions`);
      if (!response.ok) throw new Error('Failed to fetch questions');
      const data = await response.json();
      
      // Transform DTO back to full question format for editing
      const transformedData = data.map(item => ({
        id: item.id,
        questionText: item.questionText || item.question || '',
        options: Array.isArray(item.options) ? item.options : ['', '', '', ''],
        correctAnswer: item.correctAnswer || 0,
        explanation: item.explanation || '',
        category: item.category || 'SPRING_BOOT',
        difficulty: item.difficulty || 1,
        createdAt: item.createdAt || new Date().toISOString()
      }));
      
      setQuestions(transformedData);
    } catch (error) {
      console.error('Error fetching questions:', error);
      showNotification('Failed to fetch questions', 'error');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizResults = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard`);
      if (!response.ok) throw new Error('Failed to fetch quiz results');
      const data = await response.json();
      setQuizResults(data);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      showNotification('Failed to fetch quiz results', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'questions') {
      fetchQuestions();
    } else if (activeTab === 'results') {
      fetchQuizResults();
    } else if (activeTab === 'dashboard') {
      fetchQuestions();
      fetchQuizResults();
    }
  }, [activeTab]);

  const filteredQuestions = questions.filter(q => {
    const questionText = q.questionText || q.question || '';
    const matchesSearch = questionText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || q.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddQuestion = () => {
    setCurrentQuestion({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      category: 'SPRING_BOOT',
      difficulty: 1
    });
    setModalType('add');
    setShowModal(true);
  };

  const handleEditQuestion = (question) => {
    setCurrentQuestion({ 
      ...question,
      options: question.options && question.options.length === 4 
        ? question.options 
        : ['', '', '', '']
    });
    setModalType('edit');
    setShowModal(true);
  };

  const handleViewQuestion = (question) => {
    setCurrentQuestion(question);
    setModalType('view');
    setShowModal(true);
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete question');
        
        setQuestions(questions.filter(q => q.id !== id));
        showNotification('Question deleted successfully');
      } catch (error) {
        console.error('Error deleting question:', error);
        showNotification('Failed to delete question', 'error');
      }
    }
  };

  const handleSaveQuestion = async () => {
    if (!currentQuestion.questionText.trim()) {
      showNotification('Please enter a question text', 'error');
      return;
    }

    if (currentQuestion.options.some(opt => !opt.trim())) {
      showNotification('Please fill all options', 'error');
      return;
    }

    try {
      let response;
      
      if (modalType === 'add') {
        const questionData = {
          questionText: currentQuestion.questionText,
          options: currentQuestion.options,
          correctAnswer: currentQuestion.correctAnswer,
          explanation: currentQuestion.explanation || '',
          category: currentQuestion.category,
          difficulty: currentQuestion.difficulty
        };

        response = await fetch(`${API_BASE_URL}/questions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(questionData)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to add question: ${response.status} - ${errorText}`);
        }
      } else {
        showNotification('Edit functionality requires PUT endpoint in backend', 'error');
        return;
      }

      const savedQuestion = await response.json();
      
      if (modalType === 'add') {
        const fullQuestion = {
          id: savedQuestion.id,
          questionText: savedQuestion.questionText,
          options: currentQuestion.options,
          correctAnswer: currentQuestion.correctAnswer,
          explanation: currentQuestion.explanation,
          category: currentQuestion.category,
          difficulty: currentQuestion.difficulty,
          createdAt: new Date().toISOString()
        };
        setQuestions([...questions, fullQuestion]);
        showNotification('Question added successfully');
      }

      setShowModal(false);
      setCurrentQuestion(null);
    } catch (error) {
      console.error('Error saving question:', error);
      showNotification(`Failed to ${modalType === 'add' ? 'add' : 'update'} question`, 'error');
    }
  };

  const downloadData = (type) => {
    const data = type === 'questions' ? questions : quizResults;
    const filename = type === 'questions' ? 'quiz-questions.json' : 'quiz-results.json';
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(`${type} data downloaded successfully`);
  };

  const downloadCSV = (type) => {
    let csvContent = '';
    
    if (type === 'questions') {
      csvContent = 'ID,Question,Category,Difficulty,Created Date\n';
      csvContent += questions.map(q => 
        `"${q.id || 'N/A'}","${q.questionText}","${q.category}","${q.difficulty}","${q.createdAt}"`
      ).join('\n');
    } else {
      csvContent = 'ID,User Name,Score,Total Questions,Percentage,Duration (s),Completed At\n';
      csvContent += quizResults.map(r => 
        `"${r.id}","${r.userName}","${r.score}","${r.totalQuestions}","${Math.round((r.score/r.totalQuestions)*100)}%","${r.duration || 0}","${r.completedAt}"`
      ).join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(`${type} CSV downloaded successfully`);
  };

  const getDashboardStats = () => {
    const totalQuestions = questions.length;
    const totalAttempts = quizResults.length;
    const averageScore = quizResults.length > 0 
      ? Math.round(quizResults.reduce((sum, r) => sum + (r.score / r.totalQuestions * 100), 0) / quizResults.length)
      : 0;
    const passRate = quizResults.length > 0
      ? Math.round((quizResults.filter(r => (r.score / r.totalQuestions) >= 0.6).length / quizResults.length) * 100)
      : 0;

    return { totalQuestions, totalAttempts, averageScore, passRate };
  };

  const stats = getDashboardStats();

  // Classes for dark mode
  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const inputClass = isDarkMode 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' 
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500';
  const tableHeaderClass = isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600';
  const tableRowClass = isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50';
  const modalClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`rounded-xl shadow-lg p-6 border-l-4 border-blue-500 ${cardClass}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Questions</p>
              <p className={`text-3xl font-bold ${textClass}`}>{stats.totalQuestions}</p>
            </div>
            <BookOpen className="text-blue-500" size={32} />
          </div>
        </div>

        <div className={`rounded-xl shadow-lg p-6 border-l-4 border-green-500 ${cardClass}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Quiz Attempts</p>
              <p className={`text-3xl font-bold ${textClass}`}>{stats.totalAttempts}</p>
            </div>
            <Users className="text-green-500" size={32} />
          </div>
        </div>

        <div className={`rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 ${cardClass}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Average Score</p>
              <p className={`text-3xl font-bold ${textClass}`}>{stats.averageScore}%</p>
            </div>
            <TrendingUp className="text-yellow-500" size={32} />
          </div>
        </div>

        <div className={`rounded-xl shadow-lg p-6 border-l-4 border-purple-500 ${cardClass}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pass Rate</p>
              <p className={`text-3xl font-bold ${textClass}`}>{stats.passRate}%</p>
            </div>
            <BarChart3 className="text-purple-500" size={32} />
          </div>
        </div>
      </div>

      <div className={`rounded-xl shadow-lg p-6 ${cardClass}`}>
        <h2 className={`text-xl font-bold mb-4 flex items-center ${textClass}`}>
          <Calendar className="mr-2 text-blue-500" />
          Recent Quiz Attempts
        </h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader className="animate-spin text-blue-500" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`text-left py-3 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>User</th>
                  <th className={`text-left py-3 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Score</th>
                  <th className={`text-left py-3 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Percentage</th>
                  <th className={`text-left py-3 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Duration</th>
                  <th className={`text-left py-3 px-4 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Date</th>
                </tr>
              </thead>
              <tbody>
                {quizResults.slice(0, 5).map((result) => (
                  <tr key={result.id} className={`border-b ${tableRowClass}`}>
                    <td className={`py-3 px-4 font-medium ${textClass}`}>{result.userName}</td>
                    <td className={`py-3 px-4 ${textClass}`}>{result.score}/{result.totalQuestions}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (result.score / result.totalQuestions) >= 0.8 ? 'bg-green-100 text-green-800' :
                        (result.score / result.totalQuestions) >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {Math.round((result.score / result.totalQuestions) * 100)}%
                      </span>
                    </td>
                    <td className={`py-3 px-4 ${textClass}`}>
                      {result.duration ? `${Math.floor(result.duration / 60)}:${(result.duration % 60).toString().padStart(2, '0')}` : 'N/A'}
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(result.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {quizResults.length === 0 && (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No quiz attempts yet
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderQuestions = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${textClass}`}>Question Management</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Create, edit, and manage quiz questions</p>
        </div>
        <button
          onClick={handleAddQuestion}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus size={16} />
          <span>Add Question</span>
        </button>
      </div>

      <div className={`rounded-xl shadow-lg p-6 ${cardClass}`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputClass}`}
              />
            </div>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputClass}`}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <div className="flex space-x-2">
            <button
              onClick={() => downloadData('questions')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Download size={16} />
              <span>JSON</span>
            </button>
            <button
              onClick={() => downloadCSV('questions')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <FileText size={16} />
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>

      <div className={`rounded-xl shadow-lg overflow-hidden ${cardClass}`}>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="animate-spin text-blue-500" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={tableHeaderClass}>
                <tr>
                  <th className={`text-left py-4 px-6 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Question</th>
                  <th className={`text-left py-4 px-6 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Category</th>
                  <th className={`text-left py-4 px-6 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Difficulty</th>
                  <th className={`text-left py-4 px-6 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Created</th>
                  <th className={`text-left py-4 px-6 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredQuestions.map((question) => (
                  <tr key={question.id} className={tableRowClass}>
                    <td className="py-4 px-6">
                      <div className="max-w-xs">
                        <p className={`font-medium ${textClass} truncate`}>{question.questionText}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{question.options?.length || 0} options</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        question.category === 'SPRING_BOOT' ? 'bg-blue-100 text-blue-800' :
                        question.category === 'DATABASE' ? 'bg-green-100 text-green-800' :
                        question.category === 'SECURITY' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {question.category?.replace('_', ' ') || 'GENERAL'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < question.difficulty ? 'bg-orange-400' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className={`py-4 px-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {question.createdAt ? new Date(question.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewQuestion(question)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditQuestion(question)}
                          className="text-green-600 hover:text-green-800 p-1 rounded"
                          disabled={true}
                          title="Edit requires PUT endpoint in backend"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredQuestions.length === 0 && (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <BookOpen className="mx-auto mb-4" size={48} />
            <p>No questions found</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${textClass}`}>Quiz Results</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>View and analyze quiz performance data</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => downloadData('results')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download size={16} />
            <span>JSON</span>
          </button>
          <button
            onClick={() => downloadCSV('results')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <FileText size={16} />
            <span>CSV</span>
          </button>
        </div>
      </div>

      <div className={`rounded-xl shadow-lg overflow-hidden ${cardClass}`}>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="animate-spin text-blue-500" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={tableHeaderClass}>
                <tr>
                  <th className={`text-left py-4 px-6 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>User</th>
                  <th className={`text-left py-4 px-6 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Score</th>
                  <th className={`text-left py-4 px-6 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Percentage</th>
                  <th className={`text-left py-4 px-6 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Duration</th>
                  <th className={`text-left py-4 px-6 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Status</th>
                  <th className={`text-left py-4 px-6 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Date</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {quizResults.map((result) => {
                  const percentage = Math.round((result.score / result.totalQuestions) * 100);
                  const passed = percentage >= 60;
                  
                  return (
                    <tr key={result.id} className={tableRowClass}>
                      <td className={`py-4 px-6 font-medium ${textClass}`}>{result.userName}</td>
                      <td className={`py-4 px-6 ${textClass}`}>{result.score}/{result.totalQuestions}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          percentage >= 80 ? 'bg-green-100 text-green-800' :
                          percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {percentage}%
                        </span>
                      </td>
                      <td className={`py-4 px-6 ${textClass}`}>
                        {result.duration ? `${Math.floor(result.duration / 60)}:${(result.duration % 60).toString().padStart(2, '0')}` : 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${
                          passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {passed ? <CheckCircle size={12} /> : <X size={12} />}
                          <span>{passed ? 'Passed' : 'Failed'}</span>
                        </span>
                      </td>
                      <td className={`py-4 px-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(result.completedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && quizResults.length === 0 && (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <BarChart3 className="mx-auto mb-4" size={48} />
            <p>No quiz results yet</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal || !currentQuestion) return null;

    const isReadOnly = modalType === 'view';

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${modalClass}`}>
          <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-xl font-bold ${textClass}`}>
                {modalType === 'add' ? 'Add New Question' :
                 modalType === 'edit' ? 'Edit Question' : 'View Question'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className={isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Question Text</label>
              <textarea
                value={currentQuestion.questionText}
                onChange={(e) => setCurrentQuestion({...currentQuestion, questionText: e.target.value})}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputClass}`}
                rows="3"
                disabled={isReadOnly}
                placeholder="Enter your question here..."
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Options</label>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...currentQuestion.options];
                      newOptions[index] = e.target.value;
                      setCurrentQuestion({...currentQuestion, options: newOptions});
                    }}
                    className={`flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      currentQuestion.correctAnswer === index ? 
                      (isDarkMode ? 'border-green-500 bg-green-900' : 'border-green-500 bg-green-50') : 
                      inputClass
                    }`}
                    disabled={isReadOnly}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  />
                  {!isReadOnly && (
                    <button
                      onClick={() => setCurrentQuestion({...currentQuestion, correctAnswer: index})}
                      className={`p-2 rounded-lg transition-colors ${
                        currentQuestion.correctAnswer === index
                          ? 'bg-green-500 text-white'
                          : isDarkMode ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                      }`}
                      title="Mark as correct answer"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                </div>
              ))}
              {currentQuestion.correctAnswer !== undefined && (
                <p className="text-sm text-green-600 mt-2">
                  Correct Answer: Option {String.fromCharCode(65 + currentQuestion.correctAnswer)}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
                <select
                  value={currentQuestion.category}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, category: e.target.value})}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputClass}`}
                  disabled={isReadOnly}
                >
                  {categories.slice(1).map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Difficulty</label>
                <select
                  value={currentQuestion.difficulty}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, difficulty: parseInt(e.target.value)})}
                  className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputClass}`}
                  disabled={isReadOnly}
                >
                  {[1, 2, 3, 4, 5].map(level => (
                    <option key={level} value={level}>Level {level}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Explanation (Optional)</label>
              <textarea
                value={currentQuestion.explanation || ''}
                onChange={(e) => setCurrentQuestion({...currentQuestion, explanation: e.target.value})}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputClass}`}
                rows="3"
                disabled={isReadOnly}
                placeholder="Provide an explanation for the correct answer..."
              />
            </div>
          </div>

          <div className={`p-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-end space-x-3`}>
            <button
              onClick={() => setShowModal(false)}
              className={`px-4 py-2 font-medium ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Cancel
            </button>
            {!isReadOnly && (
              <button
                onClick={handleSaveQuestion}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2"
              >
                <Save size={16} />
                <span>{modalType === 'add' ? 'Add Question' : 'Update Question'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${bgClass}`}>
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className={`shadow-sm border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Settings className="text-blue-600" size={32} />
              <div>
                <h1 className={`text-2xl font-bold ${textClass}`}>Quiz Admin Panel</h1>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Manage questions and view results</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${
                  isDarkMode ? '' : ''
                } hover:opacity-80 transition-opacity`}
              >
              </button>
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : isDarkMode 
                    ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'questions'
                  ? 'border-blue-500 text-blue-600'
                  : isDarkMode 
                    ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Questions
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'results'
                  ? 'border-blue-500 text-blue-600'
                  : isDarkMode 
                    ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Results
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'questions' && renderQuestions()}
        {activeTab === 'results' && renderResults()}
      </div>

      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default AdminQuizSystem;