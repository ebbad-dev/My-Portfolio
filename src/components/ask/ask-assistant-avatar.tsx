"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
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

function useElementVisibility<T extends HTMLElement>(ref: MutableRefObject<T | null>) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "160px", threshold: 0.02 },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return visible;
}

function SignalParticles({
  pointer,
  reducedMotion,
  compact,
}: {
  pointer: MutableRefObject<PointerTarget>;
  reducedMotion: boolean;
  compact: boolean;
}) {
  const particlesRef = useRef<THREE.Points>(null);
  const smooth = useRef({ x: 0, y: 0 });
  const particleBase = useMemo(() => {
    const count = compact ? 30 : 62;
    return Array.from({ length: count }, (_, index) => {
      const orbit = index % 3;
      const angle = index * 2.399963229728653;
      const radius = compact ? 1.25 + orbit * 0.18 : 1.58 + orbit * 0.42 + ((index * 11) % 18) / 70;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle * 0.93) * radius * (compact ? 0.55 : 0.62) - (compact ? 0 : 0.36),
        z: -1.08 + ((index * 7) % 36) / 21,
        phase: index * 0.37,
        speed: 0.34 + (index % 7) * 0.07,
        depth: 0.38 + (index % 5) * 0.12,
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
    if (!particlesRef.current) return;

    const targetX = pointer.current.active && !reducedMotion ? pointer.current.x : 0;
    const targetY = pointer.current.active && !reducedMotion ? pointer.current.y : 0;
    smooth.current.x += (targetX - smooth.current.x) * 0.055;
    smooth.current.y += (targetY - smooth.current.y) * 0.055;

    if (reducedMotion) return;

    const time = clock.elapsedTime;
    const attribute = particlesRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    particleBase.forEach((particle, index) => {
      const orbit = Math.sin(time * particle.speed + particle.phase);
      const side = Math.cos(time * (particle.speed * 0.86) + particle.phase);
      attribute.setXYZ(
        index,
        particle.x + side * 0.055 + smooth.current.x * particle.depth * 0.34,
        particle.y + orbit * 0.05 + smooth.current.y * particle.depth * 0.22,
        particle.z + Math.sin(time * 0.42 + particle.phase) * 0.08,
      );
    });
    attribute.needsUpdate = true;
    particlesRef.current.rotation.y = smooth.current.x * 0.1;
    particlesRef.current.rotation.x = smooth.current.y * 0.07;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={compact ? 0.028 : 0.032} color="#67e8f9" transparent opacity={compact ? 0.72 : 0.38} depthWrite={false} />
    </points>
  );
}

function HolographicPlatform({ status, compact }: { status: AssistantExpression; compact: boolean }) {
  const platformRef = useRef<THREE.Group>(null);
  const waveformRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (compact) return;
    const time = clock.elapsedTime;
    if (platformRef.current) {
      platformRef.current.rotation.y = Math.sin(time * 0.35) * 0.035;
      platformRef.current.position.y = -1.42 + Math.sin(time * 1.2) * 0.012;
    }
    if (waveformRef.current) {
      waveformRef.current.children.forEach((child, index) => {
        const mesh = child as THREE.Mesh;
        const lift = 0.36 + Math.abs(Math.sin(time * 1.8 + index * 0.7)) * 0.34;
        mesh.scale.y = lift;
      });
    }
  });

  if (compact) return null;

  const accent = status === "success" ? "#34d399" : status === "thinking" ? "#8b5cf6" : "#22d3ee";

  return (
    <group ref={platformRef} position={[0, -1.42, -0.08]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.04, 1.32, 0.1, 80, 1, true]} />
        <meshPhysicalMaterial color="#061b2a" roughness={0.18} metalness={0.42} clearcoat={1} transparent opacity={0.5} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.12, 0.014, 12, 120]} />
        <meshBasicMaterial color={accent} transparent opacity={0.56} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <torusGeometry args={[0.66, 0.009, 10, 120]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.38} />
      </mesh>
      <group ref={waveformRef} position={[0, 0.18, 0.03]}>
        {Array.from({ length: 13 }, (_, index) => (
          <mesh key={index} position={[-0.72 + index * 0.12, 0, 0.5]} scale={[0.022, 0.34, 0.022]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={index % 3 === 0 ? "#8b5cf6" : "#22d3ee"} transparent opacity={0.56} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.35, 0.36, 1]}>
        <ringGeometry args={[0.22, 1.18, 96]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function AssistantModel({
  pointer,
  status,
  reducedMotion,
  compact,
}: {
  pointer: MutableRefObject<PointerTarget>;
  status: AssistantExpression;
  reducedMotion: boolean;
  compact: boolean;
}) {
  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const leftPupilRef = useRef<THREE.Group>(null);
  const rightPupilRef = useRef<THREE.Group>(null);
  const smileRef = useRef<THREE.Mesh>(null);
  const chestCoreRef = useRef<THREE.Mesh>(null);
  const smooth = useRef({ x: 0, y: 0 });
  const eyeSmooth = useRef({ x: 0, y: 0 });

  useFrame(({ clock }) => {
    const targetX = pointer.current.active && !reducedMotion ? pointer.current.x : 0;
    const targetY = pointer.current.active && !reducedMotion ? pointer.current.y : 0;
    smooth.current.x += (targetX - smooth.current.x) * 0.075;
    smooth.current.y += (targetY - smooth.current.y) * 0.075;
    const eyeDamping = pointer.current.active && !reducedMotion ? 0.17 : 0.11;
    eyeSmooth.current.x += (targetX - eyeSmooth.current.x) * eyeDamping;
    eyeSmooth.current.y += (targetY - eyeSmooth.current.y) * eyeDamping;

    const x = smooth.current.x;
    const y = smooth.current.y;
    const eyeX = eyeSmooth.current.x;
    const eyeY = eyeSmooth.current.y;
    const time = clock.elapsedTime;
    const thinking = status === "thinking";
    const success = status === "success";
    const clicked = status === "clicked";
    const attentive = pointer.current.active && !reducedMotion;
    const blink = !reducedMotion && time % 4.7 > 4.52 ? 0.08 : 1;

    if (rootRef.current) {
      rootRef.current.rotation.y = x * (compact ? 0.18 : 0.18);
      rootRef.current.rotation.x = -y * (compact ? 0.1 : 0.11);
      rootRef.current.position.y = (compact ? 0 : -0.02) + Math.sin(time * 1.22) * (reducedMotion ? 0 : 0.032);
    }

    if (headRef.current) {
      headRef.current.rotation.y = x * 0.18;
      headRef.current.rotation.x = -y * 0.08;
      const scale = clicked ? 1.035 : thinking ? 1.018 + Math.sin(time * 5.2) * 0.01 : attentive ? 1.018 : 1;
      headRef.current.scale.setScalar(scale);
    }

    if (haloRef.current && !reducedMotion) {
      haloRef.current.rotation.z = time * (thinking ? 0.48 : 0.22);
      haloRef.current.rotation.x = 1.08 + y * 0.08;
      haloRef.current.rotation.y = x * 0.12;
    }

    const pupilX = THREE.MathUtils.clamp(eyeX * (compact ? 0.035 : 0.058), compact ? -0.035 : -0.058, compact ? 0.035 : 0.058);
    const pupilY = THREE.MathUtils.clamp(-eyeY * (compact ? 0.022 : 0.038), compact ? -0.022 : -0.038, compact ? 0.022 : 0.038);
    if (leftEyeRef.current) leftEyeRef.current.scale.set(1.08, blink * (clicked ? 1.08 : success ? 1.04 : 1), 0.28);
    if (rightEyeRef.current) rightEyeRef.current.scale.set(1.08, blink * (clicked ? 1.08 : success ? 1.04 : 1), 0.28);
    if (leftPupilRef.current) leftPupilRef.current.position.set(-0.31 + pupilX, 0.18 + pupilY, 0.715);
    if (rightPupilRef.current) rightPupilRef.current.position.set(0.31 + pupilX, 0.18 + pupilY, 0.715);

    if (smileRef.current) {
      smileRef.current.scale.set(clicked || success ? 1.08 : attentive ? 1.02 : 0.96, clicked ? 0.12 : success ? 0.11 : 0.1, 0.08);
    }

    if (chestCoreRef.current && !reducedMotion) {
      const pulse = thinking ? 1.22 + Math.sin(time * 7) * 0.14 : success ? 1.18 : 1 + Math.sin(time * 2.2) * 0.04;
      chestCoreRef.current.scale.setScalar(pulse);
    }
  });

  const eyeColor = status === "success" ? "#34d399" : status === "thinking" ? "#a78bfa" : "#14f1dc";
  const modelScale = compact ? 0.74 : 0.82;

  return (
    <group ref={rootRef} scale={modelScale} position={[0, compact ? -0.02 : 0.03, 0]}>
      <group ref={haloRef}>
        <mesh rotation={[Math.PI / 2.08, 0, 0]}>
          <torusGeometry args={[1.34, 0.009, 12, 128]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.28} />
        </mesh>
        <mesh rotation={[Math.PI / 2.72, 0.36, 0.82]}>
          <torusGeometry args={[1.72, 0.007, 10, 128]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.22} />
        </mesh>
        <mesh rotation={[Math.PI / 2.36, -0.28, -0.72]}>
          <torusGeometry args={[1.08, 0.006, 10, 96]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.18} />
        </mesh>
      </group>

      <group ref={headRef}>
        <mesh scale={[1.08, 0.92, 0.7]} position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.82, 64, 36]} />
          <meshPhysicalMaterial color="#d8f8ff" transparent opacity={0.48} roughness={0.08} metalness={0.2} clearcoat={1} transmission={0.28} thickness={0.68} />
        </mesh>
        <mesh scale={[0.88, 0.56, 0.25]} position={[0, 0.18, 0.52]}>
          <sphereGeometry args={[0.66, 64, 28]} />
          <meshStandardMaterial color="#020a14" roughness={0.12} metalness={0.48} emissive="#041526" emissiveIntensity={0.58} />
        </mesh>
        <mesh position={[0, 0.48, 0.58]} scale={[0.68, 0.036, 0.026]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.22} />
        </mesh>

        <mesh position={[-0.82, 0.16, 0.03]} scale={[0.23, 0.42, 0.22]}>
          <sphereGeometry args={[0.74, 34, 20]} />
          <meshStandardMaterial color="#0f2b70" emissive="#1d4ed8" emissiveIntensity={0.24} roughness={0.16} metalness={0.5} />
        </mesh>
        <mesh position={[0.82, 0.16, 0.03]} scale={[0.23, 0.42, 0.22]}>
          <sphereGeometry args={[0.74, 34, 20]} />
          <meshStandardMaterial color="#0f2b70" emissive="#1d4ed8" emissiveIntensity={0.24} roughness={0.16} metalness={0.5} />
        </mesh>
        <mesh position={[-0.84, 0.18, 0.3]} scale={[0.26, 0.48, 0.075]}>
          <sphereGeometry args={[0.36, 28, 18]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.42} roughness={0.12} metalness={0.18} />
        </mesh>
        <mesh position={[0.84, 0.18, 0.3]} scale={[0.26, 0.48, 0.075]}>
          <sphereGeometry args={[0.36, 28, 18]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.42} roughness={0.12} metalness={0.18} />
        </mesh>

        <mesh position={[0, 1.02, 0.02]} rotation={[0, 0, 0.22]}>
          <capsuleGeometry args={[0.026, 0.28, 8, 18]} />
          <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={0.62} roughness={0.18} />
        </mesh>
        <mesh position={[0.11, 1.18, 0.08]}>
          <sphereGeometry args={[0.052, 22, 14]} />
          <meshStandardMaterial color="#cffafe" emissive="#22d3ee" emissiveIntensity={1.05} />
        </mesh>

        <mesh ref={leftEyeRef} position={[-0.31, 0.18, 0.675]} scale={[1.04, 0.78, 0.28]}>
          <sphereGeometry args={[0.108, 34, 20]} />
          <meshPhysicalMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={status === "thinking" ? 1.55 : status === "clicked" ? 1.45 : 1.02} roughness={0.05} metalness={0.1} clearcoat={1} transparent opacity={0.86} />
        </mesh>
        <mesh position={[-0.31, 0.18, 0.711]} scale={[1.08, 0.82, 0.08]}>
          <torusGeometry args={[0.083, 0.0045, 10, 56]} />
          <meshBasicMaterial color="#8ef8ff" transparent opacity={0.34} />
        </mesh>
        <group ref={leftPupilRef} position={[-0.31, 0.18, 0.715]}>
          <mesh scale={[1, 0.82, 0.2]}>
            <sphereGeometry args={[0.056, 30, 18]} />
            <meshStandardMaterial color="#020d16" emissive="#083f48" emissiveIntensity={0.5} roughness={0.12} metalness={0.28} />
          </mesh>
          <mesh scale={[1.12, 0.88, 0.08]}>
            <torusGeometry args={[0.064, 0.006, 8, 44]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.56} />
          </mesh>
          <mesh position={[-0.02, 0.021, 0.032]} scale={[0.5, 0.42, 0.14]}>
            <sphereGeometry args={[0.019, 14, 10]} />
            <meshBasicMaterial color="#f0fdff" transparent opacity={0.82} />
          </mesh>
        </group>
        <mesh ref={rightEyeRef} position={[0.31, 0.18, 0.675]} scale={[1.04, 0.78, 0.28]}>
          <sphereGeometry args={[0.108, 34, 20]} />
          <meshPhysicalMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={status === "thinking" ? 1.55 : status === "clicked" ? 1.45 : 1.02} roughness={0.05} metalness={0.1} clearcoat={1} transparent opacity={0.86} />
        </mesh>
        <mesh position={[0.31, 0.18, 0.711]} scale={[1.08, 0.82, 0.08]}>
          <torusGeometry args={[0.083, 0.0045, 10, 56]} />
          <meshBasicMaterial color="#8ef8ff" transparent opacity={0.34} />
        </mesh>
        <group ref={rightPupilRef} position={[0.31, 0.18, 0.715]}>
          <mesh scale={[1, 0.82, 0.2]}>
            <sphereGeometry args={[0.056, 30, 18]} />
            <meshStandardMaterial color="#020d16" emissive="#083f48" emissiveIntensity={0.5} roughness={0.12} metalness={0.28} />
          </mesh>
          <mesh scale={[1.12, 0.88, 0.08]}>
            <torusGeometry args={[0.064, 0.006, 8, 44]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.56} />
          </mesh>
          <mesh position={[-0.02, 0.021, 0.032]} scale={[0.5, 0.42, 0.14]}>
            <sphereGeometry args={[0.019, 14, 10]} />
            <meshBasicMaterial color="#f0fdff" transparent opacity={0.82} />
          </mesh>
        </group>
        <mesh ref={smileRef} position={[0, -0.115, 0.69]} rotation={[0, 0, Math.PI]} scale={[0.96, 0.1, 0.08]}>
          <torusGeometry args={[0.2, 0.011, 10, 60, Math.PI]} />
          <meshBasicMaterial color={status === "success" || status === "clicked" ? "#34d399" : "#22d3ee"} transparent opacity={0.62} />
        </mesh>
      </group>

      {!compact ? (
        <group position={[0, -0.9, 0.02]}>
          <mesh scale={[0.76, 0.46, 0.5]}>
            <sphereGeometry args={[0.66, 48, 24]} />
            <meshPhysicalMaterial color="#dffbff" transparent opacity={0.34} roughness={0.12} metalness={0.18} clearcoat={1} transmission={0.2} />
          </mesh>
          <mesh position={[0, 0.02, 0.44]} scale={[0.78, 0.18, 0.07]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#041827" emissive={status === "thinking" ? "#6d28d9" : "#0891b2"} emissiveIntensity={0.38} roughness={0.22} metalness={0.32} />
          </mesh>
          <mesh ref={chestCoreRef} position={[0.34, 0.02, 0.53]}>
            <sphereGeometry args={[0.055, 18, 12]} />
            <meshBasicMaterial color={status === "success" ? "#34d399" : "#22d3ee"} transparent opacity={0.9} />
          </mesh>
          <mesh position={[-0.2, -0.02, 0.535]} scale={[0.36, 0.03, 0.02]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#67e8f9" transparent opacity={0.46} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}

function AssistantScene({
  pointer,
  status,
  reducedMotion,
  compact,
}: {
  pointer: MutableRefObject<PointerTarget>;
  status: AssistantExpression;
  reducedMotion: boolean;
  compact: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.82} />
      <hemisphereLight args={["#67e8f9", "#070a18", 0.88]} />
      <pointLight position={[2.6, 2.6, 2.8]} intensity={2.35} color="#67e8f9" />
      <pointLight position={[-2.5, 0.4, 2.4]} intensity={1.35} color="#8b5cf6" />
      <pointLight position={[0, -1.9, 2.8]} intensity={1.05} color="#22d3ee" />
      <spotLight position={[0.6, 3.2, 2.8]} angle={0.38} penumbra={0.8} intensity={1.25} color="#dffbff" />
      <SignalParticles pointer={pointer} reducedMotion={reducedMotion} compact={compact} />
      <AssistantModel pointer={pointer} status={status} reducedMotion={reducedMotion} compact={compact} />
      <HolographicPlatform status={status} compact={compact} />
    </>
  );
}

export function AskAssistantAvatar({ status = "idle", compact = false }: { status?: AskCoreStatus; compact?: boolean }) {
  const shellRef = useRef<HTMLButtonElement>(null);
  const pointer = useRef<PointerTarget>({ x: 0, y: 0, active: false });
  const [clicked, setClicked] = useState(false);
  const reducedMotion = useReducedMotion();
  const isVisible = useElementVisibility(shellRef);
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
      shell.style.setProperty("--assistant-y", `${48 + pointer.current.y * 14}%`);
      shell.style.setProperty("--assistant-tilt-x", `${pointer.current.y * -2.5}deg`);
      shell.style.setProperty("--assistant-tilt-y", `${pointer.current.x * 3}deg`);
    };
    const onPointerLeave = () => {
      pointer.current.active = false;
      shell.style.setProperty("--assistant-x", "50%");
      shell.style.setProperty("--assistant-y", "48%");
      shell.style.setProperty("--assistant-tilt-x", "0deg");
      shell.style.setProperty("--assistant-tilt-y", "0deg");
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
        compact ? "h-12 w-12 rounded-2xl" : "h-[clamp(21rem,38vw,27rem)] w-full",
        expression === "thinking" && "ask-assistant-thinking",
        expression === "success" && "ask-assistant-success",
        expression === "clicked" && "ask-assistant-clicked",
      )}
      onClick={() => setClicked(true)}
      aria-label="Interact with Ask Ebbad assistant avatar"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--assistant-x,50%)_var(--assistant-y,48%),rgba(34,211,238,0.22),transparent_44%),radial-gradient(circle_at_72%_74%,rgba(139,92,246,0.18),transparent_48%)]" />
      {!compact ? (
        <>
          <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex items-center justify-between gap-3">
            {["Guide Online", "Projects Indexed"].map((label) => (
              <span key={label} className="rounded-full border border-cyan-300/16 bg-slate-950/54 px-2.5 py-1 text-[10px] font-bold text-cyan-50/92 shadow-[0_0_16px_rgba(34,211,238,0.1)] backdrop-blur">
                {label}
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-7 bottom-4 z-10 overflow-hidden rounded-full border border-cyan-300/12 bg-slate-950/38 px-3 py-2 shadow-[0_0_28px_rgba(34,211,238,0.08)] backdrop-blur">
            <div className="flex items-center justify-between gap-3 text-[9px] font-bold uppercase tracking-[0.16em] text-cyan-100/76">
              <span>Assistant Core Active</span>
              <span className="hidden text-cyan-100/48 sm:inline">Resume Ready · Code Links Verified</span>
              <span className="text-cyan-50/82">{expression === "thinking" ? "Thinking" : expression === "success" ? "Response Ready" : "Ready"}</span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="ask-assistant-status-bar h-full w-3/5 rounded-full bg-[linear-gradient(90deg,#22d3ee,#60a5fa,#8b5cf6)]" />
            </div>
          </div>
        </>
      ) : null}
      <Canvas
        className="pointer-events-none absolute inset-0"
        camera={{ position: [0, compact ? 0.02 : -0.04, compact ? 4.55 : 4.82], fov: compact ? 40 : 34 }}
        dpr={[1, 1.45]}
        frameloop={isVisible && !reducedMotion ? "always" : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <AssistantScene pointer={pointer} status={expression} reducedMotion={reducedMotion} compact={compact} />
      </Canvas>
    </button>
  );
}
