import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Github, ExternalLink, FileText, User, TrendingUp, Code2, Eye } from 'lucide-react';

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const projects = [
    {
      title: 'AI Chatbot with PDF Q&A',
      description: 'Upload PDF documents and ask questions from them. AI answers using document context with vector search and LLMs.',
      icon: FileText,
      github: 'https://github.com/Akshat19G/Ai-Chat-bot-PDF-Q-A-',
      demo: '#',
      tags: ['FastAPI', 'Transformers', 'FAISS', 'LangChain'],
    },
    {
      title: 'AI Resume Analyzer',
      description: 'Upload resume to extract skills, get match score with job descriptions, and receive AI-powered improvement suggestions.',
      icon: User,
      github: 'https://github.com/Akshat19G/AI-Resume-Analyzer',
      demo: '#',
      tags: ['NLP', 'PyTorch', 'FastAPI', 'PDF Parsing'],
    },
    {
      title: 'Recommendation System',
      description: 'Netflix/Amazon-style recommendation engine with personalized suggestions using collaborative filtering and embeddings.',
      icon: TrendingUp,
      github: 'https://github.com/Akshat19G/Recommendation-System/tree/main',
      demo: '#',
      tags: ['Collaborative Filtering', 'Embeddings', 'Python', 'ML'],
    },
    {
      title: 'AI Code Assistant',
      description: 'Full-stack AI tool to generate code, explain code logic, and debug snippets using LLM APIs.',
      icon: Code2,
      github: 'https://github.com/Akshat19G/Ai-code-Assistant/tree/main',
      demo: '#',
      tags: ['LLM APIs', 'React', 'FastAPI', 'AI Engineering'],
    },
    {
      title: 'Computer Vision Detection System',
      description: 'Real-time object detection system for face detection, helmet detection, and attendance monitoring using deep learning.',
      icon: Eye,
      github: 'https://github.com/Akshat19G/Computer-Vision-Detection-System/tree/main',
      demo: '#',
      tags: ['OpenCV', 'YOLO', 'PyTorch', 'Computer Vision'],
    },
  ];

  return (
    <section id="projects" ref={ref} className="relative py-28 sm:py-36 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <p className="text-[12px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-4">
            Featured Projects
          </p>
          <h2
            className="text-[36px] sm:text-[44px] lg:text-[50px] font-semibold tracking-[-0.03em] text-white leading-[1.1] mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            AI Solutions
            <br />
            <span className="text-white/40">In Production</span>
          </h2>
          <p className="text-[16px] text-white/50 max-w-xl leading-relaxed" style={{ fontFamily: 'var(--font-text)' }}>
            Building real-world AI applications that solve complex problems
          </p>
        </motion.div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group"
            >
              <div
                className="p-6 rounded-2xl border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1 h-full"
                style={{ background: 'rgba(255,255,255,0.025)' }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                    <project.icon className="w-5 h-5 text-white/55" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open(project.github, '_blank')}
                      className="p-2 rounded-lg border border-white/[0.07] hover:border-white/[0.14] hover:bg-white/[0.04] transition-all duration-200"
                      aria-label="View on GitHub"
                    >
                      <Github className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
                    </button>
                    <button
                      onClick={() => window.open(project.demo, '_blank')}
                      className="p-2 rounded-lg border border-white/[0.07] hover:border-white/[0.14] hover:bg-white/[0.04] transition-all duration-200"
                      aria-label="View demo"
                    >
                      <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <h3
                  className="text-[17px] font-semibold text-white/90 mb-2 tracking-[-0.02em]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {project.title}
                </h3>
                <p className="text-[14px] text-white/45 leading-relaxed mb-5" style={{ fontFamily: 'var(--font-text)' }}>
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-full text-white/45 border border-white/[0.08] bg-white/[0.03]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10"
        >
          <button
            onClick={() => window.open('https://github.com/Akshat19G', '_blank')}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-white/60 rounded-xl border border-white/[0.08] hover:border-white/[0.15] hover:text-white/85 transition-all duration-200"
          >
            <Github className="w-4 h-4" />
            View All Projects on GitHub
          </button>
        </motion.div>
      </div>
    </section>
  );
}
