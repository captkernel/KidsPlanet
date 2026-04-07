import { BRAND, school } from "@/templates/shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function AdmissionStory({ fields }: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(180deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 50%, ${BRAND.primaryLight} 100%)`,
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
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -80,
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: BRAND.accent,
          opacity: 0.08,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: -120,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: BRAND.accentLight,
          opacity: 0.06,
        }}
      />

      {/* School name */}
      <div
        style={{
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: 3,
          textTransform: "uppercase",
          opacity: 0.8,
          marginBottom: 80,
        }}
      >
        {school.name}
      </div>

      {/* Headline */}
      <div
        style={{
          fontSize: 80,
          fontWeight: 900,
          lineHeight: 1.05,
          textAlign: "center",
          marginBottom: 36,
          maxWidth: "95%",
          textShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {fields.headline}
      </div>

      {/* Year accent */}
      <div
        style={{
          background: BRAND.accent,
          color: BRAND.primaryDark,
          padding: "16px 52px",
          borderRadius: 60,
          fontSize: 44,
          fontWeight: 900,
          marginBottom: 40,
          boxShadow: `0 6px 24px rgba(200,168,78,0.4)`,
        }}
      >
        {fields.year}
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 24,
          opacity: 0.8,
          textAlign: "center",
          lineHeight: 1.5,
          maxWidth: "85%",
          marginBottom: "auto",
        }}
      >
        {school.tagline}
      </div>

      {/* CTA */}
      <div
        style={{
          background: "rgba(255,255,255,0.15)",
          border: `2px solid ${BRAND.white}`,
          borderRadius: 16,
          padding: "20px 48px",
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 32,
          letterSpacing: 1,
          textAlign: "center",
        }}
      >
        {fields.cta}
      </div>

      {/* Phone */}
      <div
        style={{
          fontSize: 26,
          fontWeight: 600,
          color: BRAND.accentLight,
        }}
      >
        {fields.phone}
      </div>
    </div>
  );
}
