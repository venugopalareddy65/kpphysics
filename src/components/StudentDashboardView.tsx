import React, { useState } from 'react';
import {
  User,
  Course,
  MockTest,
  TestAttemptResult,
  AssignmentItem,
  STUDY_MATERIALS
} from '../data/physicsData';
import {
  LayoutDashboard,
  BookOpen,
  FileCheck,
  FileText,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  Play,
  CheckCircle2,
  Flame,
  Award,
  ArrowRight,
  Sparkles,
  Clock,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { StudentAchievementsSection } from './StudentAchievementsSection';
import { PWAInstallButton } from './PWAInstallButton';
import { FloatingExamCountdownWidget } from './FloatingExamCountdownWidget';

interface StudentDashboardViewProps {
  user: User;
  courses: Course[];
  tests: MockTest[];
  attempts: TestAttemptResult[];
  assignments: AssignmentItem[];
  onOpenCourse: (course: Course) => void;
  onStartTest: (test: MockTest) => void;
  onOpenAnalytics: () => void;
  onSubmitAssignment: (assignmentId: string) => void;
  onLogout: () => void;
  onBackHome: () => void;
}

const sectionScrollVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' as const }
  }
};

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  user,
  courses,
  tests,
  attempts,
  onOpenCourse,
  onStartTest,
  onOpenAnalytics,
  onLogout,
  onBackHome
}) => {
  const [sidebarTab, setSidebarTab] = useState<
    'DASHBOARD' | 'MY_COURSES' | 'TESTS' | 'MATERIALS' | 'PROGRESS'
  >('DASHBOARD');
  const [hoveredSidebarId, setHoveredSidebarId] = useState<string | null>(null);

  const class12Course =
    courses.find((c) => c.id === 'course-class-12') || courses[0];
  const jeeMainCourse =
    courses.find((c) => c.id === 'course-jee-main') || courses[1] || courses[0];
  const neetCourse =
    courses.find((c) => c.id === 'course-neet-physics') || courses[2] || courses[0];

  const recentStudents = [
    { name: 'Venu', email: 'venu@gmail.com', joinDate: 'Apr 17, 2025', status: 'Active' },
    { name: 'Sneha Patil', email: 'sneha@gmail.com', joinDate: 'Apr 16, 2025', status: 'Active' },
    { name: 'Amit Kumar', email: 'amit@gmail.com', joinDate: 'Apr 15, 2025', status: 'Active' },
    { name: 'Pooja Singh', email: 'pooja@gmail.com', joinDate: 'Apr 14, 2025', status: 'Active' },
    { name: 'Suresh Reddy', email: 'suresh@gmail.com', joinDate: 'Apr 13, 2025', status: 'Active' }
  ];

  const progressValue = 68;
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressValue / 100) * circumference;

  const sidebarItems = [
    {
      id: 'DASHBOARD',
      label: 'Dashboard',
      icon: LayoutDashboard,
      activeGradient: 'from-blue-600 to-cyan-500',
      iconColor: 'text-cyan-400'
    },
    {
      id: 'MY_COURSES',
      label: 'My Courses',
      icon: BookOpen,
      activeGradient: 'from-indigo-600 to-blue-500',
      iconColor: 'text-blue-400'
    },
    {
      id: 'TESTS',
      label: 'Tests',
      icon: FileCheck,
      activeGradient: 'from-amber-500 to-orange-500',
      iconColor: 'text-amber-400'
    },
    {
      id: 'MATERIALS',
      label: 'Study Materials',
      icon: FileText,
      activeGradient: 'from-violet-600 to-purple-500',
      iconColor: 'text-violet-400'
    },
    {
      id: 'PROGRESS',
      label: 'Progress',
      icon: TrendingUp,
      activeGradient: 'from-emerald-600 to-teal-500',
      iconColor: 'text-emerald-400'
    }
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-12 bg-[#F4F7FB]">
      {/* Dark Navy Left Sidebar with Animated Hover & Active Pills */}
      <aside className="lg:col-span-3 xl:col-span-2 bg-gradient-to-b from-[#070E24] via-[#0B1536] to-[#081026] text-slate-300 p-5 flex flex-col justify-between border-r border-slate-800/90">
        <div className="space-y-6">
          <div className="px-2.5 py-2 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-mono font-bold text-amber-400 tracking-wider">
              STUDENT PORTAL
            </div>
            <div className="text-sm font-bold text-white mt-0.5 truncate">
              {user.name}
            </div>
            <div className="text-[11px] text-cyan-300 truncate">{user.targetExam}</div>
          </div>

          <nav
            onMouseLeave={() => setHoveredSidebarId(null)}
            className="space-y-1.5"
          >
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = sidebarTab === item.id;
              const isHovered = hoveredSidebarId === item.id;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setHoveredSidebarId(item.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSidebarTab(item.id as any)}
                  className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors z-10 ${
                    isActive
                      ? 'text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="studentSidebarActiveBg"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.activeGradient} -z-10`}
                    />
                  )}
                  {!isActive && isHovered && (
                    <motion.span
                      layoutId="studentSidebarHoverBg"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      className="absolute inset-0 rounded-xl bg-white/10 border border-white/10 -z-10"
                    />
                  )}
                  <IconComponent
                    className={`w-4 h-4 ${isActive ? 'text-white' : item.iconColor}`}
                  />
                  <span>{item.label}</span>
                </motion.button>
              );
            })}

            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onOpenAnalytics}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-rose-500/15 hover:text-rose-300 border border-transparent hover:border-rose-400/30 transition-all"
            >
              <BarChart3 className="w-4 h-4 text-rose-400" />
              <span>Analytics &amp; Weak Areas</span>
            </motion.button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800/90 space-y-1.5">
          <motion.button
            whileHover={{ x: 4 }}
            type="button"
            onClick={onBackHome}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-amber-300 hover:bg-amber-400/10 transition-colors"
          >
            <Settings className="w-4 h-4 text-amber-400" />
            <span>Back to Home</span>
          </motion.button>
          <motion.button
            whileHover={{ x: 4 }}
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:text-white hover:bg-rose-600/80 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </motion.button>
        </div>
      </aside>

      {/* Main Content Area with Scroll-Triggered Motion & Colorful Hover Cards */}
      <div className="lg:col-span-9 xl:col-span-10 p-6 sm:p-8 space-y-8">
        {/* Top Greeting Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-[#061029] via-[#0C1E4A] to-[#0E2963] text-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg border border-blue-900/40 relative overflow-hidden"
        >
          <div className="space-y-1 relative z-10">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ACTIVE LEARNING SESSION · {user.classLevel.toUpperCase()}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Good Morning, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Keep going! You’re on a <span className="text-amber-400 font-semibold">{user.streakDays}-day Physics streak</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <PWAInstallButton compact />
            <motion.button
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={onOpenAnalytics}
              className="px-4 py-2.5 text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl backdrop-blur-xs transition-all inline-flex items-center gap-1.5"
            >
              <BarChart3 className="w-4 h-4 text-cyan-300" />
              <span>View Test Analytics</span>
            </motion.button>
            <motion.button
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => onStartTest(tests[0])}
              className="px-5 py-2.5 text-xs font-bold bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-slate-950 rounded-xl shadow-md hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-all inline-flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4" />
              <span>Take Chapter Test</span>
            </motion.button>
          </div>
        </motion.div>

        {/* 4 Colorful KPI Metric Cards with Hover Elevation */}
        <motion.div
          variants={sectionScrollVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Card 1: Overall Progress Ring */}
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-5 flex items-center gap-4 shadow-2xs hover:shadow-xl transition-all overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-400" />
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke="#E2E8F0"
                  strokeWidth="6"
                  fill="none"
                />
                <motion.circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke="#2563EB"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  whileInView={{ strokeDashoffset }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute text-xs font-bold font-mono tabular-nums text-blue-700">
                68%
              </span>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Overall Progress</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 group-hover:text-blue-600 transition-colors mt-0.5">
                68%
              </div>
              <div className="text-[11px] text-blue-600 font-medium">
                On track for Boards
              </div>
            </div>
          </motion.div>

          {/* Card 2: Learning Streak */}
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-5 flex items-center justify-between shadow-2xs hover:shadow-xl transition-all overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 to-orange-500" />
            <div>
              <div className="text-xs font-medium text-slate-500">Learning Streak</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 group-hover:text-amber-600 transition-colors mt-1">
                {user.streakDays || 12} days
              </div>
              <div className="text-[11px] text-amber-600 font-medium mt-0.5">
                Active daily consistency
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
          </motion.div>

          {/* Card 3: Tests Completed */}
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative bg-white border border-slate-200 hover:border-violet-400 rounded-2xl p-5 flex items-center justify-between shadow-2xs hover:shadow-xl transition-all overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-violet-500 to-indigo-600" />
            <div>
              <div className="text-xs font-medium text-slate-500">Tests Completed</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 group-hover:text-violet-600 transition-colors mt-1">
                {Math.max(8, attempts.length)}
              </div>
              <div className="text-[11px] text-violet-600 font-medium mt-0.5">
                Chapter &amp; Mock Exams
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-200 text-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileCheck className="w-6 h-6" />
            </div>
          </motion.div>

          {/* Card 4: Average Score */}
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative bg-white border border-slate-200 hover:border-emerald-400 rounded-2xl p-5 flex items-center justify-between shadow-2xs hover:shadow-xl transition-all overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div>
              <div className="text-xs font-medium text-slate-500">Average Score</div>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 group-hover:text-emerald-600 transition-colors mt-1">
                82%
              </div>
              <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
                Top 10% batch accuracy
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform">
              <Award className="w-6 h-6" />
            </div>
          </motion.div>
        </motion.div>

        {/* Student Achievements & Metallic-Gradient Badges Module */}
        <StudentAchievementsSection
          user={user}
          courses={courses}
          attempts={attempts}
        />

        {/* Continue Learning Banner with Animated Progress & Hover Lift */}
        <motion.div
          variants={sectionScrollVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-3"
        >
          <h2 className="text-base font-bold text-slate-900">Continue Learning</h2>
          <motion.div
            whileHover={{ y: -4 }}
            className="group bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-28 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-900 relative">
                <img
                  src={class12Course.thumbnail}
                  alt="Class 12 Physics"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                    <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-50 text-blue-600 border border-blue-200">
                  IN PROGRESS · CHAPTER 3
                </span>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Class 12 Physics — Current Electricity
                </h3>
                <div className="w-48 sm:w-72 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '38%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                  />
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  3/8 lessons completed · Next: Drift Velocity &amp; Mobility
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.04, x: 2 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => onOpenCourse(class12Course)}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all whitespace-nowrap self-start sm:self-center inline-flex items-center gap-1.5"
            >
              <span>Resume Lesson</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Your Courses (3 Colorful Interactive Cards) */}
        <motion.div
          variants={sectionScrollVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Your Enrolled Courses</h2>
            <button
              type="button"
              onClick={() => onOpenCourse(class12Course)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                course: class12Course,
                title: 'Class 12 Physics',
                pct: 68,
                sub: '11/16 chapters completed',
                barColor: 'from-blue-600 to-cyan-500',
                badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
                hoverBorder: 'hover:border-blue-400'
              },
              {
                course: jeeMainCourse,
                title: 'JEE Main Physics',
                pct: 42,
                sub: '6/14 chapters completed',
                barColor: 'from-amber-400 to-orange-500',
                badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
                hoverBorder: 'hover:border-amber-400'
              },
              {
                course: neetCourse,
                title: 'NEET Physics',
                pct: 35,
                sub: '5/12 chapters completed',
                barColor: 'from-emerald-500 to-teal-500',
                badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                hoverBorder: 'hover:border-emerald-400'
              }
            ].map((item) => (
              <motion.button
                key={item.title}
                type="button"
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenCourse(item.course)}
                className={`group relative text-left bg-white border border-slate-200 ${item.hoverBorder} rounded-2xl p-5 shadow-2xs hover:shadow-xl transition-all space-y-3 overflow-hidden`}
              >
                <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${item.barColor}`} />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold border ${item.badgeBg}`}
                  >
                    {item.pct}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className={`h-full bg-gradient-to-r ${item.barColor} rounded-full`}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>{item.sub}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Study Materials Quick Shelf when MATERIALS tab is clicked */}
        {sidebarTab === 'MATERIALS' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-violet-200 rounded-2xl p-5 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Chapter-Wise Formula Sheets &amp; Study Notes
              </h2>
              <span className="text-xs font-mono text-violet-600 font-bold">
                {STUDY_MATERIALS.length} PDF Compendiums
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STUDY_MATERIALS.map((mat) => (
                <motion.div
                  key={mat.id}
                  whileHover={{ y: -4 }}
                  className="p-4 rounded-xl border border-slate-200 hover:border-violet-400 bg-slate-50/70 space-y-2 transition-all"
                >
                  <div className="text-[10px] font-mono font-bold text-violet-600">
                    {mat.category} · {mat.pages} PAGES
                  </div>
                  <div className="text-xs font-bold text-slate-900">{mat.title}</div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{mat.summary}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bottom Split: Upcoming Tests & Recent Activity */}
        <motion.div
          variants={sectionScrollVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Upcoming Tests</h2>
              <button
                type="button"
                onClick={() => onStartTest(tests[0])}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: 'Electrostatics & Gauss Law Test',
                  date: 'Apr 20, 2025 · 10:00 AM',
                  badge: '20 MCQs · 30 Min',
                  testObj: tests[1] || tests[0]
                },
                {
                  title: 'Full Syllabus JEE Main Mock Test',
                  date: 'Apr 25, 2025 · 09:00 AM',
                  badge: '90 Marks · Timed',
                  testObj: tests[2] || tests[0]
                }
              ].map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={{ x: 4 }}
                  className="p-4 bg-slate-50/80 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl flex items-center justify-between gap-3 transition-all"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900">{item.title}</div>
                    <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
                      <Clock className="w-3 h-3 text-amber-500" />
                      <span>{item.date}</span>
                      <span>·</span>
                      <span className="text-blue-600 font-semibold">{item.badge}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => onStartTest(item.testObj)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-2xs"
                  >
                    Start
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
            <div className="space-y-3 text-xs">
              {[
                {
                  title: '✓ Completed Video: Coulomb’s Law & Vector Form',
                  time: '2 hours ago',
                  tag: 'Done',
                  tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
                },
                {
                  title: '★ Scored 85% in Chapter Test 3 (Moving Charges)',
                  time: '3 hours ago',
                  tag: '85%',
                  tagColor: 'bg-blue-50 text-blue-700 border-blue-200'
                },
                {
                  title: '● Enrolled in JEE Main & Advanced Physics',
                  time: '1 day ago',
                  tag: 'Active',
                  tagColor: 'bg-amber-50 text-amber-700 border-amber-200'
                }
              ].map((act) => (
                <motion.div
                  key={act.title}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/70 transition-all"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{act.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{act.time}</div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold border ${act.tagColor}`}
                  >
                    {act.tag}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Students & Content Overview Strip */}
        <motion.div
          variants={sectionScrollVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900">
              Batch Leaderboard &amp; Recent Students
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-2.5 pr-3">Name</th>
                    <th className="py-2.5 px-3">Email</th>
                    <th className="py-2.5 px-3">Join Date</th>
                    <th className="py-2.5 pl-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentStudents.map((stu) => (
                    <tr
                      key={stu.email}
                      className="hover:bg-blue-50/40 transition-colors"
                    >
                      <td className="py-2.5 pr-3 font-semibold text-slate-900">
                        {stu.name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">{stu.email}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        {stu.joinDate}
                      </td>
                      <td className="py-2.5 pl-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          {stu.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-2xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">Content Overview</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Academy-wide published curriculum inventory
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Courses', val: '12', color: 'hover:border-blue-400 hover:bg-blue-50/50' },
                { label: 'Chapters', val: '84', color: 'hover:border-cyan-400 hover:bg-cyan-50/50' },
                { label: 'Lessons', val: '342', color: 'hover:border-violet-400 hover:bg-violet-50/50' },
                { label: 'Tests', val: '48', color: 'hover:border-amber-400 hover:bg-amber-50/50' },
                { label: 'Questions', val: '2,480', color: 'hover:border-emerald-400 hover:bg-emerald-50/50' },
                { label: 'Simulations', val: '18', color: 'hover:border-rose-400 hover:bg-rose-50/50' }
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -4, scale: 1.03 }}
                  className={`p-3.5 bg-slate-50 border border-slate-200 ${stat.color} rounded-xl text-center transition-all cursor-default`}
                >
                  <div className="text-xs text-slate-500">{stat.label}</div>
                  <div className="text-lg font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                    {stat.val}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Persistent Exam Countdown Timer with Progress-Ring Proximity Indicator */}
      <FloatingExamCountdownWidget tests={tests} onStartTest={onStartTest} />
    </div>
  );
};
