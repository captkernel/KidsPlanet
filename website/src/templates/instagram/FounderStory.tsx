import { BRAND, school } from "@/templates/shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function FounderStory({ fields }: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(180deg, ${BRAND.cream} 0%, ${BRAND.white} 100%)`,
        fontFamily: BRAND.font,
        color: BRAND.textDark,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 72,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top decorative line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 2,
          height: 100,
          background: `linear-gradient(180deg, ${BRAND.accent}, transparent)`,
        }}
      />

      {/* Headline */}
      <div
        style={{
          fontSize: 40,
          fontWeight: 800,
          color: BRAND.primary,
          marginBottom: 48,
          letterSpacing: 1,
        }}
      >
        {fields.headline}
      </div>

      {/* Opening quote mark */}
      <div
        style={{
          fontSize: 140,
          lineHeight: 0.5,
          color: BRAND.accent,
          fontFamily: "Georgia, serif",
          marginBottom: 16,
        }}
      >
        {"\u201C"}
      </div>

      {/* Quote */}
      <div
        style={{
          fontSize: 32,
          fontWeight: 400,
          lineHeight: 1.6,
          fontStyle: "italic",
          maxWidth: "85%",
          color: BRAND.textDark,
          fontFamily: "Georgia, serif",
          marginBottom: 16,
        }}
      >
        {fields.quote}
      </div>

      {/* Closing quote mark */}
      <div
        style={{
          fontSize: 140,
          lineHeight: 0.3,
          color: BRAND.accent,
          fontFamily: "Georgia, serif",
          marginBottom: 40,
        }}
      >
        {"\u201D"}
      </div>

      {/* Founder name divider */}
      <div
        style={{
          width: 60,
          height: 3,
          background: BRAND.accent,
          marginBottom: 20,
          borderRadius: 2,
        }}
      />

      {/* Founder name */}
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: BRAND.primary,
          marginBottom: 6,
        }}
      >
        {fields.founder}
      </div>
      <div
        style={{
          fontSize: 18,
          color: BRAND.textMuted,
          marginBottom: 36,
        }}
      >
        Founder, {school.name}
      </div>

      {/* Since badge */}
      <div
        style={{
          border: `2px solid ${BRAND.accent}`,
          borderRadius: 50,
          padding: "10px 32px",
          fontSize: 18,
          fontWeight: 700,
          color: BRAND.accent,
          letterSpacing: 2,
        }}
      >
        {fields.since}
      </div>

      {/* Bottom decorative line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 2,
          height: 100,
          background: `linear-gradient(0deg, ${BRAND.accent}, transparent)`,
        }}
      />
    </div>
  );
}
