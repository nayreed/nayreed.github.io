import React from 'react';
import GlassCard from './ui/GlassCard';
import { Cpu } from 'lucide-react';
import ProgrammingSkillsIcon from '../assets/programming.svg';
import ProfessionalSkillsIcon from '../assets/professional.svg';
import OtherSkillsIcon from '../assets/other.svg';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Technical Skills',
      icon: <img src={ProgrammingSkillsIcon} alt="Programming Skills Icon" className="w-6 h-6" />,
      skills: [
        'Python', 'C++', 'MATLAB', 'KiCAD', 'HTML5', 'CSS', 'JavaScript', 'React', 'Node.js', 'GitHub', 'Powershell', 'WordPress', 'Shopify', 'Microsoft Office'
      ]
    },
    {
      title: 'Professional Skills',
      icon: <img src={ProfessionalSkillsIcon} alt="Professional Skills Icon" className="w-6 h-6" />,
      skills: [
        'Student tutor', 'Digital Strategy', 'Social Media', 'Organization Skills'
      ]
    },
    {
      title: 'Other Skills',
      icon: <img src={OtherSkillsIcon} alt="Other Skills Icon" className="w-6 h-6" />,
      skills: [
        'Coffee Roasting', 'Barista'
      ]
    }
  ];

  const languages = [
    { name: 'English', level: 'C1 (Advanced)', proficiency: 90 },
    { name: 'Bangla', level: 'C2 (Native)', proficiency: 100 },
    { name: 'Urdu', level: 'B1 (Intermediate)', proficiency: 65 },
    { name: 'Hindi', level: 'B1 (Intermediate)', proficiency: 60},
    { name: 'Finnish', level: 'A1.2 (Basic)', proficiency: 30 }
  ];

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>
      <div className="absolute inset-0 bg-grid opacity-20"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 font-medium mb-4 backdrop-blur-sm">
            <Cpu size={14} className="mr-2 text-primary" />
            <span>Capabilities</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Skills & Languages</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="space-y-8">
            {skillCategories.map((category, index) => (
              <GlassCard key={index} className="p-8" variant={index === 0 ? 'neon' : 'default'} hoverEffect>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mr-3">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{category.title}</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-white/5 border border-white/10 text-white/90 px-4 py-2 rounded-md text-sm transition-all hover:bg-primary/10 hover:border-primary/30 hover:text-white cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="space-y-8">
            <GlassCard className="p-8 h-full" variant="dark" hoverEffect>
              <h3 className="text-xl font-bold text-white mb-8">Languages</h3>
              <div className="space-y-6">
                {languages.map((language, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <p className="font-medium text-white">{language.name}</p>
                      <p className="text-sm text-white/50">{language.level}</p>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${language.proficiency}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
