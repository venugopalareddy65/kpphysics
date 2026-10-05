/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  INITIAL_COURSES,
  INITIAL_TESTS,
  STUDY_MATERIALS,
  INITIAL_ASSIGNMENTS,
  PHYSICS_TOPICS_TAXONOMY,
  STUDENT_SUCCESS_RECORDS,
  User,
  Course,
  MockTest,
  TestAttemptResult,
  StudyMaterial,
  AssignmentItem
} from './data/physicsData';
import { PhysicsSimulationLab } from './components/PhysicsSimulationLab';
import { TestEngineModal } from './components/TestEngineModal';
import { CourseCatalogView } from './components/CourseCatalogView';
import { CourseDetailView } from './components/CourseDetailView';
import { StudentDashboardView } from './components/StudentDashboardView';
import { ResultsAnalyticsView } from './components/ResultsAnalyticsView';
import { AdminPortalView } from './components/AdminPortalView';
import { ArchitectureBlueprintView } from './components/ArchitectureBlueprintView';
import { AuthPortalModal, AuthModalMode } from './components/AuthPortalModal';
import { HeroPhysicsDiagramCard } from './components/HeroPhysicsDiagramCard';
import { WebsiteLoadingSplash } from './components/WebsiteLoadingSplash';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { PWAInstallButton, OfflineIndicator } from './components/PWAInstallButton';
import { ContactInquirySection } from './components/ContactInquirySection';
import { PhysicsChatbotWidget } from './components/PhysicsChatbotWidget';
import {
  Search,
  Play,
  ArrowRight,
  X,
  Home,
  BookOpen,
  FileCheck,
  BarChart3,
  User as UserIcon,
  Atom,
  Zap,
  Award,
  Sparkles,
  Compass,
  Layers,
  GraduationCap,
  ShieldCheck,
  Flame,
  Clock,
  CheckCircle2,
  Sliders,
  FileText,
  ChevronUp,
  Lightbulb,
  Heart,
  Star,
  Cpu,
  Activity,
  Eye,
  Magnet,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';

type ActiveView =
  | 'HOME'
  | 'CATALOG'
  | 'COURSE_DETAIL'
  | 'DASHBOARD'
  | 'ANALYTICS'
  | 'ADMIN'
  | 'BLUEPRINT';

// Staggered Entrance Animation Variants for Main Content Area
const mainPageStaggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.06
    }
  }
};

const sectionEntranceVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const
    }
  }
};

const cardGridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15
    }
  }
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.42,
      ease: 'easeOut' as const
    }
  }
};

