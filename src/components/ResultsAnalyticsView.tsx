import React, { useState } from 'react';
import { TestAttemptResult, MockTest } from '../data/physicsData';
import {
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Award,
  Target,
  Zap,
  Flame,
  BarChart3,
  Play
} from 'lucide-react';
import { motion } from 'motion/react';

interface ResultsAnalyticsViewProps {
  attempts: TestAttemptResult[];
  tests: MockTest[];
  onStartWeakAreaTest: (test: MockTest) => void;
  onBackHome: () => void;
}

export const ResultsAnalyticsView: React.FC<ResultsAnalyticsViewProps> = ({
  attempts,
  tests,
  onStartWeakAreaTest,
  onBackHome
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TOPIC_WISE' | 'HISTORY' | 'WEAK_AREAS'>('OVERVIEW');
  const [timeframe, setTimeframe] = useState<'30_DAYS' | '90_DAYS' | 'ALL'>('30_DAYS');

  const topicBreakdown = [
    { topic: 'Mechanics & Rotational Dynamics', percentage: 92, color: 'from-blue-600 to-cyan-500', status: 'Mastered' },
    { topic: 'Ray & Wave Optics', percentage: 83, color: 'from-indigo-600 to-blue-500', status: 'Strong' },
    { topic: 'Electrostatics & Current', percentage: 78, color: 'from-emerald-600 to-teal-500', status: 'Good' },
    { topic: 'Thermodynamics & Kinetic Theory', percentage: 71, color: 'from-amber-500 to-yellow-500', status: 'Moderate' },
    { topic: 'Moving Charges & Magnetism', percentage: 65, color: 'from-orange-500 to-amber-500', status: 'Focus Needed' },
    { topic: 'Modern Physics & Dual Nature', percentage: 58, color: 'from-rose-600 to-pink-500', status: 'Priority Weak Area' }
  ];

  const weakTopics = [
    {
      name: 'Magnetism & Moving Charges',
      accuracy: '65%',
      issue: 'Sign convention in Biot-Savart cross product and helical pitch equations.',
      recommendedTest: tests[0]
    },
    {
      name: 'Modern Physics & Photoelectric Effect',
      accuracy: '58%',
      issue: 'Stopping potential vs frequency slope and de Broglie wavelength ratios.',
      recommendedTest: tests[2] || tests[0]
    },
    {
      name: 'Thermodynamics Indicator Diagrams',
      accuracy: '71%',
      issue: 'Adiabatic vs Isothermal work integral sign conventions.',
      recommendedTest: tests[1] || tests[0]
    }
  ];

  const kpiCards = [
    {
      title: 'Average Score',
      val: '78%',
      delta: '↑ 12% vs last month',
      icon: Award,
      accent: 'from-amber-500 to-orange-500',
      iconBg: 'bg-amber-500/10 text-amber-600'
    },
    {
      title: 'Tests Attempted',
      val: `${Math.max(8, attempts.length)}`,
      delta: '↑ +3 this week',
      icon: BarChart3,
      accent: 'from-blue-600 to-indigo-600',
      iconBg: 'bg-blue-600/10 text-blue-600'
    },
    {
      title: 'Accuracy Rate',
      val: '85%',
      delta: '↑ 10% improvement',
      icon: Target,
      accent: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-500/10 text-emerald-600'
    },
    {
      title: 'Time / Question',
      val: '1m 24s',
      delta: '↓ 20% faster speed',
      icon: Clock,
      accent: 'from-violet-600 to-purple-600',
      iconBg: 'bg-violet-600/10 text-violet-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Student Dashboard
          </button>
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Test Results &amp; Performance Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time diagnostic telemetry across Mechanics, Electrodynamics, Optics, and Modern Physics.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-amber-400"
          >
            <option value="30_DAYS">Last 30 Days</option>
            <option value="90_DAYS">Last 90 Days</option>
            <option value="ALL">All Academic Year</option>
          </select>
        </div>
      </motion.div>

      {/* Interactive Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-xl border border-slate-200">
        {[
          { id: 'OVERVIEW', label: 'Performance Overview' },
          { id: 'TOPIC_WISE', label: 'Topic-wise Mastery' },
          { id: 'HISTORY', label: 'Attempt History' },
          { id: 'WEAK_AREAS', label: 'Priority Weak Areas' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4 Animated KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, idx) => {
          const IconComp = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              whileHover={{ y: -4 }}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs relative overflow-hidden"
            >
              <div className={`h-1 w-full bg-gradient-to-r ${kpi.accent} absolute top-0 left-0`} />
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{kpi.title}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kpi.iconBg}`}>
                  <IconComp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-slate-900 mt-2">
                {kpi.val}
              </div>
              <div className="text-xs font-mono text-emerald-600 font-semibold mt-1">
                {kpi.delta}
              </div>
            </motion.div>
          );
        })}
      </div>

      {activeTab === 'OVERVIEW' && (
        <>
          {/* Performance Trend Dual-Curve SVG Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Performance Trajectory vs. Batch Average
                </h2>
                <p className="text-xs text-slate-500">
                  Consistent upward accuracy across the last 5 chapter tests
                </p>
              </div>
              <div className="flex items-center gap-5 text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-blue-600">
                  <span className="w-3 h-1 bg-blue-600 rounded-full inline-block" /> Your Score
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                  <span className="w-3 h-1 bg-emerald-500 rounded-full inline-block" /> Class Average
                </span>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <svg
                viewBox="0 0 700 210"
                className="w-full h-52 select-none"
                role="img"
                aria-label="Performance Trend Chart"
              >
                <defs>
                  <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {[30, 70, 110, 150].map((y) => (
                  <line
                    key={y}
                    x1="40"
                    y1={y}
                    x2="670"
                    y2={y}
                    stroke="#F1F5F9"
                    strokeWidth="1.5"
                  />
                ))}

                {/* Shaded Area under Your Score */}
                <path
                  d="M 50 115 Q 150 130, 250 100 T 450 65 T 650 50 L 650 165 L 50 165 Z"
                  fill="url(#scoreAreaGrad)"
                />

                {/* Class Average Curve (Emerald) */}
                <path
                  d="M 50 135 Q 150 120, 250 125 T 450 95 T 650 85"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  strokeDasharray="5 4"
                />

                {/* Your Score Curve (Royal Blue) */}
                <path
                  d="M 50 115 Q 150 130, 250 100 T 450 65 T 650 50"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="3.5"
                />

                {[
                  { x: 50, y: 115, label: 'Apr 10', val: '68%' },
                  { x: 200, y: 118, label: 'Apr 12', val: '66%' },
                  { x: 350, y: 82, label: 'Apr 14', val: '79%' },
                  { x: 500, y: 65, label: 'Apr 16', val: '84%' },
                  { x: 650, y: 50, label: 'Apr 18', val: '88%' }
                ].map((pt) => (
                  <g key={pt.label}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="5"
                      fill="#2563EB"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                    <text
                      x={pt.x - 12}
                      y={pt.y - 10}
                      fill="#1E293B"
                      fontSize="10"
                      fontWeight="bold"
                      className="font-mono"
                    >
                      {pt.val}
                    </text>
                    <text
                      x={pt.x - 16}
                      y="190"
                      fill="#64748B"
                      fontSize="11"
                      className="font-mono"
                    >
                      {pt.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </motion.div>

          {/* Bottom Split: Topic-wise Performance + Weak Areas Action Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-2xs"
            >
              <h2 className="text-base font-bold text-slate-900">
                Topic-wise Accuracy Breakdown
              </h2>
              <div className="space-y-4">
                {topicBreakdown.map((item) => (
                  <div key={item.topic} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{item.topic}</span>
                      <span className="font-mono tabular-nums font-bold text-slate-900">
                        {item.percentage}% · <span className="text-slate-500 font-normal">{item.status}</span>
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>PRIORITY REVISION TARGETS</span>
                </div>
                <h2 className="text-lg font-bold text-white">Weak Areas Diagnostic</h2>
                <p className="text-xs text-slate-300">
                  Targeted practice on these 3 chapters can boost your projected JEE/Board score by +24 marks:
                </p>

                <div className="space-y-2.5 pt-1">
                  {weakTopics.map((wt) => (
                    <div
                      key={wt.name}
                      className="p-3.5 bg-slate-800/80 border border-slate-700/80 rounded-xl flex items-start justify-between gap-2"
                    >
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {wt.name}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{wt.issue}</p>
                      </div>
                      <span className="font-mono text-xs font-bold text-amber-400 shrink-0">
                        {wt.accuracy}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onStartWeakAreaTest(tests[0])}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Focus Here → Start Targeted Practice Test
              </button>
            </motion.div>
          </div>
        </>
      )}

      {activeTab === 'TOPIC_WISE' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Detailed Topic Mastery Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topicBreakdown.map((t) => (
              <div key={t.topic} className="p-4 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">{t.topic}</span>
                  <span className="font-mono text-xs font-semibold text-slate-600">
                    {t.status} ({t.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${t.color}`} style={{ width: `${t.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'HISTORY' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <th className="py-3.5 px-4">Test Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Score</th>
                  <th className="py-3.5 px-4">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {attempts.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{a.testTitle}</td>
                    <td className="py-3.5 px-4 text-slate-600">{a.examCategory}</td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-600">
                      {a.submittedAt}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums font-bold text-slate-900">
                      {a.score} / {a.totalMarks}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums font-semibold text-emerald-600">
                      {a.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'WEAK_AREAS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {weakTopics.map((wt) => (
            <div
              key={wt.name}
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="text-xs font-mono text-rose-600 font-semibold">
                  ACCURACY: {wt.accuracy}
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{wt.name}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{wt.issue}</p>
              </div>
              <button
                type="button"
                onClick={() => onStartWeakAreaTest(wt.recommendedTest)}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold rounded-xl hover:from-blue-500 hover:to-indigo-500"
              >
                Practice Now →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
