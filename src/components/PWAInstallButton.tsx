import React, { useState } from 'react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, WifiOff, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({
  compact = false
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  if (isInstalled) {
    return null;
  }

  return (
    <>
      <motion.button
        whileHover={{ y: -2, scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        type="button"
        onClick={async () => {
          if (isInstallable) {
            await install();
          } else {
            setShowGuideModal(true);
          }
        }}
        className={
          compact
            ? 'hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-cyan-400/40 bg-cyan-500/15 text-cyan-200 hover:bg-cyan-500/25 hover:border-cyan-300 transition-all whitespace-nowrap'
            : 'inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md hover:shadow-cyan-500/30 transition-all whitespace-nowrap'
        }
        title="Install KP Physics Academy App for offline formula access"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{compact ? 'Install App' : 'Install Mobile / Desktop App'}</span>
      </motion.button>

      <AnimatePresence>
        {showGuideModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              className="bg-white border border-slate-200 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl text-slate-900"
            >
              <div className="bg-gradient-to-r from-[#061029] via-[#0B1D42] to-[#112559] text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-amber-300 font-bold uppercase">
                      PROGRESSIVE WEB APP (PWA)
                    </div>
                    <h3 className="text-sm font-bold text-white">
                      Install KP Physics Academy
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGuideModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs text-slate-600">
                <p className="leading-relaxed">
                  Install <strong>KP Physics Academy</strong> on your device for instant home-screen launch and offline access to Physics formula compendiums, saved lecture notes, and simulations.
                </p>

                {isIOS ? (
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2 text-slate-800">
                    <div className="font-bold text-blue-900">
                      Install on iPhone / iPad (Safari):
                    </div>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>
                        Tap the <strong>Share</strong> button in the Safari toolbar.
                      </li>
                      <li>
                        Scroll down and tap <strong>Add to Home Screen</strong>.
                      </li>
                      <li>
                        Tap <strong>Add</strong> in the top-right corner.
                      </li>
                    </ol>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-slate-800">
                    <div className="font-bold text-slate-900">
                      How to Install on Chrome / Edge / Android:
                    </div>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>
                        Click the <strong>Install KP Physics</strong> icon in your browser’s address bar (or open the browser menu <strong>⋮ → Install app</strong>).
                      </li>
                      <li>
                        If viewing inside a preview frame, open the app in a standalone tab first to trigger native installation.
                      </li>
                    </ol>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Offline Formula Sheets
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-medium text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Standalone Full-Screen
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGuideModal(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 md:bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 shadow-lg border border-amber-300">
      <WifiOff className="w-4 h-4 animate-pulse" />
      <span>Offline Mode — Using cached Physics formulas &amp; notes</span>
    </div>
  );
};
