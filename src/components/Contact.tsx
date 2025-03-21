
import React from 'react';
import GlassCard from './ui/GlassCard';
import { MapPin, Phone, Mail, Linkedin, ExternalLink, MessageSquare, Github } from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    {
      icon: <MapPin size={18} />,
      label: 'Location',
      value: 'Kajaanintie 32 B 15/2, Oulu, Finland',
      link: null
    },
    {
      icon: <Phone size={18} />,
      label: 'Phone',
      value: '+358 40 878 5598',
      link: 'tel:+358408785598'
    },
    {
      icon: <Mail size={18} />,
      label: 'Email',
      value: 'nayreedptk@gmail.com',
      link: 'mailto:nayreedptk@gmail.com'
    },
    {
      icon: <Mail size={18} />,
      label: 'Academic Email',
      value: 'rnayreed24@student.oulu.fi',
      link: 'mailto:rnayreed24@student.oulu.fi'
    },
    {
      icon: <Linkedin size={18} />,
      label: 'LinkedIn',
      value: 'linkedin.com/in/nayreed',
      link: 'https://www.linkedin.com/in/nayreed/'
    },
    {
      icon: <Github size={18} />,
      label: 'GitHub',
      value: 'github.com/RA-Nayreed',
      link: 'https://www.github.com/RA-Nayreed'
    }
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>
      <div className="absolute inset-0 bg-tech-pattern opacity-10"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 font-medium mb-4 backdrop-blur-sm">
            <MessageSquare size={14} className="mr-2 text-primary" />
            <span>Get in Touch</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Contact Information</h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <GlassCard className="p-8 border border-white/10" variant="neon" hoverEffect>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    {item.icon}
                  </div>

                  <div>
                    <p className="text-sm text-white/50 mb-1">{item.label}</p>
                    {item.link ? (
                      <a
                        href={item.link}
                        className="text-white group-hover:text-primary transition-colors flex items-center"
                        target={item.link.startsWith('http') ? '_blank' : undefined}
                        rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {item.value}
                        {item.link.startsWith('http') && (
                          <ExternalLink size={12} className="ml-1 opacity-50" />
                        )}
                      </a>
                    ) : (
                      <p className="text-white">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-white/10">
              <div className="flex items-center justify-center">
                <a
                  href="mailto:nayreedptk@gmail.com"
                  className="relative group bg-white/5 hover:bg-primary/20 text-white font-medium rounded-md px-6 py-3 transition-all duration-300 flex items-center border border-white/10 hover:border-primary/30"
                >
                  <Mail size={16} className="mr-2" />
                  Send Message
                </a>
              </div>
              <p className="text-center text-white/50 mt-4 text-sm">
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
