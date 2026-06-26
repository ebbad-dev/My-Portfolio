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
    const count = compact ? 34 : 82;
    return Array.from({ length: count }, (_, index) => {
      const orbit = index % 3;
      const angle = index * 2.399963229728653;
      const radius = compact ? 1.25 + orbit * 0.18 : 1.38 + orbit * 0.38 + ((index * 11) % 22) / 64;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle * 0.93) * radius * (compact ? 0.55 : 0.66) - (compact ? 0 : 0.22),
        z: -0.78 + ((index * 7) % 38) / 19,
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
      <pointsMaterial size={compact ? 0.028 : 0.038} color="#67e8f9" transparent opacity={0.72} depthWrite={false} />
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
      platformRef.current.position.y = -1.28 + Math.sin(time * 1.2) * 0.015;
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
    <group ref={platformRef} position={[0, -1.28, -0.08]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.15, 1.42, 0.12, 80, 1, true]} />
        <meshPhysicalMaterial color="#082438" roughness={0.24} metalness={0.34} clearcoat={0.8} transparent opacity={0.58} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.22, 0.018, 12, 120]} />
        <meshBasicMaterial color={accent} transparent opacity={0.72} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <torusGeometry args={[0.74, 0.011, 10, 120]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.48} />
      </mesh>
      <group ref={waveformRef} position={[0, 0.22, 0.03]}>
        {Array.from({ length: 13 }, (_, index) => (
          <mesh key={index} position={[-0.72 + index * 0.12, 0, 0.5]} scale={[0.026, 0.42, 0.026]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={index % 3 === 0 ? "#8b5cf6" : "#22d3ee"} transparent opacity={0.56} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.35, 0.36, 1]}>
        <ringGeometry args={[0.22, 1.18, 96]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.08} side={THREE.DoubleSide} />
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
  const leftPupilRef = useRef<THREE.Mesh>(null);
  const rightPupilRef = useRef<THREE.Mesh>(null);
  const smileRef = useRef<THREE.Mesh>(null);
  const chestCoreRef = useRef<THREE.Mesh>(null);
  const smooth = useRef({ x: 0, y: 0 });

  useFrame(({ clock }) => {
    const targetX = pointer.current.active && !reducedMotion ? pointer.current.x : 0;
    const targetY = pointer.current.active && !reducedMotion ? pointer.current.y : 0;
    smooth.current.x += (targetX - smooth.current.x) * 0.075;
    smooth.current.y += (targetY - smooth.current.y) * 0.075;

    const x = smooth.current.x;
    const y = smooth.current.y;
    const time = clock.elapsedTime;
    const thinking = status === "thinking";
    const success = status === "success";
    const clicked = status === "clicked";
    const attentive = pointer.current.active && !reducedMotion;
    const blink = !reducedMotion && time % 4.7 > 4.52 ? 0.08 : 1;

    if (rootRef.current) {
      rootRef.current.rotation.y = x * (compact ? 0.18 : 0.24);
      rootRef.current.rotation.x = -y * (compact ? 0.1 : 0.16);
      rootRef.current.position.y = compact ? 0 : Math.sin(time * 1.22) * (reducedMotion ? 0 : 0.045);
    }

    if (headRef.current) {
      headRef.current.rotation.y = x * 0.18;
      headRef.current.rotation.x = -y * 0.08;
      const scale = clicked ? 1.07 : thinking ? 1.035 + Math.sin(time * 5.2) * 0.014 : attentive ? 1.035 : 1;
      headRef.current.scale.setScalar(scale);
    }

    if (haloRef.current && !reducedMotion) {
      haloRef.current.rotation.z = time * (thinking ? 0.48 : 0.22);
      haloRef.current.rotation.x = 1.08 + y * 0.08;
      haloRef.current.rotation.y = x * 0.12;
    }

    const pupilX = x * 0.055;
    const pupilY = -y * 0.036;
    if (leftEyeRef.current) leftEyeRef.current.scale.set(1.08, blink * (clicked ? 1.18 : success ? 1.08 : 1), 0.34);
    if (rightEyeRef.current) rightEyeRef.current.scale.set(1.08, blink * (clicked ? 1.18 : success ? 1.08 : 1), 0.34);
    if (leftPupilRef.current) leftPupilRef.current.position.set(-0.34 + pupilX, 0.2 + pupilY, 0.705);
    if (rightPupilRef.current) rightPupilRef.current.position.set(0.34 + pupilX, 0.2 + pupilY, 0.705);

    if (smileRef.current) {
      smileRef.current.scale.set(clicked || success ? 1.34 : attentive ? 1.16 : 1.05, clicked ? 0.24 : success ? 0.21 : 0.18, 0.1);
    }

    if (chestCoreRef.current && !reducedMotion) {
      const pulse = thinking ? 1.22 + Math.sin(time * 7) * 0.14 : success ? 1.18 : 1 + Math.sin(time * 2.2) * 0.04;
      chestCoreRef.current.scale.setScalar(pulse);
    }
  });

  const eyeColor = status === "success" ? "#34d399" : status === "thinking" ? "#a78bfa" : "#14f1dc";
  const modelScale = compact ? 0.74 : 1;

  return (
    <group ref={rootRef} scale={modelScale} position={[0, compact ? -0.02 : 0.34, 0]}>
      <group ref={haloRef}>
        <mesh rotation={[Math.PI / 2.08, 0, 0]}>
          <torusGeometry args={[1.28, 0.012, 12, 128]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.52} />
        </mesh>
        <mesh rotation={[Math.PI / 2.72, 0.36, 0.82]}>
          <torusGeometry args={[1.58, 0.009, 10, 128]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.36} />
        </mesh>
        <mesh rotation={[Math.PI / 2.36, -0.28, -0.72]}>
          <torusGeometry args={[1.02, 0.007, 10, 96]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.3} />
        </mesh>
      </group>

      <group ref={headRef}>
        <mesh scale={[1.16, 0.98, 0.76]} position={[0, 0.16, 0]}>
          <sphereGeometry args={[0.86, 64, 36]} />
          <meshPhysicalMaterial color="#dffbff" transparent opacity={0.54} roughness={0.1} metalness={0.14} clearcoat={1} transmission={0.24} thickness={0.62} />
        </mesh>
        <mesh scale={[0.98, 0.66, 0.28]} position={[0, 0.14, 0.56]}>
          <sphereGeometry args={[0.68, 64, 28]} />
          <meshStandardMaterial color="#02101d" roughness={0.16} metalness={0.32} emissive="#05243a" emissiveIntensity={0.88} />
        </mesh>
        <mesh position={[0, 0.54, 0.61]} scale={[0.84, 0.055, 0.035]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.4} />
        </mesh>

        <mesh position={[-0.92, 0.16, 0.04]} scale={[0.28, 0.48, 0.24]}>
          <sphereGeometry args={[0.74, 34, 20]} />
          <meshStandardMaterial color="#1d4ed8" emissive="#2563eb" emissiveIntensity={0.42} roughness={0.18} metalness={0.36} />
        </mesh>
        <mesh position={[0.92, 0.16, 0.04]} scale={[0.28, 0.48, 0.24]}>
          <sphereGeometry args={[0.74, 34, 20]} />
          <meshStandardMaterial color="#1d4ed8" emissive="#2563eb" emissiveIntensity={0.42} roughness={0.18} metalness={0.36} />
        </mesh>
        <mesh position={[-0.94, 0.18, 0.34]} scale={[0.34, 0.56, 0.09]}>
          <sphereGeometry args={[0.36, 28, 18]} />
          <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.68} roughness={0.14} />
        </mesh>
        <mesh position={[0.94, 0.18, 0.34]} scale={[0.34, 0.56, 0.09]}>
          <sphereGeometry args={[0.36, 28, 18]} />
          <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={0.68} roughness={0.14} />
        </mesh>

        <mesh position={[0, 1.12, 0.02]} rotation={[0, 0, 0.22]}>
          <capsuleGeometry args={[0.032, 0.34, 8, 18]} />
          <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={0.9} roughness={0.18} />
        </mesh>
        <mesh position={[0.13, 1.31, 0.08]}>
          <sphereGeometry args={[0.07, 22, 14]} />
          <meshStandardMaterial color="#ecfeff" emissive="#22d3ee" emissiveIntensity={1.8} />
        </mesh>

        <mesh ref={leftEyeRef} position={[-0.34, 0.2, 0.69]} scale={[1.08, 1, 0.34]}>
          <sphereGeometry args={[0.118, 34, 20]} />
          <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={status === "thinking" ? 3.1 : status === "clicked" ? 2.65 : 2.05} />
        </mesh>
        <mesh ref={leftPupilRef} position={[-0.34, 0.2, 0.705]} scale={[1.08, 1.08, 0.3]}>
          <sphereGeometry args={[0.054, 18, 12]} />
          <meshBasicMaterial color="#03151e" />
        </mesh>
        <mesh position={[-0.38, 0.26, 0.765]} scale={[0.44, 0.42, 0.16]}>
          <sphereGeometry args={[0.035, 14, 10]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.78} />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.34, 0.2, 0.69]} scale={[1.08, 1, 0.34]}>
          <sphereGeometry args={[0.118, 34, 20]} />
          <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={status === "thinking" ? 3.1 : status === "clicked" ? 2.65 : 2.05} />
        </mesh>
        <mesh ref={rightPupilRef} position={[0.34, 0.2, 0.705]} scale={[1.08, 1.08, 0.3]}>
          <sphereGeometry args={[0.054, 18, 12]} />
          <meshBasicMaterial color="#03151e" />
        </mesh>
        <mesh position={[0.3, 0.26, 0.765]} scale={[0.44, 0.42, 0.16]}>
          <sphereGeometry args={[0.035, 14, 10]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.78} />
        </mesh>
        <mesh ref={smileRef} position={[0, -0.12, 0.72]} rotation={[0, 0, Math.PI]} scale={[1.05, 0.18, 0.1]}>
          <torusGeometry args={[0.25, 0.019, 10, 60, Math.PI]} />
          <meshBasicMaterial color={status === "success" || status === "clicked" ? "#34d399" : "#22d3ee"} transparent opacity={0.96} />
        </mesh>
      </group>

      {!compact ? (
        <group position={[0, -0.86, 0.02]}>
          <mesh scale={[0.82, 0.48, 0.52]}>
            <sphereGeometry args={[0.66, 48, 24]} />
            <meshPhysicalMaterial color="#d7fbff" transparent opacity={0.42} roughness={0.14} metalness={0.12} clearcoat={1} transmission={0.18} />
          </mesh>
          <mesh position={[0, 0.02, 0.46]} scale={[0.92, 0.22, 0.08]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#061d31" emissive={status === "thinking" ? "#7c3aed" : "#0891b2"} emissiveIntensity={0.6} roughness={0.26} metalness={0.2} />
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
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--assistant-x,50%)_var(--assistant-y,48%),rgba(34,211,238,0.3),transparent_42%),radial-gradient(circle_at_72%_74%,rgba(139,92,246,0.22),transparent_48%)]" />
      {!compact ? (
        <>
          <div className="pointer-events-none absolute left-3 top-3 z-10 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1.5">
            {["Guide Online", "Projects Indexed", "Resume Ready", "Code Links Verified"].map((label) => (
              <span key={label} className="rounded-full border border-cyan-300/18 bg-slate-950/62 px-2.5 py-1 text-[10px] font-bold text-cyan-50 shadow-[0_0_18px_rgba(34,211,238,0.12)] backdrop-blur">
                {label}
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-5 bottom-5 z-10 overflow-hidden rounded-2xl border border-cyan-300/14 bg-slate-950/52 p-3 backdrop-blur">
            <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100/85">
              <span>Assistant Core Active</span>
              <span>{expression === "thinking" ? "Thinking" : expression === "success" ? "Response Ready" : "Ready"}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
              <div className="ask-assistant-status-bar h-full w-2/3 rounded-full bg-[linear-gradient(90deg,#22d3ee,#60a5fa,#8b5cf6)]" />
            </div>
          </div>
        </>
      ) : null}
      <Canvas
        className="pointer-events-none absolute inset-0"
        camera={{ position: [0, compact ? 0.02 : -0.06, compact ? 4.55 : 4.05], fov: compact ? 40 : 35 }}
        dpr={[1, 1.45]}
        frameloop="always"
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <AssistantScene pointer={pointer} status={expression} reducedMotion={reducedMotion} compact={compact} />
      </Canvas>
    </button>
  );
}
