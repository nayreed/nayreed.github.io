import React from 'react';
import SectionHeader from './SectionHeader';
import { MapPin, Calendar, Check } from 'lucide-react';

const experiences = [
  {
    title: 'Research Assistant',
    company: 'Centre of Applied Computing · University of Oulu',
    location: 'Oulu, Finland',
    period: 'Jan 2026 – Jun 2026',
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
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeader eyebrow="01 — Experience" title="Professional Experience" />

        {experiences.map((exp) => (
          /* The one inverted surface on the page — reserved for the current role */
          <div key={exp.title} className="bg-invert text-invert-ink rounded-xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display text-2xl font-bold">{exp.title}</h3>
                <p className="text-invert-fade mt-1">{exp.company}</p>
              </div>
              <div className="flex flex-col gap-2 md:items-end shrink-0">
                <span className="inline-flex items-center gap-2 font-mono text-xs border border-invert-hairline rounded-full px-3 py-1.5">
                  <Calendar size={12} />
                  {exp.period}
                </span>
                <span className="inline-flex items-center gap-2 text-xs text-invert-fade">
                  <MapPin size={12} />
                  {exp.location}
                </span>
              </div>
            </div>

            <ul className="space-y-3 border-t border-invert-hairline pt-6">
              {exp.achievements.map((achievement) => (
                <li key={achievement} className="flex gap-3">
                  <Check size={16} className="mt-1 shrink-0" />
                  <p className="text-invert-fade text-[15px] leading-relaxed">{achievement}</p>
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
