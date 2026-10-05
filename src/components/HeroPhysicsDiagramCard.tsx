import React, { useState } from 'react';
import { HERO_VISUAL } from '../data/physicsData';
import { Atom, Sparkles, Sliders } from 'lucide-react';
import { motion } from 'motion/react';

export const HeroPhysicsDiagramCard: React.FC<{
  onOpenSimulations: () => void;
}> = ({ onOpenSimulations }) => {
  const [overlayDiagram, setOverlayDiagram] = useState<boolean>(true);
  const [activeLaw, setActiveLaw] = useState<'RELATIVITY' | 'LORENTZ' | 'BOHR'>('RELATIVITY');

  const lawDetails = {
    RELATIVITY: {
      formula: 'E = mc² · E² = (pc)² + (m₀c²)²',
      title: 'Mass-Energy Equivalence & Relativistic Kinematics'
    },
    LORENTZ: {
      formula: 'F = q(E + v × B) · r = mv / (qB)',
      title: 'Magnetic Lorentz Force & Helical Cyclotron Orbits'
    },
    BOHR: {
      formula: 'L = n h / (2π) · ΔE = hν = E₂ - E₁',
      title: 'Quantized Atomic Orbitals & Spectral Transitions'
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-indigo-400/30 bg-[#060B19] shadow-2xl">
      {/* Main Visual Stage: Student Looking Up at Glowing Atomic Nucleus + Interactive Diagram Overlay */}
      <div className="relative h-80 sm:h-96 w-full overflow-hidden">
        <img
          src={HERO_VISUAL}
          alt="Student looking up at glowing 3D atomic orbital diagram and E = mc² equations"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-102 transition-transform duration-700"
        />

        {/* Subtle Vignette Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060B19] via-transparent to-[#060B19]/40" />

        {/* Floating Physics Formula Callouts & Orbital Diagram Overlay */}
        {overlayDiagram && (
          <svg
            viewBox="0 0 440 340"
            className="absolute inset-0 w-full h-full pointer-events-none select-none"
            aria-hidden="true"
          >
            {/* Subtle glowing orbital arc overlay */}
            <ellipse
              cx="285"
              cy="130"
              rx="115"
              ry="42"
              transform="rotate(-24 285 130)"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              strokeOpacity="0.65"
            />
            <ellipse
              cx="285"
              cy="130"
              rx="115"
              ry="42"
              transform="rotate(28 285 130)"
              fill="none"
              stroke="#FBBF24"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              strokeOpacity="0.65"
            />

            {/* Top-left floating formula */}
            <text
              x="22"
              y="46"
              fill="#93C5FD"
              fontSize="16"
              fontStyle="italic"
              fontWeight="bold"
              className="font-mono"
              opacity="0.9"
            >
              E = mc²
            </text>

            {/* Top-right vector formula */}
            <text
              x="295"
              y="34"
              fill="#FDE68A"
              fontSize="12"
              fontWeight="bold"
              className="font-mono"
              opacity="0.85"
            >
              F = q(v × B)
            </text>

            {/* Bottom-right formula */}
            <text
              x="315"
              y="265"
              fill="#FBBF24"
              fontSize="18"
              fontStyle="italic"
              fontWeight="bold"
              className="font-mono"
              opacity="0.95"
            >
              E = mc²
            </text>

            {/* Left wave equation */}
            <text
              x="18"
              y="195"
              fill="#67E8F9"
              fontSize="11"
              className="font-mono"
              opacity="0.8"
            >
              λ = h / p
            </text>
          </svg>
        )}

        {/* Top-Right Diagram Overlay Toggle Button */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setOverlayDiagram(!overlayDiagram)}
            className="px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/15 text-[11px] font-mono text-amber-300 hover:text-white transition-colors"
          >
            {overlayDiagram ? '● Vector HUD On' : '○ Vector HUD Off'}
          </button>
        </div>

        {/* Bottom Interactive Equation Switcher Dock */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'RELATIVITY', label: 'E = mc²' },
                { id: 'LORENTZ', label: 'F = q(v × B)' },
                { id: 'BOHR', label: 'L = nℏ' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveLaw(tab.id as any)}
                  className={`px-2.5 py-1 rounded-md font-mono text-xs transition-all ${
                    activeLaw === tab.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onOpenSimulations}
              className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Interactive Lab →</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2">
            <span className="text-slate-200 font-medium truncate">
              {lawDetails[activeLaw].title}
            </span>
            <span className="font-mono text-amber-400 font-bold ml-2 shrink-0">
              {lawDetails[activeLaw].formula.split('·')[0]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
