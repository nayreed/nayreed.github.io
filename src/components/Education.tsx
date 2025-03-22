
import React, { useState } from 'react';
import GlassCard from './ui/GlassCard';
import { GraduationCap, BookOpen, Calendar, ChevronDown, ChevronUp, Star, Download, HelpCircle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import FinlandIcon from '../assets/finland.svg';
import BangladeshIcon from '../assets/bangladesh.svg';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';

const Education = () => {
  const [openCollapsible, setOpenCollapsible] = useState(false);

  const education = [
    {
      institution: 'University of Oulu',
      location: 'Oulu, Finland',
      degree: 'B.Sc (Technology) in Electronics and Communications Engineering',
      period: 'August 2024 - PRESENT',
      featured: [
        { title: 'Artificial Intelligence', description: "Highly interested in AI and Machine Learning" },
        { title: 'C++ Programming', description: "Proficient in C++ programming language" },
      ],
      courses: [
        { name: 'Calculus I', grade: 'A' }, 
        { name: 'Elementry Programming', grade: 'A+' }, 
        { name: 'Introduction to Electronics', grade: 'A-' },
        { name: 'Electrical Measurement Principles', grade: 'B+' }, 
        { name: 'Matrix Algebra', grade: 'A' }, 
        { name: 'Calculus II', grade: 'A-' },
        { name: 'Digital Techniques 1', grade: 'A' }, 
        { name: 'Differential Equations', grade: 'B+' }, 
        { name: 'Introduction to Internet', grade: 'A' },
        { name: 'Probability and Mathematical Statistics', grade: 'B+' }
      ],
      transcript: "transcript.pdf" // Placeholder for transcript file
    },
    {
      institution: 'Shaheed Bir Bikram Ramiz Uddin Cantonment College',
      location: 'Dhaka, Bangladesh',
      degree: 'Higher Secondary School Certificate',
      period: 'February 2022 - November 2023'
    }
  ];

  const testScores = {
    name: 'SAT',
    date: 'December 2023',
    scores: [
      { subject: 'Total', score: '1360' },
      { subject: 'Math', score: '740' },
      { subject: 'Reading & Writing', score: '620' }
    ]
  };

  const handleDownloadTranscript = () => {
    // This would be replaced with actual file download logic
    alert('Transcript download will be implemented. This is a placeholder.');
    // For actual implementation:
    // const link = document.createElement('a');
    // link.href = education[0].transcript;
    // link.download = 'University_Transcript.pdf';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  return (
    <section id="education" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>
      <div className="absolute inset-0 bg-tech-pattern opacity-10"></div>

      {/* Interactive Easter Egg: Hidden constellation animation that appears on scroll */}
      <div className="constellation absolute inset-0 opacity-0 transition-opacity duration-1000" data-easter-egg="true">
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

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 font-medium mb-4 backdrop-blur-sm">
            <GraduationCap size={14} className="mr-2 text-primary" />
            <span>Academic Background</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Education & Qualifications</h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {education.map((edu, index) => (
            <GlassCard key={index} className="p-8" variant={index === 0 ? 'neon' : 'default'} hoverEffect>
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="flex-shrink-0 flex md:flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <GraduationCap size={20} />
                  </div>

                  <div className="flex items-center text-white/50 text-sm">
                    <Calendar size={14} className="mr-2 text-primary/70" />
                    <span>{edu.period}</span>
                  </div>

                  {/* Download Transcript Button - Only for the first education entry */}
                  {index === 0 && edu.transcript && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            onClick={handleDownloadTranscript} 
                            variant="outline" 
                            size="sm" 
                            className="mt-2 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                          >
                            <Download size={14} className="mr-2" />
                            Transcript
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download official transcript</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-2">
                    <h3 className="text-xl font-bold text-white">{edu.institution}</h3>
                    <div className="flex items-center text-white/50 text-sm">
                      {edu.location === 'Oulu, Finland' ? (
                        <img src={FinlandIcon} alt="Finland Icon" className="w-6 h-6 mr-2" />
                      ) : edu.location === 'Dhaka, Bangladesh' ? (
                        <img src={BangladeshIcon} alt="Bangladesh Icon" className="w-6 h-6 mr-2" />
                      ) : null}
                      <span>{edu.location}</span>
                    </div>
                  </div>

                  <p className="text-lg text-primary mb-4">{edu.degree}</p>

                  {/* Featured Accomplishments Section */}
                  {edu.featured && (
                  <div className="mt-4 mb-6">
                    <h4 className="text-md font-medium text-white/80 mb-3 flex items-center">
                      <Star size={14} className="mr-2 text-primary/70" />
                      Featured
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {edu.featured.map((item, i) => (
                        <div
                          key={i}
                          className="bg-primary/5 border border-primary/20 text-white/90 p-3 rounded-md transition-all hover:bg-primary/10"
                        >
                          <h5 className="font-medium text-primary">{item.title}</h5>
                          <p className="text-sm text-white/70 mt-1">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                  {/* Collapsible Coursework Section with Grades on Hover */}
                  {edu.courses && (
                      <div className="mt-6">
                        <Collapsible open={openCollapsible} onOpenChange={setOpenCollapsible}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-md font-medium text-white/80 flex items-center">
                              Relevant Coursework
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle size={14} className="ml-2 text-primary/70 cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Hover over courses to see grades</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </h4>
                            <CollapsibleTrigger className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-white/70 hover:bg-primary/10 hover:text-white transition-colors">
                              {openCollapsible ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </CollapsibleTrigger>
                          </div>

                        {/* Always show first 3 courses, toggle the rest */}
                        <div className="flex flex-wrap gap-2">
                          {edu.courses.slice(0, 3).map((course, i) => (
                            <HoverCard key={i}>
                              <HoverCardTrigger asChild>
                                <span
                                  className="bg-white/5 border border-white/10 text-white/70 px-3 py-1 rounded-md text-sm transition-all hover:bg-primary/10 hover:border-primary/30 hover:text-white cursor-help"
                                >
                                  {course.name}
                                </span>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-auto bg-black/80 border border-primary/20 text-white backdrop-blur-lg">
                                <div className="flex justify-between items-center">
                                  <span>{course.name}</span>
                                  <span className="ml-4 font-bold text-primary">{course.grade}</span>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          ))}

                          <CollapsibleContent className="flex flex-wrap gap-2">
                            {edu.courses.slice(3).map((course, i) => (
                              <HoverCard key={i}>
                                <HoverCardTrigger asChild>
                                  <span
                                    className="bg-white/5 border border-white/10 text-white/70 px-3 py-1 rounded-md text-sm transition-all hover:bg-primary/10 hover:border-primary/30 hover:text-white cursor-help"
                                  >
                                    {course.name}
                                  </span>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-auto bg-black/80 border border-primary/20 text-white backdrop-blur-lg">
                                  <div className="flex justify-between items-center">
                                    <span>{course.name}</span>
                                    <span className="ml-4 font-bold text-primary">{course.grade}</span>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            ))}
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}

          <GlassCard className="p-8" variant="dark" hoverEffect>
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <BookOpen size={20} />
                </div>
              </div>

              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-4">
                  <h3 className="text-xl font-bold text-white">{testScores.name}</h3>
                  <div className="flex items-center text-white/50 text-sm">
                    <Calendar size={14} className="mr-2 text-primary/70" />
                    <span>{testScores.date}</span>
                  </div>
                </div>

                <div className="space-y-4 border-l-2 border-primary/30 pl-4">
                  {testScores.scores.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-white/80">{item.subject}</span>
                      <span className="font-medium text-white bg-primary/10 border border-primary/20 px-3 py-1 rounded-md">{item.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Easter Egg Script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('scroll', function() {
            const constellations = document.querySelectorAll('.constellation');
            if (window.scrollY > 1000 && window.scrollY < 1800) {
              constellations.forEach(c => c.classList.add('opacity-100'));
            } else {
              constellations.forEach(c => c.classList.remove('opacity-100'));
            }
          });

          // Secret keyboard shortcut
          let keySequence = [];
          document.addEventListener('keydown', (e) => {
            keySequence.push(e.key);
            if (keySequence.length > 5) keySequence.shift();

            if (keySequence.join('') === 'oulu') {
              document.body.classList.toggle('matrix-mode');

              const audio = new Audio('https://www.soundjay.com/nature/sounds/rain-07.mp3');
              audio.volume = 0.1;
              audio.play();

              setTimeout(() => {
                document.body.classList.remove('matrix-mode');
              }, 5000);
            }
          });
        `
      }} />
    </section>
  );
};

export default Education;
