import { ImageResponse } from "next/og";
import { siteName } from "@/lib/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f8fafc",
          color: "#020617",
          padding: 72,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4, color: "#0f766e", fontWeight: 700 }}>{siteName}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", maxWidth: 900, fontSize: 64, lineHeight: 1.05, fontWeight: 700 }}>
            Healthcare Data Partnerships for Enterprise Research
          </div>
          <div style={{ display: "flex", marginTop: 32, maxWidth: 940, fontSize: 28, lineHeight: 1.35, color: "#475569" }}>
            Trusted clinical, molecular, imaging and real-world data collaboration for life sciences and healthcare AI.
          </div>
        </div>
        <div style={{ fontSize: 22, color: "#334155" }}>bconz.com</div>
      </div>
    ),
    size
  );
}
