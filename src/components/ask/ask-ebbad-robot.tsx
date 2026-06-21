"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Stars } from "@react-three/drei";
import { forwardRef, useEffect, useRef, useState, type MutableRefObject } from "react";
import { MathUtils, type Group } from "three";
import { Bot, CheckCircle2, Code2, FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AskRobotStatus } from "@/components/ask/types";

const statusChips = [
  { label: "AI Guide Live", icon: Sparkles },
  { label: "Projects Indexed", icon: CheckCircle2 },
  { label: "Resume Ready", icon: FileText },
  { label: "Code Links Verified", icon: Code2 },
] as const;

export function AskEbbadRobot({ status = "idle", compact = false }: { status?: AskRobotStatus; compact?: boolean }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const [staticMode, setStaticMode] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const update = () => setStaticMode(reduced.matches || coarse.matches || window.innerWidth < 768);
    update();
    reduced.addEventListener("change", update);
    coarse.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      reduced.removeEventListener("change", update);
      coarse.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const node = shellRef.current;
    if (!node || staticMode) return;

    const move = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      pointer.current.x = MathUtils.clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1);
      pointer.current.y = MathUtils.clamp(((event.clientY - rect.top) / rect.height - 0.5) * -2, -1, 1);
      pointer.current.active = true;
    };
    const leave = () => {
      pointer.current.active = false;
    };

    node.addEventListener("pointermove", move);
    node.addEventListener("pointerleave", leave);
    return () => {
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerleave", leave);
    };
  }, [staticMode]);

  return (
    <div
      ref={shellRef}
      className={cn(
        "robot-panel premium-card relative isolate overflow-hidden rounded-3xl border border-cyan-300/15 bg-slate-950/72 shadow-[0_24px_70px_rgba(0,0,0,0.35)]",
        compact ? "min-h-0 p-0" : "min-h-[27rem] p-5 sm:p-6",
      )}
      aria-hidden="true"
    >
      <RobotBackdrop />
      {!compact ? <RobotStatusChips status={status} /> : null}
      <div className={cn("relative z-10", compact ? "h-full" : "h-[25rem] sm:h-[28rem]")}>
        {staticMode ? <StaticRobot status={status} /> : <RobotCanvas pointer={pointer} status={status} />}
      </div>
      {!compact ? (
        <div className="relative z-10 -mt-3 flex items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-center text-xs font-semibold text-slate-300 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.9)]" />
          Portfolio AI Guide
        </div>
      ) : null}
    </div>
  );
}

function RobotCanvas({ pointer, status }: { pointer: MutableRefObject<{ x: number; y: number; active: boolean }>; status: AskRobotStatus }) {
  return (
    <Canvas camera={{ position: [0, 0.15, 6.2], fov: 42 }} dpr={[1, 1.55]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[2.8, 4.2, 5]} intensity={2.35} color="#E0F7FF" />
      <pointLight position={[2.8, 1.4, 3]} intensity={35} color="#22D3EE" />
      <pointLight position={[-3, -1.2, 2.6]} intensity={22} color="#8B5CF6" />
      <Stars radius={14} depth={8} count={180} factor={1.2} fade speed={0.16} />
      <RobotModel pointer={pointer} status={status} />
    </Canvas>
  );
}

