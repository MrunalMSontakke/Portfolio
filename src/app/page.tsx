'use client'

import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <p className="text-zinc-500">Loading 3D Scene...</p>
    </div>
  ),
})

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      {/* Overlay UI */}
      <div className="pointer-events-none relative z-10 flex flex-col items-center gap-8 px-4 text-center">
        <h1 className="pointer-events-auto text-6xl font-bold tracking-tighter sm:text-8xl">
          Amazing 3D Website
        </h1>
        <p className="pointer-events-auto max-w-2xl text-lg text-zinc-400 sm:text-xl">
          Built with Next.js, Three.js, React Three Fiber, and Tailwind CSS.
          Interact with the 3D sphere by hovering, clicking, and dragging.
        </p>
        <div className="pointer-events-auto flex gap-4">
          <button className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-transform hover:scale-105">
            Explore More
          </button>
          <button className="rounded-full border border-zinc-700 bg-zinc-900/50 px-8 py-3 text-sm font-semibold backdrop-blur-sm transition-transform hover:scale-105">
            Documentation
          </button>
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-8 left-8 z-10 hidden flex-col gap-1 sm:flex">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
          Powered by
        </p>
        <div className="flex gap-4 text-sm font-semibold">
          <span>Three.js</span>
          <span>Next.js</span>
          <span>Tailwind CSS</span>
        </div>
      </div>
    </main>
  )
}
