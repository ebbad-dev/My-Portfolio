"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import type { AskCoreStatus } from "@/components/ask/types";

type PointerTarget = {
  x: number;
  y: number;
  active: boolean;
};

type AssistantExpression = AskCoreStatus | "clicked";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function AssistantScene({
  pointer,
  status,
  reducedMotion,
  compact,
}: {
  pointer: React.MutableRefObject<PointerTarget>;
  status: AssistantExpression;
  reducedMotion: boolean;
  compact: boolean;
}) {
  const headRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const leftPupilRef = useRef<THREE.Mesh>(null);
  const rightPupilRef = useRef<THREE.Mesh>(null);
  const smileRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const smooth = useRef({ x: 0, y: 0 });
  const particleBase = useMemo(() => {
    const count = compact ? 36 : 56;
    return Array.from({ length: count }, (_, index) => {
      const angle = index * 2.399963229728653;
      const radius = 1.45 + ((index * 13) % 40) / 30;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius * 0.72,
        z: -0.9 + ((index * 7) % 28) / 18,
        phase: index * 0.41,
        speed: 0.62 + (index % 6) * 0.08,
        depth: 0.55 + (index % 5) * 0.12,
      };
    });
  }, [compact]);
  const positions = useMemo(() => {
    const values = new Float32Array(particleBase.length * 3);
    particleBase.forEach((particle, index) => {
      values[index * 3] = particle.x;
      values[index * 3 + 1] = particle.y;
      values[index * 3 + 2] = particle.z;
    });
    return values;
  }, [particleBase]);

  useFrame(({ clock }) => {
    const targetX = pointer.current.active && !reducedMotion ? pointer.current.x : 0;
    const targetY = pointer.current.active && !reducedMotion ? pointer.current.y : 0;
    smooth.current.x += (targetX - smooth.current.x) * 0.08;
    smooth.current.y += (targetY - smooth.current.y) * 0.08;

    const x = smooth.current.x;
    const y = smooth.current.y;
    const time = clock.elapsedTime;
    const thinking = status === "thinking";
    const success = status === "success";
    const clicked = status === "clicked";
    const blink = !reducedMotion && time % 4.4 > 4.22 ? 0.12 : 1;

    if (headRef.current) {
      headRef.current.rotation.y = x * 0.28;
      headRef.current.rotation.x = -y * 0.18;
      headRef.current.position.y = (reducedMotion ? 0 : Math.sin(time * 1.35) * 0.035) + (success || clicked ? 0.035 : 0);
      const scale = clicked ? 1.035 : thinking ? 1 + Math.sin(time * 5) * 0.018 : 1;
      headRef.current.scale.setScalar(scale);
    }

    if (haloRef.current && !reducedMotion) {
      haloRef.current.rotation.z = time * (thinking ? 0.38 : 0.18);
      haloRef.current.rotation.x = 1.12 + y * 0.06;
      haloRef.current.rotation.y = x * 0.08;
    }

    const pupilX = x * 0.045;
    const pupilY = -y * 0.035;
    if (leftEyeRef.current) leftEyeRef.current.scale.set(1, blink * (clicked ? 1.12 : 1), 0.32);
    if (rightEyeRef.current) rightEyeRef.current.scale.set(1, blink * (clicked ? 1.12 : 1), 0.32);
    if (leftPupilRef.current) {
      leftPupilRef.current.position.set(-0.28 + pupilX, 0.14 + pupilY, 0.548);
      leftPupilRef.current.scale.setScalar(clicked ? 1.15 : 1);
    }
    if (rightPupilRef.current) {
      rightPupilRef.current.position.set(0.28 + pupilX, 0.14 + pupilY, 0.548);
      rightPupilRef.current.scale.setScalar(clicked ? 1.15 : 1);
    }
    if (smileRef.current) {
      smileRef.current.scale.set(clicked || success ? 1.16 : 1, clicked ? 0.2 : 0.16, 0.1);
    }

    if (particlesRef.current && !reducedMotion) {
      const attribute = particlesRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
      particleBase.forEach((particle, index) => {
        const drift = Math.sin(time * particle.speed + particle.phase) * 0.045;
        attribute.setXYZ(
          index,
          particle.x + x * particle.depth * 0.24 + Math.cos(time * particle.speed + particle.phase) * 0.04,
          particle.y + y * particle.depth * 0.18 + drift,
          particle.z + Math.sin(time * 0.7 + particle.phase) * 0.045,
        );
      });
      attribute.needsUpdate = true;
      particlesRef.current.rotation.y = x * 0.08;
      particlesRef.current.rotation.x = y * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={0.9} />
      <pointLight position={[2.4, 2.4, 2.8]} intensity={1.8} color="#67e8f9" />
      <pointLight position={[-2.2, -1.8, 2.2]} intensity={1.2} color="#8b5cf6" />
      <group ref={haloRef}>
        <mesh rotation={[Math.PI / 2.05, 0, 0]}>
          <torusGeometry args={[1.34, 0.01, 12, 96]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.42} />
        </mesh>
        <mesh rotation={[Math.PI / 2.6, 0.25, 0.8]}>
          <torusGeometry args={[1.72, 0.008, 10, 96]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
        </mesh>
      </group>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={compact ? 0.035 : 0.045} color="#67e8f9" transparent opacity={0.74} depthWrite={false} />
      </points>
      <group ref={headRef}>
        <mesh scale={[1.08, 0.9, 0.66]} position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.82, 48, 32]} />
          <meshPhysicalMaterial color="#dffbff" transparent opacity={0.38} roughness={0.18} metalness={0.14} clearcoat={1} transmission={0.3} thickness={0.42} />
        </mesh>
        <mesh position={[0, 0.98, 0.02]} rotation={[0, 0, 0.25]}>
          <capsuleGeometry args={[0.035, 0.32, 8, 16]} />
          <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={0.85} roughness={0.22} />
        </mesh>
        <mesh position={[0.13, 1.16, 0.08]}>
          <sphereGeometry args={[0.065, 18, 12]} />
          <meshStandardMaterial color="#a5f3fc" emissive="#22d3ee" emissiveIntensity={1.6} />
        </mesh>
        <mesh scale={[0.9, 0.54, 0.2]} position={[0, 0.08, 0.45]}>
          <sphereGeometry args={[0.64, 48, 24]} />
          <meshStandardMaterial color="#03111f" roughness={0.24} metalness={0.18} emissive="#061827" emissiveIntensity={0.75} />
        </mesh>
        <mesh ref={leftEyeRef} position={[-0.28, 0.15, 0.535]} scale={[1, 1, 0.32]}>
          <sphereGeometry args={[0.105, 28, 18]} />
          <meshStandardMaterial color="#14f1dc" emissive="#14f1dc" emissiveIntensity={status === "thinking" ? 2.8 : status === "clicked" ? 2.45 : 1.75} />
        </mesh>
        <mesh ref={leftPupilRef} position={[-0.28, 0.14, 0.548]} scale={[1, 1, 0.3]}>
          <sphereGeometry args={[0.046, 18, 12]} />
          <meshBasicMaterial color="#052b32" />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.28, 0.15, 0.535]} scale={[1, 1, 0.32]}>
          <sphereGeometry args={[0.105, 28, 18]} />
          <meshStandardMaterial color="#14f1dc" emissive="#14f1dc" emissiveIntensity={status === "thinking" ? 2.8 : status === "clicked" ? 2.45 : 1.75} />
        </mesh>
        <mesh ref={rightPupilRef} position={[0.28, 0.14, 0.548]} scale={[1, 1, 0.3]}>
          <sphereGeometry args={[0.046, 18, 12]} />
          <meshBasicMaterial color="#052b32" />
        </mesh>
        <mesh ref={smileRef} position={[0, -0.15, 0.548]} rotation={[0, 0, 0]} scale={[1, 0.16, 0.1]}>
          <torusGeometry args={[0.22, 0.018, 10, 48, Math.PI]} />
          <meshBasicMaterial color={status === "success" || status === "clicked" ? "#34d399" : "#22d3ee"} transparent opacity={0.94} />
        </mesh>
        <mesh position={[0, -0.82, 0.02]} scale={[0.68, 0.38, 0.42]}>
          <sphereGeometry args={[0.62, 40, 20]} />
          <meshPhysicalMaterial color="#c8f7ff" transparent opacity={0.28} roughness={0.2} metalness={0.1} clearcoat={1} transmission={0.22} />
        </mesh>
        <mesh position={[0, -0.83, 0.4]} scale={[0.7, 0.24, 0.08]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#062235" emissive={status === "thinking" ? "#7c3aed" : "#0891b2"} emissiveIntensity={0.55} roughness={0.3} />
        </mesh>
      </group>
    </>
  );
}

