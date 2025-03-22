
import React from 'react';
import GlassCard from './ui/GlassCard';
import { FileText, ExternalLink } from 'lucide-react';
import OtherIcon from '../assets/other.svg';
import ProgrammingIcon from '../assets/programming.svg';

const Articles = () => {
  const articles = [
    {
      title: "The Evolution of Programming Languages",
      description: "A deep dive into how programming languages have evolved over time",
      platform: "LinkedIn",
      date: "March 2024",
      link: "https://www.linkedin.com/pulse/evolution-programming-languages-your-name"
    },
    {
      title: "Machine Learning: Present and Future",
      description: "Exploring current ML applications and future possibilities",
      platform: "LinkedIn",
      date: "January 2024",
      link: "https://www.linkedin.com/pulse/machine-learning-present-future-your-name"
    }
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {articles.map((article, index) => (
            <GlassCard
              key={index}
              className="p-8 flex flex-col h-full border border-white/5"
              variant={index % 2 === 0 ? 'neon' : 'default'}
              hoverEffect
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                  {index % 2 === 0 ? (
                    <img src={ProgrammingIcon} alt="Programming Icon" className="w-6 h-6" />
                  ) : (
                    <img src={OtherIcon} alt="Article Icon" className="w-6 h-6" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-white">{article.title}</h3>
                <p className="text-white/50 text-sm mt-1">{article.platform} • {article.date}</p>
              </div>

              <p className="text-white/70 flex-grow mb-6">
                {article.description}
              </p>

              <div className="mt-auto">
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:text-primary/80 transition-colors gap-1 text-sm group"
                >
                  <span>Read Article</span>
                  <ExternalLink size={14} className="transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </GlassCard>
          ))}

          {/* LinkedIn Post Embed */}
          <GlassCard className="p-8 col-span-1 md:col-span-2" variant="dark" hoverEffect>
            <div className="linkedin-embed-container w-full overflow-hidden rounded-lg">
              <iframe 
                src="https://www.linkedin.com/embed/feed/update/urn:li:share:7085634925641502720" 
                height="600" 
                width="100%" 
                frameBorder="0" 
                allowFullScreen={true}
                title="LinkedIn Post"
                className="rounded-lg"
              ></iframe>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default Articles;
