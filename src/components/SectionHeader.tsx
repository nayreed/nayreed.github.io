import React from 'react';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

const SectionHeader = ({ eyebrow, title, description }: SectionHeaderProps) => (
  <div className="mb-12 md:mb-16 text-center">
    <p className="font-mono text-xs uppercase tracking-[0.25em] text-mute mb-3">{eyebrow}</p>
    <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">{title}</h2>
    {description && (
      <p className="mt-4 text-fade max-w-xl mx-auto leading-relaxed">{description}</p>
    )}
  </div>
);

export default SectionHeader;
