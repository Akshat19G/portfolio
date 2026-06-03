import { motion, useInView, AnimatePresence } from 'motion/react';
import { useRef, useState, useEffect, useCallback } from 'react';
import {
  Github, ExternalLink, FileText, User, TrendingUp,
  Code2, Eye, ChevronLeft, ChevronRight, Pause, Play,
  Maximize2, X
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface Project {
  title: string;
  description: string;
  longDescription: string;
  icon: React.ElementType;
  github: string;
  demo: string;
  tags: string[];
  features: string[];
  screenshots: { src: string; alt: string; placeholder: string }[];
  accent: string;
  accentBg: string;
}

// ── Project Data ───────────────────────────────────────────────────────────────
// Screenshots use placeholder gradients rendered via CSS — no external images needed.
// Each "placeholder" is a CSS gradient string used as background.
const projects: Project[] = [
  {
    title: 'AI Chatbot with PDF Q&A',
    description: 'Upload PDF documents and ask questions from them. AI answers using document context with vector search and LLMs.',
    longDescription: 'A full-stack AI application that lets users upload PDF documents and have natural conversations about their contents. Built on vector similarity search and large language models for accurate, context-aware answers.',
    icon: FileText,
    github: 'https://github.com/Akshat19G/Ai-Chat-bot-PDF-Q-A-',
    demo: '#',
    tags: ['FastAPI', 'Transformers', 'FAISS', 'LangChain'],
    features: ['PDF upload & parsing', 'Vector similarity search', 'Conversational memory', 'Multi-document support'],
    screenshots: [
      { src: '', alt: 'Chat interface', placeholder: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)' },
      { src: '', alt: 'Document upload',placeholder: 'linear-gradient(135deg,#0a0f1e 0%,#162040 50%,#0a0f1e 100%)' },
      { src: '', alt: 'Q&A results',   placeholder: 'linear-gradient(135deg,#0d1117 0%,#1a1f35 50%,#0d1117 100%)' },
    ],
    accent: '#818cf8',
    accentBg: 'rgba(99,102,241,0.08)',
  },
  {
    title: 'AI Resume Analyzer',
    description: 'Upload resume to extract skills, get match score with job descriptions, and receive AI-powered improvement suggestions.',
    longDescription: 'Intelligent resume analysis tool that parses uploaded documents, extracts key skills and experiences, matches them against job descriptions, and generates actionable improvement recommendations using NLP.',
    icon: User,
    github: 'https://github.com/Akshat19G/AI-Resume-Analyzer',
    demo: '#',
    tags: ['NLP', 'PyTorch', 'FastAPI', 'PDF Parsing'],
    features: ['Skills extraction', 'Job description matching', 'Score calculation', 'AI suggestions'],
    screenshots: [
      { src: '', alt: 'Analysis dashboard', placeholder: 'linear-gradient(135deg,#0f1f0f 0%,#1a3a1a 50%,#0f1f0f 100%)' },
      { src: '', alt: 'Skills breakdown',   placeholder: 'linear-gradient(135deg,#0a1a0a 0%,#142814 50%,#0a1a0a 100%)' },
      { src: '', alt: 'Match report',       placeholder: 'linear-gradient(135deg,#0d1f0d 0%,#1c3420 50%,#0d1f0d 100%)' },
    ],
    accent: '#34d399',
    accentBg: 'rgba(52,211,153,0.08)',
  },
  {
    title: 'Recommendation System',
    description: 'Netflix/Amazon-style recommendation engine with personalized suggestions using collaborative filtering and embeddings.',
    longDescription: 'Production-grade recommendation engine implementing both collaborative filtering and content-based approaches, with user-specific embedding models trained on interaction history for highly personalized results.',
    icon: TrendingUp,
    github: 'https://github.com/Akshat19G/Recommendation-System/tree/main',
    demo: '#',
    tags: ['Collaborative Filtering', 'Embeddings', 'Python', 'ML'],
    features: ['Collaborative filtering', 'Content-based filtering', 'Embedding models', 'Real-time scoring'],
    screenshots: [
      { src: '', alt: 'Recommendation feed',    placeholder: 'linear-gradient(135deg,#1a0f0a 0%,#3a1f10 50%,#1a0f0a 100%)' },
      { src: '', alt: 'User preferences',        placeholder: 'linear-gradient(135deg,#150c08 0%,#2e1a0e 50%,#150c08 100%)' },
      { src: '', alt: 'Algorithm performance',   placeholder: 'linear-gradient(135deg,#1a110a 0%,#382012 50%,#1a110a 100%)' },
    ],
    accent: '#fb923c',
    accentBg: 'rgba(251,146,60,0.08)',
  },
  {
    title: 'Sahi Code',
    description: 'Full-stack AI tool to generate code, explain code logic, and debug snippets using LLM APIs.',
    longDescription: 'A developer productivity tool powered by large language models that generates, explains, and debugs code across multiple programming languages with an intuitive React frontend and fast FastAPI backend.',
    icon: Code2,
    github: 'https://github.com/Akshat19G/sahicode',
    demo: '#',
    tags: ['LLM APIs', 'React', 'FastAPI', 'AI Engineering'],
    features: ['Code generation', 'Logic explanation', 'Bug detection', 'Multi-language support'],
    screenshots: [
      { src: '', alt: 'Code editor',    placeholder: 'linear-gradient(135deg,#0a0f1a 0%,#101830 50%,#0a0f1a 100%)' },
      { src: '', alt: 'AI suggestions', placeholder: 'linear-gradient(135deg,#080d18 0%,#0e1628 50%,#080d18 100%)' },
      { src: '', alt: 'Debug view',     placeholder: 'linear-gradient(135deg,#0b1020 0%,#121a38 50%,#0b1020 100%)' },
    ],
    accent: '#60a5fa',
    accentBg: 'rgba(96,165,250,0.08)',
  },
  {
    title: 'Computer Vision Detection',
    description: 'Real-time object detection system for face detection, helmet detection, and attendance monitoring using deep learning.',
    longDescription: 'A computer vision system built on YOLO and PyTorch for real-time multi-class detection. Includes specialized models for safety compliance (helmet detection) and automated attendance tracking through facial recognition.',
    icon: Eye,
    github: 'https://github.com/Akshat19G/Computer-Vision-Detection-System/tree/main',
    demo: '#',
    tags: ['OpenCV', 'YOLO', 'PyTorch', 'Computer Vision'],
    features: ['Real-time detection', 'Face recognition', 'Helmet compliance', 'Attendance tracking'],
    screenshots: [
      { src: '', alt: 'Detection feed',    placeholder: 'linear-gradient(135deg,#1a0a14 0%,#3a1030 50%,#1a0a14 100%)' },
      { src: '', alt: 'Model performance', placeholder: 'linear-gradient(135deg,#15081a 0%,#2c1038 50%,#15081a 100%)' },
      { src: '', alt: 'Attendance log',    placeholder: 'linear-gradient(135deg,#1a0b1c 0%,#38123c 50%,#1a0b1c 100%)' },
    ],
    accent: '#c084fc',
    accentBg: 'rgba(192,132,252,0.08)',
  },
];

// ── Screenshot Carousel ────────────────────────────────────────────────────────
interface CarouselProps {
  screenshots: Project['screenshots'];
  accent: string;
  title: string;
}

function ProjectCarousel({ screenshots, accent, title }: CarouselProps) {
  const [active, setActive] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const go = useCallback((dir: 1 | -1) => {
    setActive(p => (p + dir + screenshots.length) % screenshots.length);
  }, [screenshots.length]);

  // Auto-play
  useEffect(() => {
    if (!isPlaying) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => go(1), 3500);
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, go]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  // Touch / drag
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
    if (info.offset.x < -40) go(1);
    else if (info.offset.x > 40) go(-1);
  };

  const current = screenshots[active];

  return (
    <div className="relative overflow-hidden rounded-xl aspect-[16/9] group/carousel"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Slides */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{ background: current.placeholder }}
        >
          {/* Decorative inner glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full opacity-10" style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`, filter: 'blur(20px)' }} />
          </div>
          {/* Simulated UI chrome */}
          <div className="absolute top-3 left-3 right-3 flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="flex-1 h-2.5 rounded-full bg-white/5 mx-2" />
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="h-1.5 rounded-full bg-white/5 mb-1.5 w-3/4" />
            <div className="h-1.5 rounded-full bg-white/5 mb-1.5 w-1/2" />
            <div className="h-1.5 rounded-full bg-white/5 w-2/3" />
          </div>
          {/* Alt label */}
          <div className="absolute bottom-3 right-3">
            <span className="text-[10px] text-white/20 px-2 py-0.5 rounded-md bg-black/30">{current.alt}</span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

      {/* Nav arrows */}
      {screenshots.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            aria-label="Previous screenshot"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 border border-white/10 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 hover:bg-black/60 hover:scale-110 backdrop-blur-sm"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-white/80" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); go(1); }}
            aria-label="Next screenshot"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 border border-white/10 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 hover:bg-black/60 hover:scale-110 backdrop-blur-sm"
          >
            <ChevronRight className="w-3.5 h-3.5 text-white/80" />
          </button>
        </>
      )}

      {/* Play/Pause */}
      <button
        onClick={(e) => { e.stopPropagation(); setIsPlaying(p => !p); }}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 border border-white/10 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 backdrop-blur-sm"
      >
        {isPlaying ? <Pause className="w-2.5 h-2.5 text-white/70" /> : <Play className="w-2.5 h-2.5 text-white/70" />}
      </button>

      {/* Dot indicators */}
      {screenshots.length > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
          {screenshots.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setActive(i); }}
              aria-label={`Go to screenshot ${i + 1}`}
              className="transition-all duration-300"
            >
              <div
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === active ? '18px' : '6px',
                  height: '6px',
                  background: i === active ? accent : 'rgba(255,255,255,0.25)',
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Project Card ───────────────────────────────────────────────────────────────
interface ProjectCardProps {
  project: Project;
  index: number;
  isInView: boolean;
  onExpand: () => void;
}

