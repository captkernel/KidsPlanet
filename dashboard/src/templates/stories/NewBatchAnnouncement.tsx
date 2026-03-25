import { BRAND, school } from "@/templates/shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function NewBatchAnnouncement({ fields }: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(180deg, ${BRAND.primary} 0%, ${BRAND.primaryDark} 100%)`,
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
      {/* Background diamond shapes */}
      <div
        style={{
          position: "absolute",
          top: 180,
          right: -40,
          width: 160,
          height: 160,
          background: "rgba(255,255,255,0.04)",
          transform: "rotate(45deg)",
          borderRadius: 16,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 300,
          left: -30,
          width: 120,
          height: 120,
          background: "rgba(255,255,255,0.03)",
          transform: "rotate(45deg)",
          borderRadius: 12,
        }}
      />

      {/* School name */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: 4,
          textTransform: "uppercase",
          opacity: 0.7,
          marginBottom: 80,
        }}
      >
        {school.name}
      </div>

      {/* NEW badge */}
      <div
        style={{
          background: BRAND.accent,
          color: BRAND.primaryDark,
          padding: "8px 40px",
          borderRadius: 40,
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: 4,
          textTransform: "uppercase",
          marginBottom: 40,
        }}
      >
        NEW BATCH
      </div>

      {/* Headline */}
      <div
        style={{
          fontSize: 68,
          fontWeight: 900,
          lineHeight: 1.1,
          textAlign: "center",
          marginBottom: 56,
          textShadow: "0 4px 20px rgba(0,0,0,0.2)",
        }}
      >
        {fields.headline}
      </div>

      {/* Class name card */}
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          border: `2px solid ${BRAND.accent}`,
          borderRadius: 20,
          padding: "28px 52px",
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            opacity: 0.7,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          CLASS
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 900,
            color: BRAND.accentLight,
          }}
        >
          {fields.class}
        </div>
      </div>

      {/* Start date */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: "auto",
        }}
      >
        <div style={{ width: 40, height: 2, background: BRAND.accent }} />
        <div style={{ fontSize: 26, fontWeight: 600 }}>Starting {fields.date}</div>
        <div style={{ width: 40, height: 2, background: BRAND.accent }} />
      </div>

      {/* CTA */}
      <div
        style={{
          background: BRAND.accent,
          color: BRAND.primaryDark,
          borderRadius: 16,
          padding: "22px 56px",
          fontSize: 28,
          fontWeight: 800,
          boxShadow: `0 8px 30px rgba(200,168,78,0.35)`,
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        {fields.cta}
      </div>

      {/* Phone */}
      <div style={{ fontSize: 22, fontWeight: 500, opacity: 0.7 }}>
        {school.phone}
      </div>
    </div>
  );
}
