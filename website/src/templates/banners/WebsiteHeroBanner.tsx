import { BRAND, school } from "@/templates/shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function WebsiteHeroBanner({ fields }: Props) {
  const bgImage = fields.backgroundImage;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        fontFamily: BRAND.font,
        background: `linear-gradient(135deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 100%)`,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        ...(bgImage
          ? {
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}),
      }}
    >
      {/* Background overlay when image is set */}
      {bgImage && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(26,58,26,0.85), rgba(45,80,22,0.75))",
            zIndex: 0,
          }}
        />
      )}

      {/* Background decorative elements */}
      <div
        style={{
          position: "absolute",
          top: -60,
          left: -60,
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: BRAND.primaryLight,
          opacity: 0.1,
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          right: -40,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: BRAND.primaryLight,
          opacity: 0.08,
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 100,
          right: 150,
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: `2px solid ${BRAND.accentLight}`,
          opacity: 0.12,
          zIndex: 1,
        }}
      />

      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${BRAND.accent}, ${BRAND.accentLight}, ${BRAND.accent})`,
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
          padding: "0 80px",
          maxWidth: 900,
        }}
      >
        {/* School name label */}
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: BRAND.accentLight,
            textTransform: "uppercase" as const,
            letterSpacing: 5,
            marginBottom: 24,
          }}
        >
          {school.name}
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: BRAND.white,
            lineHeight: 1.12,
            marginBottom: 20,
            ...(bgImage ? { textShadow: "0 2px 12px rgba(0,0,0,0.3)" } : {}),
          }}
        >
          {fields.headline || "Admissions Open for 2026-27"}
        </div>

        {/* Decorative divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 40,
              height: 2,
              background: BRAND.accent,
              borderRadius: 1,
            }}
          />
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: BRAND.accent,
            }}
          />
          <div
            style={{
              width: 40,
              height: 2,
              background: BRAND.accent,
              borderRadius: 1,
            }}
          />
        </div>

        {/* Subheadline */}
        <div
          style={{
            fontSize: 20,
            color: BRAND.white,
            opacity: 0.85,
            lineHeight: 1.5,
            marginBottom: 36,
            maxWidth: 600,
          }}
        >
          {fields.subheadline ||
            "Give Your Child the Best Start in Kullu Valley"}
        </div>

        {/* CTA Button */}
        <div
          style={{
            background: `linear-gradient(135deg, ${BRAND.accent}, ${BRAND.accentDark})`,
            color: BRAND.primaryDark,
            padding: "16px 52px",
            borderRadius: 10,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 1,
            textTransform: "uppercase" as const,
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          {fields.cta || "Apply Now"}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${BRAND.accent}, ${BRAND.accentLight}, ${BRAND.accent})`,
          zIndex: 2,
        }}
      />
    </div>
  );
}
