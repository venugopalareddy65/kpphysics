import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  MessageSquare,
  Sparkles,
  User as UserIcon,
  Atom,
  Zap,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactInquirySectionProps {
  defaultName?: string;
  defaultEmail?: string;
}

interface SubmittedTicket {
  id: string;
  name: string;
  email: string;
  targetExam: string;
  inquiryType: string;
  message: string;
  createdAt: string;
}

export const ContactInquirySection: React.FC<ContactInquirySectionProps> = ({
  defaultName = 'Venu',
  defaultEmail = 'venu@gmail.com'
}) => {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState('+91 98765 43210');
  const [targetExam, setTargetExam] = useState('JEE Main & Advanced');
  const [inquiryType, setInquiryType] = useState('Course & Batch Counseling');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [latestTicket, setLatestTicket] = useState<SubmittedTicket | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          targetExam,
          inquiryType,
          message
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit inquiry.');
      }
      setLatestTicket(data.ticket);
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Unable to submit inquiry at this moment.');
    } finally {
      setSubmitting(false);
    }
  };

  const examTracks = [
    {
      label: 'JEE Main & Adv',
      value: 'JEE Main & Advanced',
      activeGrad: 'from-blue-600 to-cyan-500 text-white border-cyan-300 shadow-blue-500/25',
      idleStyle: 'bg-blue-50/80 text-blue-700 border-blue-200 hover:border-blue-400'
    },
    {
      label: 'NEET UG Physics',
      value: 'NEET UG Physics',
      activeGrad: 'from-emerald-600 to-teal-500 text-white border-emerald-300 shadow-emerald-500/25',
      idleStyle: 'bg-emerald-50/80 text-emerald-700 border-emerald-200 hover:border-emerald-400'
    },
    {
      label: 'Class 12 Boards',
      value: 'CBSE Class 12 Boards',
      activeGrad: 'from-amber-500 to-orange-500 text-slate-950 border-amber-300 shadow-amber-500/25',
      idleStyle: 'bg-amber-50/80 text-amber-800 border-amber-200 hover:border-amber-400'
    },
    {
      label: 'Class 10 / 11',
      value: 'Class 10 / 11 Foundation',
      activeGrad: 'from-violet-600 to-fuchsia-600 text-white border-violet-300 shadow-violet-500/25',
      idleStyle: 'bg-violet-50/80 text-violet-700 border-violet-200 hover:border-violet-400'
    }
  ];

  const inquiryTopics = [
    {
      label: 'Course Counseling',
      value: 'Course & Batch Counseling',
      activeColor: 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-indigo-400'
    },
    {
      label: '1-on-1 Doubt Session',
      value: '1-on-1 Physics Doubt Session',
      activeColor: 'bg-gradient-to-r from-rose-500 to-orange-500 text-white border-rose-400'
    },
    {
      label: 'Mock Test Series',
      value: 'Mock Test Series Inquiry',
      activeColor: 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white border-emerald-400'
    },
    {
      label: 'Scholarship Info',
      value: 'Scholarship & Fee Details',
      activeColor: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 border-amber-300'
    }
  ];

  return (
    <motion.section
      id="sec-contact"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="relative px-6 sm:px-10 py-12 bg-gradient-to-br from-[#060E26] via-[#0D1E4C] to-[#1A1346] text-white border-t border-slate-800 overflow-hidden"
    >
      {/* Vibrant Ambient Color Orbs */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-fuchsia-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        {/* Left Column: Vibrant Multi-Color Contact Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400/20 via-cyan-400/20 to-fuchsia-400/20 border border-amber-400/40 text-[11px] font-mono font-bold text-amber-300 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>GET IN TOUCH · ACADEMIC COUNSELING</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              Contact{' '}
              <span className="bg-gradient-to-r from-amber-300 via-yellow-300 to-cyan-300 bg-clip-text text-transparent">
                KP Physics Academy
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Have questions about Class 10–12 Board batches, JEE/NEET test series, or 1-on-1 Physics doubt sessions? Connect directly with our faculty desk.
            </p>
          </div>

          <div className="space-y-3.5">
            {[
              {
                icon: Phone,
                title: 'Academic Helpline & WhatsApp',
                value: '+91 98450 11223 · Mon–Sat (8 AM – 9 PM)',
                cardGrad:
                  'from-amber-500/20 via-orange-500/10 to-slate-900/60 border-amber-400/40 hover:border-amber-300',
                iconGrad:
                  'bg-gradient-to-br from-amber-300 to-orange-500 text-slate-950 shadow-[0_0_16px_rgba(251,191,36,0.45)]',
                titleColor: 'text-amber-300'
              },
              {
                icon: Mail,
                title: 'Faculty & Doubt Resolution Desk',
                value: 'admissions@kpphysics.in · doubts@kpphysics.in',
                cardGrad:
                  'from-cyan-500/20 via-blue-500/10 to-slate-900/60 border-cyan-400/40 hover:border-cyan-300',
                iconGrad:
                  'bg-gradient-to-br from-cyan-300 to-blue-600 text-slate-950 shadow-[0_0_16px_rgba(34,211,238,0.45)]',
                titleColor: 'text-cyan-300'
              }
            ].map((item) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={item.title}
                  whileHover={{ x: 6, scale: 1.02 }}
                  className={`p-4 rounded-2xl bg-gradient-to-r ${item.cardGrad} border backdrop-blur-md transition-all flex items-center gap-4 cursor-default`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.iconGrad}`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className={`text-xs font-bold ${item.titleColor}`}>
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-200 truncate mt-0.5">
                      {item.value}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Highlight Strip */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-400/15 via-cyan-400/15 to-emerald-400/15 border border-white/15 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="text-xs font-medium text-slate-200">
                Free 1-on-1 Academic Roadmap Session for New Students
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-mono text-[10px] font-bold shrink-0">
              FREE
            </span>
          </div>
        </div>

        {/* Right Column: Colorful Interactive Contact Form Card (7 cols) */}
        <div className="lg:col-span-7 bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45)] border-2 border-white/20 relative overflow-hidden">
          {/* Rainbow Multi-Color Top Ribbon */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 via-rose-500 via-violet-500 to-cyan-400" />

          <div className="flex items-center justify-between gap-3 mb-5 pt-1">
            <div>
              <div className="text-[11px] font-mono font-bold text-indigo-600 uppercase tracking-wider">
                INSTANT COUNSELING &amp; DOUBT DESK
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Send Us a Message or Book Free Demo
              </h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-rose-500 text-white flex items-center justify-center shadow-md shrink-0">
              <Atom className="w-6 h-6 animate-spin" style={{ animationDuration: '9s' }} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {latestTicket && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-300 text-xs text-emerald-950 space-y-1.5 shadow-sm"
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="inline-flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    Inquiry Logged Successfully!
                  </span>
                  <span className="font-mono text-[11px] bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                    Ticket #{latestTicket.id}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-900">
                  Thank you, <strong>{latestTicket.name}</strong>! We have registered your request for{' '}
                  <strong>{latestTicket.targetExam}</strong> ({latestTicket.inquiryType}) and sent confirmation details to{' '}
                  <span className="underline font-semibold">{latestTicket.email}</span>.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name, Email, Phone Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-indigo-950 mb-1">
                  Student Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-indigo-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Venu"
                    className="w-full pl-9 pr-3 py-2.5 bg-indigo-50/50 border border-indigo-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-cyan-950 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-cyan-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="venu@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-cyan-50/50 border border-cyan-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-cyan-500 focus:ring-3 focus:ring-cyan-500/15 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  Phone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-3 focus:ring-amber-500/15 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Colorful Target Exam Track Selector Pills */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Select Target Exam / Curriculum Track
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {examTracks.map((track) => {
                  const active = targetExam === track.value;
                  return (
                    <motion.button
                      key={track.value}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => setTargetExam(track.value)}
                      className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition-all truncate ${
                        active
                          ? `bg-gradient-to-r ${track.activeGrad} shadow-md`
                          : track.idleStyle
                      }`}
                    >
                      {track.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Colorful Inquiry Topic Pills */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                What Can We Help You With?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {inquiryTopics.map((topic) => {
                  const active = inquiryType === topic.value;
                  return (
                    <motion.button
                      key={topic.value}
                      whileHover={{ y: -2, scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={() => setInquiryType(topic.value)}
                      className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition-all truncate ${
                        active
                          ? `${topic.activeColor} shadow-sm`
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700'
                      }`}
                    >
                      {topic.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Colorful Message Box */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Your Message or Physics Topic Doubt
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us which Physics chapters, simulations, or exam batch you'd like guidance on..."
                className="w-full px-4 py-3 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 transition-all"
              />
            </div>

            {/* Submit Bar with Multi-Stop Gradient Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Includes Free Demo Class &amp; Formula Compendium PDF</span>
              </div>

              <motion.button
                whileHover={{ y: -3, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:via-orange-400 hover:to-rose-400 text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-[0_0_24px_rgba(249,115,22,0.5)] transition-all inline-flex items-center gap-2 disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Sending Inquiry...' : 'Submit Inquiry Now'}</span>
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.section>
  );
};
