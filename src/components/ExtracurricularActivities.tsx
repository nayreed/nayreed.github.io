import React from 'react';
import SectionHeader from './SectionHeader';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';

const activities = [
  {
    title: 'CSC Summer School in High-Performance Computing (2026)',
    location: 'Hotelli Nuuksio, Espoo, Finland',
    date: 'Jun 23 – Jul 2, 2026',
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
    title: 'JunctionX OuluES – 2nd Runner-Up, Nordea Challenge (2025)',
    location: 'University of Oulu',
    date: 'Sep 18 – Sep 21, 2025',
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
    title: 'Operations Associate – AIESEC',
    location: 'Oulu, Finland',
    date: 'Mar 2025 – Mar 2026',
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
    title: 'Hack Oulu 2025 – AI Siege',
    location: 'University of Oulu',
    date: 'Apr 11 – Apr 13, 2025',
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
    title: 'MSc Student Tutor – Orientation and Support Role',
    location: 'University of Oulu',
    date: 'May 2025 – Nov 2025',
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

const ExtracurricularActivities = () => {
  return (
    <section id="activities" className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeader
          eyebrow="05 — Activities"
          title="Professional Development & Activities"
        />

        <div className="space-y-5">
          {activities.map((act) => (
            <div key={act.title} className="card-hairline p-7 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-ink leading-snug">
                    {act.title}
                  </h3>
                  <p className="text-mute text-sm mt-1 flex items-center gap-2">
                    <MapPin size={12} />
                    {act.location}
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 font-mono text-xs text-charcoal border border-hairline rounded-full px-3 py-1.5 shrink-0">
                  <Calendar size={12} />
                  {act.date}
                </span>
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
