import React, { useState, useEffect, useMemo } from 'react';
import {
  Course,
  MockTest,
  StudyMaterial,
  STUDY_MATERIALS
} from '../data/physicsData';
import {
  Search,
  X,
  BookOpen,
  Play,
  FileCheck,
  FileText,
  ArrowRight,
  Command
} from 'lucide-react';
import { motion } from 'motion/react';

interface GlobalSearchModalProps {
  courses: Course[];
  tests: MockTest[];
  onClose: () => void;
  onSelectCourse: (course: Course) => void;
  onStartTest: (test: MockTest) => void;
  onPreviewMaterial: (material: StudyMaterial) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  courses,
  tests,
  onClose,
  onSelectCourse,
  onStartTest,
  onPreviewMaterial
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matchedCourses = q
      ? courses.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            c.boardTags.some((b) => b.toLowerCase().includes(q))
        )
      : courses.slice(0, 3);

    const allLessons = courses.flatMap((course) =>
      course.chapters.flatMap((ch) =>
        ch.lessons.map((les) => ({
          lesson: les,
          course
        }))
      )
    );

    const matchedLessons = q
      ? allLessons.filter(
          ({ lesson }) =>
            lesson.title.toLowerCase().includes(q) ||
            lesson.formulaSummary.toLowerCase().includes(q)
        )
      : allLessons.slice(0, 3);

    const matchedTests = q
      ? tests.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.examCategory.toLowerCase().includes(q)
        )
      : tests.slice(0, 2);

    const matchedMaterials = q
      ? STUDY_MATERIALS.filter(
          (m) =>
            m.title.toLowerCase().includes(q) ||
            m.summary.toLowerCase().includes(q) ||
            m.previewFormulas.some(
              (f) =>
                f.name.toLowerCase().includes(q) ||
                f.equation.toLowerCase().includes(q)
            )
        )
      : STUDY_MATERIALS.slice(0, 2);

    return {
      matchedCourses,
      matchedLessons,
      matchedTests,
      matchedMaterials
    };
  }, [query, courses, tests]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -12 }}
        className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
      >
        {/* Top Search Input Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center gap-3 border-b border-slate-800">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Physics courses, lessons, formulas (e.g., Gauss, Projectile, JEE, Optics)..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
          />
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
            ESC
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[68vh] overflow-y-auto space-y-5 divide-y divide-slate-100">
          {/* Courses */}
          {results.matchedCourses.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-mono font-bold uppercase text-blue-600 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Courses ({results.matchedCourses.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {results.matchedCourses.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onSelectCourse(c);
                      onClose();
                    }}
                    className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-left flex items-center justify-between gap-2 transition-all group"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                        {c.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {c.boardTags.join(' · ')}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lessons & Equations */}
          {results.matchedLessons.length > 0 && (
            <div className="pt-4 space-y-2">
              <div className="text-[11px] font-mono font-bold uppercase text-violet-600 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5" />
                <span>Video Lessons &amp; Equations ({results.matchedLessons.length})</span>
              </div>
              <div className="space-y-2">
                {results.matchedLessons.slice(0, 4).map(({ lesson, course }) => (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => {
                      onSelectCourse(course);
                      onClose();
                    }}
                    className="w-full p-3 rounded-xl border border-slate-200 hover:border-violet-400 hover:bg-violet-50/40 text-left flex items-center justify-between gap-3 transition-all group"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-violet-700 truncate">
                        {lesson.title}{' '}
                        <span className="text-[11px] font-normal text-slate-500">
                          in {course.title}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-blue-700 truncate mt-0.5">
                        {lesson.formulaSummary}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">
                      {lesson.durationMinutes}m →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mock Tests */}
          {results.matchedTests.length > 0 && (
            <div className="pt-4 space-y-2">
              <div className="text-[11px] font-mono font-bold uppercase text-amber-600 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Mock Exams ({results.matchedTests.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {results.matchedTests.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      onStartTest(t);
                      onClose();
                    }}
                    className="p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-left flex items-center justify-between gap-2 transition-all group"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {t.title}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {t.durationMinutes} mins · {t.totalMarks} marks
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-md bg-amber-400 text-slate-950 text-[10px] font-bold shrink-0">
                      Start
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Study Materials */}
          {results.matchedMaterials.length > 0 && (
            <div className="pt-4 space-y-2">
              <div className="text-[11px] font-mono font-bold uppercase text-emerald-600 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Formula Sheets &amp; PDFs ({results.matchedMaterials.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {results.matchedMaterials.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onPreviewMaterial(m);
                      onClose();
                    }}
                    className="p-3 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 text-left flex items-center justify-between gap-2 transition-all group"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {m.title}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {m.pages} pages · {m.fileSize}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Command className="w-3.5 h-3.5" /> Press <kbd className="font-mono font-bold">Ctrl + K</kbd> anytime to open Quick Search
          </span>
          <span>KP Physics Academy</span>
        </div>
      </motion.div>
    </div>
  );
};
