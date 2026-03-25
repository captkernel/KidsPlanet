import { BRAND, school } from "@/templates/shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function AdmissionFlyer({ fields }: Props) {
  const classes = fields.classes || "Playgroup · Nursery · KG · Class 1–8";
  const classItems = classes.split(" · ");
  const bgImage = fields.backgroundImage;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        fontFamily: BRAND.font,
        background: BRAND.cream,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
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
              "linear-gradient(135deg, rgba(26,58,26,0.88), rgba(45,80,22,0.78))",
            zIndex: 0,
          }}
        />
      )}

      {/* All content wrapped in relative container */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Top decorative bar */}
        <div
          style={{
            height: 8,
            background: `linear-gradient(90deg, ${BRAND.accent}, ${BRAND.accentLight}, ${BRAND.accent})`,
          }}
        />

        {/* Header section */}
        <div
          style={{
            background: bgImage
              ? "rgba(26,58,26,0.6)"
              : `linear-gradient(135deg, ${BRAND.primaryDark}, ${BRAND.primary})`,
            padding: "40px 50px 36px",
            position: "relative",
          }}
        >
          {/* Decorative circle */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: BRAND.primaryLight,
              opacity: 0.2,
            }}
          />
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: BRAND.accentLight,
              textTransform: "uppercase" as const,
              letterSpacing: 3,
              marginBottom: 8,
            }}
          >
            {school.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: BRAND.white,
              opacity: 0.7,
            }}
          >
            {school.tagline}
          </div>
        </div>

        {/* Accent bar */}
        <div
          style={{
            height: 5,
            background: `linear-gradient(90deg, ${BRAND.accent}, ${BRAND.accentLight})`,
          }}
        />

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "50px 50px 0",
          }}
        >
          {/* Headline */}
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: bgImage ? BRAND.white : BRAND.primaryDark,
              lineHeight: 1.1,
              marginBottom: 16,
              ...(bgImage ? { textShadow: "0 2px 12px rgba(0,0,0,0.3)" } : {}),
            }}
          >
            {fields.headline || "Admissions Open 2026-27"}
          </div>

          {/* Subheadline */}
          <div
            style={{
              fontSize: 18,
              color: bgImage ? "rgba(255,255,255,0.85)" : BRAND.textMuted,
              lineHeight: 1.5,
              marginBottom: 40,
              maxWidth: 500,
            }}
          >
            {fields.subheadline || "Kullu Valley's Dedicated Early Childhood Learning Center"}
          </div>

          {/* Decorative divider */}
          <div
            style={{
              width: 60,
              height: 4,
              background: BRAND.accent,
              borderRadius: 2,
              marginBottom: 36,
            }}
          />

          {/* Classes section */}
          <div style={{ marginBottom: 40 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: bgImage ? BRAND.accentLight : BRAND.primary,
                textTransform: "uppercase" as const,
                letterSpacing: 2,
                marginBottom: 20,
              }}
            >
              Classes Offered
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap" as const,
                gap: 10,
              }}
            >
              {classItems.map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: bgImage ? "rgba(255,255,255,0.15)" : BRAND.white,
                    border: `2px solid ${bgImage ? "rgba(255,255,255,0.3)" : BRAND.primaryLight}`,
                    borderRadius: 8,
                    padding: "10px 20px",
                    fontSize: 15,
                    fontWeight: 600,
                    color: bgImage ? BRAND.white : BRAND.primaryDark,
                  }}
                >
                  {item.trim()}
                </div>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Contact info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 30,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: bgImage ? BRAND.accent : BRAND.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: bgImage ? BRAND.primaryDark : BRAND.white,
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              ✆
            </div>
            <div>
              <div style={{ fontSize: 13, color: bgImage ? "rgba(255,255,255,0.7)" : BRAND.textMuted }}>
                Call us at
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: bgImage ? BRAND.white : BRAND.primaryDark,
                }}
              >
                {fields.phone || school.phone}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner at bottom */}
        <div
          style={{
            background: `linear-gradient(135deg, ${BRAND.accent}, ${BRAND.accentDark})`,
            padding: "24px 50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: BRAND.primaryDark,
              textAlign: "center",
            }}
          >
            {fields.cta || "Enroll Now — Limited Seats!"}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            background: BRAND.primaryDark,
            padding: "12px 50px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 11, color: BRAND.white, opacity: 0.7 }}>
            {school.address}
          </div>
          <div style={{ fontSize: 11, color: BRAND.accentLight }}>
            {school.email}
          </div>
        </div>
      </div>

      {/* Corner decorative element */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          right: 0,
          width: 120,
          height: 120,
          background: BRAND.primary,
          opacity: 0.05,
          borderRadius: "50%",
          transform: "translate(40px, 0)",
        }}
      />
    </div>
  );
}
