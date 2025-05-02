
import React from 'react';
import { Github, Linkedin, Mail, ChevronRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-black border-t border-white/5 relative overflow-hidden">
      {/* Tech pattern background */}
      <div className="absolute inset-0 bg-tech-pattern opacity-20"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="mb-8 md:mb-0">
            <a href="#home" className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              R.A.N
            </a>
            <p className="text-white/50 mt-2 max-w-md">
              Thank you for visiting my Website.
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href="https://github.com/RA-Nayreed"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 flex items-center justify-center text-white/70 hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a class="libutton" href="https://www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=nayreed" target="_blank">Follow on LinkedIn</a>
            <a
              href="https://www.linkedin.com/in/nayreed/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 flex items-center justify-center text-white/70 hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="mailto:nayreedptk@gmail.com"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 flex items-center justify-center text-white/70 hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            © {currentYear} Rezwan Ahmad Nayreed. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-6">
            {[
              { label: 'Home', href: '#home' },
              { label: 'Experience', href: '#experience' },
              { label: 'Skills', href: '#skills' },
              { label: 'Contact', href: '#contact' }
            ].map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-white/50 hover:text-primary transition-colors text-sm flex items-center"
              >
                <ChevronRight size={14} className="mr-1 text-primary/50" />
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



<style>
.libutton {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 7px;
  text-align: center;
  outline: none;
  text-decoration: none !important;
  color: #ffffff !important;
  width: 200px;
  height: 32px;
  border-radius: 16px;
  background-color: #0A66C2;
  font-family: "SF Pro Text", Helvetica, sans-serif;
}
</style>
