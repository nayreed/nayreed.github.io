import React from 'react';
import SectionHeader from './SectionHeader';
import { ArrowUpRight, Github } from 'lucide-react';
import EisimDemoPlayer from './EisimDemoPlayer';

const EISIM_DEMO_URL = 'https://a3s.fi/swift/v1/nayreed/EISim-demo.mp4';

const projects = [
  {
    title: 'Edge Intelligence Simulator',
    description: 'Deep-RL research platform for edge-resource management',
    details:
      'Extended the EISim simulator with TD3 and MADDPG agents, upgraded DDPG and TD3 variants. Built stress-test, out-of-distribution, and domain-randomization evaluation pipelines, plus a Linux desktop app that takes an experiment from scenario configuration to result inspection.',
    tags: ['Java', 'Maven', 'Deeplearning4j/ND4J', 'React', 'TypeScript', 'Python'],
    demoUrl: EISIM_DEMO_URL,
  },
  {
    title: 'Federated Multiarch Machine Learning',
    description: 'Flower-based federated learning framework',
    details:
      'A federated learning framework supporting MLP, CNN and Spiking Neural Network (SNN) architectures under both IID and non-IID data distributions.',
    tags: ['Python', 'PyTorch', 'snnTorch', 'Flower'],
    repo: 'RA-Nayreed/FMML',
    link: 'https://github.com/RA-Nayreed/FMML',
  },
  {
    title: 'Spectrum Analyzer',
    description: 'Graphical spectral-data analysis tool',
    details:
      'A graphical tool for analyzing and visualizing spectral data, offering features like background removal, intensity calculation, and interactive plotting.',
    tags: ['Python', 'Tkinter', 'Matplotlib', 'NumPy'],
    repo: 'RA-Nayreed/Spectrum_Analyzer-1.0',
    link: 'https://github.com/RA-Nayreed/Spectrum_Analyzer-1.0/tree/main',
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        <SectionHeader title="Projects" />

        <div className="space-y-5">
          {projects.map((project, index) => {
            const content = (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-sm text-mute mt-1">{project.description}</p>
                  </div>
                  {'link' in project && project.link ? (
                    <ArrowUpRight
                      size={18}
                      className="shrink-0 mt-1 text-mute group-hover:text-ink transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  ) : null}
                </div>

                <p className="text-[15px] text-fade leading-relaxed mt-4">{project.details}</p>

                <div className="flex flex-wrap gap-1.5 mt-6">
                  {project.tags.map((tag) => (
                    <span key={tag} className="chip !px-2.5 !py-1">
                      {tag}
                    </span>
                  ))}
                </div>

                {'demoUrl' in project && project.demoUrl ? (
                  <EisimDemoPlayer src={project.demoUrl} />
                ) : (
                  <div className="mt-5">
                    <span className="inline-flex max-w-full items-center gap-1.5 font-mono text-xs text-mute group-hover:text-ink transition-colors">
                      <Github size={13} />
                      <span className="min-w-0 break-all">{project.repo}</span>
                    </span>
                  </div>
                )}
              </>
            );

            if ('link' in project && project.link) {
              return (
                <a
                  key={project.title}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group card-hairline block p-6 sm:p-8 transition-colors hover:border-hairline-strong"
                  data-reveal="scale"
                  style={{ '--reveal-delay': `${index * 90}ms` } as React.CSSProperties}
                >
                  {content}
                </a>
              );
            }

            return (
              <article
                key={project.title}
                className="card-hairline p-6 sm:p-8"
                data-reveal="scale"
                style={{ '--reveal-delay': `${index * 90}ms` } as React.CSSProperties}
              >
                {content}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
