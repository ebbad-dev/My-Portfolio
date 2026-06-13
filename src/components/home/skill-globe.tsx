"use client";

import { Html, OrbitControls, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import type { Group } from "three";
import type { PortfolioSkill } from "@/data/skills";
import { SkillOrbIcon } from "@/components/ui/skill-icon";

type SkillNode = PortfolioSkill & {
  position: [number, number, number];
};

type SkillGlobeProps = {
  skills: PortfolioSkill[];
  selectedSkillId?: string;
  onSelect: (skill: PortfolioSkill) => void;
};

export function SkillGlobe({ skills, selectedSkillId, onSelect }: SkillGlobeProps) {
  const nodes = useMemo<SkillNode[]>(() => {
    return skills.slice(0, 34).map((skill, index, list) => {
      const total = Math.max(list.length, 1);
      const phi = Math.acos(-1 + (2 * index) / total);
      const theta = Math.sqrt(total * Math.PI) * phi;
      return {
        ...skill,
        position: [2.9 * Math.cos(theta) * Math.sin(phi), 2.9 * Math.sin(theta) * Math.sin(phi), 2.9 * Math.cos(phi)],
      };
    });
  }, [skills]);

  return (
    <div className="glass-panel rounded-3xl p-4 md:p-6">
      <div className="h-[430px] w-full overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_58%)]" aria-label="Interactive 3D technical skill constellation">
        <Canvas camera={{ position: [0, 0, 7], fov: 55 }} dpr={[1, 1.6]}>
          <ambientLight intensity={0.85} />
          <pointLight position={[4, 4, 4]} intensity={22} color="#22D3EE" />
          <pointLight position={[-3, -2, 4]} intensity={12} color="#8B5CF6" />
          <Stars radius={18} depth={12} count={520} factor={2} fade speed={0.3} />
          <ConstellationNodes nodes={nodes} selectedSkillId={selectedSkillId} onSelect={onSelect} />
          <OrbitControls enablePan={false} enableZoom={false} rotateSpeed={0.48} />
        </Canvas>
      </div>
    </div>
  );
}

function ConstellationNodes({ nodes, selectedSkillId, onSelect }: { nodes: SkillNode[]; selectedSkillId?: string; onSelect: (skill: PortfolioSkill) => void }) {
  const group = useRef<Group>(null);
  const [hovering, setHovering] = useState(false);

  useFrame((_, delta) => {
    if (group.current && !hovering) {
      group.current.rotation.y += delta * 0.18;
      group.current.rotation.x = Math.sin(Date.now() * 0.00024) * 0.1;
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[2.04, 56, 56]} />
        <meshStandardMaterial color="#0F172A" emissive="#083344" emissiveIntensity={0.42} wireframe transparent opacity={0.65} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.92, 56, 56]} />
        <meshStandardMaterial color="#020617" transparent opacity={0.36} roughness={0.75} metalness={0.25} />
      </mesh>
      {nodes.map((skill, index) => {
        const active = skill.id === selectedSkillId;
        return (
          <group key={`${skill.id}-${index}`} position={skill.position}>
            <mesh
              scale={active ? 1.75 : 1}
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
              <sphereGeometry args={[0.085, 20, 20]} />
              <meshBasicMaterial color={active ? "#E0F7FF" : skill.color} />
            </mesh>
            <mesh scale={active ? 1.45 : 1}>
              <sphereGeometry args={[0.15, 18, 18]} />
              <meshBasicMaterial color={skill.color} transparent opacity={active ? 0.24 : 0.13} />
            </mesh>
            <Html center distanceFactor={7.2}>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(skill);
                }}
                className={`pointer-events-auto inline-flex items-center gap-1.5 rounded-full border bg-slate-950/85 px-2 py-1 font-mono text-[10px] text-slate-100 shadow-[0_0_18px_rgba(34,211,238,0.16)] backdrop-blur transition ${active ? "border-cyan-300/45 scale-110" : "border-white/10 hover:border-cyan-300/35"}`}
                style={{ boxShadow: active ? `0 0 24px ${skill.glowColor}` : undefined }}
              >
                <SkillOrbIcon skill={skill} />
                {(active || index % 2 === 0) ? <span>{skill.name}</span> : null}
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
