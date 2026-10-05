import React, { useState, useEffect, useMemo } from 'react';
import { MockTest } from '../data/physicsData';
import {
  Clock,
  Calendar,
  Zap,
  ChevronDown,
  ChevronUp,
  BellRing,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingExamCountdownWidgetProps {
  tests: MockTest[];
  onStartTest: (test: MockTest) => void;
}

interface ScheduledExamItem {
  id: string;
  title: string;
  examTag: string;
  scheduleLabel: string;
  totalPrepWindowHours: number;
  initialRemainingSeconds: number;
  testIndex: number;
  ringColors: {
    start: string;
    end: string;
    badgeBg: string;
    urgencyText: string;
  };
}

const SCHEDULED_EXAMS: ScheduledExamItem[] = [
  {
    id: 'sched-electrostatics',
    title: 'Electrostatics & Gauss Law Test',
    examTag: 'JEE MAIN / CLASS 12',
    scheduleLabel: 'Scheduled · 10:00 AM IST',
    totalPrepWindowHours: 14 * 24, // 14-day preparation window
    initialRemainingSeconds: 2 * 86400 + 14 * 3600 + 38 * 60 + 42, // ~2d 14h 38m 42s left (82% proximity)
    testIndex: 1,
    ringColors: {
      start: '#F59E0B',
      end: '#EF4444',
      badgeBg: 'bg-amber-400/15 text-amber-300 border-amber-400/40',
      urgencyText: 'High Proximity · Final Revision'
    }
  },
  {
    id: 'sched-full-jee',
    title: 'Full Syllabus JEE Main Mock',
    examTag: 'ALL INDIA RANK BOOSTER',
    scheduleLabel: 'Scheduled · 09:00 AM IST',
    totalPrepWindowHours: 14 * 24,
    initialRemainingSeconds: 5 * 86400 + 19 * 3600 + 22 * 60 + 15, // ~5d 19h left (58% proximity)
    testIndex: 2,
    ringColors: {
      start: '#38BDF8',
      end: '#6366F1',
      badgeBg: 'bg-cyan-400/15 text-cyan-300 border-cyan-400/40',
      urgencyText: 'Moderate Proximity · Practice Phase'
    }
  },
  {
    id: 'sched-magnetism-c12',
    title: 'Moving Charges & Magnetism Test',
    examTag: 'CHAPTER MOCK EXAM',
    scheduleLabel: 'Scheduled · 04:00 PM IST',
    totalPrepWindowHours: 14 * 24,
    initialRemainingSeconds: 9 * 86400 + 6 * 3600 + 12 * 60 + 50, // ~9d 06h left (34% proximity)
    testIndex: 0,
    ringColors: {
      start: '#10B981',
      end: '#06B6D4',
      badgeBg: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/40',
      urgencyText: 'Early Window · Concept Building'
    }
  }
];

export const FloatingExamCountdownWidget: React.FC<
  FloatingExamCountdownWidgetProps
> = ({ tests, onStartTest }) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(() => {
    const saved = localStorage.getItem('kp_selected_upcoming_exam_v1');
    return saved ? Number(saved) || 0 : 0;
  });
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [elapsedTickSeconds, setElapsedTickSeconds] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('kp_selected_upcoming_exam_v1', String(selectedIdx));
  }, [selectedIdx]);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTickSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeExam = SCHEDULED_EXAMS[selectedIdx] || SCHEDULED_EXAMS[0];
  const remainingSeconds = Math.max(
    60,
    activeExam.initialRemainingSeconds - elapsedTickSeconds
  );

  // Compute proximity percentage (0% at start of prep window -> 100% at exam start)
  const proximityPercentage = useMemo(() => {
    const totalWindowSecs = activeExam.totalPrepWindowHours * 3600;
    const elapsedInWindow = Math.max(0, totalWindowSecs - remainingSeconds);
    return Math.min(99, Math.max(12, Math.round((elapsedInWindow / totalWindowSecs) * 100)));
  }, [activeExam, remainingSeconds]);

  // Breakdown into Days, Hours, Minutes, Seconds
  const days = Math.floor(remainingSeconds / 86400);
  const hours = Math.floor((remainingSeconds % 86400) / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  // SVG Progress Ring Geometry
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (proximityPercentage / 100) * circumference;

  const targetTest =
    tests[activeExam.testIndex] || tests[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="fixed bottom-20 md:bottom-6 left-4 sm:left-auto sm:right-20 z-30 max-w-sm w-[calc(100vw-2rem)] sm:w-88 select-none"
    >
      <div className="bg-gradient-to-br from-[#060E24]/95 via-[#0B193D]/95 to-[#0F2352]/95 backdrop-blur-xl text-white rounded-2xl border border-slate-700/80 shadow-[0_16px_40px_rgba(2,6,23,0.65)] overflow-hidden">
        {/* Top Persistent Header Bar */}
        <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
            </span>
            <span className="text-[11px] font-mono font-bold tracking-wider text-amber-300 uppercase truncate">
              Upcoming Mock Exam Timer
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            title={isMinimized ? 'Expand exam countdown' : 'Minimize exam countdown'}
          >
            {isMinimized ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Minimized Compact Strip */}
        {isMinimized ? (
          <div
            onClick={() => setIsMinimized(false)}
            className="px-4 py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="rgba(148, 163, 184, 0.2)"
                    strokeWidth="7"
                    fill="none"
                  />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke={activeExam.ringColors.start}
                    strokeWidth="7"
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span className="absolute text-[9px] font-mono font-bold text-amber-300">
                  {proximityPercentage}%
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {activeExam.title}
                </div>
                <div className="text-[11px] font-mono text-cyan-300 tabular-nums">
                  {days}d : {String(hours).padStart(2, '0')}h :{' '}
                  {String(minutes).padStart(2, '0')}m :{' '}
                  {String(seconds).padStart(2, '0')}s
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-amber-300 font-semibold shrink-0">
              Expand
            </span>
          </div>
        ) : (
          /* Expanded Countdown Body with Animated Visual Progress Ring */
          <AnimatePresence initial={false}>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 space-y-4"
            >
              {/* Exam Selector Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {SCHEDULED_EXAMS.map((exam, idx) => {
                  const active = idx === selectedIdx;
                  return (
                    <button
                      key={exam.id}
                      type="button"
                      onClick={() => setSelectedIdx(idx)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all whitespace-nowrap border ${
                        active
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      Exam #{idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Center Row: Visual Progress-Ring + Countdown Readout */}
              <div className="flex items-center gap-4">
                {/* Animated SVG Progress Ring Indicating Proximity to Exam Date */}
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <defs>
                      <linearGradient
                        id={`examProxGrad-${activeExam.id}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor={activeExam.ringColors.start} />
                        <stop offset="100%" stopColor={activeExam.ringColors.end} />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="40"
                      cy="40"
                      r={radius}
                      stroke="rgba(148, 163, 184, 0.18)"
                      strokeWidth="7"
                      fill="none"
                    />
                    <motion.circle
                      cx="40"
                      cy="40"
                      r={radius}
                      stroke={`url(#examProxGrad-${activeExam.id})`}
                      strokeWidth="7"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-bold font-mono tabular-nums text-white leading-none">
                      {proximityPercentage}%
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 uppercase mt-0.5">
                      Proximity
                    </span>
                  </div>
                </div>

                {/* Exam Info & Urgency Badge */}
                <div className="min-w-0 flex-1 space-y-1">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${activeExam.ringColors.badgeBg}`}
                  >
                    {activeExam.examTag}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug truncate">
                    {activeExam.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-300">
                    <Calendar className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{activeExam.scheduleLabel}</span>
                  </div>
                  <div className="text-[10px] font-medium text-amber-300 flex items-center gap-1">
                    <BellRing className="w-3 h-3 shrink-0" />
                    <span className="truncate">{activeExam.ringColors.urgencyText}</span>
                  </div>
                </div>
              </div>

              {/* 4-Box Live Digital Countdown (DAYS : HRS : MIN : SEC) */}
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: 'DAYS', val: String(days).padStart(2, '0') },
                  { label: 'HRS', val: String(hours).padStart(2, '0') },
                  { label: 'MIN', val: String(minutes).padStart(2, '0') },
                  { label: 'SEC', val: String(seconds).padStart(2, '0') }
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className="p-2 rounded-xl bg-slate-950/80 border border-white/10"
                  >
                    <div className="text-sm sm:text-base font-bold font-mono tabular-nums text-amber-300">
                      {unit.val}
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 tracking-wider">
                      {unit.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct Action Button to Launch Practice / Mock Exam */}
              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => onStartTest(targetTest)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-bold shadow-md hover:shadow-[0_0_20px_rgba(251,191,36,0.45)] transition-all flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Attempt Scheduled Mock Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};
