"use client"

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uScrollProgress;
uniform float uVelocity;
uniform vec2 uResolution;

#define PI 3.14159265359

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec3 iridescence(float angle) {
  return vec3(
    sin(angle) * 0.5 + 0.5,
    sin(angle + PI * 2.0 / 3.0) * 0.5 + 0.5,
    sin(angle + PI * 4.0 / 3.0) * 0.5 + 0.5
  );
}

void main() {
  vec2 uv = vUv;
  float time = uTime * 0.3;
  float scroll = uScrollProgress;
  float baseStrength = mix(0.08, 0.02, scroll);
  float velocityBoost = uVelocity * 0.1;
  float distortionStrength = baseStrength + velocityBoost;
  float n1 = snoise(uv * 3.0 + time * 0.5);
  float n2 = snoise(uv * 5.0 - time * 0.3);
  vec2 distortion = vec2(n1, n2) * distortionStrength;
  vec2 distortedUv = uv + distortion;
  float angle = atan(distortion.y, distortion.x) + time * 0.5;
  vec3 iriColor = iridescence(angle * 3.0);
  float brightness = snoise(distortedUv * 2.0 + time * 0.2) * 0.5 + 0.5;
  brightness = pow(brightness, 2.0);
  float alpha = brightness * mix(0.15, 0.06, scroll);
  vec3 color = iriColor * brightness;
  gl_FragColor = vec4(color, alpha);
}
`

interface LiquidGlassShaderProps {
  scrollProgress?: number
  velocity?: number
}

export default function LiquidGlassShader({ scrollProgress = 0, velocity = 0 }: LiquidGlassShaderProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScrollProgress: { value: 0 },
      uVelocity: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    []
  )

  useFrame((state) => {
    if (!meshRef.current) return
    const material = meshRef.current.material as THREE.ShaderMaterial
    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uScrollProgress.value = scrollProgress
    material.uniforms.uVelocity.value = velocity
    material.uniforms.uResolution.value.set(viewport.width, viewport.height)
  })

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}
