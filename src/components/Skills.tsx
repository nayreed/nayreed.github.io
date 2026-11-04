import React from 'react';
import SectionHeader from './SectionHeader';
import { Code2, TerminalSquare, CircuitBoard, PenLine } from 'lucide-react';

const skillCategories = [
  {
    title: 'Languages',
    icon: <Code2 size={18} />,
    skills: ['Python', 'C/C++', 'SystemVerilog', 'Java', 'SQL', 'JavaScript/TypeScript'],
  },
  {
    title: 'Systems',
    icon: <TerminalSquare size={18} />,
    skills: ['Linux', 'Bash', 'Git', 'SLURM', 'MPI/OpenMP', 'GPU Computing'],
  },
  {
    title: 'Engineering Tools',
    icon: <CircuitBoard size={18} />,
    skills: ['MATLAB/Simulink', 'QuestaSim', 'Design Compiler', 'Vivado', 'LTspice', 'KiCad'],
  },
  {
    title: 'Professional',
    icon: <PenLine size={18} />,
    skills: ['Experiment Design', 'Simulation & Modelling', 'Research Writing', 'Technical Documentation'],
  },
];

const Skills = () => {
  return (
    <section id="skills" className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        <SectionHeader title="Skills" />

        <div className="card-hairline divide-y divide-hairline" data-reveal="scale">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className="grid grid-cols-1 sm:grid-cols-[13rem_1fr] sm:items-center gap-4 sm:gap-5 p-5 sm:px-7 sm:py-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-soft border border-hairline flex items-center justify-center text-ink shrink-0">
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
