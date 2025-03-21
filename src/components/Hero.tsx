
import React, { useEffect, useState } from 'react';
import AnimatedText from './ui/AnimatedText';
import { ArrowDown, Code, Cpu, Zap } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center relative overflow-hidden">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0"></div>
      
      {/* Grid lines */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KICA8cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgIDxwYXRoIGQ9Ik0gNTAgMCBMIDAgMCAwIDUwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMC41cHgiPjwvcGF0aD4KICA8L3BhdHRlcm4+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSI+PC9yZWN0Pgo8L3N2Zz4=')]"></div>
      
      {/* Animated orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl animate-floating opacity-20"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full filter blur-3xl animate-floating opacity-10" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-6 pt-24 pb-16 relative z-10">
        <div className="flex flex-col space-y-6 max-w-4xl">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 font-medium mb-6 backdrop-blur-sm">
              <Cpu size={14} className="mr-2 text-primary" />
              <span>Electronics & Communications Engineer</span>
            </div>
          </div>

          <div>
            <AnimatedText 
              text="Rezwan Ahmad"
              tag="h1"
              className="text-5xl md:text-7xl font-bold tracking-tight text-white"
              delay={0.5}
              animation="blur-in"
            />
            <AnimatedText 
              text="Nayreed"
              tag="h1"
              className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mt-2"
              delay={1}
              animation="blur-in"
            />
          </div>

          <p className={`text-lg md:text-xl text-white/70 max-w-2xl transition-all duration-1000 delay-[1500ms] ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
            BSc student at University of Oulu, passionate about electronics, programming, and digital innovation. 
            Experienced in web development and committed to creating impactful solutions.
          </p>

          <div className={`flex flex-wrap gap-4 mt-6 transition-all duration-1000 delay-[1800ms] ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
            <a 
              href="#contact" 
              className="relative group bg-primary hover:bg-primary/90 text-white font-medium rounded-md px-6 py-3 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Get in Touch
                <Zap size={16} className="ml-2 animate-pulse" />
              </span>
              <span className="absolute inset-0 w-0 bg-gradient-to-r from-primary to-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#experience" 
              className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-white font-medium rounded-md px-6 py-3 transition-all duration-300 flex items-center"
            >
              <Code size={16} className="mr-2" />
              View Experience
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <a href="#experience" className="flex flex-col items-center text-white/50 hover:text-primary transition-colors duration-300">
          <span className="text-xs mb-2 font-light">Scroll Down</span>
          <ArrowDown className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
