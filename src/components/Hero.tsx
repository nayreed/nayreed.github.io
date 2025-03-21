
import React, { useEffect, useState } from 'react';
import AnimatedText from './ui/AnimatedText';
import { ArrowDown, Code, Cpu, Zap, Download } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clickEffect, setClickEffect] = useState({ active: false, x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleClick = (e: MouseEvent) => {
      setClickEffect({ active: true, x: e.clientX, y: e.clientY });
      setTimeout(() => setClickEffect({ active: false, x: 0, y: 0 }), 700);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // Easter egg - Konami code
    let keys: string[] = [];
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    const handleKeyDown = (e: KeyboardEvent) => {
      keys.push(e.key);
      keys = keys.slice(-10);

      if (keys.join(',') === konamiCode.join(',')) {
        document.querySelector('.hero-section')?.classList.add('konami-active');
        setTimeout(() => {
          document.querySelector('.hero-section')?.classList.remove('konami-active');
        }, 5000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <section id="home" className="hero-section min-h-screen flex flex-col justify-center relative overflow-hidden">
      {/* Futuristic background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0"></div>

      {/* Interactive grid lines that follow mouse */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KICA8cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgIDxwYXRoIGQ9Ik0gNTAgMCBMIDAgMCAwIDUwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMC41cHgiPjwvcGF0aD4KICA8L3BhdHRlcm4+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSI+PC9yZWN0Pgo8L3N2Zz4=')]"></div>

      {/* Mouse follower highlight */}
      <div
        className="pointer-events-none absolute w-80 h-80 rounded-full bg-primary/5 blur-[80px] transition-all duration-200 ease-out"
        style={{
          left: `${mousePosition.x - 160}px`,
          top: `${mousePosition.y - 160}px`,
          opacity: isVisible ? 0.3 : 0
        }}
      ></div>

      {/* Click ripple effect */}
      {clickEffect.active && (
        <div
          className="pointer-events-none absolute w-4 h-4 rounded-full bg-primary animate-ping"
          style={{
            left: `${clickEffect.x}px`,
            top: `${clickEffect.y}px`,
            opacity: 0.7
          }}
        ></div>
      )}

      {/* Animated orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl animate-floating opacity-20"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full filter blur-3xl animate-floating opacity-10" style={{
      animationDelay: '1s'
    }}></div>

      <div className="container mx-auto px-6 pt-24 pb-16 relative z-10">
        <div className="flex flex-col space-y-6 max-w-4xl">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 font-medium mb-6 backdrop-blur-sm">
              <Cpu size={14} className="mr-2 text-primary" />
              <span>Electronics &amp; Communications Engineering Student</span>
            </div>
          </div>

          <div>
            <AnimatedText text="Rezwan Ahmad" tag="h1" className="text-5xl md:text-7xl font-bold tracking-tight text-white" delay={0.5} animation="blur-in" />
            <AnimatedText text="Nayreed" tag="h1" className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-grey" delay={1} animation="blur-in" />
          </div>

          <p className={`text-lg md:text-xl text-white/70 max-w-2xl transition-all duration-1000 delay-[1500ms] ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
            BSc student at University of Oulu, passionate about electronics, programming, and digital innovation.
            Experienced in web development and committed to creating impactful solutions.
          </p>

          <div className={`flex flex-wrap gap-4 mt-6 transition-all duration-1000 delay-[1800ms] ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
            <a
              href="#contact"
              className="relative group bg-primary hover:bg-primary/90 text-white font-medium rounded-md px-6 py-3 transition-all duration-300 overflow-hidden"
              data-tooltip="Let's collaborate"
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
              data-tooltip="See my professional journey"
            >
              <Code size={16} className="mr-2" />
              View Experience
            </a>
            <a
              href="#"
              className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 text-white font-medium rounded-md px-6 py-3 transition-all duration-300 flex items-center secret-resume-button"
              onClick={(e) => {
                e.preventDefault();
                alert('Easter egg: Resume download coming soon!');
                document.querySelector('.secret-resume-button')?.classList.add('pulse-animation');
                setTimeout(() => {
                  document.querySelector('.secret-resume-button')?.classList.remove('pulse-animation');
                }, 1000);
              }}
              data-tooltip="Download my resume"
            >
              <Download size={16} className="mr-2" />
              Resume PDF
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

      {/* Extra futuristic elements */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-primary/5 to-transparent"></div>

      <div className="absolute top-20 right-20 hidden md:block">
        <div className="text-xs font-mono text-white/30 typing-effect">
          <span data-typing="Electronics student. Developer. Innovator."></span>
        </div>
      </div>

      {/* Typing effect script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          // Typing effect
          document.querySelectorAll('[data-typing]').forEach(el => {
            const text = el.getAttribute('data-typing');
            if (!text) return;

            let i = 0;
            let isDeleting = false;
            let speed = 100;

            function type() {
              const fullText = text;

              if (isDeleting) {
                el.textContent = fullText.substring(0, i-1);
                i--;
                speed = 50;
              } else {
                el.textContent = fullText.substring(0, i+1);
                i++;
                speed = 100;
              }

              if (!isDeleting && i === fullText.length) {
                isDeleting = true;
                speed = 1000;
              } else if (isDeleting && i === 0) {
                isDeleting = false;
                speed = 500;
              }

              setTimeout(type, speed);
            }

            setTimeout(type, 1000);
          });

          // Konami code effect
          document.querySelector('.hero-section')?.addEventListener('animationend', function() {
            this.classList.remove('konami-active');
          });
        `
      }} />

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse-animation {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); box-shadow: 0 0 15px rgba(59, 130, 246, 0.5); }
            100% { transform: scale(1); }
          }

          .pulse-animation {
            animation: pulse-animation 0.5s ease-out;
          }

          .konami-active {
            animation: matrix-effect 5s ease-out;
          }

          @keyframes matrix-effect {
            0% { filter: hue-rotate(0deg); }
            30% { filter: hue-rotate(120deg); }
            60% { filter: hue-rotate(240deg); }
            100% { filter: hue-rotate(360deg); }
          }

          .matrix-mode {
            filter: hue-rotate(90deg) invert(0.8);
            transition: filter 0.5s ease;
          }

          [data-tooltip] {
            position: relative;
          }

          [data-tooltip]:hover:after {
            content: attr(data-tooltip);
            position: absolute;
            bottom: -30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 100;
            opacity: 0;
            animation: tooltip-fade 0.3s ease forwards;
          }

          @keyframes tooltip-fade {
            from { opacity: 0; transform: translate(-50%, -5px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
        `
      }} />
    </section>
  );
};

export default Hero;
