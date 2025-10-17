import React, { useState, useEffect, useRef } from 'react';
import GlassCard from './ui/GlassCard';
import { Star, Users, Calendar } from 'lucide-react';

const ExtracurricularActivities = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  const activities = [
    {
      title: 'JunctionX OuluES – 2nd Runner-Up, Nordea Challenge (2025) Demo',
      location: 'University of Oulu',
      date: '18 Sept. - 21 Sept. 2025',
      description:
        'Developed Aisti, a sensory data platform that turns dry data into visual and auditory signals, enabling intuitive anomaly detection using ML, and sonification in a multi-modal pipeline.',
      skills: [
        'Machine learning',
        'Data sonification',
        'LLM integration',
        'Interactive dashboards',
        'Problem-solving',
        'Team collaboration'
      ]
    },
    {
      title: 'Operations Associate – AIESEC',
      location: 'Oulu, Finland',
      date: 'Mar. 2025 – Present',
      description:
        'Active member of the operations team, supporting the planning and execution of AIESEC’s youth leadership and student exchange initiatives.',
      skills: [
        'Teamwork',
        'Event coordination',
        'Operations administration',
        'Communication',
        'Cultural engagement'
      ]
    },
    {
      title: 'Hack Oulu 2025 – AI Siege Badge',
      location: 'University of Oulu',
      date: '11 Apr. - 13 Apr. 2025',
      description:
        'Participated in AI security battles acting as both attacker and defender in adversarial chatbot scenarios.',
      skills: [
        'Strategic critical thinking',
        'Advanced prompt engineering',
        'Social engineering awareness',
        'Cybersecurity mindset',
        'Innovation',
        'Technical proficiency'
      ]
    },
    {
      title: "MSc Student Tutor – Orientation and Support Role",
      location: 'University of Oulu',
      date: 'May 2025 - Present',
      description:
        'Appointed as a student tutor to guide incoming Master’s students in Electronics, supporting their academic and cultural integration.',
      skills: [
        'Leadership',
        'Cross-cultural communication',
        'Mentorship',
        'Organizational skills',
        'Peer support',
        'Problem-solving'
      ]
    }
  ];

  return (
    <section id="extracurricular" className="py-24 relative overflow-hidden" ref={sectionRef}>
      {/* Interactive Easter Egg: Hidden constellation animation that appears on scroll */}
      <div
        className={`constellation absolute inset-0 transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        data-easter-egg="true"
      >
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="star absolute w-1 h-1 bg-primary rounded-full animate-pulse-glow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          ></div>
        ))}
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>
      <div className="absolute inset-0 bg-tech-pattern opacity-10"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 font-medium mb-4 backdrop-blur-sm">
            <Star size={14} className="mr-2 text-primary" />
            <span>Extracurricular</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Extracurricular Activities</h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {activities.map((act, idx) => (
            <div key={idx} className="mb-6">
              <GlassCard className="p-6" variant="neon" hoverEffect>
                <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                  <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Users size={18} />
                    </div>
                    <div className="hidden md:flex items-center text-white/50 text-sm">
                      <Calendar size={14} className="mr-2 text-primary/70" />
                      <span>{act.date}</span>
                    </div>
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-white mb-1">{act.title}</h3>
                    <p className="text-lg text-primary mb-2">{act.location}</p>
                    <div className="md:hidden flex items-center text-white/50 text-sm mb-4">
                      <Calendar size={14} className="mr-2 text-primary/70" />
                      <span>{act.date}</span>
                    </div>

                    <p className="text-white/80">{act.description}</p>

                    <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {act.skills.map((s, i) => (
                        <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                          <span className="inline-block w-2 h-2 mt-2 rounded-full bg-primary" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExtracurricularActivities;
