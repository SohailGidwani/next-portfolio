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

export default function WebGLCanvas({ children, className, fallback }: WebGLCanvasProps) {
  const [supported, setSupported] = useState<boolean | null>(null)

  useEffect(() => {
    setSupported(detectWebGL())
  }, [])

  useEffect(() => {
    if (supported === false) {
      window.dispatchEvent(new Event('webgl-ready'))
    }
  }, [supported])

  if (supported === null) return null
  if (!supported) return fallback ?? null

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
