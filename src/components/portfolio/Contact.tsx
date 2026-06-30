import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Send, Mail, User, MessageSquare, CheckCircle, AlertCircle, Github, Linkedin, Twitter } from 'lucide-react';
import { useServerFn } from '@tanstack/react-start';
import { toast } from 'sonner';
import { sendContactEmail } from '@/lib/contact.functions';

export default function Contact() {
  const ref = useRef(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const sendEmail = useServerFn(sendContactEmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      await sendEmail({ data: formData });
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error('Contact send error:', error);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'srivastavaakshat1909@gmail.com',
      href: 'mailto:srivastavaakshat1909@gmail.com',
    },
    {
      icon: Github,
      label: 'GitHub',
      value: '@Akshat19G',
      href: 'https://github.com/Akshat19G',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Akshat Srivastava',
      href: 'https://www.linkedin.com/in/akshat-srivastava-300455308/',
    },
    {
      icon: Twitter,
      label: 'Twitter / X',
      value: '@Akii0019',
      href: 'https://x.com/Akii0019',
    },
  ];

  const reasons = [
    'Collaborate on AI/ML projects',
    'Discuss job opportunities',
    'Share knowledge and insights',
    'Build innovative solutions',
  ];

  const inputClass = "w-full px-4 py-3 rounded-xl text-[14px] text-white/85 placeholder-white/20 border border-white/[0.08] focus:border-white/[0.20] focus:outline-none transition-all duration-200 bg-white/[0.04]";

  return (
    <section id="contact" ref={ref} className="relative py-28 sm:py-36 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <p className="text-[12px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-4">
            Get In Touch
          </p>
          <h2
            className="text-[36px] sm:text-[44px] lg:text-[50px] font-semibold tracking-[-0.03em] text-white leading-[1.1] mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Let's Build
            <br />
            <span className="text-white/40">The Future Together</span>
          </h2>
          <p className="text-[16px] text-white/50 max-w-xl leading-relaxed" style={{ fontFamily: 'var(--font-text)' }}>
            Ready to collaborate on AI projects or discuss opportunities
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* Left: Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <h3
              className="text-[20px] font-semibold text-white/80 tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Contact Information
            </h3>

            {/* Contact links */}
            <div className="space-y-2">
              {contactInfo.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.25 + i * 0.07 }}
                  className="flex items-center gap-3.5 p-3.5 rounded-xl border border-white/[0.07] hover:border-white/[0.13] hover:-translate-x-0 hover:translate-x-0.5 transition-all duration-200 group"
                  style={{ background: 'rgba(255,255,255,0.025)' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-white/45" />
                  </div>
                  <div>
                    <div className="text-[11px] text-white/30 mb-0.5" style={{ fontFamily: 'var(--font-text)' }}>
                      {item.label}
                    </div>
                    <div className="text-[14px] font-medium text-white/75 group-hover:text-white/90 transition-colors" style={{ fontFamily: 'var(--font-text)' }}>
                      {item.value}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Why connect */}
            <div
              className="p-5 rounded-2xl border border-white/[0.07]"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <h4
                className="text-[15px] font-semibold text-white/70 mb-3 tracking-[-0.01em]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Why Connect?
              </h4>
              <ul className="space-y-2">
                {reasons.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.07 }}
                    className="flex items-center gap-2.5 text-[14px] text-white/45"
                    style={{ fontFamily: 'var(--font-text)' }}
                  >
                    <CheckCircle className="w-4 h-4 text-white/30 flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-4 p-6 sm:p-7 rounded-2xl border border-white/[0.07]"
              style={{ background: 'rgba(255,255,255,0.025)' }}
            >
              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="flex items-center gap-1.5 text-[12px] font-medium text-white/45">
                  <User className="w-3.5 h-3.5" />
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="flex items-center gap-1.5 text-[12px] font-medium text-white/45">
                  <Mail className="w-3.5 h-3.5" />
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label htmlFor="subject" className="flex items-center gap-1.5 text-[12px] font-medium text-white/45">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="What's this about?"
                  required
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="flex items-center gap-1.5 text-[12px] font-medium text-white/45">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`${inputClass} resize-none`}
                  placeholder="Your message..."
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 text-[13px] font-medium text-white/85 rounded-xl border border-white/[0.12] hover:border-white/[0.20] hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white/80 rounded-full"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-white/25" style={{ fontFamily: 'var(--font-text)' }}>
                Your information is secure and will only be used to contact you.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