function RobotModel({ pointer, status }: { pointer: MutableRefObject<{ x: number; y: number; active: boolean }>; status: AskRobotStatus }) {
  const root = useRef<Group>(null);
  const head = useRef<Group>(null);
  const leftPupil = useRef<Group>(null);
  const rightPupil = useRef<Group>(null);
  const smile = useRef<Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;
    target.current.x = MathUtils.lerp(target.current.x, pointer.current.active ? pointer.current.x : 0, 1 - Math.exp(-delta * 7.5));
    target.current.y = MathUtils.lerp(target.current.y, pointer.current.active ? pointer.current.y : 0, 1 - Math.exp(-delta * 7.5));

    if (root.current) {
      root.current.position.y = Math.sin(elapsed * 1.12) * 0.065;
      root.current.rotation.y = MathUtils.lerp(root.current.rotation.y, target.current.x * 0.12, 1 - Math.exp(-delta * 4));
    }
    if (head.current) {
      head.current.rotation.x = MathUtils.lerp(head.current.rotation.x, target.current.y * -0.09, 1 - Math.exp(-delta * 4));
      head.current.rotation.z = Math.sin(elapsed * 0.8) * 0.018;
    }
    [leftPupil.current, rightPupil.current].forEach((pupil) => {
      if (!pupil) return;
      pupil.position.x = MathUtils.lerp(pupil.position.x, target.current.x * 0.09, 1 - Math.exp(-delta * 8));
      pupil.position.y = MathUtils.lerp(pupil.position.y, target.current.y * 0.075, 1 - Math.exp(-delta * 8));
    });
    if (smile.current) {
      const glow = status === "thinking" ? Math.sin(elapsed * 7) * 0.045 : status === "success" ? 0.06 : Math.sin(elapsed * 1.8) * 0.02;
      smile.current.scale.set(1 + glow, 1 + glow * 0.35, 1);
    }
  });

  const accent = status === "success" ? "#34D399" : status === "thinking" ? "#A78BFA" : "#22D3EE";

  return (
    <group ref={root}>
      <group rotation={[0.16, 0, 0]}>
        <mesh position={[0, 0.08, -0.56]}>
          <torusGeometry args={[2.04, 0.01, 8, 160]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.18} />
        </mesh>
        <mesh position={[0, 0.08, -0.58]} rotation={[0.3, 0.28, 0]}>
          <torusGeometry args={[2.36, 0.008, 8, 160]} />
          <meshBasicMaterial color="#8B5CF6" transparent opacity={0.12} />
        </mesh>
      </group>

      <group ref={head} position={[0, 0.66, 0]}>
        <RoundedBox args={[2.18, 1.74, 0.82]} radius={0.36} smoothness={10}>
          <meshStandardMaterial color="#E8F8FF" emissive="#38BDF8" emissiveIntensity={0.06} roughness={0.32} metalness={0.18} />
        </RoundedBox>
        <RoundedBox args={[1.52, 1.02, 0.88]} radius={0.23} smoothness={10} position={[0, 0.01, 0.09]}>
          <meshStandardMaterial color="#020B13" emissive="#06263A" emissiveIntensity={0.55} roughness={0.42} metalness={0.34} />
        </RoundedBox>
        <mesh position={[0, 0, 0.56]}>
          <boxGeometry args={[1.24, 0.015, 0.02]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.38} />
        </mesh>

        <RobotEye ref={leftPupil} x={-0.43} accent={accent} />
        <RobotEye ref={rightPupil} x={0.43} accent={accent} />
        <group ref={smile} position={[0, -0.34, 0.57]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.38, 0.024, 10, 80, Math.PI]} />
            <meshBasicMaterial color={accent} transparent opacity={0.92} />
          </mesh>
        </group>

        <mesh position={[-1.22, 0.02, -0.02]}>
          <torusGeometry args={[0.42, 0.08, 16, 52]} />
          <meshStandardMaterial color="#3B82F6" emissive="#2563EB" emissiveIntensity={0.45} roughness={0.34} metalness={0.38} />
        </mesh>
        <mesh position={[1.22, 0.02, -0.02]}>
          <torusGeometry args={[0.42, 0.08, 16, 52]} />
          <meshStandardMaterial color="#3B82F6" emissive="#2563EB" emissiveIntensity={0.45} roughness={0.34} metalness={0.38} />
        </mesh>
      </group>

      <group position={[0, -1.06, 0]}>
        <RoundedBox args={[1.66, 1.02, 0.66]} radius={0.28} smoothness={10}>
          <meshStandardMaterial color="#DDF3FF" emissive="#38BDF8" emissiveIntensity={0.045} roughness={0.4} metalness={0.14} />
        </RoundedBox>
        <RoundedBox args={[1.18, 0.46, 0.72]} radius={0.16} smoothness={8} position={[0, 0.02, 0.08]}>
          <meshStandardMaterial color="#BFF6FF" emissive="#22D3EE" emissiveIntensity={0.24} transparent opacity={0.72} roughness={0.3} metalness={0.22} />
        </RoundedBox>
        <mesh position={[-0.28, 0.04, 0.48]} rotation={[0, 0, -0.56]}>
          <boxGeometry args={[0.52, 0.045, 0.025]} />
          <meshBasicMaterial color={accent} transparent opacity={0.82} />
        </mesh>
        <mesh position={[0.22, 0.04, 0.48]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.74, 0.045, 0.025]} />
          <meshBasicMaterial color={accent} transparent opacity={0.82} />
        </mesh>
      </group>
    </group>
  );
}

