import React, { useState, useEffect } from 'react';
import {
  Course,
  Chapter,
  Lesson,
  MockTest,
  TestAttemptResult,
  LessonType
} from '../data/physicsData';
import {
  Plus,
  Trash2,
  Edit3,
  ArrowLeft,
  LayoutDashboard,
  BookOpen,
  FileCheck,
  Users,
  MessageSquare,
  TrendingUp,
  Award,
  Sparkles,
  Search,
  Download,
  CheckCircle2,
  Zap,
  Atom,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import mechanicsImage from '../assets/images/course_mechanics_rotational_1791088103626.jpg';

interface AdminPortalViewProps {
  courses: Course[];
  tests: MockTest[];
  attempts: TestAttemptResult[];
  onSaveCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onSaveTest: (test: MockTest) => void;
  onDeleteTest: (testId: string) => void;
  onBackHome: () => void;
}

interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  targetExam: string;
  inquiryType: string;
  message: string;
  createdAt: string;
  status: string;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  courses,
  tests,
  attempts,
  onSaveCourse,
  onDeleteCourse,
  onSaveTest,
  onDeleteTest,
  onBackHome
}) => {
  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'COURSES' | 'TESTS' | 'RESULTS' | 'INQUIRIES'
  >('OVERVIEW');
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [courseSearch, setCourseSearch] = useState('');

  // Course Create / Edit State
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState<Course['category']>('JEE');
  const [courseDomain, setCourseDomain] = useState('Mechanics');
  const [courseHours, setCourseHours] = useState(40);
  const [courseDesc, setCourseDesc] = useState('');

  // Lesson addition inside a course
  const [selectedCourseForLesson, setSelectedCourseForLesson] = useState<string>(
    courses[0]?.id || ''
  );
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonFormula, setNewLessonFormula] = useState('');
  const [newLessonType, setNewLessonType] = useState<LessonType>('VIDEO');

  // Question addition inside a test
  const [selectedTestId, setSelectedTestId] = useState<string>(tests[0]?.id || '');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptionA, setNewOptionA] = useState('');
  const [newOptionB, setNewOptionB] = useState('');
  const [newOptionC, setNewOptionC] = useState('');
  const [newOptionD, setNewOptionD] = useState('');
  const [newCorrectIndex, setNewCorrectIndex] = useState<'a' | 'b' | 'c' | 'd'>('a');
  const [newExplanation, setNewExplanation] = useState('');

  // Contact Inquiries State
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([
    {
      id: 'INQ-849201',
      name: 'Venu',
      email: 'venu@gmail.com',
      phone: '+91 98765 43210',
      targetExam: 'JEE Main & Advanced',
      inquiryType: 'Course & Batch Counseling',
      message: 'Looking for JEE Advanced Rotational Mechanics & Electrodynamics test series schedule.',
      createdAt: 'Today · 10:15 AM',
      status: 'RECEIVED'
    }
  ]);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3500);
  };

  useEffect(() => {
    fetch('/api/contact')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.inquiries) && data.inquiries.length > 0) {
          setInquiries(data.inquiries);
        }
      })
      .catch(() => {
        // fallback to default seeded inquiry
      });
  }, [activeTab]);

  const startNewCourse = () => {
    setActiveTab('COURSES');
    setEditingCourse({
      id: `course-${Date.now()}`,
      title: '',
      slug: '',
      category: 'JEE',
      boardTags: ['JEE Main', 'CBSE Class 12'],
      topicDomain: 'Mechanics',
      description: '',
      instructor: 'Prof. K. P. Vishwanath (IIT Madras Alumnus)',
      totalHours: 36,
      thumbnail: mechanicsImage,
      chapters: [
        {
          id: `chap-${Date.now()}`,
          courseId: `course-${Date.now()}`,
          position: 1,
          title: '01. Core Principles & Vector Foundations',
          description: 'Fundamental derivations and problem-solving methodology.',
          lessons: []
        }
      ]
    });
    setCourseTitle('');
    setCourseCategory('JEE');
    setCourseDomain('Mechanics');
    setCourseHours(36);
    setCourseDesc('');
  };

  const startEditCourse = (c: Course) => {
    setActiveTab('COURSES');
    setEditingCourse(c);
    setCourseTitle(c.title);
    setCourseCategory(c.category);
    setCourseDomain(c.topicDomain);
    setCourseHours(c.totalHours);
    setCourseDesc(c.description);
  };

  const handleConfirmCourseSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !courseTitle.trim()) return;
    const updated: Course = {
      ...editingCourse,
      title: courseTitle.trim(),
      slug: courseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: courseCategory,
      topicDomain: courseDomain,
      totalHours: Number(courseHours) || 30,
      description:
        courseDesc.trim() ||
        'Structured Physics course with video lectures, notes, and chapter tests.'
    };
    onSaveCourse(updated);
    setEditingCourse(null);
    showToast(`Course "${updated.title}" saved to curriculum!`);
  };

  const handleAddLessonToCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim()) return;
    const targetCourse = courses.find((c) => c.id === selectedCourseForLesson);
    if (!targetCourse) return;

    const firstChapter: Chapter = targetCourse.chapters[0] || {
      id: `chap-${Date.now()}`,
      courseId: targetCourse.id,
      position: 1,
      title: '01. Core Concepts',
      description: 'Chapter modules',
      lessons: []
    };

    const newLesson: Lesson = {
      id: `les-${Date.now()}`,
      chapterId: firstChapter.id,
      title: newLessonTitle.trim(),
      type: newLessonType,
      durationMinutes: 35,
      formulaSummary: newLessonFormula.trim() || 'F = dp / dt',
      keyTakeaways: [
        'Rigorous derivation and conservation laws applied to exam problems.',
        'Dimensional verification and limiting case checks.'
      ]
    };

    const updatedChapters =
      targetCourse.chapters.length > 0
        ? targetCourse.chapters.map((ch, idx) =>
            idx === 0 ? { ...ch, lessons: [...ch.lessons, newLesson] } : ch
          )
        : [{ ...firstChapter, lessons: [newLesson] }];

    onSaveCourse({
      ...targetCourse,
      chapters: updatedChapters
    });
    setNewLessonTitle('');
    setNewLessonFormula('');
    showToast(`Added lesson "${newLesson.title}" to ${targetCourse.title}!`);
  };

  const handleDeleteLesson = (
    courseId: string,
    chapterId: string,
    lessonId: string
  ) => {
    const targetCourse = courses.find((c) => c.id === courseId);
    if (!targetCourse) return;
    const updatedChapters = targetCourse.chapters.map((ch) =>
      ch.id === chapterId
        ? { ...ch, lessons: ch.lessons.filter((l) => l.id !== lessonId) }
        : ch
    );
    onSaveCourse({ ...targetCourse, chapters: updatedChapters });
    showToast('Lesson removed from course.');
  };

  const handleAddQuestionToTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !newOptionA.trim() || !newOptionB.trim()) return;
    const targetTest = tests.find((t) => t.id === selectedTestId);
    if (!targetTest) return;

    const qId = `q-${Date.now()}`;
    const newQ = {
      id: qId,
      questionText: newQuestionText.trim(),
      options: [
        { id: `${qId}-a`, text: newOptionA.trim() },
        { id: `${qId}-b`, text: newOptionB.trim() },
        { id: `${qId}-c`, text: newOptionC.trim() || 'None of the above' },
        { id: `${qId}-d`, text: newOptionD.trim() || 'Cannot be determined' }
      ],
      correctOptionId: `${qId}-${newCorrectIndex}`,
      explanation:
        newExplanation.trim() ||
        'Evaluated directly using conservation principles and standard SI substitutions.',
      marks: 4,
      negativeMarks: 1
    };

    onSaveTest({
      ...targetTest,
      totalMarks: targetTest.totalMarks + 4,
      questions: [...targetTest.questions, newQ]
    });

    setNewQuestionText('');
    setNewOptionA('');
    setNewOptionB('');
    setNewOptionC('');
    setNewOptionD('');
    setNewExplanation('');
    showToast(`Added MCQ question to "${targetTest.title}"!`);
  };

  const exportResultsCSV = () => {
    const rows = [
      ['Attempt ID', 'Student Name', 'Exam Title', 'Date', 'Score', 'Total Marks', 'Accuracy %'],
      ...attempts.map((a) => [
        a.id,
        a.userName,
        `"${a.testTitle}"`,
        a.submittedAt,
        String(a.score),
        String(a.totalMarks),
        `${a.percentage}%`
      ])
    ]
      .map((r) => r.join(','))
      .join('\n');

    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'KP-Physics-Admin-Student-Results.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalLessonsCount = courses.reduce(
    (sum, c) => sum + c.chapters.reduce((cs, ch) => cs + ch.lessons.length, 0),
    0
  );
  const totalQuestionsCount = tests.reduce(
    (sum, t) => sum + t.questions.length,
    0
  );

  const sidebarNavItems = [
    {
      id: 'OVERVIEW',
      label: 'Command Overview',
      icon: LayoutDashboard,
      grad: 'from-blue-600 to-cyan-500',
      iconColor: 'text-cyan-400'
    },
    {
      id: 'COURSES',
      label: `Courses & Lessons (${courses.length})`,
      icon: BookOpen,
      grad: 'from-amber-500 to-orange-500',
      iconColor: 'text-amber-400'
    },
    {
      id: 'TESTS',
      label: `Tests & MCQ Bank (${tests.length})`,
      icon: FileCheck,
      grad: 'from-violet-600 to-indigo-600',
      iconColor: 'text-violet-400'
    },
    {
      id: 'RESULTS',
      label: `Student Results (${attempts.length})`,
      icon: TrendingUp,
      grad: 'from-emerald-600 to-teal-500',
      iconColor: 'text-emerald-400'
    },
    {
      id: 'INQUIRIES',
      label: `Counseling Inbox (${inquiries.length})`,
      icon: MessageSquare,
      grad: 'from-rose-500 to-pink-600',
      iconColor: 'text-rose-400'
    }
  ];

  const filteredCourses = courses.filter(
    (c) =>
      !courseSearch.trim() ||
      c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.topicDomain.toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-12 bg-[#F4F7FB]">
      {/* Left Dark Navy Faculty Command Sidebar */}
      <aside className="lg:col-span-3 xl:col-span-2 bg-gradient-to-b from-[#050C20] via-[#0B1536] to-[#081026] text-slate-300 p-5 flex flex-col justify-between border-r border-slate-800">
        <div className="space-y-6">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-cyan-500/10 to-indigo-500/15 border border-amber-400/30">
            <div className="flex items-center gap-2">
              <Atom className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '9s' }} />
              <span className="text-[10px] font-mono font-bold text-amber-300 tracking-wider uppercase">
                ADMIN &amp; FACULTY CMS
              </span>
            </div>
            <div className="text-sm font-bold text-white mt-1 truncate">
              Prof. K. P. Vishwanath
            </div>
            <div className="text-[11px] text-cyan-300 truncate">
              Curriculum &amp; Exam Director
            </div>
          </div>

          <nav
            onMouseLeave={() => setHoveredNav(null)}
            className="space-y-1.5"
          >
            {sidebarNavItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              const isHovered = hoveredNav === item.id;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setHoveredNav(item.id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors z-10 ${
                    isActive
                      ? 'text-white font-bold shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="adminSidebarActivePill"
                      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                      className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.grad} -z-10`}
                    />
                  )}
                  {!isActive && isHovered && (
                    <motion.span
                      layoutId="adminSidebarHoverPill"
                      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                      className="absolute inset-0 rounded-xl bg-white/10 border border-white/10 -z-10"
                    />
                  )}
                  <IconComp
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : item.iconColor
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800/90 space-y-2">
          <motion.button
            whileHover={{ x: 4 }}
            type="button"
            onClick={onBackHome}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/25 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Academy Home</span>
          </motion.button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:col-span-9 xl:col-span-10 p-6 sm:p-8 space-y-8">
        {/* Top Hero Command Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#061029] via-[#0B1E4B] to-[#1D1B54] text-white rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg border border-indigo-900/50 relative overflow-hidden"
        >
          <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none" />
          <div className="space-y-1 relative z-10">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-300 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>REAL-TIME CURRICULUM &amp; EXAMINATION STUDIO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Admin Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Manage Class 10–12, JEE &amp; NEET courses, publish MCQ exams, and track student performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <motion.button
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={startNewCourse}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-slate-950 text-xs font-bold shadow-md hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create New Course</span>
            </motion.button>
            <motion.button
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => setActiveTab('TESTS')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5"
            >
              <FileCheck className="w-4 h-4 text-cyan-300" />
              <span>+ Add MCQ Question</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Animated Action Toast */}
        <AnimatePresence>
          {toastNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-between shadow-md"
            >
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {toastNotice}
              </span>
              <span className="font-mono text-[10px] uppercase">Synced</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4 Vibrant KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Enrolled Students',
              value: '1,248',
              delta: '+14.2% this month',
              icon: Users,
              topBar: 'from-blue-600 to-cyan-400',
              iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
              hoverBorder: 'hover:border-blue-400'
            },
            {
              label: 'Published Courses',
              value: String(courses.length),
              delta: `${totalLessonsCount} active lessons`,
              icon: BookOpen,
              topBar: 'from-amber-400 to-orange-500',
              iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
              hoverBorder: 'hover:border-amber-400'
            },
            {
              label: 'Mock Exams & Tests',
              value: String(tests.length),
              delta: `${totalQuestionsCount} Physics MCQs`,
              icon: FileCheck,
              topBar: 'from-violet-600 to-fuchsia-500',
              iconBg: 'bg-violet-50 text-violet-600 border-violet-200',
              hoverBorder: 'hover:border-violet-400'
            },
            {
              label: 'Batch Avg Accuracy',
              value: '84.6%',
              delta: 'Top 5% JEE/NEET benchmark',
              icon: Award,
              topBar: 'from-emerald-500 to-teal-500',
              iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
              hoverBorder: 'hover:border-emerald-400'
            }
          ].map((kpi) => {
            const IconComp = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`relative bg-white border border-slate-200 ${kpi.hoverBorder} rounded-2xl p-5 flex items-center justify-between shadow-2xs hover:shadow-xl transition-all overflow-hidden`}
              >
                <div
                  className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${kpi.topBar}`}
                />
                <div>
                  <div className="text-xs font-medium text-slate-500">
                    {kpi.label}
                  </div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                    {kpi.value}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">
                    {kpi.delta}
                  </div>
                </div>
                <div
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${kpi.iconBg}`}
                >
                  <IconComp className="w-6 h-6" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* TAB 1: COMMAND OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* Enrollment Growth Chart + Course Enrollment Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Animated Monthly Enrollment Bar Chart */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Student Enrollment Growth (2025–2026)
                    </h2>
                    <p className="text-xs text-slate-500">
                      Monthly active Physics scholars across Class 10–12, JEE &amp; NEET batches
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[11px] font-bold">
                    +28% YoY
                  </span>
                </div>

                <div className="h-48 flex items-end justify-between gap-2 sm:gap-3 pt-6 px-2 border-b border-slate-100">
                  {[
                    { month: 'Jan', val: 45, students: 520 },
                    { month: 'Feb', val: 54, students: 610 },
                    { month: 'Mar', val: 62, students: 740 },
                    { month: 'Apr', val: 75, students: 890 },
                    { month: 'May', val: 82, students: 980 },
                    { month: 'Jun', val: 90, students: 1120 },
                    { month: 'Jul', val: 96, students: 1248 }
                  ].map((bar, idx) => (
                    <div
                      key={bar.month}
                      className="flex-1 flex flex-col items-center gap-2 group"
                    >
                      <span className="text-[10px] font-mono font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
                        {bar.students}
                      </span>
                      <div className="w-full bg-slate-100 rounded-t-xl h-32 flex items-end overflow-hidden">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${bar.val}%` }}
                          transition={{
                            duration: 0.7,
                            delay: idx * 0.06,
                            ease: 'easeOut'
                          }}
                          className="w-full bg-gradient-to-t from-blue-600 via-indigo-500 to-cyan-400 group-hover:from-amber-500 group-hover:to-orange-400 rounded-t-xl transition-colors"
                        />
                      </div>
                      <span className="text-[11px] font-mono text-slate-600 font-semibold">
                        {bar.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Distribution Breakdown */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Enrollment by Exam Track
                  </h2>
                  <p className="text-xs text-slate-500">
                    Distribution of active students by curriculum
                  </p>
                </div>

                <div className="space-y-3.5 pt-1">
                  {[
                    {
                      track: 'JEE Main & Advanced Physics',
                      pct: 42,
                      count: '524 students',
                      grad: 'from-blue-600 to-cyan-400'
                    },
                    {
                      track: 'CBSE Class 12 Board Physics',
                      pct: 28,
                      count: '349 students',
                      grad: 'from-amber-400 to-orange-500'
                    },
                    {
                      track: 'NEET UG Speed Physics',
                      pct: 19,
                      count: '237 students',
                      grad: 'from-emerald-500 to-teal-500'
                    },
                    {
                      track: 'Class 10 & 11 Foundation',
                      pct: 11,
                      count: '138 students',
                      grad: 'from-violet-600 to-fuchsia-500'
                    }
                  ].map((item) => (
                    <div key={item.track} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">
                          {item.track}
                        </span>
                        <span className="font-mono text-slate-500">
                          {item.count} ({item.pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.pct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full bg-gradient-to-r ${item.grad} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Students Directory & Quick Course Manager */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900">
                    Active Scholars Directory
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('RESULTS')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    View Test Submissions →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                        <th className="py-2.5 pr-3">Student</th>
                        <th className="py-2.5 px-3">Track</th>
                        <th className="py-2.5 px-3">Streak</th>
                        <th className="py-2.5 pl-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        {
                          name: 'Venu',
                          email: 'venu@gmail.com',
                          track: 'Class 12 & JEE Main',
                          streak: '12 days'
                        },
                        {
                          name: 'Sneha Patil',
                          email: 'sneha@gmail.com',
                          track: 'JEE Advanced',
                          streak: '19 days'
                        },
                        {
                          name: 'Amit Kumar',
                          email: 'amit@gmail.com',
                          track: 'NEET UG Physics',
                          streak: '9 days'
                        },
                        {
                          name: 'Pooja Singh',
                          email: 'pooja@gmail.com',
                          track: 'CBSE Class 12',
                          streak: '15 days'
                        },
                        {
                          name: 'Suresh Reddy',
                          email: 'suresh@gmail.com',
                          track: 'Class 11 Mechanics',
                          streak: '7 days'
                        }
                      ].map((stu) => (
                        <tr
                          key={stu.email}
                          className="hover:bg-blue-50/40 transition-colors"
                        >
                          <td className="py-2.5 pr-3">
                            <div className="font-bold text-slate-900">{stu.name}</div>
                            <div className="text-[11px] text-slate-500">{stu.email}</div>
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-700">
                            {stu.track}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-amber-600">
                            🔥 {stu.streak}
                          </td>
                          <td className="py-2.5 pl-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs">
                <h2 className="text-base font-bold text-slate-900">
                  Quick Faculty Actions
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    {
                      title: 'Launch Course & Lesson Editor',
                      desc: 'Create new courses or append video lectures & simulations',
                      btn: 'Open Courses Studio',
                      color: 'from-blue-600 to-indigo-600',
                      action: () => setActiveTab('COURSES')
                    },
                    {
                      title: 'Manage Timed Mock Tests',
                      desc: 'Add JEE/NEET MCQs with step-by-step derivations',
                      btn: 'Open Exam Bank',
                      color: 'from-amber-500 to-orange-500',
                      action: () => setActiveTab('TESTS')
                    },
                    {
                      title: 'Review Student Counseling Inbox',
                      desc: 'Respond to student batch & doubt inquiries',
                      btn: `Open Inbox (${inquiries.length})`,
                      color: 'from-emerald-600 to-teal-600',
                      action: () => setActiveTab('INQUIRIES')
                    }
                  ].map((card) => (
                    <motion.div
                      key={card.title}
                      whileHover={{ x: 4 }}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {card.title}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {card.desc}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={card.action}
                        className={`px-3.5 py-2 rounded-xl bg-gradient-to-r ${card.color} text-white text-xs font-bold whitespace-nowrap shadow-xs`}
                      >
                        {card.btn}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COURSES & LESSONS STUDIO */}
        {activeTab === 'COURSES' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    placeholder="Filter courses by title or Physics topic..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={startNewCourse}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 rounded-xl shadow-xs whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Create New Course
                </button>
              </div>

              {editingCourse && (
                <motion.form
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleConfirmCourseSave}
                  className="bg-gradient-to-br from-[#071028] to-[#0E224D] text-white p-6 rounded-2xl space-y-4 border border-cyan-500/30 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-amber-300">
                      {courses.some((c) => c.id === editingCourse.id)
                        ? 'Edit Existing Physics Course'
                        : 'Create New Physics Course'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingCourse(null)}
                      className="text-xs text-slate-300 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-300 mb-1">
                        Course Title
                      </label>
                      <input
                        type="text"
                        required
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                        placeholder="e.g., JEE Advanced: Electrodynamics & Circuit Theory"
                        className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        Target Category
                      </label>
                      <select
                        value={courseCategory}
                        onChange={(e) =>
                          setCourseCategory(e.target.value as Course['category'])
                        }
                        className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white"
                      >
                        <option value="CLASS_10">Class 10 Physics</option>
                        <option value="CLASS_11">Class 11 Physics</option>
                        <option value="CLASS_12">Class 12 Physics</option>
                        <option value="JEE">JEE Main &amp; Advanced</option>
                        <option value="NEET">NEET UG Physics</option>
                        <option value="COMPETITIVE">Olympiad / Competitive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">
                        Duration (Hours)
                      </label>
                      <input
                        type="number"
                        value={courseHours}
                        onChange={(e) => setCourseHours(Number(e.target.value))}
                        className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-300 mb-1">
                        Syllabus Description
                      </label>
                      <textarea
                        rows={2}
                        value={courseDesc}
                        onChange={(e) => setCourseDesc(e.target.value)}
                        placeholder="Syllabus summary and key analytical methods..."
                        className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 rounded-xl hover:from-amber-300 hover:to-yellow-300"
                    >
                      Save Course Record
                    </button>
                  </div>
                </motion.form>
              )}

              <div className="space-y-3.5">
                {filteredCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    whileHover={{ y: -3 }}
                    className="bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-5 space-y-3 shadow-2xs hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-mono font-bold">
                            {course.category.replace('_', ' ')}
                          </span>
                          <span className="text-slate-500">{course.topicDomain}</span>
                          <span>·</span>
                          <span className="font-mono font-bold text-amber-600">
                            {course.totalHours} hrs
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-1">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {course.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEditCourse(course)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteCourse(course.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Lessons inside course */}
                    <div className="pt-3 border-t border-slate-100 space-y-1.5">
                      <div className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                        Lessons ({course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0)})
                      </div>
                      {course.chapters.map((ch) =>
                        ch.lessons.map((les) => (
                          <div
                            key={les.id}
                            className="flex items-center justify-between text-xs py-2 px-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200/60"
                          >
                            <div className="min-w-0 pr-2">
                              <span className="font-semibold text-slate-900">
                                {les.title}
                              </span>
                              <span className="text-slate-400 mx-1.5">·</span>
                              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                                {les.type}
                              </span>
                              <span className="text-slate-400 mx-1.5">·</span>
                              <span className="font-mono text-[11px] text-amber-700">
                                {les.formulaSummary}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteLesson(course.id, ch.id, les.id)
                              }
                              className="text-rose-600 hover:text-rose-800 text-[11px] font-bold shrink-0"
                            >
                              Remove
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column: Add Lesson Form */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handleAddLessonToCourse}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm sticky top-24 relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />
                <h3 className="text-base font-bold text-slate-900 pt-1">
                  Add New Lesson / Lecture Module
                </h3>
                <p className="text-xs text-slate-500">
                  Attach a video lecture, formula sheet PDF, or interactive simulation to any course.
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Target Course
                  </label>
                  <select
                    value={selectedCourseForLesson}
                    onChange={(e) => setSelectedCourseForLesson(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 bg-slate-50"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newLessonTitle}
                    onChange={(e) => setNewLessonTitle(e.target.value)}
                    placeholder="e.g., Conservation of Angular Momentum in Central Orbits"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lesson Format
                  </label>
                  <select
                    value={newLessonType}
                    onChange={(e) => setNewLessonType(e.target.value as LessonType)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 bg-slate-50"
                  >
                    <option value="VIDEO">Video Lecture</option>
                    <option value="PDF">Formula Sheet / PDF Notes</option>
                    <option value="SIMULATION">Interactive Physics Simulation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Key Physics Equation / Relation
                  </label>
                  <input
                    type="text"
                    value={newLessonFormula}
                    onChange={(e) => setNewLessonFormula(e.target.value)}
                    placeholder="e.g., L = r × p = I ω"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <motion.button
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-blue-500/25 transition-all"
                >
                  + Append Lesson to Course
                </motion.button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: TESTS & MCQ BANK */}
        {activeTab === 'TESTS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <h2 className="text-base font-bold text-slate-900">
                Active Mock Tests &amp; Question Banks
              </h2>
              {tests.map((test) => (
                <div
                  key={test.id}
                  className="bg-white border border-slate-200 hover:border-violet-400 rounded-2xl p-5 space-y-3 shadow-2xs transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-200 font-mono font-bold text-[10px]">
                          {test.examCategory.replace('_', ' ')}
                        </span>
                        <span className="font-mono tabular-nums">
                          {test.durationMinutes} mins
                        </span>
                        <span>·</span>
                        <span className="font-mono tabular-nums font-bold text-slate-800">
                          {test.totalMarks} marks
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {test.title}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteTest(test.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Test
                    </button>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {test.questions.map((q, i) => (
                      <div
                        key={q.id}
                        className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/70 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <strong className="font-mono text-indigo-700">
                            Question {i + 1} (+{q.marks} / -{q.negativeMarks})
                          </strong>
                          <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Key: Option {q.correctOptionId.split('-').pop()?.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-slate-900 font-medium">{q.questionText}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-5">
              <form
                onSubmit={handleAddQuestionToTest}
                className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3.5 shadow-sm sticky top-24 relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400" />
                <h3 className="text-base font-bold text-slate-900 pt-1">
                  Add MCQ Question to Examination
                </h3>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Examination
                  </label>
                  <select
                    value={selectedTestId}
                    onChange={(e) => setSelectedTestId(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 bg-slate-50"
                  >
                    {tests.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Question Statement
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Enter numerical or conceptual Physics MCQ..."
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    required
                    value={newOptionA}
                    onChange={(e) => setNewOptionA(e.target.value)}
                    placeholder="Option A"
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50"
                  />
                  <input
                    type="text"
                    required
                    value={newOptionB}
                    onChange={(e) => setNewOptionB(e.target.value)}
                    placeholder="Option B"
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50"
                  />
                  <input
                    type="text"
                    value={newOptionC}
                    onChange={(e) => setNewOptionC(e.target.value)}
                    placeholder="Option C"
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50"
                  />
                  <input
                    type="text"
                    value={newOptionD}
                    onChange={(e) => setNewOptionD(e.target.value)}
                    placeholder="Option D"
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Correct Option Key
                  </label>
                  <select
                    value={newCorrectIndex}
                    onChange={(e) => setNewCorrectIndex(e.target.value as any)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50"
                  >
                    <option value="a">Option A</option>
                    <option value="b">Option B</option>
                    <option value="c">Option C</option>
                    <option value="d">Option D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Step-by-Step Derivation Explanation
                  </label>
                  <input
                    type="text"
                    value={newExplanation}
                    onChange={(e) => setNewExplanation(e.target.value)}
                    placeholder="Shown after student submits attempt..."
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50"
                  />
                </div>

                <motion.button
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  + Save MCQ to Examination Bank
                </motion.button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: STUDENT SUBMISSIONS & RESULTS */}
        {activeTab === 'RESULTS' && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <div className="px-6 py-4 bg-gradient-to-r from-[#061029] to-[#0E224D] text-white flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold">
                  Student Examination Submissions Log
                </h2>
                <p className="text-xs text-slate-300">
                  Real-time evaluation of student mock test attempts
                </p>
              </div>
              <button
                type="button"
                onClick={exportResultsCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV Report</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-700">
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Examination Title</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Score</th>
                    <th className="py-3.5 px-4">Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {attempts.map((att) => (
                    <tr
                      key={att.id}
                      className="hover:bg-blue-50/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {att.userName}
                      </td>
                      <td className="py-3.5 px-4">{att.testTitle}</td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-500">
                        {att.submittedAt}
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums font-bold text-slate-900">
                        {att.score} / {att.totalMarks}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                              style={{ width: `${att.percentage}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-emerald-700">
                            {att.percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: COUNSELING & CONTACT INQUIRIES INBOX */}
        {activeTab === 'INQUIRIES' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Student &amp; Parent Counseling Inquiries
                </h2>
                <p className="text-xs text-slate-500">
                  Messages submitted via the homepage Contact &amp; Demo Counseling form
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-mono text-xs font-bold">
                {inquiries.length} Inquiries
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inquiries.map((inq) => (
                <motion.div
                  key={inq.id}
                  whileHover={{ y: -3 }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50/40 border border-slate-200 hover:border-blue-400 space-y-2.5 shadow-2xs transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white font-mono text-[10px] font-bold">
                      #{inq.id}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      {inq.status || 'RECEIVED'}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">
                      {inq.name}{' '}
                      <span className="text-xs font-normal text-slate-500">
                        ({inq.email})
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-indigo-600 mt-0.5">
                      {inq.targetExam} · {inq.inquiryType}
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80">
                    &ldquo;{inq.message}&rdquo;
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
