import React from 'react';
import SectionHeader from './SectionHeader';
import { BookOpenText } from 'lucide-react';

const SELF = 'Rezwan Ahmad Nayreed';

const publications = [
  {
    title: 'CES: A Calibrated, Reproducible, and Scalable Simulator for the Edge-Cloud Continuum',
    authors: ['Nam Do', 'Henna Kokkonen', SELF, 'Hassan Mehmood', 'Vu Truong', 'Lauri Lovén'],
    status: 'In preparation',
    contribution: 'Conceptualization, Software, Investigation, Writing (review & editing)',
  },
];

const Publications = () => {
  return (
    <section id="publications" className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        <SectionHeader title="Publications" />

        <div className="space-y-5">
          {publications.map((pub) => (
            <article
              key={pub.title}
              className="card-hairline p-6 sm:p-7 md:p-8 flex items-start gap-3 sm:gap-5"
              data-reveal="scale"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-soft border border-hairline flex items-center justify-center text-ink shrink-0">
                <BookOpenText size={18} />
              </div>
              <div className="min-w-0 flex-grow">
                <span className="inline-flex items-center font-mono text-xs text-charcoal border border-hairline rounded-full px-3 py-1">
                  {pub.status}
                </span>
                <h3 className="font-display text-lg font-bold text-ink leading-snug mt-3">{pub.title}</h3>
                <p className="text-fade text-[15px] leading-relaxed mt-2">
                  {pub.authors.map((author, i) => (
                    <React.Fragment key={author}>
                      {author === SELF ? <strong className="text-ink font-semibold">{author}</strong> : author}
                      {i < pub.authors.length - 1 && ', '}
                    </React.Fragment>
                  ))}
                </p>
                <p className="text-sm text-mute mt-3">
                  <span className="text-charcoal">My role:</span> {pub.contribution}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Publications;
