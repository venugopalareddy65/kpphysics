import React, { useState, useEffect } from 'react';
import { MockTest, TestAttemptResult } from '../data/physicsData';
import { Clock, ArrowLeft } from 'lucide-react';

interface TestEngineModalProps {
  test: MockTest;
  userId: string;
  userName: string;
  onClose: () => void;
  onSubmitResult: (result: TestAttemptResult) => void;
}

export const TestEngineModal: React.FC<TestEngineModalProps> = ({
  test,
  userId,
  userName,
  onClose,
  onSubmitResult
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({
    // Pre-select q1-b ("qvB sinθ") so the user sees the exact Screen 5 state immediately
    q1: 'q1-b'
  });
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState<number>(28 * 60 + 45); // 00:28:45 matching Screen 5
  const [submittedResult, setSubmittedResult] = useState<TestAttemptResult | null>(null);

  useEffect(() => {
    if (submittedResult) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submittedResult]);

  useEffect(() => {
    if (secondsLeft === 0 && !submittedResult) {
      handleEvaluateSubmission();
    }
  }, [secondsLeft, submittedResult]);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (submittedResult) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const toggleMarkReview = (questionId: string) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleEvaluateSubmission = () => {
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    for (const q of test.questions) {
      const chosen = selectedAnswers[q.id];
      if (!chosen) {
        unansweredCount += 1;
      } else if (chosen === q.correctOptionId) {
        score += q.marks;
        correctCount += 1;
      } else {
        score -= q.negativeMarks;
        incorrectCount += 1;
      }
    }

    const percentage = Math.max(0, Math.round((score / test.totalMarks) * 100));
    const timeTakenSeconds = Math.max(60, test.durationMinutes * 60 - secondsLeft);

    const result: TestAttemptResult = {
      id: `attempt-${Date.now()}`,
      testId: test.id,
      testTitle: test.title,
      examCategory: test.examCategory,
      userId,
      userName,
      submittedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      score,
      totalMarks: test.totalMarks,
      percentage,
      correctCount,
      incorrectCount,
      unansweredCount,
      timeTakenSeconds,
      answers: selectedAnswers
    };

    setSubmittedResult(result);
    onSubmitResult(result);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `00:${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const currentQuestion = test.questions[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-xl max-w-3xl w-full overflow-hidden shadow-xl my-8">
        {/* Top Header matching Screen 5 */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Exit
            </button>
            <span className="text-slate-300">|</span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {test.title}
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[11px] text-slate-500">Time Remaining</div>
              <div className="font-mono tabular-nums text-sm font-bold text-slate-900">
                {formatTimer(secondsLeft)}
              </div>
            </div>
            {!submittedResult && (
              <button
                type="button"
                onClick={handleEvaluateSubmission}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors"
              >
                Submit Test
              </button>
            )}
          </div>
        </div>

        {!submittedResult ? (
          <div className="p-6 space-y-6">
            {/* Question Number & Mark for Review Checkbox matching Screen 5 */}
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900">
                Question {currentIndex + 1} of {test.questions.length}
              </h4>

              <label className="inline-flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={Boolean(markedForReview[currentQuestion.id])}
                  onChange={() => toggleMarkReview(currentQuestion.id)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Mark for Review</span>
              </label>
            </div>

            {/* Question Statement */}
            <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl space-y-4">
              <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
                {currentQuestion.questionText}
              </p>

              {/* Radio Options A, B, C, D matching Screen 5 */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === opt.id;
                  const letter = String.fromCharCode(65 + idx);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-colors flex items-center gap-3 ${
                        isSelected
                          ? 'bg-blue-50/90 border-blue-600 text-blue-950 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-blue-600' : 'border-slate-400'
                        }`}
                      >
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                        )}
                      </span>
                      <span className="text-sm">
                        <strong className="font-mono mr-1.5">{letter}.</strong> {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Previous & Next Buttons matching Screen 5 */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                ← Previous
              </button>

              {currentIndex < test.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((i) => Math.min(test.questions.length - 1, i + 1))
                  }
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleEvaluateSubmission}
                  className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                >
                  Finish &amp; Evaluate →
                </button>
              )}
            </div>

            {/* Numbered Question Palette Circles & Status Legend matching Screen 5 */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-900">
                Question Navigator
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {test.questions.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isMarked = Boolean(markedForReview[q.id]);
                  const isAnswered = Boolean(selectedAnswers[q.id]);

                  let circleStyle =
                    'bg-slate-100 text-slate-700 border border-slate-200';
                  if (isCurrent) {
                    circleStyle = 'bg-blue-600 text-white font-bold shadow-xs';
                  } else if (isMarked) {
                    circleStyle = 'bg-amber-100 text-amber-900 border border-amber-400';
                  } else if (isAnswered) {
                    circleStyle =
                      'bg-emerald-100 text-emerald-900 border border-emerald-300';
                  }

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-8 h-8 rounded-full text-xs font-mono transition-colors flex items-center justify-center ${circleStyle}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  Answered
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  Not Answered
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                  Current / Marked
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Post-Submission Instant Evaluation */
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <div className="text-xs text-slate-500">Score</div>
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  {submittedResult.score} / {submittedResult.totalMarks}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Accuracy</div>
                <div className="text-2xl font-bold font-mono tabular-nums text-blue-600">
                  {submittedResult.percentage}%
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Correct / Wrong</div>
                <div className="text-base font-bold font-mono tabular-nums text-emerald-700 mt-1">
                  {submittedResult.correctCount} / {submittedResult.incorrectCount}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const reportLines = [
                      '============================================================',
                      '         KP PHYSICS ACADEMY — OFFICIAL TEST SCORECARD       ',
                      '============================================================',
                      `Student Name   : ${submittedResult.userName}`,
                      `Examination    : ${submittedResult.testTitle} (${submittedResult.examCategory})`,
                      `Date           : ${submittedResult.submittedAt}`,
                      `Final Score    : ${submittedResult.score} / ${submittedResult.totalMarks}`,
                      `Accuracy       : ${submittedResult.percentage}%`,
                      `Correct / Wrong: ${submittedResult.correctCount} Correct, ${submittedResult.incorrectCount} Wrong, ${submittedResult.unansweredCount} Unanswered`,
                      '------------------------------------------------------------',
                      'QUESTION-BY-QUESTION ANALYSIS:',
                      ...test.questions.map((q, i) => {
                        const chosen = submittedResult.answers[q.id];
                        const isRight = chosen === q.correctOptionId;
                        return `Q${i + 1}: ${isRight ? 'CORRECT (+4)' : 'INCORRECT/SKIPPED'} | ${q.questionText}\n    Derivation: ${q.explanation}`;
                      }),
                      '============================================================'
                    ].join('\n');
                    const blob = new Blob([reportLines], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `KP-Physics-Scorecard-${submittedResult.id}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition-colors"
                >
                  ↓ Download Scorecard
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
                >
                  Close &amp; View Analytics
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {test.questions.map((q, idx) => {
                const chosen = submittedResult.answers[q.id];
                const correct = chosen === q.correctOptionId;
                return (
                  <div
                    key={q.id}
                    className="p-4 border border-slate-200 rounded-xl space-y-1.5"
                  >
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Question {idx + 1}</span>
                      <span className={correct ? 'text-emerald-600' : 'text-rose-600'}>
                        {correct ? '✓ Correct (+4)' : '✕ Incorrect / Unanswered'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-900">
                      {q.questionText}
                    </p>
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                      <strong>Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
