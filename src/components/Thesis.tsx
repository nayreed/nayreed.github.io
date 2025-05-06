import React from 'react';
import GlassCard from './ui/GlassCard';
import { ExternalLink } from 'lucide-react';
import FlIcon from '../assets/FL.svg'; // Import the FL.svg icon

const Thesis = () => {
  return (
    <section id="thesis" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>
      <div className="absolute inset-0 bg-tech-pattern opacity-10"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 font-medium mb-4 backdrop-blur-sm">
            <img src={FlIcon} alt="Federated Learning Icon" className="w-5 h-5 mr-2" />
            <span>Thesis</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Thesis Work</h2>
        </div>

        <div className="max-w-5xl mx-auto">
          <GlassCard className="p-8 col-span-1 md:col-span-2" variant="dark" hoverEffect>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4">
                <img src={FlIcon} alt="Federated Learning Icon" className="w-full h-full" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Exploring Federated Learning for Privacy-Preserving AI</h3>
              <p className="text-white/70 mb-6 text-center">
                A detailed thesis exploring the applications of Federated Learning in privacy-preserving artificial intelligence systems.
              </p>
              <a
                href="https://example.com/thesis"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:text-primary/80 transition-colors gap-1 text-sm group"
              >
                <span>Read Thesis</span>
                <ExternalLink size={14} className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default Thesis;