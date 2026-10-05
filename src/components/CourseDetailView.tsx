import React, { useState } from 'react';
import { Course, Lesson, MockTest, STUDY_MATERIALS } from '../data/physicsData';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Play,
  FileText,
  Star,
  BookOpen,
  Clock,
  Award,
  ChevronRight
} from 'lucide-react';
import { PhysicsSimulationLab } from './PhysicsSimulationLab';

interface CourseDetailViewProps {
  course: Course;
  isEnrolled: boolean;
  completedLessonIds: string[];
  courseTests: MockTest[];
  onBack: () => void;
  onEnroll: (courseId: string) => void;
  onToggleLessonComplete: (lessonId: string) => void;
  onStartTest: (test: MockTest) => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  course,
  isEnrolled,
  completedLessonIds,
  courseTests,
  onBack,
  onEnroll,
  onToggleLessonComplete,
  onStartTest
}) => {
  const allLessons: Lesson[] = course.chapters.flatMap((c) => c.lessons);
  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'CHAPTERS' | 'TESTS' | 'MATERIALS' | 'REVIEWS'
  >('OVERVIEW');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Interactive Timestamped Video Lecture Notes (Persisted in localStorage)
  const [lectureNotes, setLectureNotes] = useState<
    Array<{ id: string; lessonId: string; timestamp: string; text: string }>
  >(() => {
    try {
      const saved = localStorage.getItem('kp_lecture_timestamp_notes');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage errors
    }
    return [
      {
        id: 'note-1',
        lessonId: 'les-coulomb-1',
        timestamp: '04:15',
        text: 'Superposition vector addition: always resolve F_x and F_y components before summing.'
      },
      {
        id: 'note-2',
        lessonId: 'les-gauss-2',
        timestamp: '11:40',
        text: 'For infinite line charge, E = λ / (2π ε₀ r) — flux through flat caps is zero.'
      }
    ];
  });
  const [noteTimestamp, setNoteTimestamp] = useState('06:30');
  const [noteInput, setNoteInput] = useState('');

  const handleAddTimestampNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLesson || !noteInput.trim()) return;
    const updated = [
      {
        id: `note-${Date.now()}`,
        lessonId: activeLesson.id,
        timestamp: noteTimestamp.trim() || '05:00',
        text: noteInput.trim()
      },
      ...lectureNotes
    ];
    setLectureNotes(updated);
    localStorage.setItem('kp_lecture_timestamp_notes', JSON.stringify(updated));
    setNoteInput('');
  };

  const handleDeleteTimestampNote = (id: string) => {
    const updated = lectureNotes.filter((n) => n.id !== id);
    setLectureNotes(updated);
    localStorage.setItem('kp_lecture_timestamp_notes', JSON.stringify(updated));
  };

  const completedInCourse = allLessons.filter((l) => completedLessonIds.includes(l.id)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb matching Screen 3: < Courses > Class 12 Physics */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 font-medium text-slate-700 hover:text-slate-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Courses
        </button>
        <span>&gt;</span>
        <span className="text-slate-900 font-semibold">{course.title}</span>
      </div>

      {/* Top Hero Card of Course Detail matching Screen 3 */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {course.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span className="font-semibold text-blue-700">
                {course.boardTags.join(' · ')}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 text-amber-500 font-semibold">
                ★★★★★ <span className="text-slate-700 font-mono">4.8 (2.4k reviews)</span>
              </span>
            </div>

            <div className="text-xs text-slate-600 font-mono tabular-nums">
              16 Chapters · 380+ Lectures · 120+ Tests · 5 PDF Notes
            </div>

            {/* Dual CTA Buttons: Enroll Now + Continue Learning */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onEnroll(course.id);
                  if (allLessons[0]) setActiveLesson(allLessons[0]);
                }}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                {isEnrolled ? 'Enrolled · Open Player' : 'Enroll Now'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (allLessons[0]) setActiveLesson(allLessons[0]);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                <Play className="w-3.5 h-3.5" />
                Continue Learning ({completedInCourse}/{allLessons.length})
              </button>
            </div>

            {/* Feature Perks Row */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-slate-500">
              <span>✓ Lifetime Access</span>
              <span>✓ Downloadable Notes</span>
              <span>✓ Completion Certificate</span>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 h-48 sm:h-52">
              <img
                src={course.thumbnail}
                alt={course.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* 5 Tabs: Overview | Chapters | Tests | Materials | Reviews */}
        <div className="flex flex-wrap items-center gap-6 border-b border-slate-200 mt-8 text-xs sm:text-sm font-semibold">
          {[
            { id: 'OVERVIEW', label: 'Overview' },
            { id: 'CHAPTERS', label: `Chapters (${course.chapters.length})` },
            { id: 'TESTS', label: `Tests (${courseTests.length})` },
            { id: 'MATERIALS', label: 'Materials' },
            { id: 'REVIEWS', label: 'Reviews' }
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === t.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Active Lesson Drawer if launched */}
        {activeLesson && (
          <div className="mt-6 bg-slate-900 text-white rounded-xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-amber-400">
                  ACTIVE LESSON MODULE · {activeLesson.durationMinutes} MINS
                </div>
                <h3 className="text-lg font-semibold mt-0.5">{activeLesson.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleLessonComplete(activeLesson.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg ${
                    completedLessonIds.includes(activeLesson.id)
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-amber-500 text-slate-950'
                  }`}
                >
                  {completedLessonIds.includes(activeLesson.id)
                    ? '✓ Completed'
                    : 'Mark Complete'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLesson(null)}
                  className="px-3 py-1.5 text-xs text-slate-300 hover:text-white"
                >
                  Close Player
                </button>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs sm:text-sm text-amber-300">
              Equation: {activeLesson.formulaSummary}
            </div>

            <ul className="space-y-1.5 text-xs text-slate-300">
              {activeLesson.keyTakeaways.map((k, i) => (
                <li key={i}>• {k}</li>
              ))}
            </ul>

            {/* Interactive Video Lecture Timestamp Notes */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                  Timestamped Lecture Notes ({lectureNotes.filter((n) => n.lessonId === activeLesson.id).length})
                </span>
                <span className="text-[11px] text-slate-400">
                  Saved automatically for offline revision
                </span>
              </div>

              <form onSubmit={handleAddTimestampNote} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={noteTimestamp}
                  onChange={(e) => setNoteTimestamp(e.target.value)}
                  placeholder="05:30"
                  className="w-24 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-amber-300 focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Add a personal Physics note or formula reminder at this timestamp..."
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg whitespace-nowrap transition-colors"
                >
                  + Save Note
                </button>
              </form>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {lectureNotes
                  .filter((n) => n.lessonId === activeLesson.id)
                  .map((note) => (
                    <div
                      key={note.id}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-950/90 border border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono text-[11px] font-bold shrink-0">
                          ▶ {note.timestamp}
                        </span>
                        <span className="text-slate-200 truncate">{note.text}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteTimestampNote(note.id)}
                        className="text-[11px] text-slate-500 hover:text-rose-400 shrink-0"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Contents */}
        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            <div className="lg:col-span-8 space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">About This Course</h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3">What You’ll Learn</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Complete {course.title} syllabus</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Concepts with real-life examples</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Practice questions &amp; mock tests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Previous year board &amp; entrance papers</span>
                  </div>
                </div>
              </div>

              {/* Chapters List matching Screen 3 */}
              <div className="space-y-3 pt-2">
                <h3 className="text-base font-bold text-slate-900">
                  Chapters ({course.chapters.length})
                </h3>
                <div className="space-y-2.5">
                  {course.chapters.map((ch, idx) => (
                    <div
                      key={ch.id}
                      className="p-4 border border-slate-200 rounded-xl hover:border-blue-500 transition-colors bg-slate-50/50 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-sm font-bold text-slate-900">
                            {ch.title}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {ch.description}
                          </div>
                        </div>
                        <div className="text-xs font-mono text-slate-500 shrink-0">
                          {ch.lessons.length + 10} lessons · 2h {15 + idx * 15}m &gt;
                        </div>
                      </div>

                      {/* Clickable Lessons inside Chapter */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {ch.lessons.map((les) => {
                          const done = completedLessonIds.includes(les.id);
                          return (
                            <button
                              key={les.id}
                              type="button"
                              onClick={() => setActiveLesson(les)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                done
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                              }`}
                            >
                              {done ? '✓ ' : '▶ '} {les.title}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Course Highlights Box matching Screen 3 */}
            <div className="lg:col-span-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Course Highlights</h3>
                <ul className="space-y-3 text-xs text-slate-700 font-medium">
                  <li className="flex items-center justify-between border-b border-slate-200/70 pb-2.5">
                    <span>Structured Chapters</span>
                    <span className="font-mono font-bold text-slate-900">16 Chapters</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-slate-200/70 pb-2.5">
                    <span>HD Video Lectures</span>
                    <span className="font-mono font-bold text-slate-900">380+ Lectures</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-slate-200/70 pb-2.5">
                    <span>Chapter &amp; Mock Tests</span>
                    <span className="font-mono font-bold text-slate-900">120+ Tests</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-slate-200/70 pb-2.5">
                    <span>Revision Compendiums</span>
                    <span className="font-mono font-bold text-slate-900">5 PDF Notes</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Access Duration</span>
                    <span className="font-mono font-bold text-emerald-700">Lifetime Access</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'CHAPTERS' && (
          <div className="pt-6 space-y-4">
            {course.chapters.map((ch) => (
              <div key={ch.id} className="p-5 border border-slate-200 rounded-xl space-y-3">
                <h3 className="text-base font-bold text-slate-900">{ch.title}</h3>
                <p className="text-xs text-slate-600">{ch.description}</p>
                <div className="divide-y divide-slate-100">
                  {ch.lessons.map((les) => (
                    <div
                      key={les.id}
                      className="py-2.5 flex items-center justify-between text-xs"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveLesson(les)}
                        className="font-medium text-slate-800 hover:text-blue-600 text-left"
                      >
                        ▶ {les.title} ({les.durationMinutes} min)
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleLessonComplete(les.id)}
                        className="font-mono text-slate-500 hover:text-emerald-600"
                      >
                        {completedLessonIds.includes(les.id) ? '✓ Completed' : 'Mark Complete'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'TESTS' && (
          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {courseTests.map((t) => (
              <div
                key={t.id}
                className="p-5 border border-slate-200 rounded-xl flex items-center justify-between gap-4"
              >
                <div>
                  <div className="text-sm font-bold text-slate-900">{t.title}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1">
                    {t.questions.length} Questions · {t.durationMinutes} mins
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onStartTest(t)}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 whitespace-nowrap"
                >
                  Start Test
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'MATERIALS' && (
          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {STUDY_MATERIALS.map((m) => (
              <div key={m.id} className="p-4 border border-slate-200 rounded-xl space-y-2">
                <div className="text-sm font-bold text-slate-900">{m.title}</div>
                <p className="text-xs text-slate-600">{m.summary}</p>
                <div className="text-xs font-mono text-blue-600">
                  {m.pages} pages · {m.fileSize}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'REVIEWS' && (
          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="text-xs text-amber-500">★★★★★</div>
              <div className="text-xs font-bold text-slate-900">Venu · Class 12 CBSE</div>
              <p className="text-xs text-slate-600">
                &ldquo;Electric Charges and Current Electricity derivations are explained step-by-step. Scored 96% in my pre-board exam.&rdquo;
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="text-xs text-amber-500">★★★★★</div>
              <div className="text-xs font-bold text-slate-900">Sneha Patil · JEE Aspirant</div>
              <p className="text-xs text-slate-600">
                &ldquo;The chapter tests and Lorentz force numericals match JEE Main difficulty closely.&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Physics Simulation Sandbox below Course Overview */}
      <PhysicsSimulationLab />
    </div>
  );
};
