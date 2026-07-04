import React from 'react';
import SectionHeader from './SectionHeader';
import { ArrowUpRight, Github } from 'lucide-react';

const projects = [
  {
    index: '01',
    title: 'Edge Intelligence Simulator (EISim)',
    description: 'Learning-based edge-resource management research platform',
    details:
      'Extended EISim with homogeneous/heterogeneous experiment configurations, TD3 and MADDPG support, upgraded DDPG/TD3 agent variants, and stress-test, out-of-distribution, and domain-randomized evaluation workflows. Built a prototype Linux desktop application and expanded the simulator toward an agentic research direction.',
    tags: ['Java', 'Maven', 'Deeplearning4j/ND4J', 'React', 'TypeScript', 'Python'],
    link: 'https://github.com/RA-Nayreed/EISim',
  },
  {
    index: '02',
    title: 'Federated Multiarch Machine Learning',
    description: 'Flower-based federated learning framework',
    details:
      'A federated learning framework supporting MLP, CNN and Spiking Neural Network (SNN) architectures under both IID and non-IID data distributions.',
    tags: ['Python', 'PyTorch', 'snnTorch', 'Flower'],
    link: 'https://github.com/RA-Nayreed/FMML',
  },
  {
    index: '03',
    title: 'Spectrum Analyzer',
    description: 'Graphical spectral-data analysis tool',
    details:
      'A graphical tool for analyzing and visualizing spectral data, offering features like background removal, intensity calculation, and interactive plotting.',
    tags: ['Python', 'Tkinter', 'Matplotlib', 'NumPy'],
    link: 'https://github.com/RA-Nayreed/Spectrum_Analyzer-1.0/tree/main',
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader eyebrow="02 — Projects" title="Projects" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projects.map((project) => (
            <a
              key={project.title}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group card-hairline p-6 md:p-7 flex flex-col transition-colors hover:border-hairline-strong"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="font-mono text-xs text-mute">{project.index}</span>
                <Github size={16} className="text-mute group-hover:text-ink transition-colors" />
              </div>

              <h3 className="font-display text-lg font-bold text-ink leading-snug">
                {project.title}
              </h3>
              <p className="text-sm text-mute mt-1">{project.description}</p>

              <p className="text-sm text-fade leading-relaxed mt-4 flex-grow">{project.details}</p>

              <div className="flex flex-wrap gap-1.5 mt-6">
                {project.tags.map((tag) => (
                  <span key={tag} className="chip !px-2.5 !py-1">
                    {tag}
                  </span>
                ))}
              </div>

              <span className="inline-flex items-center gap-1 text-sm font-medium text-ink mt-6">
                View on GitHub
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
