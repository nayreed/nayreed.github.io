import React from 'react';
import SectionHeader from './SectionHeader';
import { FileText, ArrowUpRight } from 'lucide-react';

const Articles = () => {
  return (
    <section id="articles" className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        <SectionHeader title="Articles" />

        <a
          href="https://www.linkedin.com/pulse/brain-computer-interfaces-bci-rezwan-ahmad-nayreed-m5iqc/"
          target="_blank"
          rel="noopener noreferrer"
          className="group card-hairline p-6 sm:p-7 md:p-8 flex flex-col sm:flex-row items-start gap-5 transition-colors hover:border-hairline-strong"
          data-reveal="scale"
        >
          <div className="w-11 h-11 rounded-full bg-soft border border-hairline flex items-center justify-center text-ink shrink-0">
            <FileText size={18} />
          </div>
          <div className="flex-grow">
            <h3 className="font-display text-lg font-bold text-ink">
              Brain-Computer Interfaces (BCI)
            </h3>
            <p className="text-fade text-[15px] leading-relaxed mt-2">
              An article discussing the advancements and applications of Brain-Computer
              Interfaces.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-ink mt-4">
              Read on LinkedIn
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>
        </a>
      </div>
    </section>
  );
};

export default Articles;
