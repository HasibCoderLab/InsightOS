import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Home, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'

function FloatingParticle({ delay, x, y, size, duration }) {
  return (
    <motion.div
      className="absolute rounded-full bg-violet-500/20"
      style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -30, 0],
        opacity: [0, 0.6, 0],
        scale: [0.5, 1, 0.5],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

function GlitchText() {
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 200)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      <motion.h1
        className="text-[180px] sm:text-[220px] md:text-[260px] font-black leading-none tracking-tighter select-none"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
      >
        <span className="bg-gradient-to-b from-white via-slate-300 to-slate-600 bg-clip-text text-transparent">
          4
        </span>
        <span className="bg-gradient-to-b from-violet-400 via-purple-400 to-fuchsia-600 bg-clip-text text-transparent">
          0
        </span>
        <span className="bg-gradient-to-b from-white via-slate-300 to-slate-600 bg-clip-text text-transparent">
          4
        </span>
      </motion.h1>

      {/* Glitch layers */}
      {glitch && (
        <>
          <motion.h1
            className="absolute inset-0 text-[180px] sm:text-[220px] md:text-[260px] font-black leading-none tracking-tighter text-red-500/30 select-none"
            animate={{ x: [-3, 3, -2, 2, 0] }}
            transition={{ duration: 0.2 }}
            aria-hidden
          >
            404
          </motion.h1>
          <motion.h1
            className="absolute inset-0 text-[180px] sm:text-[220px] md:text-[260px] font-black leading-none tracking-tighter text-cyan-500/30 select-none"
            animate={{ x: [3, -3, 2, -2, 0] }}
            transition={{ duration: 0.2 }}
            aria-hidden
          >
            404
          </motion.h1>
        </>
      )}

      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[100px]" />
      </div>
    </div>
  )
}

function AstronautSVG() {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-48 h-48 md:w-64 md:h-64"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
    >
      <defs>
        <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="50%" stopColor="#4c1d95" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
      </defs>

      {/* Body */}
      <motion.g
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Backpack */}
        <rect x="72" y="75" width="24" height="55" rx="8" fill="#6d28d9" />

        {/* Body suit */}
        <ellipse cx="100" cy="100" rx="32" ry="40" fill="url(#suitGrad)" />

        {/* Helmet */}
        <circle cx="100" cy="65" r="28" fill="#e2e8f0" />
        <circle cx="100" cy="65" r="22" fill="url(#visorGrad)" />

        {/* Visor reflection */}
        <ellipse cx="94" cy="60" rx="8" ry="5" fill="white" opacity="0.15" />

        {/* Backpack straps */}
        <rect x="78" y="78" width="4" height="20" rx="2" fill="#5b21b6" />
        <rect x="118" y="78" width="4" height="20" rx="2" fill="#5b21b6" />

        {/* Left arm */}
        <motion.g
          animate={{ rotate: [0, -15, 0, 15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '68px 90px' }}
        >
          <rect x="52" y="85" width="18" height="8" rx="4" fill="url(#suitGrad)" />
          <circle cx="50" cy="89" r="5" fill="#e2e8f0" />
        </motion.g>

        {/* Right arm */}
        <motion.g
          animate={{ rotate: [0, 20, 0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '132px 90px' }}
        >
          <rect x="130" y="85" width="18" height="8" rx="4" fill="url(#suitGrad)" />
          <circle cx="150" cy="89" r="5" fill="#e2e8f0" />
        </motion.g>

        {/* Left leg */}
        <motion.g
          animate={{ rotate: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '88px 130px' }}
        >
          <rect x="82" y="132" width="12" height="28" rx="6" fill="url(#suitGrad)" />
          <rect x="78" y="155" width="18" height="8" rx="4" fill="#e2e8f0" />
        </motion.g>

        {/* Right leg */}
        <motion.g
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '112px 130px' }}
        >
          <rect x="106" y="132" width="12" height="28" rx="6" fill="url(#suitGrad)" />
          <rect x="104" y="155" width="18" height="8" rx="4" fill="#e2e8f0" />
        </motion.g>
      </motion.g>

      {/* Floating stars */}
      {[
        { cx: 25, cy: 30, r: 1.5 },
        { cx: 175, cy: 45, r: 1 },
        { cx: 160, cy: 15, r: 1.5 },
        { cx: 30, cy: 170, r: 1 },
        { cx: 170, cy: 170, r: 1.2 },
      ].map((star, i) => (
        <motion.circle
          key={i}
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          fill="#a78bfa"
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      {/* Tether */}
      <motion.path
        d="M100 105 Q 120 130 140 120 Q 160 110 180 130"
        fill="none"
        stroke="#7c3aed"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        animate={{ pathLength: [0, 1] }}
        transition={{ duration: 2, delay: 1 }}
      />
    </motion.svg>
  )
}

export default function NotFoundPage() {
  const navigate = useNavigate()

  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 0.5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    duration: Math.random() * 3 + 3,
  }))

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <FloatingParticle key={p.id} {...p} />
        ))}
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Astronaut */}
        <AstronautSVG />

        {/* 404 Glitch */}
        <div className="-mt-8 mb-4">
          <GlitchText />
        </div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-md"
        >
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
            Lost in Space
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            The page you're looking for has drifted into a black hole.
            Let's get you back to familiar territory.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex items-center gap-3 mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(139,92,246,0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-slate-300 text-sm font-medium hover:bg-white/[0.1] hover:text-white transition-all duration-200"
          >
            <ArrowLeft size={16} />
            Go Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(139,92,246,0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-200"
          >
            <Home size={16} />
            Return Home
          </motion.button>
        </motion.div>

        {/* Fun fact */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-10 text-xs text-slate-600"
        >
          HTTP 404 — The requested resource could not be located on this server.
        </motion.p>
      </div>
    </div>
  )
}