function ProjectCard({ project, index, isInView, onExpand }: ProjectCardProps) {
  const Icon = project.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div
        className="relative rounded-2xl border border-white/[0.07] hover:border-white/[0.13] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-2xl overflow-hidden h-full flex flex-col"
        style={{
          background: 'rgba(255,255,255,0.022)',
          boxShadow: '0 0 0 0 transparent',
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.3s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px ${project.accent}15`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 transparent';
        }}
      >
        {/* Accent glow top-edge */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(90deg, transparent, ${project.accent}60, transparent)` }}
        />

        {/* Screenshot carousel */}
        <div className="p-3 pb-0 flex-shrink-0">
          <ProjectCarousel screenshots={project.screenshots} accent={project.accent} title={project.title} />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Header row */}
          <div className="flex items-start justify-between mb-3.5">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl border border-white/[0.08] flex items-center justify-center flex-shrink-0"
                style={{ background: project.accentBg }}
              >
                <Icon className="w-4.5 h-4.5" style={{ color: project.accent, opacity: 0.9 }} />
              </div>
              <div>
                <h3
                  className="text-[16px] font-semibold text-white/90 tracking-[-0.02em] leading-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {project.title}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
              <button
                onClick={() => window.open(project.github, '_blank')}
                aria-label="View on GitHub"
                className="p-1.5 rounded-lg border border-white/[0.07] hover:border-white/[0.16] hover:bg-white/[0.05] transition-all duration-200"
              >
                <Github className="w-3.5 h-3.5 text-white/40 hover:text-white/80 transition-colors" />
              </button>
              <button
                onClick={() => window.open(project.demo, '_blank')}
                aria-label="View demo"
                className="p-1.5 rounded-lg border border-white/[0.07] hover:border-white/[0.16] hover:bg-white/[0.05] transition-all duration-200"
              >
                <ExternalLink className="w-3.5 h-3.5 text-white/40 hover:text-white/80 transition-colors" />
              </button>
              <button
                onClick={onExpand}
                aria-label="Expand project"
                className="p-1.5 rounded-lg border border-white/[0.07] hover:border-white/[0.16] hover:bg-white/[0.05] transition-all duration-200"
              >
                <Maximize2 className="w-3.5 h-3.5 text-white/40 hover:text-white/80 transition-colors" />
              </button>
            </div>
          </div>

          {/* Description */}
          <p
            className="text-[13px] text-white/45 leading-relaxed mb-4 flex-1"
            style={{ fontFamily: 'var(--font-text)' }}
          >
            {project.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.features.map(f => (
              <span
                key={f}
                className="flex items-center gap-1 text-[11px] text-white/40"
              >
                <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: project.accent + '80' }} />
                {f}
              </span>
            ))}
          </div>

          {/* Tech stack tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="px-2.5 py-1 text-[11px] font-medium rounded-full border transition-colors duration-200"
                style={{
                  color: project.accent + 'cc',
                  borderColor: project.accent + '30',
                  background: project.accentBg,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Expanded Modal ─────────────────────────────────────────────────────────────
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const Icon = project.icon;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-xl" />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/[0.1]"
        style={{ background: 'rgba(12,12,12,0.98)', backdropFilter: 'blur(40px)' }}
      >
        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${project.accent}80, transparent)` }} />

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full border border-white/[0.1] flex items-center justify-center hover:bg-white/[0.06] transition-all duration-200"
        >
          <X className="w-3.5 h-3.5 text-white/60" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Carousel */}
          <div className="mb-6">
            <ProjectCarousel screenshots={project.screenshots} accent={project.accent} title={project.title} />
          </div>

          {/* Title row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl border border-white/[0.08] flex items-center justify-center flex-shrink-0" style={{ background: project.accentBg }}>
              <Icon className="w-5 h-5" style={{ color: project.accent }} />
            </div>
            <h3 className="text-[20px] font-semibold text-white tracking-[-0.02em]" style={{ fontFamily: 'var(--font-display)' }}>
              {project.title}
            </h3>
          </div>

          {/* Long description */}
          <p className="text-[14px] text-white/50 leading-relaxed mb-6" style={{ fontFamily: 'var(--font-text)' }}>
            {project.longDescription}
          </p>

          {/* Features */}
          <div className="mb-6">
            <h4 className="text-[12px] font-semibold tracking-[0.1em] uppercase text-white/30 mb-3">Key Features</h4>
            <div className="grid grid-cols-2 gap-2">
              {project.features.map(f => (
                <div key={f} className="flex items-center gap-2 text-[13px] text-white/55">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: project.accent + '90' }} />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <h4 className="text-[12px] font-semibold tracking-[0.1em] uppercase text-white/30 mb-3">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-[12px] font-medium rounded-full border"
                  style={{ color: project.accent + 'cc', borderColor: project.accent + '30', background: project.accentBg }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-3">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.1] hover:border-white/[0.2] text-[13px] font-medium text-white/70 hover:text-white/90 transition-all duration-200"
            >
              <Github className="w-4 h-4" />GitHub
            </a>
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200"
              style={{ background: project.accent + '20', color: project.accent, border: `1px solid ${project.accent}40` }}
            >
              <ExternalLink className="w-4 h-4" />Live Demo
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [expandedProject, setExpandedProject] = useState<Project | null>(null);

  return (
    <section id="projects" ref={ref} className="relative py-28 sm:py-36 px-5 sm:px-8">
      {/* Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] opacity-[0.025] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,#818cf8 0%,transparent 70%)', filter: 'blur(80px)' }} />

      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <p className="text-[12px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-4">Featured Projects</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              index={index}
              isInView={isInView}
              onExpand={() => setExpandedProject(project)}
            />
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

      {/* Expanded Modal */}
      <AnimatePresence>
        {expandedProject && (
          <ProjectModal project={expandedProject} onClose={() => setExpandedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
