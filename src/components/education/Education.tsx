
import React, { useState } from 'react';
import EducationCard, { GraduationCap } from './EducationCard';
import TestScoreCard from './TestScoreCard';
import FlipCardStyles from './FlipCardStyles';

const Education: React.FC = () => {
  const [openCollapsible, setOpenCollapsible] = useState(false);

  const education = [
    {
      institution: 'University of Oulu',
      location: 'Oulu, Finland',
      degree: 'B.Sc (Technology) in Electronics and Communications Engineering',
      period: 'August 2024 - PRESENT',
      featured: [
        { title: 'Artificial Intelligence', description: "Highly interested in AI and Machine Learning", grade: '5' },
        { title: 'C++ Programming', description: "Proficient in C++ programming language", grade: '4' },
      ],
      courses: [
        { name: 'Calculus I', grade: '4' },
        { name: 'Elementry Programming', grade: '3' },
        { name: 'Introduction to Electronics', grade: '4' },
        { name: 'Electrical Measurement Principles', grade: '5' },
        { name: 'Matrix Algebra', grade: '5' },
        { name: 'Calculus II', grade: '5' },
        { name: 'Digital Techniques 1', grade: 'Passed' },
        { name: 'Differential Equations', grade: 'NULL' },
        { name: 'Introduction to Internet', grade: 'NULL' },
        { name: 'Probability and Mathematical Statistics', grade: 'NULL' }
      ],
      transcript: "transcript.pdf" // Placeholder for transcript file
    },
    {
      institution: 'Shaheed Bir Bikram Ramiz Uddin Cantonment College',
      location: 'Dhaka, Bangladesh',
      degree: 'Higher Secondary School Certificate',
      period: 'February 2022 - November 2023'
    }
  ];

  const testScores = {
    name: 'SAT',
    date: 'December 2023',
    scores: [
      { subject: 'Total', score: '1360' },
      { subject: 'Math', score: '740' },
      { subject: 'Reading & Writing', score: '620' }
    ]
  };

  return (
    <section id="education" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>
      <div className="absolute inset-0 bg-tech-pattern opacity-10"></div>

      {/* Interactive Easter Egg: Hidden constellation animation that appears on scroll */}
      <div className="constellation absolute inset-0 opacity-0 transition-opacity duration-1000" data-easter-egg="true">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="star absolute w-1 h-1 bg-primary rounded-full animate-pulse-glow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 font-medium mb-4 backdrop-blur-sm">
            <GraduationCap size={14} className="mr-2 text-primary" />
            <span>Academic Background</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Education & Qualifications</h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {education.map((edu, index) => (
            <EducationCard 
              key={index} 
              education={edu} 
              index={index} 
              openCollapsible={openCollapsible} 
              setOpenCollapsible={setOpenCollapsible} 
            />
          ))}

          <TestScoreCard {...testScores} />
        </div>
      </div>
      
      <FlipCardStyles />

      {/* Easter Egg Script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('scroll', function() {
            const constellations = document.querySelectorAll('.constellation');
            if (window.scrollY > 1000 && window.scrollY < 1800) {
              constellations.forEach(c => c.classList.add('opacity-100'));
            } else {
              constellations.forEach(c => c.classList.remove('opacity-100'));
            }
          });

          // Secret keyboard shortcut
          let keySequence = [];
          document.addEventListener('keydown', (e) => {
            keySequence.push(e.key);
            if (keySequence.length > 5) keySequence.shift();

            if (keySequence.join('') === 'oulu') {
              document.body.classList.toggle('matrix-mode');

              const audio = new Audio('https://www.soundjay.com/nature/sounds/rain-07.mp3');
              audio.volume = 0.1;
              audio.play();

              setTimeout(() => {
                document.body.classList.remove('matrix-mode');
              }, 5000);
            }
          });
        `
      }} />
    </section>
  );
};

export default Education;
