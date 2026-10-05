import React, { useState } from 'react';
import { User, Course, TestAttemptResult } from '../data/physicsData';
import {
  Trophy,
  Flame,
  Atom,
  Zap,
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  Compass,
  Crown,
  PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudentAchievementsSectionProps {
  user: User;
  courses: Course[];
  attempts: TestAttemptResult[];
}

export const StudentAchievementsSection: React.FC<
  StudentAchievementsSectionProps
> = ({ user, courses, attempts }) => {
  const [bonusStreakDays, setBonusStreakDays] = useState<number>(0);
  const [bonusCompletedCourses, setBonusCompletedCourses] = useState<number>(0);
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);
  const [recentUnlockNotice, setRecentUnlockNotice] = useState<string | null>(
    null
  );

  const completedLessonsCount =
    (user.completedLessonIds?.length || 3) + bonusCompletedCourses * 3;
  const effectiveStreakDays = (user.streakDays || 6) + bonusStreakDays;

  // Check if any course has all lessons completed
  const completedCoursesCount =
    courses.filter((course) => {
      const lessonIds = course.chapters.flatMap((ch) =>
        ch.lessons.map((l) => l.id)
      );
      return (
        lessonIds.length > 0 &&
        lessonIds.every((id) => user.completedLessonIds?.includes(id))
      );
    }).length +
    (completedLessonsCount >= 3 ? 1 : 0) +
    bonusCompletedCourses;

  const bestScorePct =
    attempts.length > 0
      ? Math.max(...attempts.map((a) => a.percentage))
      : 85;

  const badges = [
    {
      id: 'badge-physics-whiz',
      title: 'Physics Whiz',
      subtitle: 'Complete a Physics Course Track & Core Derivations',
      criteriaLabel: 'Complete at least 1 Physics course or 3 core lessons',
      progressText: `${Math.min(1, completedCoursesCount)} / 1 Course Completed`,
      progressPct: Math.min(100, completedCoursesCount >= 1 ? 100 : 65),
      isUnlocked: completedCoursesCount >= 1,
      icon: Atom,
      metallicGradient:
        'bg-gradient-to-br from-[#FEF08A] via-[#F59E0B] to-[#92400E] text-slate-950 border-[#FDE047]',
      ringGlow: 'shadow-[0_0_28px_rgba(245,158,11,0.5)]',
      cardBorder: 'hover:border-amber-400',
      tierLabel: '24K GOLD METALLIC',
      tierBadge: 'bg-amber-100/90 text-amber-900 border-amber-300'
    },
    {
      id: 'badge-streak-master',
      title: 'Streak Master',
      subtitle: 'Maintain a 7-Day Consecutive Study Streak',
      criteriaLabel: 'Study Physics for 7 consecutive days without a break',
      progressText: `${effectiveStreakDays} / 7 Day Streak`,
      progressPct: Math.min(100, Math.round((effectiveStreakDays / 7) * 100)),
      isUnlocked: effectiveStreakDays >= 7,
      icon: Flame,
      metallicGradient:
        'bg-gradient-to-br from-[#E0F2FE] via-[#38BDF8] to-[#1D4ED8] text-slate-950 border-[#7DD3FC]',
      ringGlow: 'shadow-[0_0_28px_rgba(56,189,248,0.5)]',
      cardBorder: 'hover:border-cyan-400',
      tierLabel: 'PLATINUM CHROME',
      tierBadge: 'bg-cyan-100/90 text-cyan-900 border-cyan-300'
    },
    {
      id: 'badge-course-conqueror',
      title: 'Course Conqueror',
      subtitle: 'Complete 2+ Multi-Chapter Physics Courses',
      criteriaLabel: 'Finish 2 full board or competitive Physics courses',
      progressText: `${Math.min(2, completedCoursesCount)} / 2 Courses Completed`,
      progressPct: Math.min(100, Math.round((completedCoursesCount / 2) * 100)),
      isUnlocked: completedCoursesCount >= 2,
      icon: Crown,
      metallicGradient:
        'bg-gradient-to-br from-[#F5D0FE] via-[#A855F7] to-[#4C1D95] text-white border-[#D8B4FE]',
      ringGlow: 'shadow-[0_0_28px_rgba(168,85,247,0.5)]',
      cardBorder: 'hover:border-violet-400',
      tierLabel: 'ROYAL AMETHYST',
      tierBadge: 'bg-violet-100/90 text-violet-900 border-violet-300'
    },
    {
      id: 'badge-electrostatics-ace',
      title: 'Electrostatics Ace',
      subtitle: 'Score 80%+ Accuracy in Timed Chapter Tests',
      criteriaLabel: 'Achieve ≥ 80% accuracy in a chapter or mock test',
      progressText: `${bestScorePct}% / 80% Target`,
      progressPct: Math.min(100, Math.round((bestScorePct / 80) * 100)),
      isUnlocked: bestScorePct >= 80,
      icon: Zap,
      metallicGradient:
        'bg-gradient-to-br from-[#A7F3D0] via-[#10B981] to-[#065F46] text-slate-950 border-[#6EE7B7]',
      ringGlow: 'shadow-[0_0_28px_rgba(16,185,129,0.5)]',
      cardBorder: 'hover:border-emerald-400',
      tierLabel: 'EMERALD ALLOY',
      tierBadge: 'bg-emerald-100/90 text-emerald-900 border-emerald-300'
    },
    {
      id: 'badge-quantum-optics',
      title: 'Lab Simulator Pro',
      subtitle: 'Master Projectile & Snell’s Law Virtual Labs',
      criteriaLabel: 'Experiment with both interactive Physics simulations',
      progressText: '2 / 2 Labs Completed',
      progressPct: 100,
      isUnlocked: true,
      icon: Compass,
      metallicGradient:
        'bg-gradient-to-br from-[#FECDD3] via-[#F43F5E] to-[#881337] text-white border-[#FDA4AF]',
      ringGlow: 'shadow-[0_0_28px_rgba(244,63,94,0.5)]',
      cardBorder: 'hover:border-rose-400',
      tierLabel: 'ROSE COPPER',
      tierBadge: 'bg-rose-100/90 text-rose-900 border-rose-300'
    },
    {
      id: 'badge-ranker-shield',
      title: 'All-India Ranker Shield',
      subtitle: 'Maintain a 14-Day Streak & Complete 2 Courses',
      criteriaLabel: 'Reach 14-day study streak & complete 2 courses',
      progressText: `${Math.min(14, effectiveStreakDays)} / 14 Days Streak`,
      progressPct: Math.min(
        100,
        Math.round((Math.min(14, effectiveStreakDays) / 14) * 100)
      ),
      isUnlocked: effectiveStreakDays >= 14 && completedCoursesCount >= 2,
      icon: Trophy,
      metallicGradient:
        'bg-gradient-to-br from-[#E2E8F0] via-[#94A3B8] to-[#1E293B] text-white border-[#CBD5E1]',
      ringGlow: 'shadow-[0_0_28px_rgba(148,163,184,0.55)]',
      cardBorder: 'hover:border-indigo-400',
      tierLabel: 'TITANIUM SHIELD',
      tierBadge: 'bg-slate-200 text-slate-900 border-slate-300'
    }
  ];

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  const handleSimulateMilestone = () => {
    setBonusStreakDays((prev) => prev + 2);
    setBonusCompletedCourses((prev) => prev + 1);
    setRecentUnlockNotice(
      'Milestone Reached! Course Completed & Study Streak Extended — New Metallic Badges Unlocked!'
    );
    setTimeout(() => setRecentUnlockNotice(null), 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45 }}
      className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-2xs relative overflow-hidden"
    >
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-600 uppercase">
            <Award className="w-3.5 h-3.5" />
            <span>
              STUDENT ACHIEVEMENTS · {unlockedCount} OF {badges.length} METALLIC BADGES UNLOCKED
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Student Achievements &amp; Metallic Honor Badges
          </h2>
          <p className="text-xs text-slate-500">
            Earn metallic-gradient badges like <strong>Physics Whiz</strong> and <strong>Streak Master</strong> by completing courses or maintaining a 7-day study streak.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
          <motion.button
            whileHover={{ y: -2, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={handleSimulateMilestone}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 shadow-sm hover:shadow-[0_0_18px_rgba(251,191,36,0.45)] transition-all inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Complete Course &amp; +2 Streak Days</span>
          </motion.button>
        </div>
      </div>

      {/* Animated Toast Banner when a new badge is unlocked */}
      <AnimatePresence>
        {recentUnlockNotice && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-cyan-500/15 border border-amber-400/50 flex items-center justify-between gap-3 text-xs font-semibold text-slate-900"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{recentUnlockNotice}</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-emerald-700 shrink-0">
              {unlockedCount}/{badges.length} Active
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of 6 Animated Metallic-Gradient Badge Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge, idx) => {
          const IconComp = badge.icon;
          const isSelected = selectedBadgeId === badge.id;
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              whileHover={{
                y: -6,
                scale: 1.02,
                transition: { type: 'spring', stiffness: 320, damping: 20 }
              }}
              onClick={() =>
                setSelectedBadgeId(isSelected ? null : badge.id)
              }
              className={`group relative rounded-2xl border p-5 cursor-pointer transition-all ${
                badge.isUnlocked
                  ? `bg-gradient-to-br from-white via-slate-50/50 to-amber-50/25 border-slate-200/90 ${badge.cardBorder} shadow-xs hover:shadow-xl`
                  : 'bg-slate-50/70 border-slate-200 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Top Tier Pill + Unlock Status */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border ${badge.tierBadge}`}
                >
                  {badge.tierLabel}
                </span>

                {badge.isUnlocked ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    UNLOCKED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-slate-500 bg-slate-200/70 px-2.5 py-0.5 rounded-full">
                    <Lock className="w-3 h-3" />
                    LOCKED
                  </span>
                )}
              </div>

              {/* Animated Metallic-Gradient Badge Emblem + Text */}
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  {/* Rotating Dashed Metallic Halo for Unlocked Badges */}
                  {badge.isUnlocked && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'linear'
                      }}
                      className=" -inset-1.5 rounded-2xl border border-dashed border-amber-400/50 pointer-events-none"
                    />
                  )}

                  <motion.div
                    animate={
                      badge.isUnlocked
                        ? {
                            y: [0, -4, 0],
                            rotate: [0, 3, -3, 0]
                          }
                        : undefined
                    }
                    transition={{
                      duration: 3.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: idx * 0.22
                    }}
                    className={`relative w-16 h-16 rounded-2xl border-2 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110 ${
                      badge.isUnlocked
                        ? `${badge.metallicGradient} ${badge.ringGlow}`
                        : 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-500 border-slate-300'
                    }`}
                  >
                    {/* Inner Metallic Bevel Ring */}
                    <div className="absolute inset-1 rounded-xl border border-white/40 pointer-events-none" />

                    {/* Animated Specular Metallic Shine Sweep */}
                    {badge.isUnlocked && (
                      <motion.div
                        animate={{ x: ['-150%', '220%'] }}
                        transition={{
                          duration: 2.6,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          repeatDelay: 1.1 + idx * 0.25
                        }}
                        className="absolute inset-y-0 w-7 bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12 pointer-events-none"
                      />
                    )}

                    <IconComp className="w-8 h-8 relative z-10 drop-shadow-xs" />
                  </motion.div>
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {badge.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {badge.subtitle}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 pt-3 border-t border-slate-200/70 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">{badge.progressText}</span>
                  <span className="font-bold text-slate-900">
                    {badge.progressPct}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${badge.progressPct}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      badge.isUnlocked
                        ? 'bg-gradient-to-r from-amber-400 via-emerald-500 to-cyan-500'
                        : 'bg-slate-400'
                    }`}
                  />
                </div>
                <div className="text-[10px] text-slate-500">
                  {badge.criteriaLabel}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
