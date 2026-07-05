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
import InteractiveAlien from '@/components/InteractiveAlien';

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

  useEffect(() => {
    const animatedElements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal], [data-progress]')
    );

    const showElement = (element: HTMLElement) => {
      element.classList.add('is-visible');
    };

    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      animatedElements.forEach(showElement);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            showElement(element);
            return;
          }
          element.classList.remove('is-visible');
        });
      },
      {
        rootMargin: '-72px 0px -12% 0px',
        threshold: 0.01,
      }
    );

    animatedElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-canvas text-ink antialiased overflow-x-clip">
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
      <InteractiveAlien />
    </div>
  );
};

export default Index;