export default function App() {
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('kp_courses_v2');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [tests, setTests] = useState<MockTest[]>(() => {
    const saved = localStorage.getItem('kp_tests_v2');
    return saved ? JSON.parse(saved) : INITIAL_TESTS;
  });

  const [attempts, setAttempts] = useState<TestAttemptResult[]>(() => {
    const saved = localStorage.getItem('kp_attempts_v2');
    if (saved) {
      const parsed: TestAttemptResult[] = JSON.parse(saved);
      return parsed.map((a) =>
        a.userName.toLowerCase().includes('rohit')
          ? { ...a, userName: 'Venu' }
          : a
      );
    }
    return [
      {
        id: 'att-seed-1',
        testId: 'test-c12-magnetism',
        testTitle: 'Class 12 Physics · Chapter Test (Moving Charges & Magnetism)',
        examCategory: 'CHAPTER_TEST',
        userId: 'usr-student-1',
        userName: 'Venu',
        submittedAt: '18 Apr 2025',
        score: 17,
        totalMarks: 20,
        percentage: 85,
        correctCount: 4,
        incorrectCount: 0,
        unansweredCount: 1,
        timeTakenSeconds: 420,
        answers: {}
      }
    ];
  });

  const [assignments, setAssignments] = useState<AssignmentItem[]>(INITIAL_ASSIGNMENTS);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kp_active_session_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem('kp_courses_v2', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('kp_tests_v2', JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    localStorage.setItem('kp_attempts_v2', JSON.stringify(attempts));
  }, [attempts]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('kp_active_session_v3', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('kp_active_session_v3');
    }
  }, [currentUser]);

  // Navigation & Modal States
  const [activeView, setActiveView] = useState<ActiveView>('HOME');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTestModal, setActiveTestModal] = useState<MockTest | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('LOGIN');
  const [showGlobalSearch, setShowGlobalSearch] = useState<boolean>(false);
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [hoveredNavId, setHoveredNavId] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isRouteTransitioning, setIsRouteTransitioning] = useState<boolean>(false);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState<boolean>(false);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState<number>(0);

  // Smooth Scroll Progress Bar across the viewport
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001
  });

  const testimonialsList = [
    {
      name: 'Aryan Sharma',
      exam: 'JEE Main 2024 (98 percentile)',
      quote:
        'KP Physics Academy helped me crack JEE Main with 98 percentile. The concept-based approach and regular tests made a huge difference in my preparation.'
    },
    ...STUDENT_SUCCESS_RECORDS.map((s) => ({
      name: s.name,
      exam: `${s.exam} (${s.achievement})`,
      quote: s.quote
    }))
  ];

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 380);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowGlobalSearch((prev) => !prev);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const switchView = (view: ActiveView) => {
    if (view === 'ADMIN' && currentUser?.role !== 'ADMIN') {
      setAuthModalMode('ADMIN');
      setShowAuthModal(true);
      return;
    }
    if (view === 'DASHBOARD' && !currentUser) {
      setAuthModalMode('LOGIN');
      setShowAuthModal(true);
      return;
    }
    setIsRouteTransitioning(true);
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsRouteTransitioning(false), 420);
  };

  const scrollToHomepageSection = (sectionId: string) => {
    if (activeView !== 'HOME') {
      setActiveView('HOME');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Unified Search Results
  const unifiedSearchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matchedCourses = courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.topicDomain.toLowerCase().includes(q)
    );

    const matchedLessons = courses.flatMap((c) =>
      c.chapters.flatMap((ch) =>
        ch.lessons
          .filter(
            (l) =>
              l.title.toLowerCase().includes(q) ||
              l.formulaSummary.toLowerCase().includes(q)
          )
          .map((l) => ({ lesson: l, course: c }))
      )
    );

    const matchedTests = tests.filter(
      (t) => t.title.toLowerCase().includes(q) || t.topic.toLowerCase().includes(q)
    );

    return {
      matchedCourses,
      matchedLessons,
      matchedTests,
      totalCount:
        matchedCourses.length + matchedLessons.length + matchedTests.length
    };
  }, [searchQuery, courses, tests]);

  const handleOpenCourse = (course: Course) => {
    setSelectedCourse(course);
    switchView('COURSE_DETAIL');
  };

  const handleEnrollCourse = (courseId: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    if (!currentUser.enrolledCourseIds.includes(courseId)) {
      setCurrentUser({
        ...currentUser,
        enrolledCourseIds: [...currentUser.enrolledCourseIds, courseId]
      });
    }
  };

  const handleToggleLessonComplete = (lessonId: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    const exists = currentUser.completedLessonIds.includes(lessonId);
    const updatedIds = exists
      ? currentUser.completedLessonIds.filter((id) => id !== lessonId)
      : [...currentUser.completedLessonIds, lessonId];
    setCurrentUser({
      ...currentUser,
      completedLessonIds: updatedIds
    });
  };

  const handleRecordTestResult = (result: TestAttemptResult) => {
    setAttempts((prev) => [result, ...prev]);
  };

  const handleSaveCourse = (updatedCourse: Course) => {
    setCourses((prev) => {
      const exists = prev.some((c) => c.id === updatedCourse.id);
      if (exists) {
        return prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c));
      }
      return [updatedCourse, ...prev];
    });
    if (selectedCourse?.id === updatedCourse.id) {
      setSelectedCourse(updatedCourse);
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  const handleSaveTest = (updatedTest: MockTest) => {
    setTests((prev) => prev.map((t) => (t.id === updatedTest.id ? updatedTest : t)));
  };

  const handleDeleteTest = (testId: string) => {
    setTests((prev) => prev.filter((t) => t.id !== testId));
  };

  const handleSubmitAssignment = (assignmentId: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, status: 'SUBMITTED' } : a))
    );
  };

  const popularFiveCourses = useMemo(() => {
    return courses.filter((c) =>
      [
        'course-class-10',
        'course-class-11',
        'course-class-12',
        'course-jee-main',
        'course-neet-physics'
      ].includes(c.id)
    );
  }, [courses]);

  const cardColorThemes = [
    {
      topBar: 'from-blue-500 to-cyan-500',
      lessonMeta: '12 Chapters · 120+ Lessons'
    },
    {
      topBar: 'from-violet-600 to-purple-600',
      lessonMeta: '14 Chapters · 150+ Lessons'
    },
    {
      topBar: 'from-slate-800 to-blue-900',
      lessonMeta: '16 Chapters · 180+ Lessons'
    },
    {
      topBar: 'from-orange-500 to-red-600',
      lessonMeta: '12 Chapters · 200+ Lessons'
    },
    {
      topBar: 'from-emerald-500 to-teal-600',
      lessonMeta: '12 Chapters · 150+ Lessons'
    }
  ];

  const eightTopicCards = [
    {
      name: 'Mechanics',
      sub: 'Motion, Force, Energy',
      icon: Atom,
      iconBg: 'bg-sky-50 text-sky-600 border-sky-200',
      hoverGlow:
        'hover:border-sky-400 hover:shadow-[0_0_24px_rgba(14,165,233,0.28)] hover:ring-2 hover:ring-sky-400/30'
    },
    {
      name: 'Thermodynamics',
      sub: 'Heat, Temperature, Laws',
      icon: Flame,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
      hoverGlow:
        'hover:border-amber-400 hover:shadow-[0_0_24px_rgba(245,158,11,0.28)] hover:ring-2 hover:ring-amber-400/30'
    },
    {
      name: 'Waves',
      sub: 'Sound, Light, Waves',
      icon: Activity,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      hoverGlow:
        'hover:border-indigo-400 hover:shadow-[0_0_24px_rgba(99,102,241,0.28)] hover:ring-2 hover:ring-indigo-400/30'
    },
    {
      name: 'Optics',
      sub: 'Light, Mirrors, Lenses',
      icon: Eye,
      iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-200',
      hoverGlow:
        'hover:border-cyan-400 hover:shadow-[0_0_24px_rgba(6,182,212,0.28)] hover:ring-2 hover:ring-cyan-400/30'
    },
    {
      name: 'Electricity',
      sub: 'Current, Voltage, Circuits',
      icon: Zap,
      iconBg: 'bg-orange-50 text-orange-600 border-orange-200',
      hoverGlow:
        'hover:border-orange-400 hover:shadow-[0_0_24px_rgba(249,115,22,0.28)] hover:ring-2 hover:ring-orange-400/30'
    },
    {
      name: 'Magnetism',
      sub: 'Fields, Forces, Induction',
      icon: Magnet,
      iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
      hoverGlow:
        'hover:border-rose-400 hover:shadow-[0_0_24px_rgba(244,63,94,0.28)] hover:ring-2 hover:ring-rose-400/30'
    },
    {
      name: 'Modern Physics',
      sub: 'Atoms, Nuclei, Quantum',
      icon: Sparkles,
      iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
      hoverGlow:
        'hover:border-blue-400 hover:shadow-[0_0_24px_rgba(59,130,246,0.28)] hover:ring-2 hover:ring-blue-400/30'
    },
    {
      name: 'Semiconductor Physics',
      sub: 'Diodes, Transistors, Devices',
      icon: Cpu,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
      hoverGlow:
        'hover:border-purple-400 hover:shadow-[0_0_24px_rgba(168,85,247,0.28)] hover:ring-2 hover:ring-purple-400/30'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB] text-slate-900 pb-16 md:pb-0">
      {/* Website Initial Loading Animation Splash */}
      <AnimatePresence>
        {isInitialLoading && (
          <WebsiteLoadingSplash onFinishLoading={() => setIsInitialLoading(false)} />
        )}
      </AnimatePresence>

      {/* Top View-Switch Animated Progress Bar */}
      <AnimatePresence>
        {isRouteTransitioning && (
          <motion.div
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.38, ease: 'easeOut' }}
            className="fixed top-0 inset-x-0 z-50 h-1 bg-gradient-to-r from-cyan-400 via-amber-400 to-blue-500 origin-left shadow-[0_0_12px_rgba(251,191,36,0.8)]"
          />
        )}
      </AnimatePresence>

      {/* Live Smooth Scroll Progress Indicator Bar */}
      <motion.div
        style={{ scaleX: smoothScrollProgress }}
        className="fixed top-0 inset-x-0 z-50 h-1 bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500 origin-left pointer-events-none"
      />

      {/* 1. Top Header Bar — Strict 3-Zone Contract with Motion Entrance */}
      <motion.header
        id="sec-header"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="sticky top-0 z-40 bg-[#081026]/95 backdrop-blur-md text-white border-b border-slate-800/90 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg"
      >
        {/* Zone 1: Single text element Brand Wordmark with Gradient Hover Shimmer */}
        <motion.a
          href="#sec-hero"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.preventDefault();
            switchView('HOME');
          }}
          className="text-lg sm:text-xl font-bold tracking-tight text-white hover:text-amber-300 transition-colors duration-300 font-display whitespace-nowrap"
        >
          KP Physics Academy
        </motion.a>

        {/* Zone 2: 5 Single-Line Navigation Links with Sliding Hover Pill & Multi-Color Glow */}
        <nav
          onMouseLeave={() => setHoveredNavId(null)}
          className="hidden lg:flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-300"
        >
          {[
            {
              id: 'HOME',
              label: 'Home',
              hoverText: 'hover:text-amber-300',
              activeBar: 'from-amber-400 to-yellow-300',
              pillBg: 'bg-amber-400/15 border-amber-400/30',
              onClick: () => switchView('HOME')
            },
            {
              id: 'CATALOG',
              label: 'Courses',
              hoverText: 'hover:text-cyan-300',
              activeBar: 'from-cyan-400 to-blue-400',
              pillBg: 'bg-cyan-400/15 border-cyan-400/30',
              onClick: () => switchView('CATALOG')
            },
            {
              id: 'MATERIALS',
              label: 'Study Materials',
              hoverText: 'hover:text-violet-300',
              activeBar: 'from-violet-400 to-fuchsia-400',
              pillBg: 'bg-violet-400/15 border-violet-400/30',
              onClick: () => setPreviewMaterial(STUDY_MATERIALS[0])
            },
            {
              id: 'TESTS',
              label: 'Tests',
              hoverText: 'hover:text-emerald-300',
              activeBar: 'from-emerald-400 to-teal-400',
              pillBg: 'bg-emerald-400/15 border-emerald-400/30',
              onClick: () => setActiveTestModal(tests[0])
            },
            {
              id: currentUser?.role === 'ADMIN' ? 'ADMIN' : 'DASHBOARD',
              label:
                currentUser?.role === 'ADMIN'
                  ? 'Admin Portal'
                  : 'Dashboard',
              badge:
                currentUser?.role === 'ADMIN'
                  ? 'ADMIN'
                  : currentUser
                  ? 'USER'
                  : null,
              hoverText: 'hover:text-rose-300',
              activeBar: 'from-rose-400 to-amber-400',
              pillBg: 'bg-rose-400/15 border-rose-400/30',
              onClick: () =>
                switchView(currentUser?.role === 'ADMIN' ? 'ADMIN' : 'DASHBOARD')
            },
            {
              id: 'CONTACT',
              label: 'Contact',
              badge: null,
              hoverText: 'hover:text-amber-300',
              activeBar: 'from-amber-400 to-cyan-400',
              pillBg: 'bg-amber-400/15 border-amber-400/30',
              onClick: () => scrollToHomepageSection('sec-contact')
            }
          ].map((navItem) => {
            const isCurrent =
              activeView === navItem.id ||
              (navItem.id === 'CATALOG' && activeView === 'COURSE_DETAIL');
            const isHovered = hoveredNavId === navItem.id;
            return (
              <motion.button
                key={navItem.id}
                type="button"
                onMouseEnter={() => setHoveredNavId(navItem.id)}
                whileHover={{ y: -2, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={navItem.onClick}
                className={`relative px-3.5 py-1.5 rounded-xl transition-colors duration-200 whitespace-nowrap inline-flex items-center gap-1.5 ${
                  isCurrent
                    ? 'text-amber-300 font-bold'
                    : `text-slate-200 ${navItem.hoverText}`
                }`}
              >
                {isHovered && (
                  <motion.span
                    layoutId="navHoverBackdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    className={`absolute inset-0 rounded-xl border ${navItem.pillBg} -z-10`}
                  />
                )}
                <span className="relative z-10">{navItem.label}</span>
                {'badge' in navItem && navItem.badge && (
                  <span
                    className={`relative z-10 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md ${
                      navItem.badge === 'ADMIN'
                        ? 'bg-amber-400 text-slate-950 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                        : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                    }`}
                  >
                    {navItem.badge}
                  </span>
                )}
                {isCurrent && (
                  <motion.span
                    layoutId="activeHeaderUnderline"
                    className={`absolute bottom-0.5 left-3 right-3 h-0.5 bg-gradient-to-r ${navItem.activeBar} rounded-full`}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Zone 3: Quick Search (Ctrl+K), PWA Install, and 2 Auth / Active Session Buttons */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ y: -2, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => setShowGlobalSearch(true)}
            title="Quick Search (Ctrl + K)"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900/90 border border-slate-700 rounded-lg hover:border-cyan-400 hover:text-cyan-200 transition-all whitespace-nowrap"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded">
              ⌘K
            </kbd>
          </motion.button>
          <PWAInstallButton compact />
          {currentUser ? (
            <>
              <motion.button
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() =>
                  setActiveView(
                    currentUser.role === 'ADMIN' ? 'ADMIN' : 'DASHBOARD'
                  )
                }
                title={
                  currentUser.role === 'ADMIN'
                    ? `Logged in as Admin (${currentUser.email})`
                    : `Logged in as Student (${currentUser.email})`
                }
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all whitespace-nowrap ${
                  currentUser.role === 'ADMIN'
                    ? 'bg-gradient-to-r from-amber-400/20 via-orange-500/20 to-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.35)]'
                    : 'bg-gradient-to-r from-sky-500/20 to-emerald-500/20 border-sky-400/70 text-sky-200 shadow-[0_0_14px_rgba(56,189,248,0.25)]'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      currentUser.role === 'ADMIN'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      currentUser.role === 'ADMIN'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  />
                </span>
                {currentUser.role === 'ADMIN' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <UserIcon className="w-3.5 h-3.5 text-sky-300" />
                )}
                <span
                  className={`px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded ${
                    currentUser.role === 'ADMIN'
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-sky-400 text-slate-950'
                  }`}
                >
                  {currentUser.role === 'ADMIN' ? 'ADMIN' : 'USER'}
                </span>
                <span className="text-white max-w-[110px] truncate">
                  {currentUser.role === 'ADMIN'
                    ? 'Admin'
                    : currentUser.name.split(' ')[0]}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ y: -2, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => {
                  setCurrentUser(null);
                  setActiveView('HOME');
                }}
                title="Sign Out"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-rose-200 bg-rose-500/15 border border-rose-400/40 rounded-lg hover:bg-rose-500 hover:text-white transition-all whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                whileHover={{ y: -2, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => {
                  setAuthModalMode('LOGIN');
                  setShowAuthModal(true);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white border border-slate-600 rounded-lg hover:border-cyan-400 hover:bg-cyan-500/15 hover:text-cyan-200 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] transition-all duration-200 whitespace-nowrap"
              >
                Login
              </motion.button>
              <motion.button
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => {
                  setAuthModalMode('REGISTER');
                  setShowAuthModal(true);
                }}
                className="px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-slate-950 rounded-lg hover:from-amber-300 hover:to-yellow-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.55)] transition-all duration-200 whitespace-nowrap"
              >
                Sign Up
              </motion.button>
            </>
          )}
        </div>
      </motion.header>

      {/* Main Content Area Wrapped in Staggered Motion Entrance Sequence */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView + (selectedCourse?.id || '')}
            variants={mainPageStaggerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -12 }}
          >
            {activeView === 'CATALOG' ? (
              <CourseCatalogView
                courses={courses}
                onSelectCourse={handleOpenCourse}
                onBackHome={() => switchView('HOME')}
              />
            ) : activeView === 'COURSE_DETAIL' && selectedCourse ? (
              <CourseDetailView
                course={selectedCourse}
                isEnrolled={Boolean(
                  currentUser?.enrolledCourseIds.includes(selectedCourse.id)
                )}
                completedLessonIds={currentUser?.completedLessonIds || []}
                courseTests={tests.filter((t) => t.courseId === selectedCourse.id)}
                onBack={() => switchView('CATALOG')}
                onEnroll={handleEnrollCourse}
                onToggleLessonComplete={handleToggleLessonComplete}
                onStartTest={(t) => setActiveTestModal(t)}
              />
            ) : activeView === 'DASHBOARD' && currentUser ? (
              <StudentDashboardView
                user={currentUser}
                courses={courses}
                tests={tests}
                attempts={attempts}
                assignments={assignments}
                onOpenCourse={handleOpenCourse}
                onStartTest={(t) => setActiveTestModal(t)}
                onOpenAnalytics={() => switchView('ANALYTICS')}
                onSubmitAssignment={handleSubmitAssignment}
                onLogout={() => {
                  setCurrentUser(null);
                  switchView('HOME');
                }}
                onBackHome={() => switchView('HOME')}
              />
            ) : activeView === 'ANALYTICS' ? (
              <ResultsAnalyticsView
                attempts={attempts}
                tests={tests}
                onStartWeakAreaTest={(t) => setActiveTestModal(t)}
                onBackHome={() => switchView('DASHBOARD')}
              />
            ) : activeView === 'ADMIN' ? (
              <AdminPortalView
                courses={courses}
                tests={tests}
                attempts={attempts}
                onSaveCourse={handleSaveCourse}
                onDeleteCourse={handleDeleteCourse}
                onSaveTest={handleSaveTest}
                onDeleteTest={handleDeleteTest}
                onBackHome={() => switchView('HOME')}
              />
            ) : activeView === 'BLUEPRINT' ? (
              <ArchitectureBlueprintView onBackHome={() => switchView('HOME')} />
            ) : (
              /* HOMEPAGE CANVAS */
              <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden space-y-2">
                    {/* SECTION 2: HERO SECTION */}
                    <motion.section
                      id="sec-hero"
                      variants={sectionEntranceVariants}
                      className="group/hero relative bg-gradient-to-br from-[#060D24] via-[#0B1739] to-[#0E224D] text-white overflow-hidden px-6 sm:px-10 py-12 lg:py-16"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                        <div className="lg:col-span-7 space-y-5 relative isolate">
                          {/* Subtle Animated Physics-Themed Background Particle Effect Behind Hero Text */}
                          <div
                            aria-hidden="true"
                            className="absolute -inset-4 pointer-events-none -z-10 overflow-hidden"
                          >
                            {[
                              { top: '6%', left: '12%', size: 'w-2 h-2', color: 'bg-cyan-400/35', symbol: 'ℏ', dur: 6.5, del: 0 },
                              { top: '22%', left: '68%', size: 'w-2.5 h-2.5', color: 'bg-amber-400/35', symbol: 'λ', dur: 7.2, del: 0.8 },
                              { top: '48%', left: '82%', size: 'w-2 h-2', color: 'bg-blue-400/35', symbol: 'Φ', dur: 5.8, del: 1.4 },
                              { top: '64%', left: '28%', size: 'w-1.5 h-1.5', color: 'bg-cyan-300/30', symbol: 'ΔE', dur: 8.0, del: 0.4 },
                              { top: '34%', left: '42%', size: 'w-2 h-2', color: 'bg-indigo-400/30', symbol: 'ω', dur: 6.9, del: 1.9 },
                              { top: '78%', left: '60%', size: 'w-2 h-2', color: 'bg-amber-300/30', symbol: '∇·E', dur: 7.5, del: 1.1 }
                            ].map((p, i) => (
                              <motion.span
                                key={i}
                                initial={{ opacity: 0.15, y: 0, x: 0 }}
                                animate={{
                                  opacity: [0.15, 0.45, 0.15],
                                  y: [0, -14, 0],
                                  x: [0, 8, 0]
                                }}
                                transition={{
                                  duration: p.dur,
                                  delay: p.del,
                                  repeat: Infinity,
                                  ease: 'easeInOut'
                                }}
                                style={{ top: p.top, left: p.left }}
                                className="absolute flex items-center gap-1"
                              >
                                <span className={`rounded-full ${p.size} ${p.color} blur-[0.5px]`} />
                                <span className="text-[10px] font-mono text-cyan-200/20 select-none">
                                  {p.symbol}
                                </span>
                              </motion.span>
                            ))}
                          </div>

                          <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.06, ease: 'easeOut' }}
                            className="text-xs font-bold tracking-wider text-cyan-400 group-hover/hero:text-cyan-300 group-hover/hero:drop-shadow-[0_0_10px_rgba(34,211,238,0.55)] transition-all duration-300"
                          >
                            YOUR SUCCESS OUR{' '}
                            <motion.span
                              whileHover={{ scale: 1.06 }}
                              className="inline-block text-amber-400 group-hover/hero:text-amber-300 group-hover/hero:drop-shadow-[0_0_14px_rgba(251,191,36,0.85)] transition-all duration-300"
                            >
                              MISSION
                            </motion.span>
                          </motion.div>

                          <motion.h1
                            initial={{ opacity: 0, x: -36 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.65, delay: 0.18, ease: 'easeOut' }}
                            className="text-3xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-yellow-300 via-orange-400 to-sky-400 bg-clip-text text-transparent leading-[1.12] drop-shadow-[0_2px_16px_rgba(56,189,248,0.22)]"
                            style={{ textWrap: 'balance' }}
                          >
                            <span className="text-white">Master</span>{' '}
                            <span className="text-sky-400">Physics.</span>
                            <br />
                            <span className="text-yellow-300">Build</span>{' '}
                            <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-sky-400 bg-clip-text text-transparent">
                              Your Future.
                            </span>
                          </motion.h1>

                          <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.52, delay: 0.32, ease: 'easeOut' }}
                            className="text-sm sm:text-base font-semibold bg-gradient-to-r from-white via-sky-300 to-amber-300 bg-clip-text text-transparent group-hover/hero:drop-shadow-[0_0_10px_rgba(56,189,248,0.35)] transition-all duration-300"
                          >
                            <span className="text-sky-300">Expert-led online courses</span>{' '}
                            <span className="text-white">for</span>{' '}
                            <span className="text-yellow-300">Class 10, 11, 12,</span>{' '}
                            <span className="text-orange-400">JEE</span>{' '}
                            <span className="text-white">&amp;</span>{' '}
                            <span className="text-emerald-400">NEET</span>
                          </motion.p>

                          <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.52, delay: 0.44, ease: 'easeOut' }}
                            className="text-xs sm:text-sm max-w-lg leading-relaxed font-medium text-sky-100"
                          >
                            Learn at your own pace with{' '}
                            <span className="text-cyan-300 font-semibold">interactive lessons</span>,{' '}
                            <span className="text-yellow-300 font-semibold">practice tests</span>{' '}
                            and{' '}
                            <span className="text-orange-300 font-semibold">
                              personalized progress tracking.
                            </span>
                          </motion.p>

                          {/* Dual CTA Buttons matching Mockup with Vibrant Hover Glow & Sliding Icons */}
                          <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.52, delay: 0.54, ease: 'easeOut' }}
                            className="flex flex-wrap items-center gap-3.5 pt-2"
                          >
                            <motion.button
                              whileHover={{ y: -3, scale: 1.04 }}
                              whileTap={{ scale: 0.97 }}
                              type="button"
                              onClick={() => switchView('CATALOG')}
                              className="group px-6 py-3 text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 rounded-full shadow-md hover:shadow-[0_0_24px_rgba(251,191,36,0.55)] transition-all duration-300 whitespace-nowrap inline-flex items-center gap-2"
                            >
                              <span>Explore Courses</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </motion.button>

                            <motion.button
                              whileHover={{ y: -3, scale: 1.04 }}
                              whileTap={{ scale: 0.97 }}
                              type="button"
                              onClick={() =>
                                document
                                  .getElementById('interactive-lab')
                                  ?.scrollIntoView({ behavior: 'smooth' })
                              }
                              className="group inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold bg-slate-900/70 text-white border border-slate-500 rounded-full hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-200 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300 whitespace-nowrap"
                            >
                              <Play className="w-3.5 h-3.5 fill-white group-hover:fill-cyan-300 group-hover:scale-110 transition-transform" />
                              <span>Watch Intro</span>
                            </motion.button>
                          </motion.div>

                          {/* 4 Stats Row with Interactive Hover Lift & Color Accents */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-700/70">
                            {[
                              {
                                value: '50K+',
                                label: 'Happy Students',
                                icon: GraduationCap,
                                hoverBorder: 'hover:border-amber-400/50 hover:bg-amber-400/10',
                                iconColor: 'text-amber-400 group-hover:text-amber-300'
                              },
                              {
                                value: '200+',
                                label: 'Video Lectures',
                                icon: Play,
                                hoverBorder: 'hover:border-cyan-400/50 hover:bg-cyan-400/10',
                                iconColor: 'text-cyan-400 group-hover:text-cyan-300'
                              },
                              {
                                value: '1K+',
                                label: 'Practice Questions',
                                icon: FileCheck,
                                hoverBorder: 'hover:border-emerald-400/50 hover:bg-emerald-400/10',
                                iconColor: 'text-emerald-400 group-hover:text-emerald-300'
                              },
                              {
                                value: '95%',
                                label: 'Success Rate',
                                icon: BarChart3,
                                hoverBorder: 'hover:border-violet-400/50 hover:bg-violet-400/10',
                                iconColor: 'text-amber-400 group-hover:text-violet-300'
                              }
                            ].map((stat) => {
                              const StatIcon = stat.icon;
                              return (
                                <motion.div
                                  key={stat.label}
                                  whileHover={{ y: -4, scale: 1.03 }}
                                  className={`group flex items-center gap-2.5 p-2.5 rounded-xl border border-transparent ${stat.hoverBorder} transition-all duration-200 cursor-default`}
                                >
                                  <StatIcon
                                    className={`w-6 h-6 shrink-0 transition-transform duration-200 group-hover:scale-110 ${stat.iconColor}`}
                                  />
                                  <div>
                                    <div className="text-lg font-bold font-mono tabular-nums text-white group-hover:text-amber-200 transition-colors">
                                      {stat.value}
                                    </div>
                                    <div className="text-[11px] text-slate-300">{stat.label}</div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Right Side Hero Visual + Vector Diagram */}
                        <div className="lg:col-span-5">
                          <HeroPhysicsDiagramCard
                            onOpenSimulations={() => {
                              document
                                .getElementById('interactive-lab')
                                ?.scrollIntoView({ behavior: 'smooth' });
                            }}
                          />
                        </div>
                      </div>
                    </motion.section>

                    {/* SECTION 3: POPULAR COURSES (Staggered Scroll Course Grid) */}
                    <motion.section
                      id="sec-popular-courses"
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.18 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="px-6 sm:px-10 py-10 space-y-6 bg-white"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                            Popular Courses
                          </h2>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Choose from our wide range of courses designed for different boards and exams.
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ x: 4, scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          type="button"
                          onClick={() => switchView('CATALOG')}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 text-xs font-bold text-blue-600 hover:text-white transition-all duration-200 shadow-2xs"
                        >
                          <span>View All Courses</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>

                      <motion.div
                        variants={cardGridContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
                      >
                        {popularFiveCourses.map((course, idx) => {
                          const theme = cardColorThemes[idx % cardColorThemes.length];
                          return (
                            <motion.div
                              key={course.id}
                              variants={cardItemVariants}
                              whileHover={{ y: -7, scale: 1.02 }}
                              className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between hover:border-blue-500 transition-all duration-300 shadow-2xs hover:shadow-xl group"
                            >
                              <div>
                                <div className={`h-1.5 w-full bg-gradient-to-r ${theme.topBar} group-hover:h-2 transition-all`} />
                                <div className="h-32 bg-slate-900 overflow-hidden relative">
                                  <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                </div>
                                <div className="p-4 space-y-1.5">
                                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {course.title}
                                  </h3>
                                  <div className="text-[11px] text-slate-500">
                                    {course.boardTags.join(' / ')}
                                  </div>
                                  <div className="text-[11px] text-slate-600 font-mono flex items-center gap-1 pt-0.5">
                                    <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" />
                                    <span className="truncate">{theme.lessonMeta}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="px-4 pb-4 pt-1">
                                <motion.button
                                  whileHover={{ scale: 1.04 }}
                                  whileTap={{ scale: 0.96 }}
                                  type="button"
                                  onClick={() => handleOpenCourse(course)}
                                  className={`w-full justify-center inline-flex items-center gap-1.5 px-3.5 py-2 border border-blue-200 bg-blue-50/70 text-blue-600 group-hover:bg-gradient-to-r ${theme.topBar} group-hover:text-white group-hover:border-transparent text-xs font-bold rounded-lg transition-all duration-200 shadow-2xs`}
                                >
                                  <span>Explore</span>
                                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </motion.section>

                    {/* SECTION 4: WHY CHOOSE KP PHYSICS ACADEMY? (Staggered Scroll & Floating Icon Motion) */}
                    <motion.section
                      id="sec-why-choose"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      variants={sectionEntranceVariants}
                      className="px-6 sm:px-10 py-12 bg-gradient-to-b from-slate-50/90 via-blue-50/30 to-slate-50/70 border-y border-slate-200/70 space-y-8 relative overflow-hidden"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45 }}
                        className="flex flex-col sm:flex-row sm:items-end justify-between gap-2"
                      >
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                            Why Choose KP Physics Academy?
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            We provide the best learning experience with modern technology and expert guidance.
                          </p>
                        </div>
                      </motion.div>

                      <motion.div
                        variants={cardGridContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 pt-1"
                      >
                        {[
                          {
                            title: 'Expert Faculty',
                            desc: 'Learn from experienced teachers',
                            icon: GraduationCap,
                            iconBg: 'from-blue-600 to-cyan-500',
                            ringColor: 'ring-blue-100',
                            hoverBorder: 'hover:border-blue-400',
                            hoverGlow:
                              'hover:shadow-[0_0_28px_rgba(59,130,246,0.32)] hover:ring-2 hover:ring-blue-400/35',
                            barColor: 'bg-gradient-to-r from-blue-600 to-cyan-500'
                          },
                          {
                            title: 'Interactive Learning',
                            desc: 'Videos, notes, simulations',
                            icon: Play,
                            iconBg: 'from-violet-600 to-indigo-500',
                            ringColor: 'ring-violet-100',
                            hoverBorder: 'hover:border-violet-400',
                            hoverGlow:
                              'hover:shadow-[0_0_28px_rgba(139,92,246,0.32)] hover:ring-2 hover:ring-violet-400/35',
                            barColor: 'bg-gradient-to-r from-violet-600 to-indigo-500'
                          },
                          {
                            title: 'Regular Tests',
                            desc: 'Track your progress',
                            icon: ShieldCheck,
                            iconBg: 'from-amber-500 to-orange-500',
                            ringColor: 'ring-amber-100',
                            hoverBorder: 'hover:border-amber-400',
                            hoverGlow:
                              'hover:shadow-[0_0_28px_rgba(245,158,11,0.32)] hover:ring-2 hover:ring-amber-400/35',
                            barColor: 'bg-gradient-to-r from-amber-500 to-orange-500'
                          },
                          {
                            title: 'Personalized Progress',
                            desc: 'Detailed topic-wise insights',
                            icon: BookOpen,
                            iconBg: 'from-emerald-500 to-teal-600',
                            ringColor: 'ring-emerald-100',
                            hoverBorder: 'hover:border-emerald-400',
                            hoverGlow:
                              'hover:shadow-[0_0_28px_rgba(16,185,129,0.32)] hover:ring-2 hover:ring-emerald-400/35',
                            barColor: 'bg-gradient-to-r from-emerald-500 to-teal-600'
                          },
                          {
                            title: 'Access Anywhere',
                            desc: 'Study on any device',
                            icon: Compass,
                            iconBg: 'from-rose-500 to-pink-600',
                            ringColor: 'ring-rose-100',
                            hoverBorder: 'hover:border-rose-400',
                            hoverGlow:
                              'hover:shadow-[0_0_28px_rgba(244,63,94,0.32)] hover:ring-2 hover:ring-rose-400/35',
                            barColor: 'bg-gradient-to-r from-rose-500 to-pink-600'
                          }
                        ].map((item, idx) => {
                          const IconComp = item.icon;
                          return (
                            <motion.div
                              key={item.title}
                              variants={cardItemVariants}
                              whileHover={{
                                y: -8,
                                scale: 1.03,
                                transition: { type: 'spring', stiffness: 320, damping: 20 }
                              }}
                              whileTap={{ scale: 0.98 }}
                              className={`group relative bg-white border border-slate-200/90 ${item.hoverBorder} ${item.hoverGlow} rounded-2xl p-5 text-center flex flex-col items-center space-y-3 shadow-xs transition-all duration-300 overflow-hidden`}
                            >
                              {/* Top animated accent bar */}
                              <div
                                className={`absolute top-0 inset-x-0 h-1 ${item.barColor} opacity-80 group-hover:h-1.5 transition-all`}
                              />

                              {/* Floating animated icon badge */}
                              <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{
                                  duration: 3.2,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                  delay: idx * 0.25
                                }}
                                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.iconBg} text-white flex items-center justify-center shadow-md ring-4 ${item.ringColor} group-hover:scale-110 transition-transform duration-300`}
                              >
                                <IconComp className="w-6 h-6" />
                              </motion.div>

                              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                                {item.title}
                              </h3>

                              <p className="text-xs text-slate-500 leading-relaxed max-w-[175px]">
                                {item.desc}
                              </p>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </motion.section>

                    {/* SECTION 5: CALL-TO-ACTION BANNER ("Better Learning Brighter Future" + Lightbulb) */}
                    <motion.section
                      id="sec-cta-banner"
                      initial={{ opacity: 0, y: 28, scale: 0.98 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="px-6 sm:px-10 py-6 bg-white"
                    >
                      <div className="bg-gradient-to-r from-[#06122E] via-[#0D2352] to-[#09183C] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-sky-400/30 shadow-[0_14px_40px_rgba(14,165,233,0.18)] relative overflow-hidden group/cta">
                        {/* Decorative Aurora Glow Accents */}
                        <div className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 rounded-full bg-sky-500/20 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-20 right-10 w-64 h-64 rounded-full bg-amber-400/20 blur-3xl" />
                        <div className="pointer-events-none absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-400 via-amber-300 to-orange-500" />

                        <div className="space-y-2.5 max-w-lg relative z-10">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-sky-400/15 border border-sky-300/30 text-[10px] font-bold uppercase tracking-widest text-sky-300">
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>Accelerate Your Rank</span>
                          </span>
                          <h2 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-white via-amber-200 to-sky-300 bg-clip-text text-transparent">
                            Start Your Physics Journey Today
                          </h2>
                          <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed">
                            Join <span className="text-amber-300 font-semibold">KP Physics Academy</span> and learn Physics with <span className="text-sky-300 font-semibold">clarity, confidence</span> and <span className="text-orange-300 font-semibold">consistency</span>.
                          </p>
                          <div className="pt-1.5">
                            <motion.button
                              whileHover={{ y: -3, scale: 1.05 }}
                              whileTap={{ scale: 0.96 }}
                              type="button"
                              onClick={() => switchView('CATALOG')}
                              className="group px-5 py-2.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 hover:from-amber-300 hover:to-yellow-200 text-slate-950 text-xs font-extrabold rounded-xl shadow-[0_0_24px_rgba(251,191,36,0.45)] hover:shadow-[0_0_32px_rgba(251,191,36,0.75)] transition-all duration-200 inline-flex items-center gap-2"
                            >
                              <span>Get Started Now</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                          </div>
                        </div>

                        {/* Right Handwritten-style Motto & Pinging Pulsing Lightbulb Graphic */}
                        <div className="flex items-center gap-5 self-end md:self-center relative z-10">
                          <div className="text-right font-display italic text-lg sm:text-xl leading-snug -rotate-6 bg-gradient-to-b from-white via-amber-200 to-sky-300 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(251,191,36,0.25)]">
                            Better
                            <br />
                            Learning
                            <br />
                            Brighter
                            <br />
                            Future
                          </div>
                          <motion.div
                            whileHover={{ rotate: 12, scale: 1.12 }}
                            className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/25 via-yellow-400/20 to-orange-500/25 border border-amber-300/60 shadow-[0_0_28px_rgba(251,191,36,0.45)] hover:shadow-[0_0_38px_rgba(251,191,36,0.75)] flex items-center justify-center text-amber-300 transition-all cursor-pointer"
                          >
                            {/* Subtle Pinging Pulse Rings around Lightbulb */}
                            <span className="pointer-events-none absolute inset-0 rounded-2xl bg-amber-400/35 animate-ping opacity-75" />
                            <span className="pointer-events-none absolute -inset-1.5 rounded-2xl border border-amber-300/40 animate-pulse" />
                            <Lightbulb className="w-8 h-8 relative z-10 text-amber-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.9)]" />
                          </motion.div>
                        </div>
                      </div>
                    </motion.section>

                    {/* SECTION 6: EXPLORE PHYSICS TOPICS (8 Subject-wise Topic Cards with Rich Hover Colors) */}
                    <motion.section
                      id="sec-physics-topics"
                      initial={{ opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="px-6 sm:px-10 py-10 bg-gradient-to-br from-slate-50/80 via-white to-sky-50/60 border-t border-slate-100 space-y-6 relative overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 relative z-10">
                        <div>
                          <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-sky-600 bg-sky-100/80 border border-sky-200 px-2.5 py-0.5 rounded-md mb-1.5">
                            Core Domains
                          </span>
                          <h2 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-slate-900 via-blue-800 to-sky-600 bg-clip-text text-transparent">
                            Explore Physics Topics
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                            Master every concept with structured chapter-wise learning paths &amp; visual labs.
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ x: 4, scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          type="button"
                          onClick={() => switchView('CATALOG')}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-xs font-bold text-white shadow-sm hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all duration-200 self-start sm:self-auto"
                        >
                          <span>View All Topics</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                        {eightTopicCards.map((topic) => {
                          const IconComp = topic.icon;
                          return (
                            <motion.button
                              key={topic.name}
                              type="button"
                              whileHover={{ y: -6, scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => switchView('CATALOG')}
                              className={`group relative overflow-hidden text-left p-4 bg-white/95 border border-slate-200/90 rounded-2xl ${topic.hoverGlow} hover:bg-gradient-to-br hover:from-white via-sky-50/30 hover:to-amber-50/30 transition-all duration-300 flex items-center justify-between gap-3.5 shadow-2xs`}
                            >
                              <div className="pointer-events-none absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-sky-400 via-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="flex items-center gap-3.5 min-w-0">
                                <div
                                  className={`w-12 h-12 rounded-xl border ${topic.iconBg} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200 flex items-center justify-center shrink-0 shadow-xs`}
                                >
                                  <IconComp className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                                    {topic.name}
                                  </h3>
                                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                    {topic.sub}
                                  </p>
                                </div>
                              </div>
                              <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-blue-600 flex items-center justify-center shrink-0 transition-colors">
                                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.section>

                    {/* SECTION 7: HOW IT WORKS (5-Step Animated Learning Progression) */}
                    <motion.section
                      id="sec-how-it-works"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      variants={sectionEntranceVariants}
                      className="px-6 sm:px-10 py-12 bg-gradient-to-br from-indigo-50/60 via-white to-amber-50/50 border-t border-slate-200/70 space-y-8 relative overflow-hidden"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45 }}
                        className="flex flex-col sm:flex-row sm:items-end justify-between gap-2"
                      >
                        <div>
                          <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100/90 border border-amber-200 px-2.5 py-0.5 rounded-md mb-1.5">
                            5-Step Blueprint
                          </span>
                          <h2 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-slate-900 via-indigo-800 to-orange-600 bg-clip-text text-transparent">
                            How It Works
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-600 mt-1">
                            Simple, structured steps to achieve your dream exam score
                          </p>
                        </div>
                      </motion.div>

                      <div className="relative">
                        {/* Animated Horizontal Progress Line on Desktop */}
                        <motion.div
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true, amount: 0.4 }}
                          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.2 }}
                          className="hidden lg:block absolute top-11 left-12 right-12 h-1 bg-gradient-to-r from-sky-500 via-amber-400 to-orange-500 origin-left z-0 opacity-45 rounded-full"
                        />

                        <motion.div
                          variants={cardGridContainerVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.2 }}
                          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 relative z-10"
                        >
                          {[
                            {
                              step: '1',
                              title: 'Choose Course',
                              sub: 'Select your class & exam',
                              badgeBg: 'from-sky-500 to-blue-600 text-white ring-sky-100',
                              accentText: 'text-sky-600',
                              topBar: 'from-sky-400 to-blue-600',
                              hoverGlow: 'hover:border-sky-400 hover:shadow-[0_0_25px_rgba(14,165,233,0.25)]',
                              icon: BookOpen,
                              action: () => switchView('CATALOG')
                            },
                            {
                              step: '2',
                              title: 'Learn Concepts',
                              sub: 'Watch videos & read notes',
                              badgeBg: 'from-amber-400 to-orange-500 text-slate-950 ring-amber-100',
                              accentText: 'text-amber-600',
                              topBar: 'from-amber-400 to-orange-500',
                              hoverGlow: 'hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.28)]',
                              icon: Play,
                              action: () => handleOpenCourse(courses[2] || courses[0])
                            },
                            {
                              step: '3',
                              title: 'Practice',
                              sub: 'Solve MCQs & assignments',
                              badgeBg: 'from-emerald-500 to-teal-600 text-white ring-emerald-100',
                              accentText: 'text-emerald-600',
                              topBar: 'from-emerald-400 to-teal-600',
                              hoverGlow: 'hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]',
                              icon: Sliders,
                              action: () =>
                                document
                                  .getElementById('interactive-lab')
                                  ?.scrollIntoView({ behavior: 'smooth' })
                            },
                            {
                              step: '4',
                              title: 'Take Tests',
                              sub: 'Check your performance',
                              badgeBg: 'from-orange-500 to-rose-500 text-white ring-orange-100',
                              accentText: 'text-orange-600',
                              topBar: 'from-orange-400 to-rose-500',
                              hoverGlow: 'hover:border-orange-400 hover:shadow-[0_0_25px_rgba(249,115,22,0.28)]',
                              icon: FileCheck,
                              action: () => setActiveTestModal(tests[0])
                            },
                            {
                              step: '5',
                              title: 'Track Progress',
                              sub: 'Visualize your growth',
                              badgeBg: 'from-indigo-600 to-violet-600 text-white ring-indigo-100',
                              accentText: 'text-indigo-600',
                              topBar: 'from-indigo-500 to-violet-600',
                              hoverGlow: 'hover:border-indigo-400 hover:shadow-[0_0_25px_rgba(99,102,241,0.28)]',
                              icon: BarChart3,
                              action: () => switchView('ANALYTICS')
                            }
                          ].map((item, idx) => {
                            const StepIcon = item.icon;
                            return (
                              <motion.button
                                key={item.step}
                                type="button"
                                variants={cardItemVariants}
                                whileHover={{
                                  y: -8,
                                  scale: 1.03,
                                  transition: { type: 'spring', stiffness: 320, damping: 20 }
                                }}
                                whileTap={{ scale: 0.97 }}
                                onClick={item.action}
                                className={`group text-left bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 ${item.hoverGlow} transition-all shadow-xs relative overflow-hidden`}
                              >
                                <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${item.topBar}`} />
                                <div className="flex items-center justify-between">
                                  <motion.div
                                    animate={{ scale: [1, 1.07, 1] }}
                                    transition={{
                                      duration: 2.6,
                                      repeat: Infinity,
                                      ease: 'easeInOut',
                                      delay: idx * 0.3
                                    }}
                                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.badgeBg} ring-4 text-sm font-mono font-extrabold flex items-center justify-center shadow-sm`}
                                  >
                                    {item.step}
                                  </motion.div>

                                  <div
                                    className={`w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-sky-50 flex items-center justify-center ${item.accentText} transition-colors`}
                                  >
                                    <StepIcon className="w-4 h-4" />
                                  </div>
                                </div>

                                <div className="space-y-1 pt-1">
                                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors flex items-center justify-between">
                                    <span>{item.title}</span>
                                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-600" />
                                  </h3>
                                  <p className="text-xs text-slate-500 leading-relaxed">
                                    {item.sub}
                                  </p>
                                </div>
                              </motion.button>
                            );
                          })}
                        </motion.div>
                      </div>
                    </motion.section>

                    {/* Interactive Simulation Lab embedded cleanly */}
                    <motion.section
                      id="interactive-lab"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.55, ease: 'easeOut' }}
                      className="px-6 sm:px-10 py-8 bg-white border-t border-slate-100 space-y-4"
                    >
                      <PhysicsSimulationLab />
                    </motion.section>

                    {/* SECTION 8: OUR STUDENTS' SUCCESS STORIES (Dark Navy Band matching Mockup) */}
                    <motion.section
                      id="sec-success-stories"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.55, ease: 'easeOut' }}
                      className="relative overflow-hidden bg-gradient-to-br from-[#06102A] via-[#0B1F4A] to-[#07122E] text-white px-6 sm:px-10 py-12 space-y-7 border-t border-sky-500/20"
                    >
                      {/* Ambient Decorative Glows */}
                      <div className="pointer-events-none absolute -top-24 left-1/4 w-72 h-72 rounded-full bg-sky-500/15 blur-3xl" />
                      <div className="pointer-events-none absolute -bottom-24 right-1/4 w-72 h-72 rounded-full bg-amber-400/15 blur-3xl" />

                      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                        <div>
                          <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-400/15 border border-amber-300/30 px-2.5 py-0.5 rounded-md mb-1.5">
                            Proven Hall of Fame
                          </span>
                          <h2 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-white via-amber-200 to-sky-300 bg-clip-text text-transparent">
                            Our Students’ Success Stories
                          </h2>
                          <p className="text-xs sm:text-sm text-sky-200/80 mt-0.5">
                            Real students. Real JEE &amp; NEET top percentiles.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                        {/* Featured Testimonial Card on Left (6 cols) */}
                        <div className="lg:col-span-6 space-y-3.5">
                          <div className="relative bg-gradient-to-br from-white via-sky-50/40 to-amber-50/30 text-slate-800 rounded-2xl p-6 shadow-[0_12px_36px_rgba(0,0,0,0.3)] border border-sky-200/70 space-y-4 overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-sky-400" />
                            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium italic">
                              &ldquo;{testimonialsList[activeTestimonialIdx].quote}&rdquo;
                            </p>
                            <div className="flex items-center justify-between pt-3 border-t border-slate-200/80">
                              <div>
                                <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                                  – {testimonialsList[activeTestimonialIdx].name}
                                </div>
                                <div className="text-[11px] font-semibold text-blue-600">
                                  {testimonialsList[activeTestimonialIdx].exam}
                                </div>
                              </div>
                              <div className="px-2.5 py-1 rounded-lg bg-amber-400/15 border border-amber-300/50 text-amber-500 text-xs font-bold tracking-wider shadow-2xs">
                                ★★★★★
                              </div>
                            </div>
                          </div>

                          {/* Carousel Dots */}
                          <div className="flex items-center gap-2 pl-2">
                            {testimonialsList.map((_, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setActiveTestimonialIdx(i)}
                                className={`h-2 rounded-full transition-all ${
                                  activeTestimonialIdx === i
                                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 w-6 shadow-[0_0_10px_rgba(251,191,36,0.7)]'
                                    : 'w-2 bg-slate-600 hover:bg-sky-400'
                                }`}
                                aria-label={`Show testimonial ${i + 1}`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Right 3 Stats: 98% Student Satisfaction | 12K+ Top Rankers | 4.8/5 Average Rating */}
                        <div className="lg:col-span-6 grid grid-cols-3 gap-4 text-center">
                          <motion.div
                            whileHover={{ y: -6, scale: 1.04 }}
                            className="p-4 rounded-2xl bg-sky-500/10 border border-sky-400/30 hover:border-sky-300 hover:shadow-[0_0_28px_rgba(56,189,248,0.3)] transition-all space-y-2 cursor-default"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                              <Heart className="w-4 h-4" />
                            </div>
                            <div className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums bg-gradient-to-r from-white to-sky-300 bg-clip-text text-transparent">
                              98%
                            </div>
                            <div className="text-[11px] font-medium text-sky-200/90">
                              Student Satisfaction
                            </div>
                          </motion.div>

                          <motion.div
                            whileHover={{ y: -6, scale: 1.04 }}
                            className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 hover:border-amber-300 hover:shadow-[0_0_28px_rgba(251,191,36,0.3)] transition-all space-y-2 cursor-default"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center mx-auto shadow-md">
                              <Award className="w-4 h-4" />
                            </div>
                            <div className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums bg-gradient-to-r from-amber-200 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
                              12K+
                            </div>
                            <div className="text-[11px] font-medium text-amber-200/90">Top Rankers</div>
                          </motion.div>

                          <motion.div
                            whileHover={{ y: -6, scale: 1.04 }}
                            className="p-4 rounded-2xl bg-orange-500/10 border border-orange-400/30 hover:border-orange-300 hover:shadow-[0_0_28px_rgba(249,115,22,0.3)] transition-all space-y-2 cursor-default"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-md">
                              <Star className="w-4 h-4" />
                            </div>
                            <div className="text-xl sm:text-2xl font-extrabold font-mono tabular-nums bg-gradient-to-r from-white via-amber-200 to-orange-300 bg-clip-text text-transparent">
                              4.8/5
                            </div>
                            <div className="text-[11px] font-medium text-orange-200/90">Average Rating</div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.section>

                    {/* SECTION 8B: CONTACT & ACADEMIC COUNSELING FORM */}
                    <ContactInquirySection
                      defaultName={currentUser?.name || 'Venu'}
                      defaultEmail={currentUser?.email || 'venu@gmail.com'}
                    />

                    {/* SECTION 9: FOOTER (Inside Canvas with Newsletter Subscription matching Mockup) */}
                    <footer
                      id="sec-footer"
                      className="relative overflow-hidden bg-gradient-to-b from-[#060F26] via-[#040B1D] to-[#020611] text-slate-300 px-6 sm:px-10 py-12 border-t border-sky-500/25 text-xs"
                    >
                      {/* Top Multi-Color Accent Line */}
                      <div className="pointer-events-none absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-sky-400" />
                      <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl" />
                      <div className="pointer-events-none absolute -top-24 right-10 w-72 h-72 rounded-full bg-amber-400/10 blur-3xl" />

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                        <div className="space-y-3">
                          <div className="text-base font-extrabold font-display flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                              <Atom className="w-5 h-5" />
                            </div>
                            <span className="bg-gradient-to-r from-white via-amber-200 to-sky-300 bg-clip-text text-transparent">
                              KP Physics Academy
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold tracking-wider uppercase text-sky-300/90">
                            Learn · Practice · Excel
                          </p>
                          <div className="pt-1 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => switchView('ADMIN')}
                              className="px-3 py-1.5 rounded-lg bg-amber-400/15 border border-amber-400/40 text-amber-300 hover:bg-amber-400 hover:text-slate-950 font-bold transition-all shadow-2xs"
                            >
                              Faculty / Admin Portal
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <div className="font-extrabold text-white tracking-wide uppercase text-[11px] text-sky-300">
                            Quick Links
                          </div>
                          <ul className="space-y-2">
                            <li>
                              <button
                                type="button"
                                onClick={() => switchView('HOME')}
                                className="hover:text-amber-300 hover:translate-x-1 inline-block transition-all font-medium"
                              >
                                Home
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                onClick={() => switchView('CATALOG')}
                                className="hover:text-sky-300 hover:translate-x-1 inline-block transition-all font-medium"
                              >
                                Courses
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                onClick={() => setPreviewMaterial(STUDY_MATERIALS[0])}
                                className="hover:text-orange-300 hover:translate-x-1 inline-block transition-all font-medium"
                              >
                                Study Materials
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                onClick={() => setActiveTestModal(tests[0])}
                                className="hover:text-amber-300 hover:translate-x-1 inline-block transition-all font-medium"
                              >
                                Tests
                              </button>
                            </li>
                          </ul>
                        </div>

                        <div className="space-y-2.5">
                          <div className="font-extrabold tracking-wide uppercase text-[11px] text-amber-300">
                            Popular Courses
                          </div>
                          <ul className="space-y-2">
                            {popularFiveCourses.map((c) => (
                              <li key={c.id}>
                                <button
                                  type="button"
                                  onClick={() => handleOpenCourse(c)}
                                  className="hover:text-sky-300 hover:translate-x-1 inline-block transition-all font-medium"
                                >
                                  {c.title}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-3">
                          <div className="font-extrabold tracking-wide uppercase text-[11px] text-orange-300">
                            Subscribe to our newsletter
                          </div>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (newsletterEmail.trim()) {
                                setNewsletterSubscribed(true);
                                setNewsletterEmail('');
                              }
                            }}
                            className="flex items-center gap-1.5"
                          >
                            <input
                              type="email"
                              required
                              value={newsletterEmail}
                              onChange={(e) => setNewsletterEmail(e.target.value)}
                              placeholder="Your email address"
                              className="w-full px-3 py-2 bg-slate-900/90 border border-sky-500/30 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.96 }}
                              type="submit"
                              className="px-4 py-2 bg-gradient-to-r from-amber-400 via-orange-500 to-sky-500 hover:from-amber-300 hover:to-sky-400 text-slate-950 text-xs font-extrabold rounded-xl whitespace-nowrap shadow-[0_0_16px_rgba(251,191,36,0.35)] transition-all"
                            >
                              Subscribe
                            </motion.button>
                          </form>
                          {newsletterSubscribed && (
                            <div className="text-[11px] font-semibold text-emerald-400">
                              ✓ Subscribed to weekly Physics formula notes!
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-9 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 relative z-10">
                        <span>© 2025 KP Physics Academy. All rights reserved.</span>
                        <span className="text-sky-300/80">Privacy Policy | Terms &amp; Conditions</span>
                      </div>
                    </footer>
                  </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            title="Scroll to top"
            className="fixed bottom-36 md:bottom-22 right-5 z-40 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating 24/7 AI Physics Doubt-Solver Chatbot */}
      <PhysicsChatbotWidget studentName={currentUser?.name || 'Venu'} />

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 flex items-center justify-around text-[11px] font-medium text-slate-400">
        {[
          { id: 'HOME', label: 'Home', icon: Home, onClick: () => switchView('HOME') },
          { id: 'CATALOG', label: 'Courses', icon: BookOpen, onClick: () => switchView('CATALOG') },
          { id: 'TESTS', label: 'Tests', icon: Zap, onClick: () => setActiveTestModal(tests[0]) },
          { id: 'ANALYTICS', label: 'Results', icon: BarChart3, onClick: () => switchView('ANALYTICS') },
          {
            id: currentUser?.role === 'ADMIN' ? 'ADMIN' : 'DASHBOARD',
            label:
              currentUser?.role === 'ADMIN'
                ? 'Admin'
                : currentUser
                ? `User: ${currentUser.name.split(' ')[0]}`
                : 'Dashboard',
            icon: currentUser?.role === 'ADMIN' ? ShieldCheck : UserIcon,
            onClick: () =>
              switchView(currentUser?.role === 'ADMIN' ? 'ADMIN' : 'DASHBOARD')
          }
        ].map((m) => {
          const IconComp = m.icon;
          const active =
            activeView === m.id ||
            (m.id === 'CATALOG' && activeView === 'COURSE_DETAIL');
          return (
            <button
              key={m.id}
              type="button"
              onClick={m.onClick}
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                active ? 'text-amber-400 font-bold' : 'hover:text-white'
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Modals */}
      {activeTestModal && (
        <TestEngineModal
          test={activeTestModal}
          userId={currentUser?.id || 'usr-student-1'}
          userName={currentUser?.name || 'Venu'}
          onClose={() => setActiveTestModal(null)}
          onSubmitResult={handleRecordTestResult}
        />
      )}

      {showAuthModal && (
        <AuthPortalModal
          initialMode={authModalMode}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setIsRouteTransitioning(true);
            setActiveView(user.role === 'ADMIN' ? 'ADMIN' : 'DASHBOARD');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => setIsRouteTransitioning(false), 420);
          }}
        />
      )}

      {showGlobalSearch && (
        <GlobalSearchModal
          courses={courses}
          tests={tests}
          onClose={() => setShowGlobalSearch(false)}
          onSelectCourse={handleOpenCourse}
          onStartTest={(t) => setActiveTestModal(t)}
          onPreviewMaterial={(m) => setPreviewMaterial(m)}
        />
      )}

      <OfflineIndicator />

      {/* Study Material Formula Inspector Modal */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
          >
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-amber-400">
                  {previewMaterial.category.replace('_', ' ')} · {previewMaterial.pages} PAGES
                </div>
                <h3 className="text-base font-semibold mt-0.5">
                  {previewMaterial.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewMaterial(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                {previewMaterial.summary}
              </p>

              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-900">
                  Key Equations &amp; Analytical Relations Preview
                </div>
                {previewMaterial.previewFormulas.map((f, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1"
                  >
                    <div className="text-xs font-semibold text-slate-900">{f.name}</div>
                    <div className="font-mono text-sm text-blue-700 font-semibold">
                      {f.equation}
                    </div>
                    <div className="text-xs text-slate-500">{f.context}</div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setPreviewMaterial(null)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
