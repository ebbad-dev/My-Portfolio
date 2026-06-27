"use client";

import { Html, OrbitControls, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { BackSide } from "three";
import type { Group } from "three";
import type { PortfolioSkill } from "@/data/skills";
import { SkillOrbIcon } from "@/components/ui/skill-icon";

type SkillNode = PortfolioSkill & {
  position: [number, number, number];
  labelVisible: boolean;
};

type SkillGlobeProps = {
  skills: PortfolioSkill[];
  selectedSkillId?: string;
  visibleLimit?: number;
  onSelect: (skill: PortfolioSkill) => void;
};

const longitudeRotations = [
  [0, 0, 0],
  [0, Math.PI / 2, 0],
  [0, Math.PI / 4, 0],
  [0, -Math.PI / 4, 0],
  [0, Math.PI / 8, 0],
  [0, -Math.PI / 8, 0],
] as const;

const latitudeLines = [-0.72, -0.44, -0.2, 0, 0.2, 0.44, 0.72] as const;

function useReducedMotionPreference() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

function useElementVisibility(ref: MutableRefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "180px", threshold: 0.02 },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);

  return visible;
}

export function SkillGlobe({ skills, selectedSkillId, visibleLimit = 14, onSelect }: SkillGlobeProps) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const visible = useElementVisibility(shellRef);
  const reducedMotion = useReducedMotionPreference();
  const nodes = useMemo<SkillNode[]>(() => {
    const sorted = [...skills].sort((a, b) => (b.globePriority || 0) - (a.globePriority || 0));
    const selected = selectedSkillId ? sorted.find((skill) => skill.id === selectedSkillId) : undefined;
    const visible = sorted.slice(0, visibleLimit);

    if (selected && !visible.some((skill) => skill.id === selected.id)) {
      visible.splice(Math.max(visible.length - 1, 0), 1, selected);
    }

    return visible.map((skill, index, list) => {
      const total = Math.max(list.length, 1);
      const phi = Math.acos(-1 + (2 * (index + 0.5)) / total);
      const theta = Math.PI * (1 + Math.sqrt(5)) * index;
      return {
        ...skill,
        labelVisible: Boolean(skill.featuredOnGlobe && index < 4),
        position: [2.72 * Math.cos(theta) * Math.sin(phi), 2.72 * Math.sin(theta) * Math.sin(phi), 2.72 * Math.cos(phi)],
      };
    });
  }, [selectedSkillId, skills, visibleLimit]);

  return (
    <div ref={shellRef} className="glass-panel relative overflow-hidden rounded-3xl p-4 md:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.12),transparent_38%),radial-gradient(circle_at_62%_65%,rgba(139,92,246,0.12),transparent_42%)]" />
      <div
        className="relative h-[430px] w-full overflow-hidden rounded-3xl border border-cyan-300/10 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.18),rgba(59,130,246,0.07)_34%,rgba(2,6,23,0.95)_72%)] md:h-[540px]"
        aria-label="Interactive holographic 3D skill globe"
      >
        <Canvas camera={{ position: [0, 0, 7.2], fov: 48 }} dpr={[1, 1.6]} frameloop={visible && !reducedMotion ? "always" : "demand"} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={0.48} />
          <directionalLight position={[3.5, 4.8, 5]} intensity={2.25} color="#E0F7FF" />
          <pointLight position={[4, 1.8, 4]} intensity={38} color="#22D3EE" />
          <pointLight position={[-3.5, -2.2, 3.6]} intensity={24} color="#8B5CF6" />
          <Stars radius={19} depth={13} count={560} factor={1.9} fade speed={0.24} />
          <HolographicPlanet nodes={nodes} selectedSkillId={selectedSkillId} onSelect={onSelect} />
          <OrbitControls enablePan={false} enableZoom={false} rotateSpeed={0.45} />
        </Canvas>
      </div>
      <p className="relative mt-4 text-center font-mono text-xs uppercase tracking-[0.12em] text-slate-500">
        Showing {nodes.length} focused nodes. Use filters for the full stack.
      </p>
    </div>
  );
}

function HolographicPlanet({ nodes, selectedSkillId, onSelect }: { nodes: SkillNode[]; selectedSkillId?: string; onSelect: (skill: PortfolioSkill) => void }) {
  const group = useRef<Group>(null);
  const [hovering, setHovering] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useFrame((state, delta) => {
    if (!group.current || hovering || reducedMotion) return;
    group.current.rotation.y += delta * 0.13;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.28) * 0.08;
  });

  return (
    <group ref={group}>
      <Atmosphere />
      <SphereBody />
      <GridLines />
      <OrbitBands />
      <SkillNodes nodes={nodes} selectedSkillId={selectedSkillId} onSelect={onSelect} setHovering={setHovering} />
    </group>
  );
}

