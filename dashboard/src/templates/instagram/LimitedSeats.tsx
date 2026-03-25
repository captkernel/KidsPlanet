import { BRAND, school } from "@/templates/shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function LimitedSeats({ fields }: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(145deg, #1a0a0a 0%, #2a0f0f 30%, ${BRAND.primaryDark} 100%)`,
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
      {/* Urgency pulse ring */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          height: 800,
          borderRadius: "50%",
          border: "3px solid rgba(220,60,60,0.15)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          border: "2px solid rgba(220,60,60,0.1)",
        }}
      />

      {/* Alert badge */}
      <div
        style={{
          background: "#dc3c3c",
          color: BRAND.white,
          padding: "10px 36px",
          borderRadius: 40,
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: 4,
          textTransform: "uppercase",
          marginBottom: 40,
          position: "relative",
        }}
      >
        HURRY!
      </div>

      {/* Headline */}
      <div
        style={{
          fontSize: 68,
          fontWeight: 900,
          lineHeight: 1.05,
          marginBottom: 24,
          maxWidth: "90%",
          position: "relative",
          textShadow: "0 2px 20px rgba(220,60,60,0.3)",
        }}
      >
        {fields.headline}
      </div>

      {/* Subheadline with accent */}
      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: "#dc3c3c",
          marginBottom: 48,
          position: "relative",
        }}
      >
        {fields.subheadline}
      </div>

      {/* CTA block */}
      <div
        style={{
          background: BRAND.accent,
          color: BRAND.primaryDark,
          padding: "22px 56px",
          borderRadius: 12,
          fontSize: 26,
          fontWeight: 800,
          marginBottom: 24,
          boxShadow: `0 8px 32px rgba(200,168,78,0.4)`,
          position: "relative",
        }}
      >
        {fields.cta}
      </div>

      {/* Phone */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: BRAND.accentLight,
          position: "relative",
        }}
      >
        {fields.phone}
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 36,
          fontSize: 18,
          fontWeight: 700,
          color: BRAND.white,
          opacity: 0.5,
          letterSpacing: 2,
        }}
      >
        {school.name}
      </div>
    </div>
  );
}
