import React from 'react';
import SectionHeader from './SectionHeader';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';
import finlandMarker from '@/assets/finland.svg?url';

const activities = [
  {
    title: 'CSC Summer School in High-Performance Computing (2026)',
    location: 'Hotelli Nuuksio, Espoo, Finland',
    date: 'June 23 - July 2',
    description:
      "Selected for CSC's intensive summer school, with participation sponsored by Eviden during the launch period of Roihu, CSC's new national supercomputer. Worked on hands-on parallel programming and scientific application scaling across MPI, OpenMP, GPU, and multi-GPU workflows, including job execution, debugging, and performance monitoring on real supercomputing systems.",
    skills: [
      'Parallel Programming',
      'MPI',
      'OpenMP',
      'GPU Computing',
      'Multi-GPU Programming',
      'Performance Analysis',
      'Scientific Computing',
    ],
    link: {
      label: 'Certificate',
      url: 'https://a3s.fi/swift/v1/nayreed/the-csc-summer-school-in-high-performance-computing.pdf',
    },
  },
  {
    title: 'JunctionX OuluES - 2nd Runner-Up, Nordea Challenge (2025)',
    location: 'University of Oulu',
    date: 'September 18 - September 21',
    description:
      'Developed Aisti, a sensory data platform that turns dry data into visual and auditory signals, enabling intuitive anomaly detection using ML and sonification in a multi-modal pipeline.',
    skills: [
      'Machine Learning',
      'Data Sonification',
      'LLM Integration',
      'Interactive Dashboards',
      'Problem-Solving',
      'Team Collaboration',
    ],
    link: {
      label: 'Demo',
      url: 'https://youtu.be/TPLN8XH-00U',
    },
  },
  {
    title: 'Operations Associate - AIESEC',
    location: 'Oulu, Finland',
    date: 'March 2025 - March 2026',
    description:
      "Active member of the operations team, supporting the planning and execution of AIESEC's youth leadership and student exchange initiatives.",
    skills: [
      'Teamwork',
      'Event Coordination',
      'Operations Administration',
      'Communication',
      'Cultural Engagement',
    ],
    link: null,
  },
  {
    title: 'Hack Oulu 2025 - AI Siege',
    location: 'University of Oulu',
    date: 'April 11 - April 13',
    description:
      'Competed in AI security battles, taking on both attacker and defender roles in adversarial chatbot scenarios.',
    skills: [
      'Strategic Critical Thinking',
      'Advanced Prompt Engineering',
      'Social Engineering Awareness',
      'Cybersecurity Mindset',
      'Innovation',
      'Technical Proficiency',
    ],
    link: {
      label: 'Badge',
      url: 'https://openbadgepassport.com/app/badge/info/918042',
    },
  },
  {
    title: 'MSc Student Tutor - Orientation and Support Role',
    location: 'University of Oulu',
    date: 'May 2025 - November 2025',
    description:
      "Appointed as a student tutor to guide incoming Master's students in Electronics, supporting their academic and cultural integration.",
    skills: [
      'Leadership',
      'Cross-Cultural Communication',
      'Mentorship',
      'Organizational Skills',
      'Peer Support',
      'Problem-Solving',
    ],
    link: {
      label: 'Badge',
      url: 'https://openbadgepassport.com/app/badge/info/1102937',
    },
  },
];

const isFinlandLocation = (location: string) =>
  location.includes('Oulu, Finland') || location.includes('Espoo, Finland');

const UniversityOfOuluMarker = () => (
  <svg
    viewBox="0 0 512 512"
    aria-hidden="true"
    className="inline-block h-3 w-3 shrink-0 text-ink"
  >
    <g fill="currentColor" transform="matrix(0.307205 0 0 -0.307205 -71.6618 802.8115)">
      <g transform="translate(1605.8906 2424.1777)">
        <path d="M0 0-65.521 65.518-71.501 59.537-347.547-216.51-282.029-282.033Z" />
      </g>
      <g transform="translate(809.311 2142.1455)">
        <path d="M0 0 65.521 65.522-216.51 347.551-282.027 282.029-276.043 276.049Z" />
      </g>
      <g transform="translate(1110.9893 2613.2764)">
        <path d="M0 0H-92.656V-8.459-398.842H0Z" />
      </g>
      <g transform="translate(1269.3086 1042.1436)">
        <path
          fillRule="evenodd"
          d="M0 0H-405.437L-450.079 401.051H-511.405-608.806-694.184V799H-559.159V572.176H-492.812-270.23V799H-135.207V572.176H-69.59 87.375 153.713V799H288.747V401.051H221.235 105.962 44.643ZM130.107 305.545H221.235 384.25V894.504H58.209V846.754 667.679H-39.701V894.504H-365.736V667.679H-463.652V894.504H-789.687V305.545H-608.806-535.542L-490.901-95.507H85.463Z"
        />
      </g>
    </g>
  </svg>
);

const ExtracurricularActivities = () => {
  return (
    <section id="activities" className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        <SectionHeader title="Professional Development & Activities" />

        <div className="space-y-5">
          {activities.map((act, index) => (
            <div
              key={act.title}
              className="card-hairline p-6 sm:p-7 md:p-8"
              data-reveal="scale"
              style={{ '--reveal-delay': `${index * 70}ms` } as React.CSSProperties}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-bold text-ink leading-snug">
                    {act.title}
                  </h3>
                </div>
                <div className="flex flex-col gap-2 md:items-end shrink-0">
                  <span className="inline-flex items-baseline justify-center md:justify-end gap-2 text-xs text-mute text-center md:text-right">
                    {act.location === 'University of Oulu' ? (
                      <UniversityOfOuluMarker />
                    ) : isFinlandLocation(act.location) ? (
                      <img src={finlandMarker} alt="" aria-hidden="true" className="w-3.5 h-3.5 object-contain shrink-0 self-center" />
                    ) : (
                      <MapPin size={12} className="shrink-0 self-center" />
                    )}
                    {act.location}
                  </span>
                  <span className="inline-flex max-w-full items-center justify-center gap-2 font-mono text-xs text-charcoal text-center border border-hairline rounded-full px-3 py-1.5">
                    <Calendar size={12} className="shrink-0" />
                    {act.date}
                  </span>
                </div>
              </div>

              <p className="text-fade text-[15px] leading-relaxed mt-4">{act.description}</p>

              <div className="flex flex-wrap gap-1.5 mt-5">
                {act.skills.map((skill) => (
                  <span key={skill} className="chip !px-2.5 !py-1">
                    {skill}
                  </span>
                ))}
              </div>

              {act.link && (
                <a
                  href={act.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 text-sm font-medium text-ink mt-5 underline underline-offset-4 decoration-hairline-strong hover:decoration-ink transition-colors"
                >
                  {act.link.label}
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExtracurricularActivities;
