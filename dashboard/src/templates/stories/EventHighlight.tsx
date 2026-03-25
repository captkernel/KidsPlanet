import { BRAND, school } from "@/templates/shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function EventHighlight({ fields }: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(180deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 40%, ${BRAND.primaryLight} 100%)`,
        fontFamily: BRAND.font,
        color: BRAND.white,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "80px 56px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Confetti-like decorative elements */}
      {/* Small squares scattered */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 60,
          width: 16,
          height: 16,
          background: BRAND.accent,
          transform: "rotate(30deg)",
          borderRadius: 3,
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 200,
          right: 80,
          width: 12,
          height: 12,
          background: BRAND.accentLight,
          transform: "rotate(55deg)",
          borderRadius: 2,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 340,
          left: 100,
          width: 10,
          height: 10,
          background: "#e0c878",
          transform: "rotate(15deg)",
          borderRadius: "50%",
          opacity: 0.4,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 500,
          right: 50,
          width: 14,
          height: 14,
          background: BRAND.accent,
          transform: "rotate(40deg)",
          borderRadius: 3,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 400,
          left: 40,
          width: 18,
          height: 18,
          background: BRAND.accentLight,
          transform: "rotate(60deg)",
          borderRadius: "50%",
          opacity: 0.35,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 500,
          right: 120,
          width: 10,
          height: 10,
          background: BRAND.accent,
          transform: "rotate(20deg)",
          borderRadius: 2,
          opacity: 0.4,
        }}
      />
      {/* Confetti strips */}
      <div
        style={{
          position: "absolute",
          top: 160,
          right: 160,
          width: 4,
          height: 24,
          background: BRAND.accent,
          transform: "rotate(35deg)",
          borderRadius: 2,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 280,
          left: 180,
          width: 4,
          height: 20,
          background: BRAND.accentLight,
          transform: "rotate(-25deg)",
          borderRadius: 2,
          opacity: 0.4,
        }}
      />

      {/* School name */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: 3,
          textTransform: "uppercase",
          opacity: 0.7,
          marginBottom: 80,
        }}
      >
        {school.name}
      </div>

      {/* Celebration star */}
      <div
        style={{
          fontSize: 64,
          color: BRAND.accent,
          marginBottom: 32,
          textShadow: `0 0 30px ${BRAND.accent}60`,
        }}
      >
        {"\u2605"}
      </div>

      {/* Headline */}
      <div
        style={{
          fontSize: 64,
          fontWeight: 900,
          lineHeight: 1.1,
          textAlign: "center",
          marginBottom: 48,
          textShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        {fields.headline}
      </div>

      {/* Event name card */}
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          border: `2px solid ${BRAND.accent}`,
          borderRadius: 20,
          padding: "36px 56px",
          textAlign: "center",
          marginBottom: 48,
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 900,
            color: BRAND.accentLight,
            lineHeight: 1.2,
          }}
        >
          {fields.event}
        </div>
      </div>

      {/* Highlight stats */}
      <div
        style={{
          background: BRAND.accent,
          color: BRAND.primaryDark,
          borderRadius: 16,
          padding: "24px 48px",
          fontSize: 26,
          fontWeight: 700,
          textAlign: "center",
          letterSpacing: 1,
          boxShadow: `0 6px 24px rgba(200,168,78,0.3)`,
          marginBottom: "auto",
        }}
      >
        {fields.highlight}
      </div>

      {/* Bottom flourish */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginTop: 40,
        }}
      >
        <div style={{ width: 40, height: 2, background: BRAND.accent, opacity: 0.5 }} />
        <div style={{ fontSize: 18, opacity: 0.6 }}>{school.tagline}</div>
        <div style={{ width: 40, height: 2, background: BRAND.accent, opacity: 0.5 }} />
      </div>
    </div>
  );
}
