import React from 'react';
import SectionHeader from './SectionHeader';
import { Mail, Linkedin, Github, ArrowUpRight } from 'lucide-react';

const contactInfo = [
  {
    icon: <Mail size={16} />,
    label: 'Academic Email',
    value: 'RezwanAhmad.Nayreed@student.oulu.fi',
    link: 'mailto:RezwanAhmad.Nayreed@student.oulu.fi',
  },
  {
    icon: <Mail size={16} />,
    label: 'Email',
    value: 'nayreedptk@gmail.com',
    link: 'mailto:nayreedptk@gmail.com',
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {contactInfo.map((item) => (
              <div key={item.label} className="min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-soft border border-hairline flex items-center justify-center text-ink shrink-0">
                    {item.icon}
                  </div>
                  <p className="text-xs text-mute">{item.label}</p>
                </div>
                <a
                  href={item.link}
                  className="text-[13px] min-[400px]:text-sm text-ink font-medium hover:text-fade transition-colors inline-flex items-center gap-1 break-all"
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
