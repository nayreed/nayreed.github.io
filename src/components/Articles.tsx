import React from 'react';
import GlassCard from './ui/GlassCard';
import { FileText, ExternalLink } from 'lucide-react';
import BciIcon from '../assets/bci.svg';
import Thesis from './Thesis'; // Import the Thesis component

const Articles = () => {
  return (
    <section id="articles" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>
      <div className="absolute inset-0 bg-tech-pattern opacity-10"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 font-medium mb-4 backdrop-blur-sm">
            <FileText size={14} className="mr-2 text-primary" />
            <span>Publications</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Articles</h2>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Brain-Computer Interfaces (BCI) Article */}
          <GlassCard className="p-8 col-span-1 md:col-span-2" variant="dark" hoverEffect>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4">
                <img src={BciIcon} alt="BCI Icon" className="w-full h-full" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Brain-Computer Interfaces (BCI)</h3>
              <p className="text-white/70 mb-6 text-center">
                An article discussing the advancements and applications of Brain-Computer Interfaces (BCI).
              </p>
              <a
                href="https://www.linkedin.com/pulse/brain-computer-interfaces-bci-rezwan-ahmad-nayreed-m5iqc/?trackingId=Ivpoy1Yy%2FM7cOh4BO%2B1n7A%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:text-primary/80 transition-colors gap-1 text-sm group"
              >
                <span>Read on LinkedIn</span>
                <ExternalLink size={14} className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </GlassCard>

          {/* Thesis Section */}
          <Thesis />
        </div>
      </div>
    </section>
  );
};

export default Articles;
