import React from 'react';

interface SectionHeaderProps {
  title: string;
  description?: string;
}

const SectionHeader = ({ title, description }: SectionHeaderProps) => (
  <div className="mb-10 md:mb-14 text-center">
    <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">{title}</h2>
    {description && (
      <p className="mt-4 text-fade max-w-xl mx-auto leading-relaxed">{description}</p>
    )}
  </div>
);

export default SectionHeader;
