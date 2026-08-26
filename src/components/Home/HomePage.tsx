import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll, Variants } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { TextPlugin } from 'gsap/TextPlugin';
import { CustomEase } from 'gsap/CustomEase';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';
import { useAuth } from '../../context/AuthContext';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin, CustomEase, Flip);
  CustomEase.create('appleEase', 'M0,0 C0.16,1 0.3,1 1,1');
}
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  FileText,
  ShieldCheck,
  Zap,
  ArrowRight,
  Target,
  FileCheck,
  Award,
  Layers,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  Sliders,
  Linkedin,
  Cpu,
  Star,
  Users,
  Check,
  TrendingUp,
  RefreshCw,
  HelpCircle,
  BookOpen,
  Lock,
  Cloud,
  User,
  LogIn,
  LogOut,
  FolderOpen,
  Play,
} from 'lucide-react';
import { ResumeTemplateType } from '../../types/resume';
import { SAMPLE_RESUMES } from '../../data/sampleResumes';

interface HomePageProps {
  onLaunchBuilder: () => void;
  onSelectTemplate: (template: ResumeTemplateType) => void;
  onLoadSample: (sampleKey: keyof typeof SAMPLE_RESUMES) => void;
  onOpenLinkedInModal?: () => void;
  onOpenAuthModal?: () => void;
  onOpenCloudResumesModal?: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

// Custom Apple-style Bento Mouse Spotlight Hook Card Component
const BentoCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 backdrop-blur-xl p-6 sm:p-8 transition-all duration-300 gsap-bento-item ${className}`}
    >
      {/* Radial Spotlight Light Follower */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            background: `radial-gradient(550px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15), transparent 80%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export const HomePage: React.FC<HomePageProps> = ({
  onLaunchBuilder,
  onSelectTemplate,
  onLoadSample,
  onOpenLinkedInModal,
  onOpenAuthModal,
  onOpenCloudResumesModal,
}) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Interactive Bullet Enhancer Demo State
  const [demoInput, setDemoInput] = useState('Helped build website features for the company');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedResult, setEnhancedResult] = useState<string | null>(null);

  // FAQ state
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Template filter state
  const [templateFilter, setTemplateFilter] = useState<'all' | 'popular' | 'tech' | 'executive'>('all');

  // Apple-style 3D Tilt Parallax for Hero Preview
  const heroRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroSectionRef,
    offset: ['start start', 'end start'],
  });

  // Scroll-Driven Apple 3D Perspective Transforms
  const scrollScale = useSpring(useTransform(heroScrollProgress, [0, 0.45], [0.88, 1.05]), { stiffness: 100, damping: 20 });
  const scrollRotateXRaw = useTransform(heroScrollProgress, [0, 0.45], [26, 0]);
  const scrollRotateX = useSpring(scrollRotateXRaw, { stiffness: 100, damping: 20 });
  const scrollTranslateY = useSpring(useTransform(heroScrollProgress, [0, 0.45], [50, -30]), { stiffness: 100, damping: 20 });
  const scrollOpacity = useTransform(heroScrollProgress, [0, 0.45], [0.82, 1]);

  const floatingPillLeft = useSpring(useTransform(heroScrollProgress, [0, 0.45], [-70, 0]), { stiffness: 100, damping: 18 });
  const floatingPillRight = useSpring(useTransform(heroScrollProgress, [0, 0.45], [70, 0]), { stiffness: 100, damping: 18 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mouseRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 25 });

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const width = rect.width || 1;
    const height = rect.height || 1;
    const xPct = (e.clientX - rect.left) / width - 0.5;
    const yPct = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleHeroMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleDemoEnhance = () => {
    setIsEnhancing(true);
    setTimeout(() => {
      setEnhancedResult(
        'Architected 12+ high-performance React & TypeScript modules, reducing page load latency by 38% and elevating daily user conversion rates by 24% for 150K+ monthly active users.'
      );
      setIsEnhancing(false);
    }, 600);
  };

  // GSAP ScrollTrigger Refs & State
  const gsapPinnedSectionRef = useRef<HTMLDivElement>(null);
  const gsap3DCardRef = useRef<HTMLDivElement>(null);
  const gsapBadgeLeftRef = useRef<HTMLDivElement>(null);
  const gsapBadgeRightRef = useRef<HTMLDivElement>(null);
  const gsapProgressBarRef = useRef<HTMLDivElement>(null);
  const [gsapStep, setGsapStep] = useState(1);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    gsap.to(window, {
      scrollTo: { y: targetId, offsetY: 80 },
      duration: 1.1,
      ease: 'appleEase',
    });
  };

  useGSAP(() => {
    const triggerEl = gsapPinnedSectionRef.current;
    if (!triggerEl) return;

    const scrollerEl = triggerEl.closest('.overflow-y-auto') || window;

    // 1. GSAP SCROLLTRIGGER PINNED 3D ENGINE SHOWCASE
    if (gsap3DCardRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          scroller: scrollerEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.28) setGsapStep(1);
            else if (p < 0.58) setGsapStep(2);
            else if (p < 0.85) setGsapStep(3);
            else setGsapStep(4);
          },
        },
      });

      // Un-tilt & scale up 3D product showcase card
      tl.fromTo(
        gsap3DCardRef.current,
        { rotateX: 28, rotateY: -20, scale: 0.78, y: 70 },
        { rotateX: 0, rotateY: 0, scale: 1.02, y: 0, duration: 1, ease: 'appleEase' }
      );

      // Expand side badges
      if (gsapBadgeLeftRef.current && gsapBadgeRightRef.current) {
        tl.to(
          gsapBadgeLeftRef.current,
          { x: -30, opacity: 1, scale: 1.05, duration: 0.6, ease: 'back.out(1.7)' },
          'badges'
        ).to(
          gsapBadgeRightRef.current,
          { x: 30, opacity: 1, scale: 1.05, duration: 0.6, ease: 'back.out(1.7)' },
          'badges'
        );
      }

      // 3D Horizontal Flip Card to reveal back side
      tl.to(
        gsap3DCardRef.current,
        { rotateY: 180, duration: 1.2, ease: 'power3.inOut' },
        'flip'
      );

      // Scrub top progress bar
      if (gsapProgressBarRef.current) {
        tl.to(
          gsapProgressBarRef.current,
          { width: '100%', ease: 'none', duration: tl.duration() },
          0
        );
      }
    }

    // 2. ARCHITECTURAL BREAKDOWN (BENTO GRID STAGGER REVEAL)
    const bentoItems = gsap.utils.toArray<HTMLElement>('.gsap-bento-item');
    if (bentoItems.length > 0) {
      gsap.fromTo(
        bentoItems,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: 'appleEase',
          scrollTrigger: {
            trigger: '#bento',
            scroller: scrollerEl,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // 3. 11 PROFESSIONAL TEMPLATES (STAGGER 3D GRID REVEAL)
    const templateItems = gsap.utils.toArray<HTMLElement>('.gsap-template-item');
    if (templateItems.length > 0) {
      gsap.fromTo(
        templateItems,
        { opacity: 0, y: 45, rotateX: 10 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'appleEase',
          scrollTrigger: {
            trigger: '#templates',
            scroller: scrollerEl,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // 4. WHY CANDIDATES CHOOSE RESUMEBUILDER (AI BULLET & FEATURES)
    const featureItems = gsap.utils.toArray<HTMLElement>('.gsap-feature-item');
    if (featureItems.length > 0) {
      gsap.fromTo(
        featureItems,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'appleEase',
          scrollTrigger: {
            trigger: '#bullet-ai',
            scroller: scrollerEl,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // 5. CRAFTED FOR GLOBAL JOB SEEKERS (STATS & FAQ REVEAL)
    const statItems = gsap.utils.toArray<HTMLElement>('.gsap-stat-item');
    if (statItems.length > 0) {
      gsap.fromTo(
        statItems,
        { opacity: 0, scale: 0.85, y: 25 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '#about',
            scroller: scrollerEl,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    ScrollTrigger.refresh();
  }, []);

  const templatesList = [
    {
      id: 'modern' as ResumeTemplateType,
      name: 'Modern Executive',
      badge: 'Most Popular',
      category: 'popular',
      score: '99% ATS Pass Rate',
      bestFor: 'Software Engineers, Tech Leads, Product Managers',
      description: 'Single-column high impact flow with balanced typography, crisp horizontal accents, and clean metadata hierarchy.',
      color: 'from-blue-600 via-indigo-600 to-cyan-500',
    },
    {
      id: 'tech' as ResumeTemplateType,
      name: 'Tech & Developer',
      badge: 'DevOps / Code',
      category: 'tech',
      score: '99% ATS Pass Rate',
      bestFor: 'Full-Stack Developers, Cloud Architects, Data Engineers',
      description: 'Dev-first layout with monospace accents, categorized technical stack badges, and GitHub link integrations.',
      color: 'from-emerald-600 via-teal-600 to-slate-900',
    },
    {
      id: 'minimal' as ResumeTemplateType,
      name: 'Clean Minimalist',
      badge: 'Classic ATS',
      category: 'popular',
      score: '100% ATS Pass Rate',
      bestFor: 'Finance, Banking, Legal, Big 4 Consulting',
      description: 'Stripped-back typographic clarity with prominent divider lines. 100% parseable by legacy Taleo, Workday, & Greenhouse parsers.',
      color: 'from-slate-700 via-slate-800 to-slate-950',
    },
    {
      id: 'executive' as ResumeTemplateType,
      name: 'Corporate Leader',
      badge: 'C-Suite & VP',
      category: 'executive',
      score: '98% ATS Pass Rate',
      bestFor: 'Directors, Executives, General Managers, VP Roles',
      description: 'Bold executive banner masthead, highlighted value proposition block, and structured core competencies matrix.',
      color: 'from-slate-900 via-indigo-950 to-blue-900',
    },
    {
      id: 'creative' as ResumeTemplateType,
      name: 'Creative Portfolio',
      badge: '2-Column Visual',
      category: 'popular',
      score: '95% ATS Pass Rate',
      bestFor: 'UI/UX Designers, Marketing, Creative Directors',
      description: 'Distinctive dark sidebar framing contact, technical tags, and education alongside an expansive main narrative column.',
      color: 'from-purple-600 via-indigo-600 to-blue-600',
    },
    {
      id: 'elegant' as ResumeTemplateType,
      name: 'Elegant Editorial',
      badge: 'Legal & Advisory',
      category: 'executive',
      score: '99% ATS Pass Rate',
      bestFor: 'Lawyers, Management Consultants, Bankers, Advisory',
      description: 'Refined serif typography with centered classic masthead and clean formal dividers for high-end advisory.',
      color: 'from-amber-700 via-stone-800 to-amber-950',
    },
    {
      id: 'nordic' as ResumeTemplateType,
      name: 'Nordic Timeline',
      badge: 'Scandinavian Flow',
      category: 'popular',
      score: '97% ATS Pass Rate',
      bestFor: 'Product Designers, Strategists, Media Specialists',
      description: 'Continuous vertical timeline connecting career trajectory nodes with generous whitespace and pastel skill pills.',
      color: 'from-teal-600 via-cyan-700 to-blue-900',
    },
    {
      id: 'split' as ResumeTemplateType,
      name: 'Balanced 2-Column',
      badge: 'Modern Split',
      category: 'tech',
      score: '96% ATS Pass Rate',
      bestFor: 'Mid-Senior Specialists, Technical PMs, Analysts',
      description: 'Tinted sidebar organizing contact info, credentials, and skills alongside an open main canvas for experience.',
      color: 'from-slate-600 via-blue-800 to-indigo-950',
    },
    {
      id: 'infographic' as ResumeTemplateType,
      name: 'Startup & Growth',
      badge: 'Product & KPI',
      category: 'executive',
      score: '97% ATS Pass Rate',
      bestFor: 'Growth Leads, Founders, Marketers, Product Owners',
      description: 'Visual competency rating progress bars, impact outcome callouts, and modern growth metric badges.',
      color: 'from-indigo-600 via-rose-600 to-purple-800',
    },
    {
      id: 'academic' as ResumeTemplateType,
      name: 'Ivy Academic / CV',
      badge: 'Ivy League Style',
      category: 'executive',
      score: '98% ATS Pass Rate',
      bestFor: 'Researchers, Professors, Data Scientists, Post-Docs',
      description: 'Formal serif elegance pairing classic Georgia typography with structured publications, appointments, and research awards.',
      color: 'from-amber-800 via-stone-900 to-slate-900',
    },
    {
      id: 'compact' as ResumeTemplateType,
      name: 'Compact High-Density',
      badge: '1-Page Squeezer',
      category: 'tech',
      score: '97% ATS Pass Rate',
      bestFor: 'Senior Veterans packing 10+ years onto a strict single page',
      description: 'Optimized dense grid maximizing vertical whitespace, perfect for dense engineering records without visual clutter.',
      color: 'from-slate-700 via-teal-900 to-slate-950',
    },
  ];

  const filteredTemplates = templatesList.filter((tpl) => {
    if (templateFilter === 'all') return true;
    return tpl.category === templateFilter;
  });

  const comparisonRows = [
    {
      feature: 'Hidden Paywall at Download',
      others: 'Trick you with a $1.95 trial that turns into $29/mo right at the final step',
      us: '100% Free Forever. Unlimited PDF & DOCX downloads without any credit card.',
      icon: Lock,
    },
    {
      feature: 'ATS Robot Compatibility',
      others: 'Heavy graphics, multi-column tables, and icons that get scrambled by Workday & Taleo',
      us: 'Engineered strictly around ATS parsing rules with verified single/dual stream hierarchy.',
      icon: Target,
    },
    {
      feature: 'Google X-Y-Z Bullet Point Formula',
      others: 'Generic placeholder text that sounds passive and unmeasurable',
      us: 'AI-assisted metric optimizer turning weak responsibilities into quantified accomplishments.',
      icon: TrendingUp,
    },
    {
      feature: 'Job Description Tailoring',
      others: 'Not included or charges an expensive enterprise subscription',
      us: 'Paste any job post for instant keyword gap analysis and 1-click tailored alignment.',
      icon: Sparkles,
    },
    {
      feature: 'Data Privacy & Security',
      others: 'Stores and sells your personal phone number, salary, and job data to recruiters',
      us: '100% Local Browser Storage. Your sensitive career data never leaves your device.',
      icon: ShieldCheck,
    },
    {
      feature: 'Editable Word (.DOCX) Export',
      others: 'Only low-res rasterized PDF or watermarked screenshots',
      us: 'Clean, structured native Microsoft Word (.docx) + Vector-sharp printable PDF.',
      icon: Download,
    },
  ];

  const faqs = [
    {
      q: 'Why do most resumes get rejected by ATS (Applicant Tracking Systems)?',
      a: 'Over 75% of resumes are automatically filtered out before a human recruiter ever sees them. Common reasons include unreadable two-column tables, non-standard section headers, missing exact job keywords, and graphics/tables that turn into blank text in software like Workday, Taleo, and Greenhouse. Our builder is architected to guarantee 100% parser readability.',
    },
    {
      q: 'Is this resume builder really 100% free with no watermark or credit card?',
      a: 'Yes! Unlike predatory resume sites that force you to spend 45 minutes building a resume only to lock the download behind a subscription, our studio is 100% free and open. You can export clean high-resolution PDFs and editable Microsoft Word (.docx) files without paying a penny.',
    },
    {
      q: 'How does the AI Job Description Tailoring feature work?',
      a: 'You simply paste the target Job Description into the AI Tailor module. The engine analyzes critical skills, required qualifications, and domain keywords, then automatically suggests optimized summaries, skill additions, and rephrased bullet points that maximize your ATS match score.',
    },
    {
      q: 'Is my personal career information private?',
      a: 'Absolutely. Your resume data is stored locally inside your browser (via LocalStorage). We do not collect, monetize, or sell your contact information, address, or employment history to any 3rd-party recruiters.',
    },
    {
      q: 'Can I import my existing LinkedIn profile or resume?',
      a: 'Yes! You can paste your LinkedIn profile text or import your existing resume to automatically parse and populate your contact details, work history, education, skills, and projects in seconds.',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-slate-100 selection:bg-blue-600 selection:text-white font-sans antialiased">
      {/* 1. FLOATING APPLE-STYLE GLASS NAVIGATION PILL */}
      <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto w-full max-w-5xl rounded-full glass-panel px-5 py-2.5 flex items-center justify-between shadow-2xl shadow-black/80 border border-white/10"
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 12, scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-sky-300 flex items-center justify-center shadow-lg shadow-blue-500/30 cursor-pointer"
              onClick={onLaunchBuilder}
            >
              <FileText className="w-4 h-4 text-white" />
            </motion.div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-tight text-white font-outfit">ResumeBuilder</span>
              <span className="text-[9px] font-extrabold px-2 py-0.5 bg-white/10 text-blue-300 border border-white/15 rounded-full shadow-xs">
                PRO ATS
              </span>
            </div>
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#bento" onClick={(e) => handleNavClick(e, '#bento')} className="hover:text-white transition-colors cursor-pointer">
              Features
            </a>
            <a href="#why-us" onClick={(e) => handleNavClick(e, '#why-us')} className="hover:text-white transition-colors cursor-pointer">
              Advantage
            </a>
            <a href="#templates" onClick={(e) => handleNavClick(e, '#templates')} className="hover:text-white transition-colors cursor-pointer">
              11 Templates
            </a>
            <a href="#bullet-ai" onClick={(e) => handleNavClick(e, '#bullet-ai')} className="hover:text-white transition-colors cursor-pointer">
              X-Y-Z AI
            </a>
            <a href="#about" onClick={(e) => handleNavClick(e, '#about')} className="hover:text-white transition-colors cursor-pointer">
              About
            </a>
          </nav>

          {/* Header Action CTAs */}
          <div className="flex items-center gap-2.5">
            {onOpenLinkedInModal && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenLinkedInModal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-300 bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                <span>LinkedIn</span>
              </motion.button>
            )}

            {/* Auth / Cloud Resumes button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-200 cursor-pointer"
                >
                  <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-slate-950 border border-white/10 rounded-2xl shadow-2xl p-1.5 z-50 text-xs"
                    >
                      {onOpenCloudResumesModal && (
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onOpenCloudResumesModal();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-slate-200 hover:bg-white/10 rounded-xl font-medium transition-colors text-left"
                        >
                          <Cloud className="w-3.5 h-3.5 text-blue-400" />
                          <span>My Cloud Resumes</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl font-medium transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              onOpenAuthModal && (
                <button
                  onClick={onOpenAuthModal}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-300 hover:text-white bg-white/5 border border-white/10 transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-blue-400" />
                  <span>Sign In</span>
                </button>
              )
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLaunchBuilder}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-white text-black hover:bg-slate-200 transition-all cursor-pointer shadow-lg shadow-white/10"
            >
              <span>Build Free</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </motion.button>
          </div>
        </motion.header>
      </div>

      {/* 2. APPLE-STYLE HERO SECTION WITH SCROLL-DRIVEN 3D PERSPECTIVE UNFOLD */}
      <section ref={heroSectionRef} className="relative pt-32 pb-24 lg:pt-40 lg:pb-36 overflow-hidden border-b border-white/10">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/15 to-purple-600/15 blur-[160px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            {/* Apple Pill Badge */}
            <motion.div variants={itemVariants} className="inline-block mb-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold backdrop-blur-md shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span>Verified Harvard & Silicon Valley Resume Architecture</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
            </motion.div>

            {/* Apple Metallic Gradient Shimmer Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.05] mb-8 font-outfit"
            >
              The Resume Studio.{' '}
              <span className="animate-text-shimmer block sm:inline">
                Re-engineered.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light"
            >
              Bypass recruiter algorithms effortlessly. Supercharge your job hunt with real-time 99%+ ATS auditing, automated Google X-Y-Z metric rewrites, and 1-click role tailoring.
            </motion.p>

            {/* Hero CTAs */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={onLaunchBuilder}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-full text-base font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-600/40 transition-all cursor-pointer"
              >
                <span>Start Building Free</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onLoadSample('softwareEngineer')}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-full text-sm font-bold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all cursor-pointer backdrop-blur-md"
              >
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Load Tech Sample</span>
              </motion.button>
            </motion.div>

            {/* Trust Highlights */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs sm:text-sm text-slate-400 font-medium"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant PDF & Word .DOCX</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Private & Client-Side Safe</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Apple-Style Scroll-Driven 3D Perspective Canvas Showcase */}
          <div className="relative mt-16 max-w-5xl mx-auto perspective-1000">
            {/* Scroll-Driven Floating Left Glass Badge */}
            <motion.div
              style={{ x: floatingPillLeft }}
              className="absolute -left-6 sm:-left-12 top-1/4 hidden lg:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-emerald-500/30 shadow-2xl backdrop-blur-2xl text-xs font-bold text-emerald-400 z-30 pointer-events-none"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>99.4% ATS Parser Match Rate</span>
            </motion.div>

            {/* Scroll-Driven Floating Right Glass Badge */}
            <motion.div
              style={{ x: floatingPillRight }}
              className="absolute -right-6 sm:-right-12 top-2/3 hidden lg:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-blue-500/30 shadow-2xl backdrop-blur-2xl text-xs font-bold text-blue-300 z-30 pointer-events-none"
            >
              <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
              <span>Google X-Y-Z Live AI Engine</span>
            </motion.div>

            <motion.div
              ref={heroRef}
              onMouseMove={handleHeroMouseMove}
              onMouseLeave={handleHeroMouseLeave}
              style={{
                scale: scrollScale,
                rotateX: scrollRotateX,
                rotateY: rotateY,
                y: scrollTranslateY,
                opacity: scrollOpacity,
                transformStyle: 'preserve-3d',
              }}
              className="w-full"
            >
              <div className="relative rounded-3xl p-1.5 bg-gradient-to-b from-white/25 via-white/10 to-transparent shadow-2xl border border-white/20 backdrop-blur-2xl group transition-all">
                <div className="bg-slate-950/95 rounded-2xl overflow-hidden p-5 sm:p-8">
                  {/* Mock Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-rose-500/90" />
                    <div className="w-3.5 h-3.5 rounded-full bg-amber-500/90" />
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/90" />
                    <span className="text-xs text-slate-400 font-mono ml-3">resumebuilder-pro-canvas.v1</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                      98% ATS Pass Score
                    </span>
                  </div>
                </div>

                {/* Hero Showcase Split Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left: Interactive Score Breakdown */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                        <span>Real-Time Audit Score</span>
                        <span className="text-emerald-400 font-mono">98/100</span>
                      </div>

                      <div className="space-y-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-slate-300 font-medium">
                            <span>Google X-Y-Z Quantified Bullets</span>
                            <span className="text-emerald-400 font-mono">100%</span>
                          </div>
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: '0%' }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 1, delay: 0.6 }}
                              className="bg-emerald-400 h-full rounded-full"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-slate-300 font-medium">
                            <span>Single Stream Hierarchy</span>
                            <span className="text-emerald-400 font-mono">100%</span>
                          </div>
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: '0%' }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 1, delay: 0.8 }}
                              className="bg-emerald-400 h-full rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-500/30 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-xs">Gemini 3.7 Flash Engine Active</p>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          1-click bullet point rewrites, resume tailoring, and cover letter generation.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Live Resume Card Preview */}
                  <div className="md:col-span-7 bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 text-xs leading-relaxed select-none">
                    <div className="border-b-2 border-slate-900 pb-3 mb-4 flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight font-outfit">
                          Alex Morgan
                        </h3>
                        <p className="text-xs font-bold text-blue-700">Senior Full-Stack Engineer</p>
                      </div>
                      <div className="text-right text-[11px] text-slate-600 font-medium">
                        San Francisco, CA • alex.morgan@dev.io
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
                        Professional Experience
                      </h4>
                      <div className="mb-2">
                        <div className="flex justify-between font-bold text-slate-900 text-xs">
                          <span>Lead Platform Engineer — Stripe</span>
                          <span className="text-slate-500 font-normal">2022 – Present</span>
                        </div>
                        <ul className="list-disc list-inside text-slate-700 space-y-1 pl-1 text-[11px]">
                          <li>
                            Architected distributed payment gateway processing <strong>$45M+ monthly</strong> with{' '}
                            <strong>99.99% uptime SLA</strong>.
                          </li>
                          <li>
                            Led cross-functional team of 8 engineers, cutting API latency by <strong>42%</strong> using
                            Redis caching and Go microservices.
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1 mb-2">
                        Technical Stack
                      </h4>
                      <div className="flex flex-wrap gap-1.5 text-[10px]">
                        <span className="px-2 py-0.5 bg-slate-100 rounded-md border border-slate-300 font-semibold text-slate-800">
                          TypeScript
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 rounded-md border border-slate-300 font-semibold text-slate-800">
                          React
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 rounded-md border border-slate-300 font-semibold text-slate-800">
                          Node.js
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 rounded-md border border-slate-300 font-semibold text-slate-800">
                          PostgreSQL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          </div>
        </div>
      </section>

      {/* GSAP SCROLLTRIGGER PINNED 3D INTERACTIVE SHOWCASE */}
      <section ref={gsapPinnedSectionRef} className="relative h-[135vh] bg-gradient-to-b from-black via-slate-950 to-black border-b border-white/10 overflow-hidden">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
          {/* Header pill & Progress Indicator */}
          <div className="max-w-3xl w-full text-center mb-6 relative z-20">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-outfit">
              Scroll To Unfold The Resume Studio
            </h2>

            {/* Step Pills Navigation */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4">
              {[
                { step: 1, label: '1. 3D Perspective' },
                { step: 2, label: '2. Dynamic Nodes' },
                { step: 3, label: '3. ATS 3D Flip Audit' },
                { step: 4, label: '4. Export Ready' },
              ].map((s) => (
                <div
                  key={s.step}
                  className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-extrabold transition-all duration-300 ${
                    gsapStep >= s.step
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40'
                      : 'bg-white/5 text-slate-400 border border-white/10'
                  }`}
                >
                  {s.label}
                </div>
              ))}
            </div>

            {/* Scrub Progress Bar */}
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden max-w-xl mx-auto border border-white/10">
              <div ref={gsapProgressBarRef} className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full w-0" />
            </div>
          </div>

          {/* 3D Showcase Card Container */}
          <div className="relative max-w-4xl w-full perspective-1000">
            {/* Floating Left 3D Badge */}
            <div
              ref={gsapBadgeLeftRef}
              className="absolute -left-4 sm:-left-12 top-1/3 hidden lg:flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-950/90 border border-emerald-500/40 shadow-2xl backdrop-blur-2xl text-xs font-bold text-emerald-400 z-30 pointer-events-none opacity-0"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="block text-white font-extrabold">100% Parser Safe</span>
                <span className="text-[10px] text-slate-400">Workday, Taleo & Greenhouse</span>
              </div>
            </div>

            {/* Floating Right 3D Badge */}
            <div
              ref={gsapBadgeRightRef}
              className="absolute -right-4 sm:-right-12 top-1/2 hidden lg:flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-950/90 border border-blue-500/40 shadow-2xl backdrop-blur-2xl text-xs font-bold text-blue-300 z-30 pointer-events-none opacity-0"
            >
              <Sparkles className="w-5 h-5 text-blue-400" />
              <div>
                <span className="block text-white font-extrabold">Gemini AI Engine</span>
                <span className="text-[10px] text-slate-400">Google X-Y-Z Metric Rewriter</span>
              </div>
            </div>

            {/* Main 3D Card with Front and Back (Flip Effect) */}
            <div
              ref={gsap3DCardRef}
              className="w-full relative preserve-3d transition-shadow duration-500"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* FRONT SIDE OF CARD */}
              <div
                className="w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-900/95 border border-white/20 shadow-2xl backdrop-blur-2xl backface-hidden"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs text-slate-400 font-mono ml-2">gsap-scrolltrigger-canvas.v1</span>
                  </div>
                  <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-blue-400" />
                    <span>Scrub Animation Active</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-4 text-left">
                    <h3 className="text-2xl font-black text-white font-outfit">
                      Real-Time ATS Parsing Diagnostic
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      Watch how your resume is analyzed in real time. Scroll down to trigger the 3D flip card and inspect the back panel diagnostic inspector!
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
                        ✓ Pipe-Separated Headers
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
                        ✓ Categorized Plain Text Skills
                      </span>
                    </div>
                  </div>

                  <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-200 text-xs select-none text-left">
                    <div className="border-b border-slate-300 pb-2 mb-3">
                      <h4 className="font-black text-slate-950 uppercase text-sm">Alex Morgan</h4>
                      <p className="text-[11px] font-bold text-blue-600">Senior Staff Software Engineer</p>
                      <p className="text-[10px] text-slate-500 font-mono">alex.morgan@dev.io | +1 555-0199 | SF, CA</p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="font-bold text-slate-900 block">Senior Lead Engineer | Stripe</span>
                        <p className="text-[10px] text-slate-600">Architected payment processing engine handling $45M+ monthly with 99.99% SLA.</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">Core Skills</span>
                        <p className="text-[10px] text-slate-700">TypeScript, React, Node.js, Go, PostgreSQL, AWS, Docker</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BACK SIDE OF CARD (180deg Flipped) */}
              <div
                className="w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-blue-950 via-slate-950 to-indigo-950 border border-blue-500/40 shadow-2xl backdrop-blur-2xl absolute top-0 left-0 h-full flex flex-col justify-between rotate-y-180 backface-hidden"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-white font-outfit">ATS Diagnostic Control Inspector</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                    99.4% Match Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left my-auto">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Header Integrity</span>
                    <span className="text-emerald-400 text-lg font-black font-mono">PASSED</span>
                    <p className="text-[11px] text-slate-300 mt-1">Zero icons. Pipe-separated plain text.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Skill Categorization</span>
                    <span className="text-emerald-400 text-lg font-black font-mono">100% Text</span>
                    <p className="text-[11px] text-slate-300 mt-1">No pill graphics or visual progress bars.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">X-Y-Z Action Formula</span>
                    <span className="text-blue-400 text-lg font-black font-mono">OPTIMIZED</span>
                    <p className="text-[11px] text-slate-300 mt-1">Quantified impact metrics in experience.</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <span>Target Parsers: Workday, Taleo, Greenhouse, Lever, iCIMS</span>
                  <button
                    onClick={onLaunchBuilder}
                    className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all cursor-pointer shadow-lg"
                  >
                    Launch Full Builder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. APPLE-STYLE BENTO GRID FEATURE SHOWCASE */}
      <section id="bento" className="py-24 border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3.5 py-1 rounded-full border border-blue-500/20">
              Architectural Breakdown
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-4 mb-4 tracking-tight font-outfit">
              Engineered For Candidate Success.
            </h2>
            <p className="text-slate-400 text-lg">
              Every section, calculation, and component is optimized to surpass automated ATS parser algorithms.
            </p>
          </motion.div>

          {/* Apple Bento Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento 1: Large Span-2 Card (ATS Engine) */}
            <BentoCard className="md:col-span-2 min-h-[320px] flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3 font-outfit">
                  Algorithmic ATS Compatibility Engine
                </h3>
                <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                  Real-time 5-pillar verification algorithm measuring impact density, bullet verb strength, contact completeness, parser safety, and section flow before you ever hit apply.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10 text-xs">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Parser Safety</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">100% Guaranteed</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">X-Y-Z Score</span>
                  <span className="text-blue-400 font-mono font-bold text-sm">Google Approved</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Taleo / Workday</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">100% Parseable</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Greenhouse</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">100% Parseable</span>
                </div>
              </div>
            </BentoCard>

            {/* Bento 2: Job Description AI Tailor */}
            <BentoCard className="md:col-span-1 min-h-[320px] flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-white mb-3 font-outfit">
                  Instant Job Description Alignment
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Paste target job specs to automatically extract critical skills, detect keyword gaps, and align your profile in 1 click.
                </p>
              </div>

              <div className="mt-6 p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs font-semibold flex items-center justify-between">
                <span>Keyword Gap Audit</span>
                <span className="text-emerald-400 font-mono">+35% Match Boost</span>
              </div>
            </BentoCard>

            {/* Bento 3: 1-Click LinkedIn Import */}
            <BentoCard className="md:col-span-1 min-h-[280px] flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                  <Linkedin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-white mb-2 font-outfit">
                  LinkedIn AI Importer
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Import profiles or raw text snippets directly to auto-fill work history, education, and credentials instantly.
                </p>
              </div>

              <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider block mt-4">
                ✓ Converts Bio into Structured Resume JSON
              </span>
            </BentoCard>

            {/* Bento 4: Editable DOCX & Vector PDF */}
            <BentoCard className="md:col-span-2 min-h-[280px] flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                  <Download className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3 font-outfit">
                  Native Word (.DOCX) & High-Resolution Vector PDF
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
                  Never get trapped with watermarked files or uneditable screenshots. Export clean Microsoft Word files and print-ready PDFs anytime.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-200">
                  📄 Editable .DOCX
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-200">
                  🎯 Vector Crisp PDF
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-200">
                  🔒 100% Local Storage Privacy
                </span>
              </div>
            </BentoCard>
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE BULLET OPTIMIZER ENGINE PLAYGROUND */}
      <section id="bullet-ai" className="py-24 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3.5 py-1 rounded-full border border-indigo-500/20">
              ⚡ Instant AI Rewriter
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-4 mb-4 tracking-tight font-outfit">
              Transform Flat Bullets Into Interview Drivers
            </h2>
            <p className="text-slate-400 text-base leading-relaxed font-light">
              Top hiring teams at Google, Apple, and Meta seek quantified impact: <strong className="text-white font-medium">"Accomplished [X] as measured by [Y], by doing [Z]"</strong>. Test our live metric engine below.
            </p>
          </motion.div>

          <BentoCard className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Input side */}
              <div className="space-y-4">
                <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                  Weak / Standard Responsibility Bullet
                </label>
                <textarea
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-900 border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors font-medium shadow-inner"
                  placeholder="e.g. Worked on frontend development and fixed bugs..."
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDemoEnhance}
                  disabled={isEnhancing}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className={`w-4 h-4 ${isEnhancing ? 'animate-spin' : ''}`} />
                  <span>{isEnhancing ? 'Optimizing with X-Y-Z Formula...' : 'Enhance With High-Impact Metrics'}</span>
                </motion.button>
              </div>

              {/* Output side */}
              <div className="space-y-4">
                <label className="block text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ATS-Optimized X-Y-Z Accomplishment
                </label>
                <div className="min-h-[125px] bg-slate-900 border border-white/10 rounded-2xl p-4 text-xs sm:text-sm leading-relaxed text-slate-300 flex items-center justify-center shadow-inner">
                  {enhancedResult ? (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="text-emerald-200 font-semibold"
                    >
                      {enhancedResult}
                    </motion.p>
                  ) : (
                    <span className="text-slate-500 italic text-center font-medium">
                      Click the enhance button above to test how our engine transforms this bullet point.
                    </span>
                  )}
                </div>

                <div className="pt-1 flex items-center justify-between text-xs text-slate-400">
                  <span>Included in full builder suite</span>
                  <button
                    onClick={onLaunchBuilder}
                    className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Use in Builder</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </BentoCard>
        </div>
      </section>

      {/* 5. 11 BATTLE-TESTED TEMPLATES SHOWCASE */}
      <section id="templates" className="py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-10"
          >
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3.5 py-1 rounded-full border border-blue-500/20">
              Harvard & Industry Approved
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-4 mb-4 tracking-tight font-outfit">
              11 Professional Templates
            </h2>
            <p className="text-slate-400 text-base">
              Every template is built with verified ATS column hierarchy, standard font pairings, and responsive layout mechanics.
            </p>

            {/* Template Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {[
                { id: 'all', label: 'All 11 Templates' },
                { id: 'popular', label: '⭐ Most Popular' },
                { id: 'tech', label: '💻 Tech & Dev' },
                { id: 'executive', label: '👔 Executive & Corporate' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setTemplateFilter(btn.id as any)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    templateFilter === btn.id
                      ? 'bg-white text-black shadow-lg shadow-white/10'
                      : 'bg-white/5 text-slate-300 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={templateFilter}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTemplates.map((tpl) => (
                <motion.div
                  key={tpl.id}
                  whileHover={{ y: -6 }}
                  className="group bg-slate-950/80 border border-white/10 hover:border-blue-500/40 rounded-3xl overflow-hidden transition-all flex flex-col justify-between shadow-2xl backdrop-blur-xl gsap-template-item"
                >
                  <div className="p-6">
                    <div className={`h-1.5 w-full bg-gradient-to-r ${tpl.color} rounded-full mb-4`} />

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-extrabold px-3 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        {tpl.badge}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-400">{tpl.score}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 font-outfit">{tpl.name}</h3>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">{tpl.description}</p>

                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 mb-4">
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 block mb-1">
                        Best Suited For:
                      </span>
                      <span className="text-xs text-slate-200 font-semibold">{tpl.bestFor}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 border-t border-white/10">
                    <button
                      onClick={() => onSelectTemplate(tpl.id)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-bold bg-white/10 hover:bg-blue-600 text-slate-200 hover:text-white transition-all cursor-pointer group-hover:bg-blue-600 group-hover:text-white"
                    >
                      <span>Use {tpl.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 6. TRANSPARENT ADVANTAGE COMPARISON SECTION */}
      <section id="why-us" className="py-24 border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3.5 py-1 rounded-full border border-blue-500/20">
              The Transparent Advantage
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-4 mb-4 tracking-tight font-outfit">
              Why Candidates Choose ResumeBuilder
            </h2>
            <p className="text-slate-400 text-base">
              No hidden paywalls, no trial tricks, and no compromised ATS layouts.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparisonRows.map((row, idx) => {
              const Icon = row.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="bg-slate-950/80 border border-white/10 hover:border-blue-500/40 rounded-3xl p-6 flex flex-col justify-between transition-all backdrop-blur-xl group gsap-feature-item"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 text-blue-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-4 font-outfit">{row.feature}</h3>

                    <div className="space-y-3.5 text-xs mb-4">
                      <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-900/40 text-rose-300">
                        <div className="flex items-center gap-1.5 font-bold mb-1 text-rose-400">
                          <XCircle className="w-4 h-4 shrink-0" />
                          <span>Other Generic Builders</span>
                        </div>
                        <p className="text-slate-400 leading-relaxed">{row.others}</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-900/40 text-emerald-300">
                        <div className="flex items-center gap-1.5 font-bold mb-1 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Our PRO ATS Studio</span>
                        </div>
                        <p className="text-emerald-200/90 font-medium leading-relaxed">{row.us}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. APPLE CREATOR SHOWCASE - ATUL YADAV */}
      <section id="about" className="py-24 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-rose-500/30 text-rose-300 text-xs font-extrabold mb-4 shadow-sm backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Architected & Engineered by Atul Yadav</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight font-outfit">
              Crafted For Global Job Seekers
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto font-light">
              Empowering candidates worldwide with modern, AI-augmented career tools without paywalls or subscription traps.
            </p>
          </motion.div>

          {/* Developer Profile Card with Apple Glassmorphism Styling */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-gradient-to-br from-slate-950 via-slate-900/90 to-slate-950 border border-white/15 rounded-3xl p-6 sm:p-10 mb-10 shadow-2xl relative overflow-hidden backdrop-blur-2xl group"
          >
            {/* Ambient Profile Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-rose-600/15 via-indigo-600/10 to-transparent blur-3xl rounded-full pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-5">
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white text-3xl font-black shadow-2xl ring-4 ring-rose-400/20 shrink-0 font-outfit cursor-pointer"
                >
                  AY
                </motion.div>
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-2xl sm:text-3xl font-black text-white font-outfit">Atul Yadav</h3>
                    <span className="px-3 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-rose-400" />
                      <span>Lead Developer</span>
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-indigo-300 to-sky-300 mt-1">
                    Full Stack Ruby on Rails & React Architect
                  </p>
                  <p className="text-xs text-slate-400 mt-1 font-normal max-w-xl leading-relaxed">
                    Specialized in High-Performance Scalable Web Systems, Ruby on Rails, React 19 & Generative AI Integrations.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLaunchBuilder}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-extrabold bg-white text-black hover:bg-slate-200 transition-all cursor-pointer shadow-xl"
                >
                  <span>Explore Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Architectural Highlights Grid */}
            <div className="mt-8 pt-6 border-t border-white/10 text-xs text-slate-300 leading-relaxed grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors gsap-stat-item">
                <p className="font-bold text-white mb-1 flex items-center gap-1.5">
                  <span>🚀</span>
                  <span>Robust Architecture</span>
                </p>
                <p className="text-slate-400 text-xs leading-normal">
                  Built with clean Ruby on Rails backend integration and ultra-responsive React 19 frontend mechanics.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors gsap-stat-item">
                <p className="font-bold text-white mb-1 flex items-center gap-1.5">
                  <span>🎯</span>
                  <span>100% ATS Compliant</span>
                </p>
                <p className="text-slate-400 text-xs leading-normal">
                  Rigorously verified against Workday, Taleo, Greenhouse, Lever, and legacy recruiter parser software.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors gsap-stat-item">
                <p className="font-bold text-white mb-1 flex items-center gap-1.5">
                  <span>🔒</span>
                  <span>Zero Paywall Commitment</span>
                </p>
                <p className="text-slate-400 text-xs leading-normal">
                  Always 100% free with unlimited exports for engineers, students, and career changers worldwide.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed text-left bg-slate-950/80 p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl backdrop-blur-xl">
            <h4 className="font-bold text-white text-lg font-outfit flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-rose-400" />
              <span>The Mission Behind ResumeBuilder PRO</span>
            </h4>
            <p className="font-light">
              Finding a job in today's tech and corporate market is tougher than ever. Over{' '}
              <strong className="text-white font-semibold">75% of qualified candidate resumes</strong> are discarded by automated Applicant Tracking Systems before a recruiter ever reads them.
            </p>
            <p className="font-light">
              Architected by <strong className="text-rose-400 font-bold">Atul Yadav</strong>, <strong className="text-white font-semibold">ResumeBuilder PRO ATS</strong> solves this with complete transparency: live AI bullet point optimization, real-time ATS scoring, and zero subscription paywalls.
            </p>
          </div>
        </div>
      </section>

      {/* 8. APPLE-STYLE FAQ ACCORDION */}
      <section id="faq" className="py-24 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3.5 py-1 rounded-full border border-blue-500/20">
              Got Questions?
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-4 mb-4 tracking-tight font-outfit">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-slate-950/80 border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden transition-all backdrop-blur-xl"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-slate-200 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ml-3 ${
                        isOpen ? 'rotate-180 text-blue-400' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/10 pt-3.5 font-normal">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. BOTTOM CTA FOOTER BANNER */}
      <section className="py-28 relative overflow-hidden bg-gradient-to-b from-black via-slate-950 to-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tight font-outfit">
              Ready To Build Your Masterpiece?
            </h2>
            <p className="text-slate-300 text-base sm:text-xl mb-12 max-w-xl mx-auto font-light">
              Build your ATS-compliant, high-scoring resume in under 10 minutes. 100% free, private, and no credit card required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={onLaunchBuilder}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4.5 rounded-full text-base font-extrabold bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-600/40 transition-all cursor-pointer"
              >
                <span>Build My Resume Now</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onLoadSample('softwareEngineer')}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4.5 rounded-full text-sm font-bold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all cursor-pointer backdrop-blur-md"
              >
                <span>Start With Pre-filled Sample</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 10. APPLE MINIMAL FOOTER */}
      <footer className="py-12 bg-black border-t border-white/10 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-slate-400">
            <span className="font-black text-white font-outfit text-sm">ResumeBuilder PRO ATS</span>
            <span className="hidden sm:inline">•</span>
            <span>
              Developed with ❤️ by <strong className="text-rose-400 font-bold">Atul Yadav</strong> (Full Stack Ruby on Rails Developer)
            </span>
          </div>

          <div className="flex items-center gap-6 text-slate-400 font-semibold">
            <button onClick={onLaunchBuilder} className="hover:text-white transition-colors cursor-pointer">
              Launch Builder
            </button>
            <span>•</span>
            <a href="#templates" className="hover:text-white transition-colors">
              11 Templates
            </a>
            <span>•</span>
            <a href="#about" className="hover:text-white transition-colors">
              About Developer
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
