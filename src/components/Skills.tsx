import React from 'react';
import SectionHeader from './SectionHeader';
import { Code2, TerminalSquare, CircuitBoard, PenLine } from 'lucide-react';

const skillCategories = [
  {
    title: 'Programming',
    icon: <Code2 size={18} />,
    skills: ['Java', 'Python', 'C/C++', 'JavaScript/TypeScript'],
  },
  {
    title: 'Systems & Tools',
    icon: <TerminalSquare size={18} />,
    skills: ['Linux', 'Bash', 'Git', 'SLURM', 'MPI/OpenMP', 'GPU Computing'],
  },
  {
    title: 'Engineering',
    icon: <CircuitBoard size={18} />,
    skills: ['MATLAB/Simulink', 'LTSpice', 'KiCad'],
  },
  {
    title: 'Professional',
    icon: <PenLine size={18} />,
    skills: ['Research Writing', 'Technical Documentation', 'Result Analysis'],
  },
];

const Skills = () => {
  return (
    <section id="skills" className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        <SectionHeader title="Skills" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {skillCategories.map((category) => (
            <div key={category.title} className="card-hairline p-6 md:p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-full bg-soft border border-hairline flex items-center justify-center text-ink">
                  {category.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-ink">{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {category.skills.map((skill) => (
                  <span key={skill} className="chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
