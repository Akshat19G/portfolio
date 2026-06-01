import { motion } from 'motion/react';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { name: 'GitHub', icon: Github, url: 'https://github.com/Akshat19G' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/akshat-srivastava-300455308/' },
    { name: 'Twitter', icon: Twitter, url: 'https://x.com/Akii0019' },
    { name: 'Email', icon: Mail, url: 'mailto:srivastavaakshat1909@gmail.com' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative py-12 px-5 sm:px-8 border-t border-white/[0.05]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">

          {/* Brand */}
          <div>
            <h3
              className="text-[15px] font-semibold text-white/75 mb-2 tracking-[-0.01em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Akshat Srivastava
            </h3>
            <p className="text-[13px] text-white/35" style={{ fontFamily: 'var(--font-text)' }}>
              Building the future of AI, one model at a time.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[12px] font-semibold tracking-[0.1em] uppercase text-white/30 mb-3">
              Quick Links
            </h4>
            <div className="space-y-2">
              {['About', 'Projects', 'Contact'].map((link) => (
                <button
                  key={link}
                  onClick={() => scrollToSection(link.toLowerCase())}
                  className="block text-[13px] text-white/40 hover:text-white/70 transition-colors duration-150"
                  style={{ fontFamily: 'var(--font-text)' }}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-[12px] font-semibold tracking-[0.1em] uppercase text-white/30 mb-3">
              Connect
            </h4>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-8 h-8 rounded-lg border border-white/[0.07] hover:border-white/[0.14] bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center transition-all duration-200"
                >
                  <social.icon className="w-3.5 h-3.5 text-white/40 hover:text-white/70 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[12px] text-white/25" style={{ fontFamily: 'var(--font-text)' }}>
            © {new Date().getFullYear()} Akshat Srivastava. All rights reserved.
          </p>
          <p className="text-[12px] text-white/25" style={{ fontFamily: 'var(--font-text)' }}>
            Built with AI & Modern Tech
          </p>
        </div>
      </div>
    </footer>
  );
}
