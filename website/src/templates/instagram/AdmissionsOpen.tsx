import { BRAND, school } from "@/templates/shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function AdmissionsOpen({ fields }: Props) {
  const bgImage = fields.backgroundImage;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(160deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 40%, ${BRAND.primaryLight} 100%)`,
        fontFamily: BRAND.font,
        color: BRAND.white,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
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

      {/* Decorative circle top-right */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: BRAND.accent,
          opacity: 0.15,
          zIndex: 1,
        }}
      />
      {/* Decorative circle bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: BRAND.accentLight,
          opacity: 0.1,
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {/* School name badge */}
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              padding: "10px 32px",
              borderRadius: 40,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {school.name}
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            lineHeight: 1.1,
            maxWidth: "85%",
            marginBottom: 20,
            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          {fields.headline}
        </div>

        {/* Subheadline */}
        <div
          style={{
            fontSize: 30,
            fontWeight: 400,
            opacity: 0.9,
            marginBottom: 48,
            maxWidth: "75%",
          }}
        >
          {fields.subheadline}
        </div>

        {/* CTA bar */}
        <div
          style={{
            background: BRAND.accent,
            color: BRAND.primaryDark,
            padding: "20px 60px",
            borderRadius: 12,
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: 1,
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          }}
        >
          {fields.cta}
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            fontSize: 16,
            opacity: 0.6,
            letterSpacing: 1,
          }}
        >
          {school.tagline}
        </div>
      </div>
    </div>
  );
}
