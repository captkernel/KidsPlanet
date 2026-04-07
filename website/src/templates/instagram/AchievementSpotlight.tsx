import { BRAND, school } from "@/templates/shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function AchievementSpotlight({ fields }: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(160deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 50%, ${BRAND.primaryLight} 100%)`,
        fontFamily: BRAND.font,
        color: BRAND.white,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 60,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Gold shimmer diagonals */}
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          background: `linear-gradient(45deg, transparent 30%, ${BRAND.accent}15 50%, transparent 70%)`,
          transform: "rotate(25deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -100,
          left: -100,
          width: 400,
          height: 400,
          background: `linear-gradient(45deg, transparent 30%, ${BRAND.accent}15 50%, transparent 70%)`,
          transform: "rotate(25deg)",
        }}
      />

      {/* Trophy / medal CSS motif */}
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: `6px solid ${BRAND.accent}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 12,
          position: "relative",
          boxShadow: `0 0 40px ${BRAND.accent}40`,
        }}
      >
        {/* Star shape inside circle */}
        <div style={{ fontSize: 56, color: BRAND.accent }}>{"\u2605"}</div>
      </div>
      {/* Medal ribbon */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            width: 20,
            height: 40,
            background: BRAND.accent,
            borderRadius: "0 0 4px 4px",
            transform: "skewX(-10deg)",
            opacity: 0.7,
          }}
        />
        <div
          style={{
            width: 20,
            height: 40,
            background: BRAND.accentLight,
            borderRadius: "0 0 4px 4px",
            transform: "skewX(10deg)",
            opacity: 0.7,
          }}
        />
      </div>

      {/* Headline */}
      <div
        style={{
          fontSize: 52,
          fontWeight: 900,
          color: BRAND.accent,
          marginBottom: 28,
          lineHeight: 1.1,
          textShadow: `0 2px 10px rgba(0,0,0,0.3)`,
        }}
      >
        {fields.headline}
      </div>

      {/* Achievement text */}
      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
          lineHeight: 1.4,
          marginBottom: 28,
          maxWidth: "85%",
        }}
      >
        {fields.achievement}
      </div>

      {/* Details bar */}
      <div
        style={{
          background: "rgba(255,255,255,0.12)",
          borderRadius: 12,
          padding: "18px 44px",
          fontSize: 24,
          fontWeight: 600,
          color: BRAND.accentLight,
          letterSpacing: 1,
          border: `1px solid ${BRAND.accent}30`,
        }}
      >
        {fields.detail}
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 36,
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 18,
          fontWeight: 700,
          color: BRAND.accent,
          opacity: 0.8,
        }}
      >
        {school.name}
      </div>
    </div>
  );
}
