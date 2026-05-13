'use client'

import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <p className="text-zinc-500">Initializing Systems...</p>
    </div>
  ),
})

export default function Home() {
  const [isTraveling, setIsTraveling] = useState(false)

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* 3D Scene Background */}
      <motion.div
        animate={{
          filter: isTraveling ? 'blur(10px) brightness(1.5)' : 'blur(0px) brightness(1)',
          scale: isTraveling ? 1.1 : 1
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-0 z-0"
      >
        <Scene isTraveling={isTraveling} />
      </motion.div>

      {/* Overlay UI */}
      <AnimatePresence mode="wait">
        {!isTraveling ? (
          <motion.div
            key="initial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="pointer-events-none relative z-10 flex flex-col items-center gap-12 px-4 text-center"
          >
            <div className="flex flex-col gap-4">
              <motion.span
                initial={{ opacity: 0, letterSpacing: '1em' }}
                animate={{ opacity: 1, letterSpacing: '0.4em' }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-xs font-bold uppercase text-indigo-500"
              >
                Deep Space Exploration
              </motion.span>
              <h1 className="pointer-events-auto text-7xl font-black tracking-tighter sm:text-9xl">
                ASTRONAUT
              </h1>
            </div>

            <p className="pointer-events-auto max-w-xl text-lg font-light leading-relaxed text-zinc-400 sm:text-xl">
              A premium 3D experience built with the cutting-edge tech stack.
              Next.js, Three.js, and Framer Motion combined.
            </p>

            <motion.div
              className="pointer-events-auto flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <button
                onClick={() => setIsTraveling(true)}
                className="group relative overflow-hidden rounded-full bg-indigo-600 px-10 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-indigo-500 hover:shadow-[0_0_40px_rgba(79,70,229,0.4)]"
              >
                <span className="relative z-10">Launch Project</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              </button>
              <button className="rounded-full border border-zinc-800 bg-zinc-950/50 px-10 py-4 text-sm font-bold uppercase tracking-widest text-zinc-300 backdrop-blur-md transition-all hover:border-zinc-600 hover:text-white">
                View Specs
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="traveling"
            initial={{ opacity: 0, scale: 2, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            className="pointer-events-none relative z-20 flex flex-col items-center gap-8 text-center"
          >
            <motion.h2
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.98, 1, 0.98],
                letterSpacing: ['0.5em', '0.7em', '0.5em']
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl font-bold uppercase text-indigo-300 sm:text-6xl"
            >
              Traveling to Hyperspace
            </motion.h2>
            <button
              onClick={() => setIsTraveling(false)}
              className="pointer-events-auto rounded-full border border-indigo-500/30 bg-indigo-500/10 px-6 py-2 text-xs font-bold uppercase tracking-widest text-indigo-400 backdrop-blur-xl transition-all hover:bg-indigo-500/20"
            >
              Abort Mission
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-8 right-8 z-10 flex items-end justify-between"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-12 bg-indigo-600" />
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              System Status: Nominal
            </p>
          </div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
            <div className="flex flex-col gap-1">
              <span className="text-zinc-400">Engine</span>
              <span>R3F / Three.js</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-zinc-400">Motion</span>
              <span>Framer Motion</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-zinc-400">UI</span>
              <span>Tailwind 4</span>
            </div>
          </div>
        </div>

        <div className="hidden flex-col items-end gap-2 sm:flex">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Scroll to Explore
          </p>
          <div className="h-12 w-[1px] bg-gradient-to-b from-indigo-600 to-transparent" />
        </div>
      </motion.div>

      {/* HUD Elements */}
      <div className="pointer-events-none absolute inset-0 z-0 border-[40px] border-white/5 opacity-20" />
      <div className="pointer-events-none absolute left-10 top-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-xs font-bold">
        N
      </div>
    </main>
  )
}