export function AskAssistantAvatar({ status = "idle", compact = false }: { status?: AskCoreStatus; compact?: boolean }) {
  const shellRef = useRef<HTMLButtonElement>(null);
  const pointer = useRef<PointerTarget>({ x: 0, y: 0, active: false });
  const [clicked, setClicked] = useState(false);
  const reducedMotion = useReducedMotion();
  const expression: AssistantExpression = clicked ? "clicked" : status;

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const onPointerMove = (event: PointerEvent) => {
      const rect = shell.getBoundingClientRect();
      pointer.current.x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
      pointer.current.y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
      pointer.current.active = true;
      shell.style.setProperty("--assistant-x", `${50 + pointer.current.x * 16}%`);
      shell.style.setProperty("--assistant-y", `${48 + pointer.current.y * 12}%`);
    };
    const onPointerLeave = () => {
      pointer.current.active = false;
      shell.style.setProperty("--assistant-x", "50%");
      shell.style.setProperty("--assistant-y", "48%");
    };

    shell.addEventListener("pointermove", onPointerMove);
    shell.addEventListener("pointerleave", onPointerLeave);
    return () => {
      shell.removeEventListener("pointermove", onPointerMove);
      shell.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  useEffect(() => {
    if (!clicked) return;
    const timer = window.setTimeout(() => setClicked(false), 850);
    return () => window.clearTimeout(timer);
  }, [clicked]);

  return (
    <button
      type="button"
      ref={shellRef}
      className={cn(
        "ask-assistant-card relative isolate min-w-0 max-w-full overflow-hidden rounded-3xl border border-cyan-300/15 bg-slate-950/70 text-left focus:outline-none focus:ring-2 focus:ring-cyan-200/70",
        compact ? "h-12 w-12 rounded-2xl" : "h-[clamp(11rem,24vw,15.5rem)] w-full",
        expression === "thinking" && "ask-assistant-thinking",
        expression === "success" && "ask-assistant-success",
        expression === "clicked" && "ask-assistant-clicked",
      )}
      onClick={() => setClicked(true)}
      aria-label="Interact with Ask Ebbad assistant avatar"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--assistant-x,50%)_var(--assistant-y,48%),rgba(34,211,238,0.26),transparent_42%),radial-gradient(circle_at_72%_72%,rgba(139,92,246,0.2),transparent_48%)]" />
      {!compact ? (
        <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
          {["Portfolio Guide Online", "Projects Indexed", "Resume Ready"].map((label) => (
            <span key={label} className="rounded-full border border-cyan-300/18 bg-slate-950/62 px-2.5 py-1 text-[10px] font-bold text-cyan-50 shadow-[0_0_18px_rgba(34,211,238,0.12)] backdrop-blur">
              {label}
            </span>
          ))}
        </div>
      ) : null}
      <Canvas
        className="pointer-events-none absolute inset-0"
        camera={{ position: [0, 0, compact ? 4.8 : 4.2], fov: compact ? 42 : 38 }}
        dpr={[1, 1.45]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <AssistantScene pointer={pointer} status={expression} reducedMotion={reducedMotion} compact={compact} />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-4 bottom-3 hidden items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-950/58 px-3 py-1.5 text-[10px] font-semibold text-slate-300 backdrop-blur sm:flex">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
        Ask Ebbad AI Console
      </div>
    </button>
  );
}
