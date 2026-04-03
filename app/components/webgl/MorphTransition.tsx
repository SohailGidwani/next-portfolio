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
uniform float uProgress;
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
  float time = uTime * 0.4;

  float edgeDist = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
  float transitionActive = 1.0 - pow(abs(uProgress * 2.0 - 1.0), 2.0);

  float n1 = snoise(uv * 4.0 + time);
  float n2 = snoise(uv * 8.0 - time * 0.7);
  float noise = (n1 + n2 * 0.5) * 0.667;

  float dissolve = smoothstep(-0.3, 0.3, noise - (uProgress * 2.0 - 1.0));

  float edgeMask = smoothstep(0.0, 0.05, abs(dissolve - 0.5));
  float edgeGlow = (1.0 - edgeMask) * transitionActive;

  float angle = atan(uv.y - 0.5, uv.x - 0.5) + time * 0.3 + noise * 2.0;
  vec3 iriColor = iridescence(angle * 2.0);

  vec3 color = iriColor * edgeGlow;
  float alpha = edgeGlow * 0.25 * transitionActive;

  gl_FragColor = vec4(color, alpha);
}
`

interface MorphTransitionProps {
  progress?: number
}

export default function MorphTransition({ progress = 0 }: MorphTransitionProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    []
  )

  useFrame((state) => {
    if (!meshRef.current) return
    const material = meshRef.current.material as THREE.ShaderMaterial
    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uProgress.value = progress
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
