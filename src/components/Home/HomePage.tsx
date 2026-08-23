import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
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

  // Comparison Tab state
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Template preview active tab
  const [selectedTemplateTab, setSelectedTemplateTab] = useState<ResumeTemplateType>('modern');

  const handleDemoEnhance = () => {
    setIsEnhancing(true);
    setTimeout(() => {
      setEnhancedResult(
        'Architected 12+ high-performance React & TypeScript modules, reducing page load latency by 38% and elevating daily user conversion rates by 24% for 150K+ monthly active users.'
      );
      setIsEnhancing(false);
    }, 600);
  };

  const templatesList = [
    {
      id: 'modern' as ResumeTemplateType,
      name: 'Modern Executive',
      badge: 'Most Popular',
      score: '99% ATS Pass Rate',
      bestFor: 'Software Engineers, Tech Leads, Product Managers',
      description: 'Single-column high impact flow with balanced typography, crisp horizontal accents, and clean metadata hierarchy.',
      color: 'from-blue-600 to-indigo-700',
    },
    {
      id: 'tech' as ResumeTemplateType,
      name: 'Tech & Developer',
      badge: 'DevOps / Code',
      score: '99% ATS Pass Rate',
      bestFor: 'Full-Stack Developers, Cloud Architects, Data Engineers',
      description: 'Dev-first layout with monospace accents, categorized technical stack badges, and GitHub link integrations.',
      color: 'from-emerald-600 to-slate-900',
    },
    {
      id: 'minimal' as ResumeTemplateType,
      name: 'Clean Minimalist',
      badge: 'Classic ATS',
      score: '100% ATS Pass Rate',
      bestFor: 'Finance, Banking, Legal, Big 4 Consulting',
      description: 'Stripped-back typographic clarity with prominent divider lines. 100% parseable by legacy Taleo, Workday, & Greenhouse parsers.',
      color: 'from-slate-700 to-slate-900',
    },
    {
      id: 'executive' as ResumeTemplateType,
      name: 'Corporate Leader',
      badge: 'C-Suite & VP',
      score: '98% ATS Pass Rate',
      bestFor: 'Directors, Executives, General Managers, VP Roles',
      description: 'Bold executive banner masthead, highlighted value proposition block, and structured core competencies matrix.',
      color: 'from-slate-900 to-indigo-950',
    },
    {
      id: 'creative' as ResumeTemplateType,
      name: 'Creative Portfolio',
      badge: '2-Column Visual',
      score: '95% ATS Pass Rate',
      bestFor: 'UI/UX Designers, Marketing, Creative Directors',
      description: 'Distinctive dark sidebar framing contact, technical tags, and education alongside an expansive main narrative column.',
      color: 'from-indigo-600 to-purple-700',
    },
    {
      id: 'elegant' as ResumeTemplateType,
      name: 'Elegant Editorial',
      badge: 'Legal & Advisory',
      score: '99% ATS Pass Rate',
      bestFor: 'Lawyers, Management Consultants, Bankers, Advisory',
      description: 'Refined serif typography with centered classic masthead and clean formal dividers for high-end advisory.',
      color: 'from-amber-700 to-stone-900',
    },
    {
      id: 'nordic' as ResumeTemplateType,
      name: 'Nordic Timeline',
      badge: 'Scandinavian Flow',
      score: '97% ATS Pass Rate',
      bestFor: 'Product Designers, Strategists, Media Specialists',
      description: 'Continuous vertical timeline connecting career trajectory nodes with generous whitespace and pastel skill pills.',
      color: 'from-teal-600 to-cyan-900',
    },
    {
      id: 'split' as ResumeTemplateType,
      name: 'Balanced 2-Column',
      badge: 'Modern Split',
      score: '96% ATS Pass Rate',
      bestFor: 'Mid-Senior Specialists, Technical PMs, Analysts',
      description: 'Tinted sidebar organizing contact info, credentials, and skills alongside an open main canvas for experience.',
      color: 'from-slate-600 to-blue-900',
    },
    {
      id: 'infographic' as ResumeTemplateType,
      name: 'Startup & Growth',
      badge: 'Product & KPI',
      score: '97% ATS Pass Rate',
      bestFor: 'Growth Leads, Founders, Marketers, Product Owners',
      description: 'Visual competency rating progress bars, impact outcome callouts, and modern growth metric badges.',
      color: 'from-indigo-600 to-rose-700',
    },
    {
      id: 'academic' as ResumeTemplateType,
      name: 'Ivy Academic / CV',
      badge: 'Ivy League Style',
      score: '98% ATS Pass Rate',
      bestFor: 'Researchers, Professors, Data Scientists, Post-Docs',
      description: 'Formal serif elegance pairing classic Georgia typography with structured publications, appointments, and research awards.',
      color: 'from-amber-800 to-stone-900',
    },
    {
      id: 'compact' as ResumeTemplateType,
      name: 'Compact High-Density',
      badge: '1-Page Squeezer',
      score: '97% ATS Pass Rate',
      bestFor: 'Senior Veterans packing 10+ years onto a strict single page',
      description: 'Optimized dense grid maximizing vertical whitespace, perfect for dense engineering records without visual clutter.',
      color: 'from-slate-700 to-teal-900',
    },
  ];

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
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* 1. TOP HEADER / NAV */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white">ResumeBuilder</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-400/30 rounded-md">
                  PRO ATS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                AI-Powered Career & Resume Studio
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#why-us" className="hover:text-white transition-colors">
              Why We're Different
            </a>
            <a href="#templates" className="hover:text-white transition-colors">
              Templates
            </a>
            <a href="#bullet-ai" className="hover:text-white transition-colors">
              Bullet Optimizer
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          {/* Header Action CTAs */}
          <div className="flex items-center gap-2.5">
            {onOpenLinkedInModal && (
              <button
                onClick={onOpenLinkedInModal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                <span>Import LinkedIn</span>
              </button>
            )}

            <button
              onClick={onLaunchBuilder}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all transform active:scale-98 cursor-pointer"
            >
              <span>Build My Resume Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-900">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Top Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-6 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>Engineered for 99%+ ATS Robot Pass Rates & Top Interviews</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6"
            >
              The Modern Resume Studio That{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">
                Actually Beats The ATS.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Stop losing dream jobs to silent recruiter algorithms. Build verified, Harvard-style resumes with live
              ATS auditing, Google X-Y-Z quantified bullets, and instant Job Description keyword tailoring.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10"
            >
              <button
                onClick={onLaunchBuilder}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-base font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Launch Resume Builder</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onLoadSample('softwareEngineer')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
              >
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Load Tech Sample Resume</span>
              </button>
            </motion.div>

            {/* Trust Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-400 font-medium"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Free & No Credit Card</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant PDF & Editable Word .DOCX</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Private & Client-Side Secure</span>
              </div>
            </motion.div>
          </div>

          {/* Interactive Hero Preview Visual */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-14 max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl p-1.5 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-2xl border border-slate-700/60">
              <div className="bg-slate-900 rounded-xl overflow-hidden p-4 sm:p-6 lg:p-8">
                {/* Mock Studio Bar */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-xs text-slate-400 font-mono ml-2">resumebuilder-pro-studio.v1</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>ATS Score: 98/100 (Exceptional)</span>
                    </div>
                  </div>
                </div>

                {/* Split Mockup */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left: Interactive Score & Checks */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                          Real-Time ATS Verification
                        </span>
                        <span className="text-xs font-bold text-emerald-400">98% Match</span>
                      </div>
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Measurable Impact Metrics (X-Y-Z)</span>
                          </span>
                          <span className="text-slate-400 font-mono">100%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Parser-Safe Layout & Hierarchy</span>
                          </span>
                          <span className="text-slate-400 font-mono">100%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Action Verb Leadership Density</span>
                          </span>
                          <span className="text-slate-400 font-mono">95%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Keyword Match vs Tech Spec</span>
                          </span>
                          <span className="text-slate-400 font-mono">98%</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-100">Live AI Assistant Ready</p>
                        <p className="text-blue-300/80 text-[11px] mt-0.5">
                          Instant bullet-point rewrites, cover letters, and tailored keyword alignments in 1 click.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Mock Resume Card */}
                  <div className="md:col-span-7 bg-white text-slate-900 rounded-xl p-5 shadow-lg border border-slate-200 text-[11px] leading-relaxed select-none">
                    <div className="border-b-2 border-slate-900 pb-2 mb-3 flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-black text-slate-950 uppercase tracking-tight">
                          Alex Morgan
                        </h3>
                        <p className="text-xs font-semibold text-blue-700">Senior Full-Stack Engineer</p>
                      </div>
                      <div className="text-right text-[10px] text-slate-500">
                        San Francisco, CA • alex.morgan@dev.io
                      </div>
                    </div>

                    <div className="mb-3">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-0.5 mb-1">
                        Professional Experience
                      </h4>
                      <div className="mb-1.5">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>Lead Platform Engineer — Stripe</span>
                          <span className="text-slate-500 font-normal">2022 – Present</span>
                        </div>
                        <ul className="list-disc list-inside text-slate-700 space-y-0.5 pl-1">
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
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-0.5 mb-1">
                        Technical Core
                      </h4>
                      <div className="flex flex-wrap gap-1 text-[9px]">
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 font-semibold">
                          TypeScript
                        </span>
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 font-semibold">
                          React
                        </span>
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 font-semibold">
                          Node.js
                        </span>
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 font-semibold">
                          PostgreSQL
                        </span>
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 font-semibold">
                          Kubernetes
                        </span>
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 font-semibold">
                          AWS
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. COMPARISON SECTION ("WHY WE ARE DIFFERENT") */}
      <section id="why-us" className="py-20 bg-slate-900/60 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
              The Transparent Advantage
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-2 mb-4 tracking-tight">
              Why Job Seekers Are Switching From Other Resume Builders
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Most resume tools trap you in subscriptions or generate files that ATS parsers cannot read. Here is how we
              solve this forever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparisonRows.map((row, idx) => {
              const Icon = row.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-4">{row.feature}</h3>

                    <div className="space-y-3 text-xs mb-6">
                      <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/40 text-rose-300">
                        <div className="flex items-center gap-1.5 font-bold mb-1 text-rose-400">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Other Generic Builders</span>
                        </div>
                        <p className="text-slate-400">{row.others}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/40 text-emerald-300">
                        <div className="flex items-center gap-1.5 font-bold mb-1 text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Our PRO ATS Studio</span>
                        </div>
                        <p className="text-emerald-200/90 font-medium">{row.us}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE BULLET OPTIMIZER PLAYGROUND */}
      <section id="bullet-ai" className="py-20 bg-slate-950 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
              Interactive Live Tool
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-2 mb-4 tracking-tight">
              Test Our Google X-Y-Z Bullet Point Engine
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Recruiters look for <strong>Accomplished [X] as measured by [Y], by doing [Z]</strong>. Try converting a
              vague job responsibility into an interview-winning accomplishment below.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Input side */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Weak / Standard Bullet Point
                </label>
                <textarea
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:outline-hidden focus:border-blue-500 transition-colors"
                  placeholder="e.g. Worked on frontend development and fixed bugs..."
                />
                <button
                  onClick={handleDemoEnhance}
                  disabled={isEnhancing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
                  <span>{isEnhancing ? 'Optimizing with X-Y-Z Formula...' : 'Enhance With High-Impact Metrics'}</span>
                </button>
              </div>

              {/* Output side */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ATS-Optimized X-Y-Z Accomplishment
                </label>
                <div className="min-h-[105px] bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs leading-relaxed text-slate-300 flex items-center justify-center">
                  {enhancedResult ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-emerald-200 font-medium"
                    >
                      {enhancedResult}
                    </motion.p>
                  ) : (
                    <span className="text-slate-500 italic text-center">
                      Click the enhance button to see how our engine transforms this bullet point.
                    </span>
                  )}
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Included in full editor suite</span>
                  <button
                    onClick={onLaunchBuilder}
                    className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Use in Builder</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 11 BATTLE-TESTED TEMPLATES SHOWCASE */}
      <section id="templates" className="py-20 bg-slate-900/70 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">
              Harvard & Industry Approved
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-2 mb-4 tracking-tight">
              11 Professional Templates For Every Career Field
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Every single template is designed with strict ATS column hierarchy, standard font pairings, and responsive
              layout mechanics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templatesList.map((tpl) => (
              <div
                key={tpl.id}
                className="group bg-slate-950 border border-slate-800 hover:border-blue-500/50 rounded-2xl overflow-hidden transition-all flex flex-col justify-between"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {tpl.badge}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400">{tpl.score}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1.5">{tpl.name}</h3>
                  <p className="text-xs text-slate-400 mb-4">{tpl.description}</p>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 mb-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Best Suited For:
                    </span>
                    <span className="text-xs text-slate-200 font-medium">{tpl.bestFor}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      onSelectTemplate(tpl.id);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white transition-all cursor-pointer shadow-xs"
                  >
                    <span>Use {tpl.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CORE FEATURES DEEP DIVE */}
      <section id="features" className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
              Complete Feature Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-2 mb-4 tracking-tight">
              Everything You Need To Land Top-Tier Offers
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              A complete, unified studio crafted to give candidates an unfair advantage in the hiring process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Real-Time ATS Score Calculator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Live evaluation across 5 algorithmic pillars: Content density, quantitative metrics, parser formatting,
                section completeness, and contact validation.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Job Description AI Tailor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paste any job vacancy from LinkedIn or Indeed to automatically identify missing keywords and tailor
                your resume directly to the target role.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                <Linkedin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">1-Click LinkedIn Import</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Save hours of typing. Easily import your existing LinkedIn profile text or PDF to populate all sections
                instantly.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Native Word (.DOCX) & PDF</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download fully editable Microsoft Word `.docx` documents or vector-sharp, high-DPI PDFs formatted
                specifically for recruiters.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Section Reordering & Hiding</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drag-and-drop to reposition sections (e.g., put Education first for fresh grads, or Experience first for
                veterans) and toggle visibility anytime.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4 text-sky-400">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Granular Visual Customization</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Switch font families (Inter, Georgia, Roboto), adjust base font sizes, line heights, and theme accent
                colors in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ABOUT THE CREATOR & MISSION */}
      <section id="about" className="py-20 bg-slate-900/50 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-500/20 via-rose-500/20 to-blue-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Created & Architected by Atul Yadav</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white mb-4 tracking-tight">
              Crafted With Passion For Job Seekers
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              Empowering engineers and professionals with modern, AI-augmented career tools without paywalls.
            </p>
          </div>

          {/* Developer Profile Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 mb-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 blur-3xl rounded-full pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-rose-500/20 ring-2 ring-rose-400/30">
                  AY
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-black text-white">Atul Yadav</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-bold">
                      Lead Developer
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-rose-400 mt-0.5">
                    Full Stack Ruby on Rails Developer
                  </p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <span>Specialized in High-Performance Web Architectures, Ruby on Rails, React & AI Integrations</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={onLaunchBuilder}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-600/25 transition-all cursor-pointer"
                >
                  <span>Explore App</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-800 text-xs text-slate-300 leading-relaxed grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <p className="font-bold text-white mb-1">🚀 Fast & Robust Backend</p>
                <p className="text-slate-400 text-[11px]">Engineered with clean architectural principles, reliable fallback handlers, and strict validation.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <p className="font-bold text-white mb-1">🎯 100% ATS Compliant</p>
                <p className="text-slate-400 text-[11px]">Every template is verified against automated recruiters like Workday, Taleo, and Greenhouse.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <p className="font-bold text-white mb-1">🔒 Zero Paywall Commitment</p>
                <p className="text-slate-400 text-[11px]">Built to be forever free for students, job seekers, and career changers worldwide.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed text-left bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800">
            <h4 className="font-bold text-white text-base">The Story Behind The Studio</h4>
            <p>
              Finding a job in today's tech and corporate market is harder than ever. Over{' '}
              <strong>75% of qualified resumes</strong> are discarded by automated Applicant Tracking Systems before a
              human ever reads them.
            </p>
            <p>
              Worse, the majority of existing online resume builders operate on deceptive business models: they promise
              a "free" resume, let you spend an hour building it, and then demand a $20–$30 monthly subscription when you
              click download.
            </p>
            <p>
              Developed by <strong>Atul Yadav</strong>, <strong>ResumeBuilder PRO ATS</strong> solves this with full transparency: AI-assisted bullet point optimization, real-time ATS scoring, and zero subscription paywalls.
            </p>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section id="faq" className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400">Got Questions?</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-2 mb-4 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-slate-200 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
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
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
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
      <section className="py-20 bg-gradient-to-b from-slate-950 to-blue-950/40 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            Ready To Land Your Next Dream Interview?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-xl mx-auto">
            Build your ATS-compliant, high-scoring resume in under 10 minutes. 100% free, private, and no signup
            required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onLaunchBuilder}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Build My Resume Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onLoadSample('softwareEngineer')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all cursor-pointer"
            >
              <span>Start With Pre-filled Sample</span>
            </button>
          </div>
        </div>
      </section>

      {/* 10. SIMPLE FOOTER */}
      <footer className="py-8 bg-slate-950 border-t border-slate-900 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-slate-400">
            <span className="font-bold text-white">ResumeBuilder PRO ATS</span>
            <span className="hidden sm:inline">•</span>
            <span>
              Developed with ❤️ by <strong className="text-rose-400 font-bold">Atul Yadav</strong> (Full Stack Ruby on Rails Developer)
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <button onClick={onLaunchBuilder} className="hover:text-white cursor-pointer">
              Launch Builder
            </button>
            <span>•</span>
            <a href="#templates" className="hover:text-white">
              Templates
            </a>
            <span>•</span>
            <a href="#about" className="hover:text-white">
              About Developer
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
