import React from 'react';
import SectionHeader from './SectionHeader';
import { MapPin, Calendar, Check, Briefcase } from 'lucide-react';

const experiences = [
  {
    title: 'Research Assistant',
    company: 'Centre of Applied Computing - University of Oulu',
    location: 'Oulu, Finland',
    period: 'January 2026 - June 2026',
    achievements: [
      'Researched, co-developed, and contributed to manuscript writing for journal resubmission work on intelligent edge orchestration.',
      'Implemented and upgraded deep reinforcement learning agents for learning-based resource-management experiments in edge-computing simulation environments.',
      'Designed stress-testing, out-of-distribution evaluation, and domain-randomization workflows to analyze agent robustness under varying simulation conditions.',
      'Developed a prototype desktop software application, integrating scenario configuration, simulator setup generation, experiment execution, and result inspection.',
      'Contributed to an agentic expansion, exploring diagnosis, strategy, adjudication, and recovery workflows for learning-agent behavior analysis.',
    ],
  },
];

const Experience = () => {
  return (
    <section id="experience" className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        <SectionHeader title="Professional Experience" />

        {experiences.map((exp) => (
          <div key={exp.title} className="card-hairline p-6 sm:p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0">
                <div className="w-11 h-11 rounded-full bg-soft border border-hairline flex items-center justify-center text-ink shrink-0">
                  <Briefcase size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-bold text-ink">{exp.title}</h3>
                  <p className="text-fade mt-1">{exp.company}</p>
                </div>
              </div>
              <div className="flex flex-row md:flex-col flex-wrap gap-2 md:items-end shrink-0">
                <span className="inline-flex max-w-full items-center justify-center gap-2 font-mono text-xs text-charcoal text-center border border-hairline rounded-full px-3 py-1.5">
                  <Calendar size={12} className="shrink-0" />
                  {exp.period}
                </span>
                <span className="inline-flex items-center gap-2 text-xs text-mute">
                  <MapPin size={12} className="shrink-0" />
                  {exp.location}
                </span>
              </div>
            </div>

            <ul className="space-y-3 mt-6">
              {exp.achievements.map((achievement) => (
                <li key={achievement} className="flex gap-3">
                  <Check size={16} className="mt-1 shrink-0 text-ink" />
                  <p className="text-fade text-[15px] leading-relaxed">{achievement}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
