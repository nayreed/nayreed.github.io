
import React from 'react';
import GlassCard from './ui/GlassCard';
import { Briefcase } from 'lucide-react';

const Experience = () => {
  const experiences = [
    {
      title: 'Independent Contractor',
      company: 'BGF Consulting LLC',
      location: 'Apopka, Florida',
      period: 'March 2020 - September 2023',
      achievements: [
        'Designed and developed the company website, improving user experience and increasing traffic by 27% over six months, ensuring it met modern web standards and reflected the brand identity.',
        'Edited video presentations for internal and client-facing purposes, improving clarity and visual appeal, leading to a 22% increase in viewer engagement.',
        'Scheduled and coordinated meetings, managing calendars for a team of 8 people, ensuring 100% on-time communication and no missed deadlines.',
        'Collaborated with the team on various projects, adapting quickly to new tasks and responsibilities, delivering 100% of projects on time, even under tight deadlines.'
      ]
    }
  ];

  return (
    <section id="experience" className="py-20 bg-grid">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Career Path
          </span>
          <h2 className="text-3xl md:text-4xl font-bold">Professional Experience</h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {experiences.map((exp, index) => (
            <div key={index} className="mb-8">
              <GlassCard className="p-8" hoverEffect>
                <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Briefcase size={24} />
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold">{exp.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-1 mb-4">
                      <p className="text-lg text-foreground/80">{exp.company}</p>
                      <p className="text-sm text-foreground/60">{exp.period}</p>
                    </div>
                    <p className="text-sm text-foreground/70 mb-4">{exp.location}</p>
                    
                    <ul className="space-y-3">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-primary mt-1.5">•</span>
                          <p className="text-foreground/80">{achievement}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
