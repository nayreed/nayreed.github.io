
import React from 'react';
import GlassCard from './ui/GlassCard';
import { GraduationCap, BookOpen } from 'lucide-react';

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
    <section id="education" className="py-20">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Academic Background
          </span>
          <h2 className="text-3xl md:text-4xl font-bold">Education & Qualifications</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          {education.map((edu, index) => (
            <GlassCard key={index} className="p-8" hoverEffect>
              <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <GraduationCap size={24} />
                  </div>
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-xl font-bold">{edu.institution}</h3>
                  <p className="text-sm text-foreground/70 mb-1">{edu.location}</p>
                  <p className="text-lg text-foreground/80 mb-2">{edu.degree}</p>
                  <p className="text-sm text-foreground/60 mb-4">{edu.period}</p>
                  
                  {edu.courses && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium mb-2">Relevant Coursework</h4>
                      <div className="flex flex-wrap gap-2">
                        {edu.courses.map((course, i) => (
                          <span 
                            key={i} 
                            className="bg-primary/5 text-foreground/70 px-3 py-1 rounded-full text-sm"
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

          <GlassCard className="p-8" hoverEffect>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <BookOpen size={24} />
                </div>
              </div>
              
              <div className="flex-grow">
                <h3 className="text-xl font-bold">{testScores.name}</h3>
                <p className="text-sm text-foreground/60 mb-4">{testScores.date}</p>
                
                <div className="space-y-2">
                  {testScores.scores.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-foreground/80">{item.subject}</span>
                      <span className="font-medium">{item.score}</span>
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