const RobotEye = forwardRef<Group, { x: number; accent: string }>(function RobotEye({ x, accent }, ref) {
  return (
  <group position={[x, 0.2, 0.56]}>
    <mesh>
      <sphereGeometry args={[0.22, 34, 34]} />
      <meshStandardMaterial color="#0DF5D3" emissive={accent} emissiveIntensity={1.2} roughness={0.16} metalness={0.16} />
    </mesh>
    <group ref={ref}>
      <mesh position={[0.04, -0.03, 0.17]}>
        <sphereGeometry args={[0.08, 22, 22]} />
        <meshStandardMaterial color="#03212B" emissive="#020617" emissiveIntensity={0.5} roughness={0.24} />
      </mesh>
      <mesh position={[-0.06, 0.08, 0.2]}>
        <sphereGeometry args={[0.038, 14, 14]} />
        <meshBasicMaterial color="#E0FFFF" transparent opacity={0.82} />
      </mesh>
    </group>
  </group>
  );
});

function RobotBackdrop() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_70%_70%,rgba(139,92,246,0.14),transparent_42%),linear-gradient(145deg,rgba(2,6,23,0.42),rgba(15,23,42,0.58))]" />
      <div className="robot-orbit-field absolute inset-0 opacity-70" />
      <div className="absolute inset-x-8 top-10 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />
    </>
  );
}

function RobotStatusChips({ status }: { status: AskRobotStatus }) {
  return (
    <div className="pointer-events-none absolute inset-4 z-20 hidden sm:block">
      {statusChips.map((chip, index) => {
        const Icon = chip.icon;
        return (
          <div
            key={chip.label}
            className={cn(
              "robot-status-chip absolute inline-flex items-center gap-2 rounded-2xl border border-cyan-300/20 bg-slate-950/72 px-3 py-2 text-xs font-bold text-slate-200 shadow-[0_0_28px_rgba(34,211,238,0.12)] backdrop-blur-xl",
              index === 0 && "left-0 top-1",
              index === 1 && "right-0 top-24",
              index === 2 && "left-3 bottom-20",
              index === 3 && "right-0 bottom-7",
              status === "thinking" && "border-violet-300/30",
              status === "success" && "border-emerald-300/30",
            )}
          >
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
            <Icon size={13} className="text-cyan-100" />
            {chip.label}
          </div>
        );
      })}
    </div>
  );
}

function StaticRobot({ status }: { status: AskRobotStatus }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className={cn("robot-static relative h-64 w-64 rounded-full", status === "thinking" && "robot-static-thinking", status === "success" && "robot-static-success")}>
        <div className="absolute inset-0 rounded-full border border-cyan-300/16 bg-[radial-gradient(circle_at_50%_45%,rgba(34,211,238,0.22),transparent_42%)]" />
        <Bot className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 text-cyan-100 drop-shadow-[0_0_26px_rgba(34,211,238,0.42)]" />
      </div>
    </div>
  );
}
