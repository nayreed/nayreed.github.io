
import React, { useEffect, useState } from 'react';
import AnimatedText from './ui/AnimatedText';
import { ArrowDown } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center relative overflow-hidden bg-grid">
      {/* Abstract background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl animate-floating opacity-70"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/20 rounded-full filter blur-3xl animate-floating opacity-60" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-6 pt-24 pb-16 relative z-10">
        <div className="flex flex-col space-y-6 max-w-4xl">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Electronics & Communications Engineer
            </span>
          </div>

          <div>
            <AnimatedText 
              text="Rezwan Ahmad"
              tag="h1"
              className="text-5xl md:text-7xl font-bold tracking-tight"
              delay={0.5}
              animation="blur-in"
            />
            <AnimatedText 
              text="Nayreed"
              tag="h1"
              className="text-5xl md:text-7xl font-bold tracking-tight text-primary mt-2"
              delay={1}
              animation="blur-in"
            />
          </div>

          <p className={`text-lg md:text-xl text-foreground/80 max-w-2xl transition-all duration-1000 delay-[1500ms] ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
            BSc student at University of Oulu, passionate about electronics, programming, and digital innovation. 
            Experienced in web development and committed to creating impactful solutions.
          </p>

          <div className={`flex flex-wrap gap-4 mt-6 transition-all duration-1000 delay-[1800ms] ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
            <a 
              href="#contact" 
              className="bg-primary hover:bg-primary/90 text-white font-medium rounded-full px-8 py-3 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get in Touch
            </a>
            <a 
              href="#experience" 
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-foreground font-medium rounded-full px-8 py-3 transition-all duration-300"
            >
              View Experience
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#experience" aria-label="Scroll down">
          <ArrowDown className="text-primary" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
