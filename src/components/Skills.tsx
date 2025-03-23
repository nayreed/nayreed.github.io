import React from 'react';
import GlassCard from './ui/GlassCard';
import { Cpu, Code, Briefcase, Coffee, Globe, Star } from 'lucide-react';
import ProgrammingSkillsIcon from '../assets/programming.svg';
import ProfessionalSkillsIcon from '../assets/professional.svg';
import OtherSkillsIcon from '../assets/other.svg';
import EnglishIcon from '../assets/english.svg';
import BanglaIcon from '../assets/bangla.svg';
import UrduIcon from '../assets/urdu.svg';
import HindiIcon from '../assets/hindi.svg';
import FinnishIcon from '../assets/finnish.svg';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Technical Skills',
      icon: <img src={ProgrammingSkillsIcon} alt="Programming Skills Icon" className="w-6 h-6" />,
      lucideIcon: <Code size={20} className="text-primary" />,
      skills: [
        'Python', 'C++', 'MATLAB', 'KiCAD', 'HTML5', 'CSS', 'JavaScript', 'React', 'Node.js', 'GitHub', 'PowerShell', 'WordPress', 'Shopify'
      ]
    },
    {
      title: 'Professional Skills',
      icon: <img src={ProfessionalSkillsIcon} alt="Professional Skills Icon" className="w-6 h-6" />,
      lucideIcon: <Briefcase size={20} className="text-primary" />,
      skills: [
        'Student tutor', 'Digital Strategy', , 'Microsoft Office', 'Social Media', 'Organization Skills'
      ]
    },
    {
      title: 'Others',
      icon: <img src={OtherSkillsIcon} alt="Other Skills Icon" className="w-6 h-6" />,
      lucideIcon: <Coffee size={20} className="text-primary" />,
      skills: [
        'Coffee Roasting', 'Barista', 'Hiking', 'Photography', 'Traveling'
      ]
    }
  ];

  const languages = [
    { name: 'English', level: 'C1 (Advanced)', proficiency: 90, icon: EnglishIcon },
    { name: 'Bangla', level: 'C2 (Native)', proficiency: 100, icon: BanglaIcon },
    { name: 'Urdu', level: 'B1 (Intermediate)', proficiency: 65, icon: UrduIcon },
    { name: 'Hindi', level: 'B1 (Intermediate)', proficiency: 60, icon: HindiIcon },
    { name: 'Finnish', level: 'A1.2 (Basic)', proficiency: 30, icon: FinnishIcon }
  ];

  const SkillBadge = ({ skill }: { skill: string }) => (
    <div className="bg-white/5 border border-white/10 text-white/90 px-4 py-2 rounded-md text-sm transition-all
                    hover:bg-primary/10 hover:border-primary/30 hover:text-white hover:scale-105
                    cursor-default flex items-center space-x-1">
      <span>{skill}</span>
    </div>
  );

  const LanguageBar = ({ language }: { language: typeof languages[0] }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img src={language.icon} alt={`${language.name} Icon`} className="w-4 h-4 mr-2" />
          <p className="font-medium text-white">{language.name}</p>
        </div>
        <div className="flex items-center">
          <p className="text-sm text-white/50 mr-2">{language.level}</p>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={12}
                className={cn(
                  "mx-0.5",
                  language.proficiency >= star * 20
                    ? "fill-primary text-primary"
                    : "text-white/20"
                )}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
        <div
          className="h-full bg-gradient-to-r from-primary/80 to-blue-400 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${language.proficiency}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>
      <div className="absolute inset-0 bg-grid opacity-20"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 font-medium mb-4 backdrop-blur-sm">
            <Cpu size={14} className="mr-2 text-primary" />
            <span>Capabilities</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Skills & Languages</h2>
        </div>

        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="skills" className="mb-12">
            <div className="flex justify-center mb-6">
              <TabsList className="bg-white/5 border border-white/10 backdrop-blur-sm">
                <TabsTrigger value="skills" className="data-[state=active]:bg-primary/20 data-[state=active]:text-white">
                  Skills
                </TabsTrigger>
                <TabsTrigger value="languages" className="data-[state=active]:bg-primary/20 data-[state=active]:text-white">
                  Languages
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="skills" className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {skillCategories.map((category, index) => (
                  <GlassCard
                    key={index}
                    className="p-6 h-full"
                    variant={index === 0 ? 'neon' : 'default'}
                    hoverEffect
                  >
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mr-3">
                        {category.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white">{category.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, i) => (
                        <SkillBadge key={i} skill={skill} />
                      ))}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="languages" className="animate-fade-in">
              <GlassCard className="p-8" variant="dark" hoverEffect>
                <div className="mb-6 flex justify-center">
                  <div className="flex items-center space-x-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-lg">
                    <Globe size={18} className="text-primary" />
                    <h3 className="text-lg font-bold text-white">Language Proficiency</h3>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {languages.map((language, index) => (
                    <div key={index} className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                      <LanguageBar language={language} />
                    </div>
                  ))}
                </div>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Skills;
