import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site";

export const alt = "Ebbad Ur Rehman portfolio preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #020617 0%, #071426 52%, #160f2f 100%)",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 20%, rgba(34,211,238,.24), transparent 31%), radial-gradient(circle at 86% 22%, rgba(139,92,246,.22), transparent 33%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 70,
            right: 70,
            top: 70,
            bottom: 70,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            border: "1px solid rgba(34,211,238,.28)",
            borderRadius: 42,
            padding: 56,
            background: "rgba(15,23,42,.7)",
          }}
        >
          <div style={{ fontSize: 28, letterSpacing: 5, color: "#67e8f9", textTransform: "uppercase" }}>
            Full-Stack / AI / Databases / Systems
          </div>
          <div style={{ marginTop: 30, fontSize: 86, fontWeight: 900, lineHeight: 0.95 }}>
            {siteConfig.name}
          </div>
          <div style={{ marginTop: 28, maxWidth: 860, fontSize: 31, lineHeight: 1.35, color: "#cbd5e1" }}>
            Interactive portfolio with serious projects, demos, a skill globe, and recruiter-ready case studies.
          </div>
          <div style={{ marginTop: 42, display: "flex", gap: 18, fontSize: 24, color: "#e0f2fe" }}>
            <span>ProctorAI</span>
            <span style={{ color: "#38bdf8" }}>/</span>
            <span>TeleTrack Enterprise</span>
            <span style={{ color: "#38bdf8" }}>/</span>
            <span>MirrorMind</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
