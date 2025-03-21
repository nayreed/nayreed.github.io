
import React from 'react';
import GlassCard from './ui/GlassCard';
import { MapPin, Phone, Mail, Linkedin } from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    {
      icon: <MapPin size={20} />,
      label: 'Location',
      value: 'Kajaanintie 32 B 15/2, Oulu, Finland',
      link: null
    },
    {
      icon: <Phone size={20} />,
      label: 'Phone',
      value: '+358 40 878 5598',
      link: 'tel:+358408785598'
    },
    {
      icon: <Mail size={20} />,
      label: 'Email',
      value: 'nayreedptk@gmail.com',
      link: 'mailto:nayreedptk@gmail.com'
    },
    {
      icon: <Mail size={20} />,
      label: 'Academic Email',
      value: 'nayreed24@student.oulu.fi',
      link: 'mailto:nayreed24@student.oulu.fi'
    },
    {
      icon: <Linkedin size={20} />,
      label: 'LinkedIn',
      value: 'linkedin.com/in/nayreed',
      link: 'https://www.linkedin.com/in/nayreed/'
    }
  ];

  return (
    <section id="contact" className="py-20 bg-grid">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Get in Touch
          </span>
          <h2 className="text-3xl md:text-4xl font-bold">Contact Information</h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <GlassCard className="p-8" hoverEffect>
            <div className="grid grid-cols-1 gap-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    {item.icon}
                  </div>
                  
                  <div>
                    <p className="text-sm text-foreground/70">{item.label}</p>
                    {item.link ? (
                      <a 
                        href={item.link} 
                        className="text-foreground hover:text-primary transition-colors"
                        target={item.link.startsWith('http') ? '_blank' : undefined}
                        rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-foreground">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-center text-foreground/70">
                Feel free to reach out for collaboration opportunities or inquiries.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default Contact;
