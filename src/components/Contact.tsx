import React from 'react';
import SectionHeader from './SectionHeader';
import { MapPin, Mail, Linkedin, Github, ArrowUpRight } from 'lucide-react';

const contactInfo = [
  {
    icon: <Mail size={16} />,
    label: 'Email',
    value: 'nayreedptk@gmail.com',
    link: 'mailto:nayreedptk@gmail.com',
  },
  {
    icon: <Mail size={16} />,
    label: 'Academic Email',
    value: 'RezwanAhmad.Nayreed@student.oulu.fi',
    link: 'mailto:RezwanAhmad.Nayreed@student.oulu.fi',
  },
  {
    icon: <Linkedin size={16} />,
    label: 'LinkedIn',
    value: 'linkedin.com/in/nayreed',
    link: 'https://www.linkedin.com/in/nayreed/',
  },
  {
    icon: <Github size={16} />,
    label: 'GitHub',
    value: 'github.com/RA-Nayreed',
    link: 'https://www.github.com/RA-Nayreed',
  },
  {
    icon: <MapPin size={16} />,
    label: 'Location',
    value: 'Oulu, Finland',
    link: null,
  },
];

const Contact = () => {
  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeader
          eyebrow="07 — Contact"
          title="Get in Touch"
          description="Feel free to reach out for collaboration opportunities or inquiries."
        />

        <div className="card-hairline p-8 md:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {contactInfo.map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-soft border border-hairline flex items-center justify-center text-ink shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-mute mb-1">{item.label}</p>
                  {item.link ? (
                    <a
                      href={item.link}
                      className="group text-sm text-ink font-medium hover:text-fade transition-colors inline-flex items-center gap-1 break-all"
                      target={item.link.startsWith('http') ? '_blank' : undefined}
                      rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {item.value}
                      {item.link.startsWith('http') && (
                        <ArrowUpRight size={12} className="text-mute shrink-0" />
                      )}
                    </a>
                  ) : (
                    <p className="text-sm text-ink font-medium">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-hairline flex justify-center">
            <a href="mailto:nayreedptk@gmail.com" className="pill-primary">
              <Mail size={15} />
              Send Mail
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
