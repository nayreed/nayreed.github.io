import React from 'react';
import SectionHeader from './SectionHeader';
import { Mail, Linkedin, Github, ArrowUpRight } from 'lucide-react';

const contactInfo = [
  {
    icon: <Mail size={14} />,
    label: 'Academic Email',
    value: 'RezwanAhmad.Nayreed@student.oulu.fi',
    link: 'mailto:RezwanAhmad.Nayreed@student.oulu.fi',
  },
  {
    icon: <Mail size={14} />,
    label: 'Email',
    value: 'nayreedptk@gmail.com',
    link: 'mailto:nayreedptk@gmail.com',
  },
  {
    icon: <Linkedin size={14} />,
    label: 'LinkedIn',
    value: 'linkedin.com/in/nayreed',
    link: 'https://www.linkedin.com/in/nayreed/',
  },
  {
    icon: <Github size={14} />,
    label: 'GitHub',
    value: 'github.com/RA-Nayreed',
    link: 'https://www.github.com/RA-Nayreed',
  },
];

const Contact = () => {
  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        <SectionHeader
          title="Get in Touch"
          description="Feel free to reach out for collaboration opportunities or inquiries."
        />

        <div className="card-hairline p-6 sm:p-8 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
            {contactInfo.map((item) => (
              <div key={item.label} className="min-w-0">
                <div className="flex items-center gap-2 text-mute mb-1.5">
                  {item.icon}
                  <span className="text-xs uppercase tracking-wider">{item.label}</span>
                </div>
                <a
                  href={item.link}
                  className="text-sm text-ink font-medium hover:text-fade transition-colors inline-flex items-center gap-1 break-all"
                  target={item.link.startsWith('http') ? '_blank' : undefined}
                  rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {item.value}
                  {item.link.startsWith('http') && (
                    <ArrowUpRight size={12} className="text-mute shrink-0" />
                  )}
                </a>
              </div>
            ))}
          </div>

          <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-hairline flex justify-center">
            <a href="mailto:RezwanAhmad.Nayreed@student.oulu.fi" className="pill-primary">
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
