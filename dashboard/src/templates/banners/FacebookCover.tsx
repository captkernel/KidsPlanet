import { BRAND, school } from "@/templates/shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function FacebookCover({ fields }: Props) {
  const bgImage = fields.backgroundImage;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        fontFamily: BRAND.font,
        background: `linear-gradient(135deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 50%, ${BRAND.primaryLight} 100%)`,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
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

      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -60,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: BRAND.primaryLight,
          opacity: 0.12,
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -100,
          right: 200,
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: BRAND.primaryLight,
          opacity: 0.08,
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 60,
          left: -40,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: BRAND.primaryLight,
          opacity: 0.06,
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -40,
          left: 100,
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: `2px solid ${BRAND.accentLight}`,
          opacity: 0.15,
          zIndex: 1,
        }}
      />

      {/* Top accent line */}
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

      {/* Main content area */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "0 80px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Left: Text content */}
        <div style={{ maxWidth: 700 }}>
          {/* School name label */}
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: BRAND.accentLight,
              textTransform: "uppercase" as const,
              letterSpacing: 4,
              marginBottom: 16,
            }}
          >
            {school.name}
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: 44,
              fontWeight: 800,
              color: BRAND.white,
              lineHeight: 1.15,
              marginBottom: 16,
              ...(bgImage ? { textShadow: "0 2px 12px rgba(0,0,0,0.3)" } : {}),
            }}
          >
            {fields.headline || "Kids Planet — Where Every Child Shines"}
          </div>

          {/* Decorative divider */}
          <div
            style={{
              width: 50,
              height: 3,
              background: BRAND.accent,
              borderRadius: 2,
              marginBottom: 16,
            }}
          />

          {/* Subheadline */}
          <div
            style={{
              fontSize: 18,
              color: BRAND.white,
              opacity: 0.85,
              lineHeight: 1.5,
              maxWidth: 500,
            }}
          >
            {fields.subheadline ||
              "Kullu Valley's Dedicated Early Childhood Learning Center"}
          </div>
        </div>

        {/* Right: Est. badge */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: `3px solid ${BRAND.accent}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                width: 106,
                height: 106,
                borderRadius: "50%",
                border: `1px solid ${BRAND.accentLight}`,
                opacity: 0.4,
                position: "absolute",
              }}
            />
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: BRAND.accentLight,
                textTransform: "uppercase" as const,
                letterSpacing: 2,
                marginBottom: 2,
              }}
            >
              Since
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: BRAND.accent,
              }}
            >
              2010
            </div>
            <div
              style={{
                fontSize: 10,
                color: BRAND.accentLight,
                opacity: 0.7,
              }}
            >
              {fields.since || "Est. 2010"}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
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
