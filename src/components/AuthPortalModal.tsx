import React, { useState } from 'react';
import { User } from '../data/physicsData';
import {
  X,
  ShieldCheck,
  UserCheck,
  Mail,
  Lock,
  User as UserIcon,
  Atom,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type AuthModalMode = 'LOGIN' | 'REGISTER' | 'ADMIN';

interface AuthPortalModalProps {
  initialMode?: AuthModalMode;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

interface StoredAccount extends User {
  password?: string;
}

const LOCAL_ACCOUNTS_KEY = 'kp_registered_accounts_v2';

function getLocalAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    const parsed: StoredAccount[] = raw ? JSON.parse(raw) : [];
    const hasVenu = parsed.some((u) => u.email.toLowerCase() === 'venu@gmail.com');
    if (!hasVenu) {
      parsed.push({
        id: 'usr-student-1',
        name: 'Venu',
        email: 'venu@gmail.com',
        password: 'Venu@2026',
        role: 'STUDENT',
        targetExam: 'CBSE Class 12 & JEE Main',
        classLevel: 'Class 12 Science',
        streakDays: 12,
        enrolledCourseIds: [
          'course-class-12',
          'course-jee-main',
          'course-neet-physics'
        ],
        completedLessonIds: ['les-coulomb-1', 'les-gauss-2', 'les-curr-1']
      });
    }
    return parsed;
  } catch {
    return [];
  }
}

function saveLocalAccount(account: StoredAccount) {
  try {
    const list = getLocalAccounts().filter(
      (u) => u.email.toLowerCase() !== account.email.toLowerCase()
    );
    list.push(account);
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(list));
  } catch {
    // ignore storage errors
  }
}

