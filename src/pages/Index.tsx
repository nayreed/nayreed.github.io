import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Education from '@/components/Education';
import Skills from '@/components/Skills';
import ExtracurricularActivities from '@/components/ExtracurricularActivities';
import Articles from '@/components/Articles';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  // Smooth scroll for anchor links, offset for the fixed navbar
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchorLink = target.closest('a[href^="#"]');

      if (anchorLink) {
        e.preventDefault();
        const targetId = anchorLink.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.getBoundingClientRect().top + window.scrollY - 72,
              behavior: 'smooth',
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="min-h-screen bg-canvas text-ink antialiased">
      <Navbar />
      {/* Sections ordered by importance */}
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Education />
        <Skills />
        <ExtracurricularActivities />
        <Articles />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
