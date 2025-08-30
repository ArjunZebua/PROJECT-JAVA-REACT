/* eslint-disable react-hooks/exhaustive-deps */
import { Play, Users, Award, Zap, BookOpen, Monitor, Palette, Lightbulb, Star, ChevronRight, Sparkles, ArrowRight, CheckCircle2, Rocket, Globe, Trophy, Heart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState({});
  const [counters, setCounters] = useState({
    students: 0,
    videos: 0,
    mentors: 0,
    satisfaction: 0
  });
  const [activeFeature, setActiveFeature] = useState(0);

  // Pastikan gambar-gambar berikut ada di folder public/assets/
  const features = [
    {
      icon: <Monitor className="w-10 h-10 text-white" />,
      title: "Pembelajaran Interaktif",
      description: "Belajar dengan metode yang menyenangkan dan interaktif melalui video berkualitas tinggi dan materi yang mudah dipahami.",
      color: "bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600",
      image: "/assets/k11.jpg",
      badge: "Interactive"
    },
    {
      icon: <Palette className="w-10 h-10 text-white" />,
      title: "Kreativitas Tanpa Batas",
      description: "Ekspresikan ide kreatif Anda melalui animasi 2D, 3D, motion graphics, dan teknik animasi terdepan.",
      color: "bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500",
      image: "/assets/k12.jpg",
      badge: "Creative"
    },
    {
      icon: <Users className="w-10 h-10 text-white" />,
      title: "Komunitas Solid",
      description: "Bergabung dengan ribuan animator dan desainer dari seluruh Indonesia dalam komunitas yang supportif.",
      color: "bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500",
      image: "/assets/k13.jpg",
      badge: "Community"
    },
    {
      icon: <Award className="w-10 h-10 text-white" />,
      title: "Sertifikat Resmi",
      description: "Dapatkan sertifikat yang diakui industri setelah menyelesaikan kursus untuk meningkatkan nilai CV Anda.",
      color: "bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500",
      image: "/assets/k14.jpg",
      badge: "Certified"
    }
  ];

  const stats = [
    { number: 10000, label: "Siswa Aktif", suffix: "+", icon: <Users className="w-8 h-8" /> },
    { number: 500, label: "Video Tutorial", suffix: "+", icon: <Play className="w-8 h-8" /> },
    { number: 50, label: "Mentor Expert", suffix: "+", icon: <Star className="w-8 h-8" /> },
    { number: 95, label: "Tingkat Kepuasan", suffix: "%", icon: <Heart className="w-8 h-8" /> }
  ];

  const sectionRefs = useRef([]);

  // Auto rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Counter animation
  useEffect(() => {
    const animateCounters = () => {
      const duration = 2500;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setCounters({
          students: Math.floor(10000 * easeOut),
          videos: Math.floor(500 * easeOut),
          mentors: Math.floor(50 * easeOut),
          satisfaction: Math.floor(95 * easeOut)
        });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    };

    const timer = setTimeout(animateCounters, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.section;
            setIsVisible(prev => ({ ...prev, [id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px' }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          {/* Floating Orbs */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
          <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-gradient-to-r from-green-400/30 to-blue-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div 
            className={`text-center transition-all duration-1500 ease-out ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            data-section="hero"
            ref={addToRefs}
          >
            {/* Hero Badge */}
            <div className="inline-flex items-center space-x-3 bg-black text-white rounded-full px-8 py-4 mb-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                <Rocket className="w-6 h-6 text-blue-400" />
              </div>
              <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-xs font-bold">
                #1 CHOICE
              </div>
            </div>

            {/* Main Heading with Stagger Animation */}
            <div className="space-y-4 mb-10">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none">
                <div className="overflow-hidden">
                  <span className={`block text-gray-900 transition-all duration-700 delay-300 ${isVisible.hero ? 'translate-y-0' : 'translate-y-full'}`}>
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span className={`block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent transition-all duration-700 delay-500 ${isVisible.hero ? 'translate-y-0' : 'translate-y-full'}`}>
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span className={`block text-gray-900 transition-all duration-700 delay-700 ${isVisible.hero ? 'translate-y-0' : 'translate-y-full'}`}>
                  </span>
                </div>
              </h1>
            </div>

            <p className={`text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed transition-all duration-1000 delay-900 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            </p>

            {/* CTA Section */}
            <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 delay-1100 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <button className="group relative px-12 py-6 bg-black text-white text-xl font-black rounded-full hover:shadow-2xl transition-all duration-500 transform hover:scale-110 overflow-hidden">
                <span className="relative z-10 flex items-center space-x-4">
                  <Play className="w-7 h-7" />
                  <span>MULAI SEKARANG</span>
                  <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
              
              <button className="px-12 py-6 border-2 border-gray-900 text-gray-900 text-xl font-bold rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center space-x-3">
                <Globe className="w-6 h-6" />
                <span>Jelajahi Kurikulum</span>
              </button>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-1 h-16 bg-gradient-to-b from-gray-900 to-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 relative">
        <div className="container mx-auto max-w-7xl">
          <div 
            className={`text-center mb-20 transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            data-section="features"
            ref={addToRefs}
          >
            <div className="inline-flex items-center space-x-3 bg-gray-100 rounded-full px-8 py-4 mb-8">
              <Zap className="w-6 h-6 text-yellow-500" />
              <span className="text-gray-900 font-bold text-lg">Mengapa Memilih AnimaLearn</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-8">
              Fitur <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Revolusioner</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Teknologi terdepan bertemu dengan metodologi pembelajaran yang telah terbukti menghasilkan animator profesional tingkat dunia
            </p>
          </div>

          {/* Interactive Features Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Feature Cards */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`group relative cursor-pointer transition-all duration-500 ${
                    isVisible.features ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                  } ${activeFeature === index ? 'scale-105' : 'hover:scale-102'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className={`relative p-8 rounded-3xl border-2 transition-all duration-500 overflow-hidden ${
                    activeFeature === index 
                      ? 'border-transparent shadow-2xl' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-xl'
                  }`}>
                    
                    {/* Active Background */}
                    {activeFeature === index && (
                      <div className={`absolute inset-0 ${feature.color} opacity-5`}></div>
                    )}
                    
                    <div className="relative z-10 flex items-start space-x-6">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center shadow-lg ${
                        activeFeature === index ? 'scale-110' : 'group-hover:scale-105'
                      } transition-transform duration-300`}>
                        {feature.icon}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                            activeFeature === index 
                              ? 'bg-black text-white' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {feature.badge}
                          </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                        
                        {/* Progress Bar */}
                        <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${feature.color} transform origin-left transition-all duration-1000 ${
                            activeFeature === index ? 'scale-x-100' : 'scale-x-0'
                          }`}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right - Feature Image */}
            <div className={`relative transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={features[activeFeature].image}
                  alt={features[activeFeature].title}
                  className="w-full h-full object-cover transition-all duration-700 scale-110 hover:scale-100"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent"></div>
                
                {/* Content Overlay */}
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <div className={`inline-flex items-center space-x-2 px-4 py-2 ${features[activeFeature].color} rounded-full mb-4 opacity-90`}>
                    {features[activeFeature].icon}
                    <span className="font-bold">{features[activeFeature].badge}</span>
                  </div>
                  <h3 className="text-3xl font-black mb-3">{features[activeFeature].title}</h3>
                  <p className="text-lg opacity-90 leading-relaxed">{features[activeFeature].description}</p>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-8 right-8 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Feature Indicators */}
              <div className="flex justify-center space-x-3 mt-8">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFeature(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      activeFeature === index 
                        ? 'bg-gray-900 scale-125' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-gray-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div 
            className={`transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            data-section="stats"
            ref={addToRefs}
          >
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black mb-8">
                Pencapaian <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Luar Biasa</span>
              </h2>
              <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Angka-angka yang membuktikan kualitas dan kepercayaan ribuan animator profesional di seluruh Indonesia
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={`group relative text-center transition-all duration-700 hover:scale-105 ${
                    isVisible.stats ? 'animate-fade-in' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Icon */}
                    <div className="relative z-10 mb-6">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                        {stat.icon}
                      </div>
                    </div>
                    
                    {/* Number */}
                    <div className="relative z-10 text-5xl lg:text-6xl font-black mb-4">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-200">
                        {index === 0 ? counters.students.toLocaleString() + stat.suffix :
                         index === 1 ? counters.videos + stat.suffix :
                         index === 2 ? counters.mentors + stat.suffix :
                         counters.satisfaction + stat.suffix}
                      </span>
                    </div>
                    
                    {/* Label */}
                    <div className="relative z-10 text-gray-300 text-lg font-semibold">{stat.label}</div>
                    
                    {/* Bottom Line */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left Side - Content */}
            <div 
              className={`space-y-10 transition-all duration-1000 ${isVisible.mission ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
              data-section="mission"
              ref={addToRefs}
            >
              <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full px-8 py-4 shadow-lg">
                <Lightbulb className="w-6 h-6" />
                <span className="text-lg font-bold">Visi & Misi Kami</span>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                  </span>
                  <br />
                  Terbaik Dunia
                </h2>
                
                <p className="text-2xl text-gray-600 leading-relaxed">
                </p>
              </div>
              
              <div className="space-y-8">
                {[
                  {
                    title: "AI-Powered Learning System",
                    desc: "Algoritma pembelajaran adaptif yang menyesuaikan dengan gaya belajar setiap individu"
                  },
                  {
                    title: "Global Industry Partnership",
                    desc: "Kolaborasi langsung dengan studio animasi ternama Hollywood dan Asia"
                  },
                  {
                    title: "Real-World Project Portfolio",
                    desc: "Pembelajaran berbasis proyek nyata dari klien industri dengan standar professional"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-6 group">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group bg-black text-white font-bold px-8 py-4 rounded-full text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3">
                  <Trophy className="w-6 h-6" />
                  <span>Lihat Pencapaian Alumni</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                
                <button className="border-2 border-gray-900 text-gray-900 font-bold px-8 py-4 rounded-full text-lg hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center justify-center space-x-3">
                  <Globe className="w-5 h-5" />
                  <span>Bergabung Komunitas</span>
                </button>
              </div>
            </div>

            {/* Right Side - Visual Grid */}
            <div 
              className={`transition-all duration-1000 delay-200 ${isVisible.mission ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
            >
              {/* Main Featured Image */}
              <div className="relative group mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="h-80 relative overflow-hidden">
                    <img 
                      src="/assets/studio.jpg"
                      alt="Modern Animation Studio"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    {/* Overlay Content */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center justify-between">
                        <div className="text-white">
                    
                        </div>
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer group-hover:scale-110">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Top Badge */}
                    <div className="absolute top-6 left-6">
                      <div className="bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold">
                         LIVE STUDIO
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Grid of Smaller Images */}
              <div className="grid grid-cols-2 gap-6">
                {/* Creative Workspace */}
                <div className="relative group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="h-48 relative overflow-hidden">
                      <img 
                        src="/assets/workspace.jpg"
                        alt="Creative Workspace"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-white">
                          <div className="font-bold text-lg">Creative Hub</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Community Space */}
                <div className="relative group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="h-48 relative overflow-hidden">
                      <img 
                        src="/assets/community.jpg"
                        alt="Community"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-white">
                          <div className="font-bold text-lg">Global Community</div>
                          <div className="text-gray-200 text-sm">10K+ Active Members</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Stats Cards */}
              <div className="absolute -right-8 -top-8 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">98%</div>
                    <div className="text-gray-600 text-sm">Job Placement</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -left-8 bottom-16 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                    <div className="text-gray-600 text-sm">Student Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black text-white relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/30 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500/30 rounded-full filter blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl">
          <div 
            className={`transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            data-section="cta"
            ref={addToRefs}
          >
            {/* CTA Badge */}
            <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-full px-8 py-4 mb-10 border border-white/20">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <span className="text-xl font-bold">Transformasi Dimulai Hari Ini</span>
            </div>
            
            {/* Main CTA Headline */}
            <h2 className="text-5xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="text-white">Ready to Become</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              </span>
            </h2>
            
            <p className="text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed">
              Bergabunglah dengan revolusi animasi Indonesia. Dari pemula hingga profesional, 
              kami akan membimbing Anda menemukan potensi terbaik dan mengubah passion menjadi karir impian.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col lg:flex-row gap-6 justify-center items-center mb-16">
              <button className="group relative px-12 py-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-xl font-black rounded-full hover:shadow-2xl transition-all duration-500 transform hover:scale-110 overflow-hidden">
                <span className="relative z-10 flex items-center space-x-4">
                  <Rocket className="w-7 h-7" />
                  <span>MULAI JOURNEY SEKARANG</span>
                  <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
              
              <button className="px-12 py-6 border-2 border-white/30 text-white text-xl font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-md flex items-center space-x-3">
                <Users className="w-6 h-6" />
                <span>Gabung Komunitas</span>
              </button>
            </div>
            
            {/* Social Proof */}
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-12 text-gray-400">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>Rated 4.9/5 by 10,000+ students</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-green-400" />
                <span>98% job placement rate</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;