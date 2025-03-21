
import React from 'react';
import GlassCard from './ui/GlassCard';
import { GraduationCap, BookOpen, Calendar, MapPin } from 'lucide-react';

const Education = () => {
  const education = [
    {
      institution: 'University of Oulu',
      location: 'Finland',
      degree: 'BSc in Electronics and Communications Engineering',
      period: 'September 2024 - PRESENT',
      courses: [
        'Calculus', 'Programming', 'Introduction to Electronics', 
        'Electrical Measurement Principles', 'Matrix Algebra', 
        'Artificial Intelligence', 'Probability and Mathematical Statistics', 
        'Digital Techniques 1'
      ]
    },
    {
      institution: 'Shaheed Bir Bikram Ramiz Uddin Cantonment College',
      location: 'Bangladesh',
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
            <GlassCard key={index} className="p-8" variant={index === 0 ? 'neon' : 'default'} hoverEffect>
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="flex-shrink-0 flex md:flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <GraduationCap size={20} />
                  </div>
                  
                  <div className="flex items-center text-white/50 text-sm">
                    <Calendar size={14} className="mr-2 text-primary/70" />
                    <span>{edu.period}</span>
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-2">
                    <h3 className="text-xl font-bold text-white">{edu.institution}</h3>
                    <div className="flex items-center text-white/50 text-sm">
                      <MapPin size={14} className="mr-2 text-primary/70" />
                      <span>{edu.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-lg text-primary mb-4">{edu.degree}</p>
                  
                  {edu.courses && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium text-white/80 mb-3">Relevant Coursework</h4>
                      <div className="flex flex-wrap gap-2">
                        {edu.courses.map((course, i) => (
                          <span 
                            key={i} 
                            className="bg-white/5 border border-white/10 text-white/70 px-3 py-1 rounded-md text-sm transition-all hover:bg-primary/10 hover:border-primary/30 hover:text-white"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}

          <GlassCard className="p-8" variant="dark" hoverEffect>
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <BookOpen size={20} />
                </div>
              </div>
              
              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-4">
                  <h3 className="text-xl font-bold text-white">{testScores.name}</h3>
                  <div className="flex items-center text-white/50 text-sm">
                    <Calendar size={14} className="mr-2 text-primary/70" />
                    <span>{testScores.date}</span>
                  </div>
                </div>
                
                <div className="space-y-4 border-l-2 border-primary/30 pl-4">
                  {testScores.scores.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-white/80">{item.subject}</span>
                      <span className="font-medium text-white bg-primary/10 border border-primary/20 px-3 py-1 rounded-md">{item.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default Education;
