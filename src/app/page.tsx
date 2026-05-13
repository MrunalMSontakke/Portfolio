"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Scene from "@/components/Scene";

export default function Home() {
  const [isTraveling, setIsTraveling] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showBriefing, setShowBriefing] = useState(false);
  const [logs, setLogs] = useState<string[]>(["SYSTEM READY", "OS: NEBULA-v4.2.0", "WAITING FOR INPUT..."]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const handleLaunch = () => {
    setCountdown(3);
    addLog("HYPERDRIVE SEQUENCE INITIATED");
  };

  useEffect(() => {
    if (countdown !== null) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        addLog(`T-MINUS 0${countdown}`);
        return () => clearTimeout(timer);
      } else {
        setCountdown(null);
        setIsTraveling(true);
        addLog("DRIVE ACTIVE - VELOCITY MAX");
      }
    }
  }, [countdown]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-12), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    if (isTraveling) {
      const interval = setInterval(() => {
        const msgs = ["VIBRATION NOMINAL", "SHIELD STRENGTH 99%", "SYNCHRONIZING...", "NEBULA DETECTED", "CORE TEMPERATURE: 4000K"];
        addLog(msgs[Math.floor(Math.random() * msgs.length)]);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isTraveling]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-black text-white selection:bg-indigo-500/30">
      <Scene isTraveling={isTraveling} />

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between p-8 md:p-12">
        <div className="flex items-center gap-6">
          <div className="h-8 w-8 rounded-lg bg-white p-1">
            <div className="h-full w-full rounded-sm bg-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400">Project</span>
            <span className="font-bold tracking-tight">NEBULA X</span>
          </div>
        </div>

        <div className="hidden items-center gap-12 md:flex">
          {['Telemetry', 'Archives', 'Systems', 'Safety'].map((item) => (
            <button key={item} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-white">
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden flex-col items-end md:flex">
              <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-600">Sync Status</span>
              <span className="text-[10px] font-mono font-bold text-emerald-500">ENCRYPTED // LINK-01</span>
           </div>
           <button className="h-10 w-10 rounded-full border border-white/5 bg-white/5 p-2 backdrop-blur-md transition-colors hover:bg-white/10">
            <div className="flex h-full w-full flex-col justify-center gap-1">
              <div className="h-[1px] w-full bg-white" />
              <div className="h-[1px] w-2/3 bg-white" />
            </div>
          </button>
        </div>
      </nav>

      {/* Sidebar Logs */}
      <div className="pointer-events-none absolute left-8 top-1/2 z-20 hidden w-64 -translate-y-1/2 flex-col gap-4 md:flex">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Console Output</span>
        <div
          ref={logContainerRef}
          className="h-64 space-y-2 overflow-hidden font-mono text-[9px] leading-tight text-zinc-500"
        >
          {logs.map((log, i) => (
            <div key={i} className={i === logs.length - 1 ? "text-indigo-400" : ""}>
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {countdown !== null && (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 2 }}
              className="absolute flex h-full w-full items-center justify-center pointer-events-none"
            >
              <span className="font-mono text-[20vw] font-black leading-none text-white/5">
                0{countdown}
              </span>
            </motion.div>
          )}

          {!isTraveling && countdown === null ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40, filter: 'blur(20px)' }}
              className="flex max-w-4xl flex-col items-center gap-12 text-center"
            >
              <div className="flex flex-col gap-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '80px' }}
                  className="mx-auto h-[2px] bg-indigo-500"
                />
                <h1 className="text-6xl font-black tracking-tighter uppercase sm:text-8xl md:text-9xl">
                  NEBULA<br/>
                  <span className="text-zinc-500">X-RAY</span>
                </h1>
              </div>

              <p className="max-w-2xl text-balance text-lg font-medium leading-relaxed text-zinc-400 sm:text-xl">
                The next frontier of spatial computing. Nebula X is an experimental platform
                integrating real-time telemetry with immersive 3D architecture.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={handleLaunch}
                  className="group relative h-16 w-64 overflow-hidden rounded-xl bg-white text-black transition-transform active:scale-95"
                >
                  <div className="absolute inset-0 bg-indigo-600 transition-transform duration-500 group-hover:translate-y-[-100%]" />
                  <span className="relative z-10 flex h-full items-center justify-center text-xs font-black uppercase tracking-[0.2em]">
                    Initiate Drive
                  </span>
                </button>
                <button
                  onClick={() => setShowBriefing(true)}
                  className="h-16 w-64 rounded-xl border border-white/10 bg-white/5 text-xs font-black uppercase tracking-[0.2em] backdrop-blur-xl transition-colors hover:bg-white/10"
                >
                  Project Briefing
                </button>
              </div>
            </motion.div>
          ) : isTraveling && (
            <motion.div
              key="traveling"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-12"
            >
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ scaleX: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-1 w-64 bg-indigo-500"
                />
                <h2 className="text-xs font-black uppercase tracking-[1em] text-indigo-400">
                  Hyperspace Active
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {[
                  { label: 'Velocity', value: '78,400 km/s' },
                  { label: 'Integrity', value: '99.2%' },
                  { label: 'Target', value: 'Sector 7G' },
                  { label: 'ETA', value: '2.1m' }
                ].map((stat, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={stat.label}
                    className="flex flex-col items-center gap-1 border-l border-white/10 pl-4 text-left"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{stat.label}</span>
                    <span className="font-mono text-sm font-bold">{stat.value}</span>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => {
                  setIsTraveling(false);
                  addLog("MISSION ABORTED BY USER");
                }}
                className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 transition-colors hover:text-white"
              >
                [ DISENGAGE ]
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Project Briefing Modal */}
      <AnimatePresence>
        {showBriefing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-8 md:p-12"
            >
              <button
                onClick={() => setShowBriefing(false)}
                className="absolute right-8 top-8 text-zinc-500 hover:text-white"
              >
                ✕
              </button>

              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">Document 01-A</span>
                  <h3 className="text-3xl font-bold tracking-tight">Mission Architecture</h3>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">The Objective</h4>
                    <p className="text-sm leading-relaxed text-zinc-500">
                      To explore the boundaries of web-based 3D environments, implementing high-performance shaders and motion systems.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Stack</h4>
                    <ul className="space-y-2 text-sm text-indigo-400/80 font-mono">
                      <li>• Next.js App Router (Turbo)</li>
                      <li>• React Three Fiber / Drei</li>
                      <li>• Framer Motion 12</li>
                      <li>• Tailwind CSS 4</li>
                    </ul>
                  </div>
                </div>

                <div className="h-[1px] w-full bg-white/5" />

                <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                  Classified Nebula X Research // Station 09
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer info */}
      <footer className="relative z-20 flex items-end justify-between p-8 md:p-12">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-8 bg-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Station 09 // Orbital Path
            </span>
          </div>
          <div className="font-mono text-[10px] text-zinc-600">
            LOC: 40.7128° N, 74.0060° W
          </div>
        </div>

        <div className="flex flex-col items-end gap-4 text-right">
          <div className="flex gap-4">
            {['Twitter', 'GitHub', 'Discord'].map(social => (
              <button key={social} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                {social}
              </button>
            ))}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-700">
            © 2025 NEBULA X CORP
          </p>
        </div>
      </footer>

      {/* Background Gradients */}
      <div className="pointer-events-none absolute -left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-[10%] bottom-[10%] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />
    </main>
  )
}
