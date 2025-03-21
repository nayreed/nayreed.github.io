
import React from 'react';
import GlassCard from './ui/GlassCard';
import { Code, ExternalLink } from 'lucide-react';

const Projects = () => {
  const projects = [
    {
      title: 'Minesweeper',
      description: 'Python Game Project',
      details: 'A classic Minesweeper game implementation using Python, featuring customizable difficulty levels and an intuitive user interface.',
      tags: ['Python', 'Game Development', 'UI Design'],
      link: null
    },
    {
      title: 'Lottery Simulator',
      description: 'Interactive Lottery Simulation Tool',
      details: 'A statistical tool that simulates lottery drawings and calculates probabilities of winning different prize tiers.',
      tags: ['Python', 'Statistics', 'Data Visualization'],
      link: 'https://github.com/nayreed'
    }
  ];

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Portfolio
          </span>
          <h2 className="text-3xl md:text-4xl font-bold">Projects</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {projects.map((project, index) => (
            <GlassCard 
              key={index} 
              className="p-8 flex flex-col h-full"
              hoverEffect
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Code size={24} />
                </div>
                <h3 className="text-xl font-bold">{project.title}</h3>
                <p className="text-foreground/70 text-sm mt-1">{project.description}</p>
              </div>
              
              <p className="text-foreground/80 flex-grow mb-6">
                {project.details}
              </p>
              
              <div className="mt-auto">
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className="bg-primary/5 text-foreground/70 px-3 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {project.link && (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary/80 transition-colors gap-1 text-sm"
                  >
                    View Project <ExternalLink size={14} />
                  </a>
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