export const AuthPortalModal: React.FC<AuthPortalModalProps> = ({
  initialMode = 'LOGIN',
  onClose,
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<AuthModalMode>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(
    initialMode === 'ADMIN' ? 'admin@kpphysics.com' : ''
  );
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [targetExam, setTargetExam] = useState('JEE Main & Advanced');
  const [classLevel, setClassLevel] = useState('Class 12 Science');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const switchTab = (nextMode: AuthModalMode) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setMode(nextMode);
    if (nextMode === 'ADMIN') {
      setEmail('admin@kpphysics.com');
      setPassword('');
    } else if (nextMode === 'LOGIN') {
      if (email === 'admin@kpphysics.com') setEmail('');
      setPassword('');
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  const handleFillAdminCredentials = () => {
    setMode('ADMIN');
    setErrorMsg(null);
    setEmail('admin@kpphysics.com');
    setPassword('Kpphysics@2026');
  };

  const handleFillStudentDemo = () => {
    setMode('LOGIN');
    setErrorMsg(null);
    setEmail('venu@gmail.com');
    setPassword('Venu@2026');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password;

    if (!cleanEmail || !cleanPassword) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    // 1. REGISTRATION FLOW
    if (mode === 'REGISTER') {
      const cleanName = name.trim();
      if (!cleanName) {
        setErrorMsg('Please enter your full name to register.');
        return;
      }
      if (cleanPassword.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (confirmPassword && cleanPassword !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please verify your password.');
        return;
      }
      if (cleanEmail === 'admin@kpphysics.com') {
        setErrorMsg(
          'This email belongs to the Administrator. Please switch to Admin Login.'
        );
        return;
      }

      setIsSubmitting(true);
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            password: cleanPassword,
            targetExam,
            classLevel
          })
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.error || 'Could not register account.');
          setIsSubmitting(false);
          return;
        }

        const createdUser: User = data.user;
        saveLocalAccount({ ...createdUser, password: cleanPassword });
        setSuccessMsg('Account created! Redirecting to your Student Dashboard...');
        setTimeout(() => {
          onLoginSuccess(createdUser);
          onClose();
        }, 500);
      } catch {
        // Fallback to localStorage registration if offline
        const existing = getLocalAccounts().find(
          (u) => u.email.toLowerCase() === cleanEmail
        );
        if (existing) {
          setErrorMsg('An account with this email already exists. Please Sign In.');
          setIsSubmitting(false);
          return;
        }
        const fallbackUser: User = {
          id: `usr-${Date.now()}`,
          name: cleanName,
          email: cleanEmail,
          role: 'STUDENT',
          targetExam,
          classLevel,
          streakDays: 1,
          enrolledCourseIds: ['course-class-12', 'course-jee-main'],
          completedLessonIds: []
        };
        saveLocalAccount({ ...fallbackUser, password: cleanPassword });
        onLoginSuccess(fallbackUser);
        onClose();
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // 2. ADMIN LOGIN OR STUDENT LOGIN FLOW
    if (mode === 'ADMIN' || cleanEmail === 'admin@kpphysics.com') {
      if (cleanEmail !== 'admin@kpphysics.com') {
        setErrorMsg('Invalid Admin ID. Use admin@kpphysics.com for Admin access.');
        return;
      }
      if (cleanPassword !== 'Kpphysics@2026') {
        setErrorMsg('Invalid Admin password. Please check your credentials.');
        return;
      }

      const adminUser: User = {
        id: 'usr-admin-1',
        name: 'Prof. K. P. Vishwanath (Admin)',
        email: 'admin@kpphysics.com',
        role: 'ADMIN',
        targetExam: 'Faculty & Curriculum Director',
        classLevel: 'Admin CMS Access',
        streakDays: 45,
        enrolledCourseIds: [
          'course-class-12',
          'course-jee-main',
          'course-neet-physics'
        ],
        completedLessonIds: ['les-coulomb-1', 'les-gauss-2', 'les-curr-1']
      };
      onLoginSuccess(adminUser);
      onClose();
      return;
    }

    // Standard Student Login
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword
        })
      });
      const data = await res.json();

      if (!res.ok) {
        // Also check localStorage accounts in case user registered locally
        const localMatch = getLocalAccounts().find(
          (u) => u.email.toLowerCase() === cleanEmail
        );
        if (localMatch && localMatch.password === cleanPassword) {
          const { password: _p, ...safeLocal } = localMatch;
          onLoginSuccess(safeLocal);
          onClose();
          return;
        }
        setErrorMsg(data.error || 'Invalid email or password.');
        setIsSubmitting(false);
        return;
      }

      onLoginSuccess(data.user);
      onClose();
    } catch {
      const localMatch = getLocalAccounts().find(
        (u) => u.email.toLowerCase() === cleanEmail
      );
      if (!localMatch) {
        setErrorMsg('No account found with this email. Please Sign Up first.');
        setIsSubmitting(false);
        return;
      }
      if (localMatch.password && localMatch.password !== cleanPassword) {
        setErrorMsg('Incorrect password. Please try again.');
        setIsSubmitting(false);
        return;
      }
      const { password: _p, ...safeLocal } = localMatch;
      onLoginSuccess(safeLocal);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="bg-white border border-slate-200/90 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 my-auto"
      >
        {/* Left Visual Showcase Column (5 cols on desktop) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#050C24] via-[#0B1942] to-[#112559] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-mono text-amber-300">
              <Atom
                className="w-4 h-4 text-sky-300 animate-spin"
                style={{ animationDuration: '8s' }}
              />
              <span>KP PHYSICS ACADEMY</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display leading-tight">
                {mode === 'ADMIN' ? (
                  <>
                    Faculty &amp; Admin{' '}
                    <span className="text-amber-400">Command Portal</span>
                  </>
                ) : mode === 'LOGIN' ? (
                  <>
                    Welcome Back,{' '}
                    <span className="text-amber-400">Future Ranker!</span>
                  </>
                ) : (
                  <>
                    Create Your{' '}
                    <span className="text-sky-300">Student Account</span>
                  </>
                )}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {mode === 'ADMIN'
                  ? 'Sign in with authorized Faculty/Admin credentials to manage courses, chapters, simulations, mock exams, and counseling inquiries.'
                  : 'Register or sign in to access interactive simulations, chapter-wise formula sheets, HD lectures, and JEE/NEET timed mock tests.'}
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {[
                {
                  text: '200+ Concept-First HD Video Lectures',
                  color: 'text-amber-400'
                },
                {
                  text: 'Interactive Projectile & Ray Optics Lab',
                  color: 'text-sky-300'
                },
                {
                  text: 'Real-Time JEE & NEET Mock Test Analytics',
                  color: 'text-emerald-300'
                },
                {
                  text: 'Chapter-Wise Formula PDF Compendiums',
                  color: 'text-orange-300'
                }
              ].map((perk) => (
                <motion.div
                  key={perk.text}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2.5 text-xs text-slate-200"
                >
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${perk.color}`} />
                  <span>{perk.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400">Trusted by</div>
              <div className="text-sm font-bold text-white font-mono">
                50,000+ Physics Students
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-400/30 font-mono text-xs text-amber-300 font-bold">
              E = mc² · F = q(v × B)
            </div>
          </div>
        </div>

        {/* Right Interactive Auth Form Column (7 cols on desktop) */}
        <div className="lg:col-span-7 p-6 sm:p-8 bg-white flex flex-col justify-between relative">
          {/* Top Mode Switcher: Sign In | Register | Admin Login */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200/80 w-full">
              {(
                [
                  { id: 'LOGIN', label: 'Student Login' },
                  { id: 'REGISTER', label: 'Register User' },
                  { id: 'ADMIN', label: 'Admin Login' }
                ] as const
              ).map((tab) => {
                const active = mode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => switchTab(tab.id)}
                    className={`relative flex-1 py-2 text-xs font-bold rounded-xl transition-colors z-10 ${
                      active ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="authTabPill"
                        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                        className={`absolute inset-0 rounded-xl -z-10 shadow-sm ${
                          tab.id === 'LOGIN'
                            ? 'bg-gradient-to-r from-blue-600 to-sky-500'
                            : tab.id === 'REGISTER'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                            : 'bg-gradient-to-r from-indigo-700 via-slate-900 to-blue-800'
                        }`}
                      />
                    )}
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <motion.button
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Quick Auto-Fill Credentials Helper Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Quick Credential Fill
              </span>
              <span className="text-[11px] font-medium text-blue-600 flex items-center gap-1">
                <KeyRound className="w-3 h-3" /> Click to auto-fill
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleFillStudentDemo}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-sky-200 bg-sky-50/70 hover:bg-sky-100/80 text-slate-900 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">Demo Student Login</div>
                  <div className="text-[10px] font-mono text-slate-600 truncate">
                    venu@gmail.com / Venu@2026
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={handleFillAdminCredentials}
                className="flex items-center gap-2.5 p-2.5 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100/80 text-slate-900 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">Admin Credentials</div>
                  <div className="text-[10px] font-mono text-slate-700 truncate">
                    admin@kpphysics.com / Kpphysics@2026
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Error / Success Feedback Alert */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-3.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-3.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'REGISTER' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {mode === 'ADMIN' ? 'Admin Email ID' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    mode === 'ADMIN'
                      ? 'admin@kpphysics.com'
                      : 'student@example.com'
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition-all"
                />
              </div>
            </div>

            <div
              className={
                mode === 'REGISTER'
                  ? 'grid grid-cols-1 sm:grid-cols-2 gap-2.5'
                  : ''
              }
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      mode === 'ADMIN'
                        ? 'Enter Admin password'
                        : 'Min. 6 characters'
                    }
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {mode === 'REGISTER' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {mode === 'REGISTER' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Select Target Exam Track
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: 'JEE Main & Adv', value: 'JEE Main & Advanced' },
                      { label: 'NEET Physics', value: 'NEET UG Physics' },
                      { label: 'Class 12 Boards', value: 'CBSE Class 12 Boards' },
                      { label: 'Class 10 / 11', value: 'Class 10 / 11 Foundation' }
                    ].map((track) => {
                      const selected = targetExam === track.value;
                      return (
                        <button
                          key={track.value}
                          type="button"
                          onClick={() => setTargetExam(track.value)}
                          className={`py-2 px-2.5 rounded-xl text-[11px] font-semibold border transition-all truncate ${
                            selected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                          }`}
                        >
                          {track.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Class / Academic Batch
                  </label>
                  <select
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Class 12 Science">Class 12 Science</option>
                    <option value="Class 11 Science">Class 11 Science</option>
                    <option value="Class 10 Foundation">Class 10 Foundation</option>
                    <option value="Dropper / Target Batch">JEE / NEET Repeater</option>
                  </select>
                </div>
              </>
            )}

            <motion.button
              whileHover={{ y: -2, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              type="submit"
              className={`w-full py-3 px-5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 mt-3 disabled:opacity-60 ${
                mode === 'LOGIN'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:shadow-blue-500/30'
                  : mode === 'REGISTER'
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:shadow-amber-500/30'
                  : 'bg-gradient-to-r from-slate-900 via-indigo-900 to-blue-800 hover:shadow-indigo-500/30'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Authenticating...'
                  : mode === 'LOGIN'
                  ? 'Sign In to Student Dashboard'
                  : mode === 'REGISTER'
                  ? 'Create Student Account & Start Learning'
                  : 'Sign In to Admin Command Center'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <div className="pt-2 text-center text-[11px] text-slate-500">
              {mode === 'LOGIN' ? (
                <>
                  New to KP Physics Academy?{' '}
                  <button
                    type="button"
                    onClick={() => switchTab('REGISTER')}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Register a new account
                  </button>
                </>
              ) : mode === 'REGISTER' ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchTab('LOGIN')}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Sign In here
                  </button>
                </>
              ) : (
                <>
                  Looking for the Student Portal?{' '}
                  <button
                    type="button"
                    onClick={() => switchTab('LOGIN')}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Switch to Student Login
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