function Atmosphere() {
  return (
    <>
      <mesh>
        <sphereGeometry args={[2.42, 72, 72]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.08} side={BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.24, 72, 72]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.055} side={BackSide} />
      </mesh>
    </>
  );
}

function SphereBody() {
  return (
    <>
      <mesh>
        <sphereGeometry args={[2.02, 96, 96]} />
        <meshStandardMaterial color="#06111f" emissive="#082f49" emissiveIntensity={0.34} transparent opacity={0.62} roughness={0.58} metalness={0.38} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.06, 96, 96]} />
        <meshBasicMaterial color="#E0F7FF" wireframe transparent opacity={0.11} />
      </mesh>
      <mesh rotation={[0.18, -0.28, 0.05]}>
        <sphereGeometry args={[2.08, 96, 96]} />
        <meshBasicMaterial color="#22D3EE" wireframe transparent opacity={0.095} />
      </mesh>
    </>
  );
}

function GridLines() {
  return (
    <group>
      {latitudeLines.map((offset) => {
        const radius = Math.sqrt(1 - offset * offset);
        return (
          <mesh key={offset} position={[0, offset * 2.02, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[radius, radius, radius]}>
            <torusGeometry args={[2.05, 0.0065, 8, 160]} />
            <meshBasicMaterial color="#22D3EE" transparent opacity={offset === 0 ? 0.34 : 0.2} />
          </mesh>
        );
      })}
      {longitudeRotations.map((rotation, index) => (
        <mesh key={index} rotation={rotation}>
          <torusGeometry args={[2.055, 0.006, 8, 160]} />
          <meshBasicMaterial color={index < 2 ? "#38BDF8" : "#8B5CF6"} transparent opacity={index < 2 ? 0.2 : 0.14} />
        </mesh>
      ))}
    </group>
  );
}

function OrbitBands() {
  return (
    <group>
      <mesh rotation={[1.16, 0.08, -0.54]}>
        <torusGeometry args={[2.78, 0.009, 8, 180]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.24} />
      </mesh>
      <mesh rotation={[1.36, -0.42, 0.72]}>
        <torusGeometry args={[2.96, 0.007, 8, 180]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.16} />
      </mesh>
      <mesh rotation={[0.96, 0.62, 0.18]}>
        <torusGeometry args={[3.14, 0.005, 8, 180]} />
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.13} />
      </mesh>
    </group>
  );
}

function SkillNodes({
  nodes,
  selectedSkillId,
  onSelect,
  setHovering,
}: {
  nodes: SkillNode[];
  selectedSkillId?: string;
  onSelect: (skill: PortfolioSkill) => void;
  setHovering: (hovering: boolean) => void;
}) {
  return (
    <>
      {nodes.map((skill, index) => {
        const active = skill.id === selectedSkillId;
        const showLabel = active || skill.labelVisible;
        return (
          <group key={`${skill.id}-${index}`} position={skill.position}>
            <mesh
              scale={active ? 1.65 : 1}
              onClick={(event) => {
                event.stopPropagation();
                onSelect(skill);
              }}
              onPointerOver={(event) => {
                event.stopPropagation();
                setHovering(true);
                document.body.dataset.cursor = "Skill";
                onSelect(skill);
              }}
              onPointerOut={() => {
                setHovering(false);
                delete document.body.dataset.cursor;
              }}
            >
              <sphereGeometry args={[0.075, 22, 22]} />
              <meshBasicMaterial color={active ? "#E0F7FF" : skill.color} transparent opacity={active ? 1 : 0.9} />
            </mesh>
            <mesh scale={active ? 1.6 : 1}>
              <sphereGeometry args={[0.2, 20, 20]} />
              <meshBasicMaterial color={skill.color} transparent opacity={active ? 0.28 : 0.12} />
            </mesh>
            <Html center distanceFactor={7.8}>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(skill);
                }}
                className={`pointer-events-auto inline-flex items-center gap-1.5 rounded-full border bg-slate-950/88 p-1 font-mono text-[10px] text-slate-100 shadow-[0_0_18px_rgba(34,211,238,0.16)] backdrop-blur transition ${
                  active ? "scale-110 border-cyan-300/55 pr-2" : "border-white/10 hover:border-cyan-300/35"
                }`}
                style={{ boxShadow: active ? `0 0 26px ${skill.glowColor}` : undefined }}
                aria-label={`Select ${skill.name}`}
              >
                <SkillOrbIcon skill={skill} />
                {showLabel ? <span className="max-w-24 truncate pr-1">{skill.name}</span> : null}
              </button>
            </Html>
          </group>
        );
      })}
    </>
  );
}
