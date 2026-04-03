"use client"

import { Suspense, useEffect, useState, ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'

interface WebGLCanvasProps {
  children: ReactNode
  className?: string
  fallback?: ReactNode
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function WebGLCanvas({ children, className, fallback }: WebGLCanvasProps) {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setSupported(detectWebGL())
    setReducedMotion(prefersReducedMotion())
  }, [])

  useEffect(() => {
    if (supported === false || reducedMotion) {
      window.dispatchEvent(new Event('webgl-ready'))
    }
  }, [supported, reducedMotion])

  if (supported === null) return null
  if (!supported || reducedMotion) return fallback ? <>{fallback}</> : <div className="absolute inset-0 webgl-fallback" />

  return (
    <Canvas
      className={className}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 1.5]}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      onCreated={() => {
        window.dispatchEvent(new Event('webgl-ready'))
      }}
    >
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </Canvas>
  )
}
