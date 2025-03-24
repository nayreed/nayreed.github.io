import React from 'react';
import GlassCard from './ui/GlassCard';
import { Briefcase, Calendar } from 'lucide-react';
import UsaIcon from '../assets/usa.svg';
import Constellations from '../components/Constellations'; // Corrected import path

const Experience = () => {
  const experiences = [
    {
      title: 'Independent Contractor',
      company: 'BGF Consulting, LLC',
      location: 'Florida, United States',
      period: 'March 2020 - December 2023',
      achievements: [
        'Designed and developed the company website, improving user experience and increasing traffic by 27% over six months, ensuring it met modern web standards and reflected the brand identity.',
        'Edited video presentations for internal and client-facing purposes, improving clarity and visual appeal, leading to a 22% increase in viewer engagement.',
        'Scheduled and coordinated meetings, managing calendars for a team of 8 people, ensuring 100% on-time communication and no missed deadlines.',
        'Collaborated with the team on various projects, adapting quickly to new tasks and responsibilities, delivering 100% of projects on time, even under tight deadlines.'
      ]
    }
  ];

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>
      <div className="absolute inset-0 bg-tech-pattern opacity-10"></div>

      {/* Constellations effect */}
      <Constellations />

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 font-medium mb-4 backdrop-blur-sm">
            <Briefcase size={14} className="mr-2 text-primary" />
            <span>Career Path</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Professional Experience</h2>
        </div>

        <div className="max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <div key={index} className="mb-8">
              <GlassCard className="p-8 border-l-4 border-l-primary" variant="neon" hoverEffect>
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                  <div className="flex-shrink-0 flex md:flex-col items-center md:items-start gap-4 md:gap-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Briefcase size={20} />
                    </div>

                    <div className="flex items-center text-white/50 text-sm">
                      <Calendar size={14} className="mr-2 text-primary/70" />
                      <span>{exp.period}</span>
                    </div>

                    <div className="hidden md:flex items-center text-white/50 text-sm">
                      <img src={UsaIcon} alt="USA Icon" className="w-6 h-6 mr-2" />
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-white mb-1">{exp.title}</h3>
                    <p className="text-lg text-primary mb-2">{exp.company}</p>
                    <div className="md:hidden flex items-center text-white/50 text-sm mb-4">
                      <img src={UsaIcon} alt="USA Icon" className="w-6 h-6 mr-2" />
                      <span>{exp.location}</span>
                    </div>

                    <ul className="space-y-3 mt-4">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="flex gap-3 group">
                          <span className="h-6 w-6 rounded-full bg-primary/10 border border-primary/30 flex-shrink-0 flex items-center justify-center text-primary mt-0.5 group-hover:bg-primary/20 transition-colors">
                            {i + 1}
                          </span>
                          <p className="text-white/80 group-hover:text-white transition-colors">{achievement}</p>
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
