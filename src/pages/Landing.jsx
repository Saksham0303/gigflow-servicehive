import { Link } from "react-router-dom";
import { Briefcase, Users, Shield, Zap, TrendingUp, CheckCircle, Sparkles, Code, Rocket } from "lucide-react";
import { useState, useEffect } from "react";

export default function Landing() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState([]);
  const [counts, setCounts] = useState({ gigs: 0, freelancers: 0, success: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      setTrail(prev => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY, id: Date.now() }];
        return newTrail.slice(-15); 
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const duration = 2000; 
    const steps = 60;
    const interval = duration / steps;
    
    const targets = { gigs: 10, freelancers: 50, success: 98 };
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounts({
        gigs: Math.floor(targets.gigs * progress),
        freelancers: Math.floor(targets.freelancers * progress),
        success: Math.floor(targets.success * progress)
      });

      if (currentStep >= steps) {
        setCounts(targets);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
     
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="pointer-events-none fixed w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"
          style={{
            left: point.x,
            top: point.y,
            transform: 'translate(-50%, -50%)',
            opacity: (index / trail.length) * 0.4,
            transition: 'opacity 0.3s ease-out',
            zIndex: 9999,
            filter: 'blur(1px)'
          }}
        />
      ))}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        <div 
          className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" 
          style={{ 
            top: '10%', 
            left: '10%', 
            animationDelay: '0s', 
            animationDuration: '20s',
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.15}px)`
          }}
        ></div>
        <div 
          className="absolute w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float" 
          style={{ 
            top: '60%', 
            right: '10%', 
            animationDelay: '2s', 
            animationDuration: '18s',
            transform: `translate(${-scrollY * 0.12}px, ${scrollY * 0.1}px)`
          }}
        ></div>
        <div 
          className="absolute w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-float" 
          style={{ 
            bottom: '10%', 
            left: '50%', 
            animationDelay: '4s', 
            animationDuration: '22s',
            transform: `translate(${scrollY * 0.08}px, ${-scrollY * 0.12}px)`
          }}
        ></div>
        
        <div 
          className="absolute animate-float-slow" 
          style={{ 
            top: '15%', 
            left: '15%', 
            animationDelay: '0s',
            transform: `translate(${scrollY * 0.2}px, ${scrollY * 0.25}px)`
          }}
        >
          <Code className="w-12 h-12 text-blue-400/20" />
        </div>
        <div 
          className="absolute animate-float-slow" 
          style={{ 
            top: '25%', 
            right: '20%', 
            animationDelay: '1s',
            transform: `translate(${-scrollY * 0.15}px, ${scrollY * 0.2}px)`
          }}
        >
          <Rocket className="w-16 h-16 text-cyan-400/20" />
        </div>
        <div 
          className="absolute animate-float-slow" 
          style={{ 
            bottom: '20%', 
            left: '25%', 
            animationDelay: '2s',
            transform: `translate(${scrollY * 0.18}px, ${-scrollY * 0.15}px)`
          }}
        >
          <Sparkles className="w-10 h-10 text-indigo-400/20" />
        </div>
        <div 
          className="absolute animate-float-slow" 
          style={{ 
            top: '50%', 
            right: '15%', 
            animationDelay: '3s',
            transform: `translate(${-scrollY * 0.22}px, ${scrollY * 0.18}px)`
          }}
        >
          <Briefcase className="w-14 h-14 text-blue-400/20" />
        </div>
        
        <div 
          className="absolute w-40 h-40 border-2 border-blue-500/20 rounded-lg animate-spin-slow" 
          style={{ 
            top: '30%', 
            left: '70%',
            transform: `translate(${scrollY * 0.15}px, ${scrollY * 0.2}px) rotate(${scrollY * 0.1}deg)`
          }}
        ></div>
        <div 
          className="absolute w-32 h-32 border-2 border-cyan-500/20 animate-spin-reverse" 
          style={{ 
            bottom: '30%', 
            left: '10%',
            transform: `translate(${scrollY * 0.1}px, ${-scrollY * 0.15}px) rotate(${-scrollY * 0.1}deg)`
          }}
        ></div>
        
        <div 
          className="absolute w-64 h-64 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-2xl animate-pulse"
          style={{ 
            top: '40%', 
            left: '40%',
            transform: `translate(${scrollY * 0.12}px, ${scrollY * 0.12}px) scale(${1 + scrollY * 0.0002})`
          }}
        ></div>
      </div>

    
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-cyan-600/20 to-indigo-600/20"></div>
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full text-blue-200 text-sm mb-8 border border-white/10 hover:border-blue-400/50 transition-all duration-300 group">
            <Zap className="w-4 h-4 text-cyan-400 group-hover:animate-pulse" />
            <span className="font-medium">Trusted by 50,000+ freelancers worldwide</span>
            <Sparkles className="w-4 h-4 text-blue-400 group-hover:animate-spin" />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight animate-fade-in relative">
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              
              <div className="absolute w-[500px] h-[500px] rounded-full opacity-30">
                <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-spin-very-slow"></div>
                <div className="absolute top-0 left-1/2 w-4 h-4 -ml-2 -mt-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50 animate-pulse"></div>
              </div>
              
              <div className="absolute w-[400px] h-[400px] rounded-full opacity-40">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40 animate-spin-slow-reverse"></div>
                <div className="absolute top-1/2 right-0 w-3 h-3 -mr-1.5 -mt-1.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
              
              <div className="absolute w-[300px] h-[300px] rounded-full opacity-50">
                <div className="absolute inset-0 rounded-full border border-indigo-400/50 animate-spin-medium"></div>
                <div className="absolute bottom-0 left-1/2 w-2 h-2 -ml-1 -mb-1 bg-indigo-400 rounded-full shadow-lg shadow-indigo-400/50 animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
              
              <div className="absolute w-1 h-1 bg-blue-300 rounded-full animate-orbit-1"></div>
              <div className="absolute w-1 h-1 bg-cyan-300 rounded-full animate-orbit-2"></div>
              <div className="absolute w-1 h-1 bg-indigo-300 rounded-full animate-orbit-3"></div>
              
              <div className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
            </div>
            
            <span className="relative z-10">Find & Hire</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent animate-gradient relative z-10">
              Freelancers Effortlessly
            </span>
          </h1>
          
          <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Post gigs, receive competitive bids, and hire top talent with a secure, 
            transparent workflow designed for the modern era.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="group relative px-10 py-5 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105 transform duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Started Free
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              to="/browse"
              className="px-10 py-5 border-2 border-blue-400/50 text-white rounded-2xl font-bold hover:bg-white/10 hover:border-blue-400 transition-all hover:scale-105 transform duration-300 backdrop-blur-sm"
            >
              Browse Opportunities
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { value: counts.gigs, suffix: 'K+', label: 'Active Gigs', icon: Briefcase },
              { value: counts.freelancers, suffix: 'K+', label: 'Freelancers', icon: Users },
              { value: counts.success, suffix: '%', label: 'Success Rate', icon: CheckCircle }
            ].map((stat, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300 hover:scale-105">
                  <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:animate-bounce" />
                  <div className="text-4xl font-black text-white mb-1">{stat.value}{stat.suffix}</div>
                  <div className="text-sm text-blue-200 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(15 23 42)"/>
          </svg>
        </div>
      </section>

    
      <section className="py-24 px-6 bg-slate-900 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
              How GigFlow <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Works</span>
            </h2>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              Three simple steps to connect with talented freelancers and get your work done
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Briefcase,
                title: "Post a Gig",
                desc: "Create a detailed gig listing with your requirements, timeline, and budget in minutes.",
                color: "from-blue-500 to-indigo-600",
                step: "01"
              },
              {
                icon: Users,
                title: "Get Quality Bids",
                desc: "Receive competitive proposals from verified freelancers with transparent pricing and portfolios.",
                color: "from-purple-500 to-pink-600",
                step: "02"
              },
              {
                icon: CheckCircle,
                title: "Hire with Confidence",
                desc: "Review detailed proposals, check ratings, and hire the perfect freelancer with one click.",
                color: "from-orange-500 to-red-600",
                step: "03"
              },
            ].map((step, i) => (
              <div
                key={i}
                className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 border border-white/5 hover:border-blue-500/50 hover:-translate-y-3"
              >
                <div className="absolute -top-6 -right-6 text-8xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                  {step.step}
                </div>
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-2xl`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">{step.title}</h3>
                <p className="text-blue-200 leading-relaxed">{step.desc}</p>
                
               
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${step.color} opacity-20 blur-xl`}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <div className="flex items-center gap-4">
              <div className="h-1.5 w-28 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
              <div className="h-1.5 w-28 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-1.5 w-28 bg-gradient-to-r from-orange-500 to-red-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">GigFlow?</span>
            </h2>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              Join thousands of businesses who trust GigFlow for their freelancing needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Bank-Grade Security",
                desc: "Enterprise-level encryption and protected workflows ensure your data and payments are always safe.",
                gradient: "from-green-400 to-emerald-600"
              },
              {
                icon: TrendingUp,
                title: "Transparent Bidding",
                desc: "Clear pricing, detailed proposals, and verified freelancer profiles help you make informed decisions.",
                gradient: "from-blue-400 to-indigo-600"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Streamlined interface designed for productivity. Post gigs and hire talent in minutes, not hours.",
                gradient: "from-purple-400 to-pink-600"
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 border border-white/5 hover:border-blue-500/50 hover:scale-105"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-2xl`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-2xl mb-3 text-white">{feature.title}</h3>
                <p className="text-blue-200 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-24 px-6 bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-indigo-600 rounded-3xl p-16 text-center shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]"></div>
            
            <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10">
              <Sparkles className="w-16 h-16 text-cyan-300 mx-auto mb-6 animate-spin-slow" />
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Join GigFlow today and experience the future of freelancing. No credit card required.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-2xl hover:shadow-white/50 hover:scale-110 transform duration-300"
              >
                Create Free Account
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>


      <footer className="bg-black text-gray-400 py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-white font-black text-2xl mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">GigFlow</h3>
              <p className="text-sm leading-relaxed">The modern platform for hiring freelancers and growing your business with confidence.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} GigFlow. All rights reserved. Made with 💜 for freelancers</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-30px) translateX(20px);
          }
          66% {
            transform: translateY(-15px) translateX(-20px);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-40px) rotate(10deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes spin-very-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-slow-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes spin-medium {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes orbit-1 {
          0% {
            transform: rotate(0deg) translateX(180px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(180px) rotate(-360deg);
          }
        }

        @keyframes orbit-2 {
          0% {
            transform: rotate(120deg) translateX(150px) rotate(-120deg);
          }
          100% {
            transform: rotate(480deg) translateX(150px) rotate(-480deg);
          }
        }

        @keyframes orbit-3 {
          0% {
            transform: rotate(240deg) translateX(120px) rotate(-240deg);
          }
          100% {
            transform: rotate(600deg) translateX(120px) rotate(-600deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 25s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 25s linear infinite;
        }

        .animate-spin-very-slow {
          animation: spin-very-slow 40s linear infinite;
        }

        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 35s linear infinite;
        }

        .animate-spin-medium {
          animation: spin-medium 20s
          linear infinite;
}
          .animate-orbit-1 {
      animation: orbit-1 15s linear infinite;
    }

    .animate-orbit-2 {
      animation: orbit-2 12s linear infinite;
    }

    .animate-orbit-3 {
      animation: orbit-3 18s linear infinite;
    }

    .animate-pulse-slow {
      animation: pulse-slow 4s ease-in-out infinite;
    }

    .animate-gradient {
      background-size: 200% 200%;
      animation: gradient 5s ease infinite;
    }

    .animate-fade-in {
      animation: fade-in 1s ease-out;
    }
  `}</style>
</div>
);
}