import React, { useState, useMemo } from 'react';
import { Play, RotateCcw, Sliders, Compass, Activity } from 'lucide-react';

type LabMode = 'PROJECTILE' | 'OPTICS';

export const PhysicsSimulationLab: React.FC = () => {
  const [labMode, setLabMode] = useState<LabMode>('PROJECTILE');

  // Projectile Lab State
  const [velocity, setVelocity] = useState<number>(36); // m/s
  const [angleDeg, setAngleDeg] = useState<number>(45); // degrees
  const [gravity, setGravity] = useState<number>(9.8); // m/s^2 (Earth 9.8, Moon 1.62, Jupiter 24.8)
  const [timeProgress, setTimeProgress] = useState<number>(100); // % of flight path

  // Wave Interference (YDSE) Lab State
  const [wavelengthNm, setWavelengthNm] = useState<number>(580); // nm (400 - 700)
  const [slitSeparationMm, setSlitSeparationMm] = useState<number>(0.8); // mm (0.4 - 2.0)
  const [screenDistanceM, setScreenDistanceM] = useState<number>(1.8); // m (1.0 - 3.0)

  // Projectile Physics Calculations
  const projectileStats = useMemo(() => {
    const thetaRad = (angleDeg * Math.PI) / 180;
    const vx = velocity * Math.cos(thetaRad);
    const vy0 = velocity * Math.sin(thetaRad);
    const timeOfFlight = (2 * vy0) / gravity;
    const maxHeight = (vy0 * vy0) / (2 * gravity);
    const horizontalRange = vx * timeOfFlight;
    const radiusApex = (vx * vx) / gravity;

    const currentT = (timeProgress / 100) * timeOfFlight;
    const currentX = vx * currentT;
    const currentY = Math.max(0, vy0 * currentT - 0.5 * gravity * currentT * currentT);
    const currentVy = vy0 - gravity * currentT;
    const currentSpeed = Math.sqrt(vx * vx + currentVy * currentVy);

    // Generate SVG trajectory points (scaled to 560x260 canvas)
    const maxScaleX = 220; // meters max reference
    const maxScaleY = 95;  // meters max reference
    const points: string[] = [];
    const steps = 50;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * timeOfFlight * (timeProgress / 100);
      const x = vx * t;
      const y = Math.max(0, vy0 * t - 0.5 * gravity * t * t);
      const svgX = 48 + (x / maxScaleX) * 480;
      const svgY = 235 - (y / maxScaleY) * 195;
      points.push(`${svgX.toFixed(1)},${svgY.toFixed(1)}`);
    }

    // Full ghost reference path
    const fullPoints: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * timeOfFlight;
      const x = vx * t;
      const y = Math.max(0, vy0 * t - 0.5 * gravity * t * t);
      const svgX = 48 + (x / maxScaleX) * 480;
      const svgY = 235 - (y / maxScaleY) * 195;
      fullPoints.push(`${svgX.toFixed(1)},${svgY.toFixed(1)}`);
    }

    const activeSvgX = 48 + (currentX / maxScaleX) * 480;
    const activeSvgY = 235 - (currentY / maxScaleY) * 195;

    return {
      vx,
      vy0,
      timeOfFlight,
      maxHeight,
      horizontalRange,
      radiusApex,
      currentT,
      currentX,
      currentY,
      currentVy,
      currentSpeed,
      polylinePoints: points.join(' '),
      fullPolylinePoints: fullPoints.join(' '),
      activeSvgX,
      activeSvgY
    };
  }, [velocity, angleDeg, gravity, timeProgress]);

  // YDSE Wave Interference Calculations
  const ydseStats = useMemo(() => {
    // Fringe width beta = (lambda * D) / d in mm
    // lambda in m = wavelengthNm * 1e-9, D in m = screenDistanceM, d in m = slitSeparationMm * 1e-3
    const betaMm = (wavelengthNm * 1e-9 * screenDistanceM) / (slitSeparationMm * 1e-3) * 1000;
    const angularWidthDeg = ((wavelengthNm * 1e-9) / (slitSeparationMm * 1e-3)) * (180 / Math.PI);

    // Wavelength to approximate RGB color for optical realism
    let waveColor = '#F59E0B';
    let spectralLabel = 'Yellow-Amber (Sodium D-Line)';
    if (wavelengthNm < 450) {
      waveColor = '#818CF8';
      spectralLabel = 'Violet-Indigo Spectrum';
    } else if (wavelengthNm < 500) {
      waveColor = '#38BDF8';
      spectralLabel = 'Cyan-Blue Spectrum';
    } else if (wavelengthNm < 565) {
      waveColor = '#10B981';
      spectralLabel = 'Emerald Green Spectrum';
    } else if (wavelengthNm < 610) {
      waveColor = '#F59E0B';
      spectralLabel = 'Amber-Gold Monochromatic';
    } else {
      waveColor = '#F43F5E';
      spectralLabel = 'He-Ne Red Laser Spectrum';
    }

    return {
      betaMm,
      angularWidthDeg,
      waveColor,
      spectralLabel
    };
  }, [wavelengthNm, slitSeparationMm, screenDistanceM]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Top Bar of Lab */}
      <div className="px-6 py-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800">
        <div>
          <div className="text-xs text-amber-400 font-medium">
            Interactive Physics Sandbox · Two-Zone Concept Explorer
          </div>
          <h3 className="text-lg font-semibold text-white mt-0.5">
            {labMode === 'PROJECTILE'
              ? 'Lab 01: Oblique Projectile Kinematics & Vector Decomposition'
              : 'Lab 02: Young’s Double Slit Wave Interference (YDSE)'}
          </h3>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setLabMode('PROJECTILE')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              labMode === 'PROJECTILE'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            01. Projectile Mechanics
          </button>
          <button
            type="button"
            onClick={() => setLabMode('OPTICS')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              labMode === 'OPTICS'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            02. Wave Optics (YDSE)
          </button>
        </div>
      </div>

      {/* Two-Zone Sandbox Layout: 65% Left Interactive Stage, 35% Right Control & Concept Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Interactive Canvas (7 cols on lg) */}
        <div className="lg:col-span-7 bg-[#0F172A] p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
          {labMode === 'PROJECTILE' ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs text-slate-300">
                <span>
                  Trajectory Equation:{' '}
                  <code className="font-mono text-amber-300">
                    y = x tan({angleDeg}°) - gx² / (2u²cos²({angleDeg}°))
                  </code>
                </span>
                <span className="font-mono tabular-nums text-emerald-400">
                  ● NOMINAL TRAJECTORY
                </span>
              </div>

              <div className="relative w-full bg-slate-950/80 border border-slate-800 rounded-lg p-3 overflow-hidden">
                <svg
                  viewBox="0 0 560 265"
                  className="w-full h-auto select-none"
                  role="img"
                  aria-label="Interactive Projectile Trajectory Graph"
                >
                  {/* Coordinate Grid */}
                  {[55, 100, 145, 190, 235].map((yVal) => (
                    <line
                      key={`grid-y-${yVal}`}
                      x1="48"
                      y1={yVal}
                      x2="535"
                      y2={yVal}
                      stroke="#1E293B"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                  ))}
                  {[48, 145, 242, 339, 436, 533].map((xVal) => (
                    <line
                      key={`grid-x-${xVal}`}
                      x1={xVal}
                      y1="25"
                      x2={xVal}
                      y2="235"
                      stroke="#1E293B"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                  ))}

                  {/* Axes */}
                  <line x1="48" y1="235" x2="540" y2="235" stroke="#475569" strokeWidth="1.5" />
                  <line x1="48" y1="20" x2="48" y2="235" stroke="#475569" strokeWidth="1.5" />

                  {/* Axis Labels */}
                  <text x="500" y="254" fill="#94A3B8" fontSize="10" className="font-mono">
                    x (Range m)
                  </text>
                  <text x="12" y="32" fill="#94A3B8" fontSize="10" className="font-mono">
                    y (m)
                  </text>

                  {/* Full Trajectory Ghost Reference */}
                  <polyline
                    fill="none"
                    stroke="#334155"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    points={projectileStats.fullPolylinePoints}
                  />

                  {/* Active Trajectory Curve */}
                  <polyline
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    points={projectileStats.polylinePoints}
                  />

                  {/* Velocity Vector Arrows on Particle */}
                  <line
                    x1={projectileStats.activeSvgX}
                    y1={projectileStats.activeSvgY}
                    x2={Math.min(545, projectileStats.activeSvgX + projectileStats.vx * 0.75)}
                    y2={projectileStats.activeSvgY}
                    stroke="#38BDF8"
                    strokeWidth="2"
                  />
                  <line
                    x1={projectileStats.activeSvgX}
                    y1={projectileStats.activeSvgY}
                    x2={projectileStats.activeSvgX}
                    y2={Math.max(15, Math.min(250, projectileStats.activeSvgY - projectileStats.currentVy * 0.75))}
                    stroke="#10B981"
                    strokeWidth="2"
                  />

                  {/* Projectile Particle */}
                  <circle
                    cx={projectileStats.activeSvgX}
                    cy={projectileStats.activeSvgY}
                    r="6"
                    fill="#F59E0B"
                    stroke="#FEF3C7"
                    strokeWidth="2"
                  />
                </svg>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                  <span>
                    <strong className="text-sky-400 font-mono">v_x</strong> Horizontal:{' '}
                    <span className="font-mono tabular-nums text-white">
                      {projectileStats.vx.toFixed(1)} m/s
                    </span>{' '}
                    (Constant)
                  </span>
                  <span>
                    <strong className="text-emerald-400 font-mono">v_y(t)</strong> Vertical:{' '}
                    <span className="font-mono tabular-nums text-white">
                      {projectileStats.currentVy.toFixed(1)} m/s
                    </span>
                  </span>
                  <span>
                    Instantaneous Speed <strong className="text-amber-400 font-mono">|v|</strong>:{' '}
                    <span className="font-mono tabular-nums text-white">
                      {projectileStats.currentSpeed.toFixed(1)} m/s
                    </span>
                  </span>
                </div>
              </div>

              {/* Quantitative Readout Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
                  <div className="text-xs text-slate-400">Horizontal Range (R)</div>
                  <div className="text-lg font-semibold font-mono tabular-nums text-amber-400 mt-0.5">
                    {projectileStats.horizontalRange.toFixed(1)} m
                  </div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
                  <div className="text-xs text-slate-400">Max Height (H_max)</div>
                  <div className="text-lg font-semibold font-mono tabular-nums text-white mt-0.5">
                    {projectileStats.maxHeight.toFixed(1)} m
                  </div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
                  <div className="text-xs text-slate-400">Time of Flight (T)</div>
                  <div className="text-lg font-semibold font-mono tabular-nums text-white mt-0.5">
                    {projectileStats.timeOfFlight.toFixed(2)} s
                  </div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
                  <div className="text-xs text-slate-400">Apex Curvature (r_c)</div>
                  <div className="text-lg font-semibold font-mono tabular-nums text-sky-400 mt-0.5">
                    {projectileStats.radiusApex.toFixed(1)} m
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs text-slate-300">
                <span>
                  Path Difference:{' '}
                  <code className="font-mono text-amber-300">
                    Δx = d sin θ = nλ · Fringe Width β = λD / d
                  </code>
                </span>
                <span className="font-mono tabular-nums text-sky-400">
                  ● COHERENT WAVEFRONT
                </span>
              </div>

              <div className="relative w-full bg-slate-950/80 border border-slate-800 rounded-lg p-4 overflow-hidden">
                <svg
                  viewBox="0 0 560 250"
                  className="w-full h-auto select-none"
                  role="img"
                  aria-label="Young's Double Slit Interference Diagram"
                >
                  {/* Optical Axis */}
                  <line
                    x1="30"
                    y1="125"
                    x2="470"
                    y2="125"
                    stroke="#334155"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />

                  {/* Double Slit Barrier */}
                  <line x1="90" y1="20" x2="90" y2="85" stroke="#94A3B8" strokeWidth="4" />
                  <line x1="90" y1="100" x2="90" y2="150" stroke="#94A3B8" strokeWidth="4" />
                  <line x1="90" y1="165" x2="90" y2="230" stroke="#94A3B8" strokeWidth="4" />

                  {/* Slit Sources S1 and S2 */}
                  <circle cx="90" cy="92" r="4" fill={ydseStats.waveColor} />
                  <circle cx="90" cy="158" r="4" fill={ydseStats.waveColor} />
                  <text x="65" y="96" fill="#E2E8F0" fontSize="11" className="font-mono">
                    S₁
                  </text>
                  <text x="65" y="162" fill="#E2E8F0" fontSize="11" className="font-mono">
                    S₂
                  </text>

                  {/* Expanding Wavefront Arcs */}
                  {[45, 95, 145, 195, 245, 295, 345].map((rad) => (
                    <g key={`wave-${rad}`} opacity="0.32">
                      <circle
                        cx="90"
                        cy="92"
                        r={rad}
                        fill="none"
                        stroke={ydseStats.waveColor}
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="90"
                        cy="158"
                        r={rad}
                        fill="none"
                        stroke={ydseStats.waveColor}
                        strokeWidth="1.5"
                      />
                    </g>
                  ))}

                  {/* Observation Screen & Intensity Cosine Curve */}
                  <line x1="465" y1="20" x2="465" y2="230" stroke="#64748B" strokeWidth="3" />

                  {/* Fringe Bands on Screen */}
                  {[-3, -2, -1, 0, 1, 2, 3].map((order) => {
                    const spacingPx = Math.min(34, Math.max(12, ydseStats.betaMm * 14));
                    const yPos = 125 + order * spacingPx;
                    if (yPos < 24 || yPos > 226) return null;
                    return (
                      <g key={`fringe-${order}`}>
                        <rect
                          x="472"
                          y={yPos - spacingPx * 0.28}
                          width="24"
                          height={spacingPx * 0.56}
                          rx="2"
                          fill={ydseStats.waveColor}
                        />
                        <text
                          x="505"
                          y={yPos + 3}
                          fill="#CBD5E1"
                          fontSize="9"
                          className="font-mono"
                        >
                          {order === 0 ? 'n=0 Max' : `n=${order > 0 ? `+${order}` : order}`}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                  <span>
                    Source Spectrum:{' '}
                    <strong className="text-white">{ydseStats.spectralLabel}</strong>
                  </span>
                  <span>
                    Intensity Distribution:{' '}
                    <code className="font-mono text-amber-300">I(φ) = 4 I₀ cos²(φ/2)</code>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
                  <div className="text-xs text-slate-400">Fringe Width (β)</div>
                  <div className="text-lg font-semibold font-mono tabular-nums text-amber-400 mt-0.5">
                    {ydseStats.betaMm.toFixed(3)} mm
                  </div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
                  <div className="text-xs text-slate-400">Angular Fringe Width (θ₀)</div>
                  <div className="text-lg font-semibold font-mono tabular-nums text-white mt-0.5">
                    {ydseStats.angularWidthDeg.toFixed(3)}°
                  </div>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 col-span-2 sm:col-span-1">
                  <div className="text-xs text-slate-400">3rd Bright Maxima (y₃)</div>
                  <div className="text-lg font-semibold font-mono tabular-nums text-sky-400 mt-0.5">
                    {(3 * ydseStats.betaMm).toFixed(2)} mm
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Control & Concept Deck (5 cols on lg) */}
        <div className="lg:col-span-5 p-6 bg-white flex flex-col justify-between">
          {labMode === 'PROJECTILE' ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm font-semibold text-slate-900">
                  Parameter Controls (SI Units)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setVelocity(36);
                    setAngleDeg(45);
                    setGravity(9.8);
                    setTimeProgress(100);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
              </div>

              {/* Launch Speed Slider */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <label htmlFor="slider-velocity" className="text-slate-700">
                    Initial Launch Speed (u)
                  </label>
                  <span className="font-mono tabular-nums text-slate-900 font-semibold">
                    {velocity} m/s
                  </span>
                </div>
                <input
                  id="slider-velocity"
                  type="range"
                  min={15}
                  max={45}
                  step={1}
                  value={velocity}
                  onChange={(e) => setVelocity(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-0.5">
                  <span>15 m/s</span>
                  <span>30 m/s</span>
                  <span>45 m/s</span>
                </div>
              </div>

              {/* Launch Angle Slider */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <label htmlFor="slider-angle" className="text-slate-700">
                    Projection Angle (θ)
                  </label>
                  <span className="font-mono tabular-nums text-slate-900 font-semibold">
                    {angleDeg}° {angleDeg === 45 ? '(Max Range)' : ''}
                  </span>
                </div>
                <input
                  id="slider-angle"
                  type="range"
                  min={15}
                  max={80}
                  step={1}
                  value={angleDeg}
                  onChange={(e) => setAngleDeg(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-0.5">
                  <span>15°</span>
                  <span>45° (Optimal)</span>
                  <span>80°</span>
                </div>
              </div>

              {/* Time Scrubbing Slider */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <label htmlFor="slider-time" className="text-slate-700">
                    Flight Time Inspector (t / T)
                  </label>
                  <span className="font-mono tabular-nums text-slate-900 font-semibold">
                    t = {projectileStats.currentT.toFixed(2)} s ({timeProgress}%)
                  </span>
                </div>
                <input
                  id="slider-time"
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={timeProgress}
                  onChange={(e) => setTimeProgress(Number(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>

              {/* Gravity Preset Selector */}
              <div>
                <div className="text-xs font-medium text-slate-700 mb-2">
                  Gravitational Field Environment (g)
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Earth (9.8)', val: 9.8 },
                    { label: 'Mars (3.7)', val: 3.7 },
                    { label: 'Jupiter (24.8)', val: 24.8 }
                  ].map((env) => (
                    <button
                      key={env.label}
                      type="button"
                      onClick={() => setGravity(env.val)}
                      className={`px-2.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
                        gravity === env.val
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {env.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm font-semibold text-slate-900">
                  Optical Bench Parameters
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setWavelengthNm(580);
                    setSlitSeparationMm(0.8);
                    setScreenDistanceM(1.8);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
              </div>

              {/* Wavelength Slider */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <label htmlFor="slider-lambda" className="text-slate-700">
                    Laser Wavelength (λ)
                  </label>
                  <span className="font-mono tabular-nums text-slate-900 font-semibold">
                    {wavelengthNm} nm
                  </span>
                </div>
                <input
                  id="slider-lambda"
                  type="range"
                  min={400}
                  max={700}
                  step={10}
                  value={wavelengthNm}
                  onChange={(e) => setWavelengthNm(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-0.5">
                  <span>400 nm (Violet)</span>
                  <span>550 nm (Green)</span>
                  <span>700 nm (Red)</span>
                </div>
              </div>

              {/* Slit Separation d */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <label htmlFor="slider-slit" className="text-slate-700">
                    Slit Separation (d)
                  </label>
                  <span className="font-mono tabular-nums text-slate-900 font-semibold">
                    {slitSeparationMm.toFixed(1)} mm
                  </span>
                </div>
                <input
                  id="slider-slit"
                  type="range"
                  min={0.4}
                  max={2.0}
                  step={0.1}
                  value={slitSeparationMm}
                  onChange={(e) => setSlitSeparationMm(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>

              {/* Screen Distance D */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <label htmlFor="slider-screen" className="text-slate-700">
                    Screen Distance (D)
                  </label>
                  <span className="font-mono tabular-nums text-slate-900 font-semibold">
                    {screenDistanceM.toFixed(1)} m
                  </span>
                </div>
                <input
                  id="slider-screen"
                  type="range"
                  min={1.0}
                  max={3.0}
                  step={0.2}
                  value={screenDistanceM}
                  onChange={(e) => setScreenDistanceM(Number(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Exam Concept Callout */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="text-xs font-semibold text-slate-900">
              JEE / NEET Concept Invariant
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {labMode === 'PROJECTILE'
                ? `Notice that at θ = ${angleDeg}° and its complement ${90 - angleDeg}°, horizontal range R remains identical on level ground while the ratio of maximum heights is tan²(${angleDeg}°).`
                : `When slit separation d decreases to ${slitSeparationMm.toFixed(1)} mm, fringe width β expands inversely (β ∝ 1/d), while angular fringe width θ₀ = λ/d remains independent of screen distance D.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
