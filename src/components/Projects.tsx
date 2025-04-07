import React from 'react';
import GlassCard from './ui/GlassCard';
import { Code, ExternalLink, Github, Layers } from 'lucide-react';
import SpectrumAnalyzerIcon from '../assets/spectrum-analyzer.svg';
import MinesweeperIcon from '../assets/minesweeper.svg';
import FortuneWheelIcon from '../assets/slot-machine.svg';

const Projects = () => {
  const projects = [
    {
      title: 'Spectrum Analyzer',
      description: 'Python Data Visualization Project',
      details: 'A graphical tool for analyzing and visualizing spectral data, offering features like background removal, intensity calculation, and interactive plotting.',
      tags: ["Python", "Data Visualization", "Spectral Analysis"],
      link: 'https://github.com/RA-Nayreed/Spectrum_Analyzer-1.0/tree/main'
    },
    {
      title: 'Minesweeper',
      description: 'Python Game Project',
      details: 'A classic Minesweeper game implementation using Python, featuring customizable difficulty levels and an intuitive user interface.',
      tags: ['Python', 'Game Development', 'UI Design'],
      link: 'https://github.com/RA-Nayreed/Minesweeper/tree/main'
    },
    {
      title: 'Lottery Simulator',
      description: 'Interactive Lottery Simulation Tool',
      details: 'A statistical tool that simulates lottery drawings and calculates probabilities of winning different prize tiers.',
      tags: ['Python', 'Statistics', 'Data Visualization'],
      link: 'https://colab.research.google.com/drive/1Jlsu8hlgZTQ5yB4bv8W5YdJR91x-v0Uz?usp=sharing#scrollTo=KR205SBD_oD7'
    }
  ];

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>
      <div className="absolute inset-0 bg-grid opacity-10"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 font-medium mb-4 backdrop-blur-sm">
            <Layers size={14} className="mr-2 text-primary" />
            <span>Portfolio</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Projects</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {projects.map((project, index) => (
            <GlassCard
              key={index}
              className="p-8 flex flex-col h-full border border-white/5"
              variant={index % 2 === 0 ? 'neon' : 'default'}
              hoverEffect
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                  {project.title === 'Spectrum Analyzer' ? (
                    <img src={SpectrumAnalyzerIcon} alt="Spectrum Analyzer Icon" className="w-6 h-6" />
                  ) : project.title === 'Minesweeper' ? (
                    <img src={MinesweeperIcon} alt="Minesweeper Icon" className="w-6 h-6" />
                  ) : project.title === 'Lottery Simulator' ? (
                    <img src={FortuneWheelIcon} alt="Lottery Simulator Icon" className="w-6 h-6" />
                  ) : (
                    <Code size={20} />
                  )}
                </div>
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
                <p className="text-white/50 text-sm mt-1">{project.description}</p>
              </div>

              <p className="text-white/70 flex-grow mb-6">
                {project.details}
              </p>

              <div className="mt-auto">
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-white/5 border border-white/10 text-white/60 px-3 py-1 rounded-md text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary/80 transition-colors gap-1 text-sm group"
                  >
                    <span>View Project</span>
                    <ExternalLink size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </a>
                ) : (
                  <div className="inline-flex items-center text-white/40 gap-1 text-sm">
                    <Github size={14} className="mr-1" />
                    <span>Private Repository</span>
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
