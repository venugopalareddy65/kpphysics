import React, { useState } from 'react';
import { Course } from '../data/physicsData';
import {
  Search,
  ArrowRight,
  BookOpen,
  Atom,
  Zap,
  Compass,
  Award,
  Sparkles,
  GraduationCap,
  Layers,
  CheckCircle2,
  Play,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CourseCatalogViewProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onBackHome: () => void;
}

export const CourseCatalogView: React.FC<CourseCatalogViewProps> = ({
  courses,
  onSelectCourse,
  onBackHome
}) => {
  const [sidebarCategory, setSidebarCategory] = useState<string>('ALL');
  const [boardFilter, setBoardFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const sidebarItems = [
    { id: 'ALL', label: 'All Courses', icon: Layers, accent: 'from-blue-600 to-indigo-600' },
    { id: 'CLASS_10', label: 'Class 10 Foundation', icon: Compass, accent: 'from-cyan-500 to-blue-600' },
    { id: 'CLASS_11', label: 'Class 11 Mechanics', icon: Atom, accent: 'from-indigo-500 to-violet-600' },
    { id: 'CLASS_12', label: 'Class 12 Electrodynamics', icon: Zap, accent: 'from-amber-500 to-orange-600' },
    { id: 'JEE', label: 'JEE Main Mastery', icon: Sparkles, accent: 'from-blue-600 to-cyan-500' },
    { id: 'COMPETITIVE', label: 'JEE Advanced & Olympiad', icon: Award, accent: 'from-violet-600 to-purple-600' },
    { id: 'NEET', label: 'NEET Speed Physics', icon: GraduationCap, accent: 'from-emerald-500 to-teal-600' }
  ];

  const boardTabs = [
    { id: 'ALL', label: 'All Curricula' },
    { id: 'CBSE', label: 'CBSE Board' },
    { id: 'ICSE', label: 'ICSE Board' },
    { id: 'JEE', label: 'JEE Main/Adv' },
    { id: 'NEET', label: 'NEET UG' }
  ];

  const getCourseTheme = (category: Course['category']) => {
    switch (category) {
      case 'CLASS_10':
        return {
          gradient: 'from-cyan-500 to-blue-600',
          borderHover: 'hover:border-cyan-400',
          textAccent: 'text-cyan-600',
          btnBg: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500'
        };
      case 'CLASS_11':
        return {
          gradient: 'from-indigo-500 to-violet-600',
          borderHover: 'hover:border-indigo-400',
          textAccent: 'text-indigo-600',
          btnBg: 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500'
        };
      case 'CLASS_12':
        return {
          gradient: 'from-amber-500 to-orange-600',
          borderHover: 'hover:border-amber-400',
          textAccent: 'text-amber-600',
          btnBg: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500'
        };
      case 'JEE':
        return {
          gradient: 'from-blue-600 to-indigo-700',
          borderHover: 'hover:border-blue-400',
          textAccent: 'text-blue-600',
          btnBg: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'
        };
      case 'NEET':
        return {
          gradient: 'from-emerald-500 to-teal-600',
          borderHover: 'hover:border-emerald-400',
          textAccent: 'text-emerald-600',
          btnBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
        };
      default:
        return {
          gradient: 'from-violet-600 to-fuchsia-600',
          borderHover: 'hover:border-violet-400',
          textAccent: 'text-violet-600',
          btnBg: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500'
        };
    }
  };

  const filtered = courses.filter((c) => {
    const matchSidebar = sidebarCategory === 'ALL' || c.category === sidebarCategory;
    const matchBoard =
      boardFilter === 'ALL' ||
      c.boardTags.some((tag) => tag.toLowerCase().includes(boardFilter.toLowerCase()));
    const matchSearch =
      !searchQuery.trim() ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.topicDomain.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSidebar && matchBoard && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-2">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Homepage
          </button>
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Physics Course Catalog
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Choose your class, board, and competitive exam track. Every course includes HD derivation lectures, interactive simulations, and chapterwise CBT tests.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses, topics, chapters..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </motion.div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Interactive Category Sidebar (3 cols) */}
        <aside className="lg:col-span-3 space-y-2">
          <div className="text-xs font-semibold text-slate-400 px-3 pb-1">
            SELECT CLASS / EXAM LEVEL
          </div>
          {sidebarItems.map((item) => {
            const active = sidebarCategory === item.id;
            const IconComp = item.icon;
            return (
              <motion.button
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                key={item.id}
                type="button"
                onClick={() => setSidebarCategory(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                  active
                    ? `bg-gradient-to-r ${item.accent} text-white shadow-md`
                    : 'bg-white border border-slate-200/80 text-slate-700 hover:border-blue-300 hover:bg-blue-50/40'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <IconComp className={`w-4 h-4 ${active ? 'text-white' : 'text-blue-600'}`} />
                  <span>{item.label}</span>
                </span>
                <ArrowRight className={`w-3.5 h-3.5 ${active ? 'opacity-100' : 'opacity-40'}`} />
              </motion.button>
            );
          })}
        </aside>

        {/* Right Course Cards Area (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Board Segmented Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200">
            <div className="flex flex-wrap items-center gap-1.5">
              {boardTabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setBoardFilter(t.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    boardFilter === t.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="text-xs font-mono text-slate-500 pr-2">
              Showing <strong className="text-slate-900">{filtered.length}</strong> courses
            </div>
          </div>

          {/* Animated Course Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((course, idx) => {
                const parts = course.topicDomain.split('·').map((s) => s.trim());
                const levelLabel = parts[0] || 'Advanced';
                const metaDetail = parts.slice(1).join(' · ') || `${course.totalHours} Hrs`;
                const theme = getCourseTheme(course.category);

                return (
                  <motion.div
                    layout
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    whileHover={{ y: -6 }}
                    className={`bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between transition-all shadow-xs hover:shadow-xl ${theme.borderHover}`}
                  >
                    <div>
                      {/* Top Color Accent Strip */}
                      <div className={`h-1.5 w-full bg-gradient-to-r ${theme.gradient}`} />

                      <div className="h-44 bg-slate-900 overflow-hidden relative group">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-4">
                          <span className="text-xs font-mono text-amber-300 font-semibold">
                            {course.boardTags.join(' · ')}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-2.5">
                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                        <div className="text-xs text-slate-500 font-mono tabular-nums pt-1 flex items-center gap-1.5">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${theme.textAccent}`} />
                          <span>{metaDetail}</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">
                        Track: <strong className={theme.textAccent}>{levelLabel}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectCourse(course)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 ${theme.btnBg} text-white text-xs font-semibold rounded-xl transition-all shadow-xs whitespace-nowrap`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        Explore
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
