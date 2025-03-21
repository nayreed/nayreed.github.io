
import React from 'react';
import GlassCard from './ui/GlassCard';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Technical Skills',
      skills: [
        'Python', 'C++', 'MATLAB', 'KiCAD', 'HTML5', 'JavaScript', 'GitHub'
      ]
    },
    {
      title: 'Professional Skills',
      skills: [
        'Shopify', 'Organization Skills', 'Digital Strategy', 'Social Media', 'Microsoft Office'
      ]
    },
    {
      title: 'Other Skills',
      skills: [
        'Coffee Roasting', 'Barista'
      ]
    }
  ];

  const languages = [
    { name: 'English', level: 'C1 (Advanced)', proficiency: 90 },
    { name: 'Bangla', level: 'C2 (Native)', proficiency: 100 },
    { name: 'Urdu', level: 'B1 (Intermediate)', proficiency: 65 },
    { name: 'Hindi', level: 'B1 (Intermediate)', proficiency: 65 },
    { name: 'Finnish', level: 'A1.2 (Basic)', proficiency: 30 }
  ];

  return (
    <section id="skills" className="py-20 bg-grid">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Capabilities
          </span>
          <h2 className="text-3xl md:text-4xl font-bold">Skills & Languages</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="space-y-8">
            {skillCategories.map((category, index) => (
              <GlassCard key={index} className="p-8" hoverEffect>
                <h3 className="text-xl font-bold mb-6">{category.title}</h3>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill, i) => (
                    <span 
                      key={i} 
                      className="bg-white/10 text-foreground/90 px-4 py-2 rounded-full text-sm transition-all hover:bg-primary/20 hover:text-foreground cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="p-8 h-full" hoverEffect>
            <h3 className="text-xl font-bold mb-6">Languages</h3>
            <div className="space-y-6">
              {languages.map((language, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <p className="font-medium">{language.name}</p>
                    <p className="text-sm text-foreground/70">{language.level}</p>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${language.proficiency}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default Skills;
