import { BRAND, school } from "@/templates/shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function SchoolBrochure({ fields }: Props) {
  const uspsRaw = fields.usps || "• Kullu's Only Dedicated Preschool\n• 20:1 Student-Teacher Ratio\n• Holistic Development Focus\n• Safe, Loving Environment";
  const usps = uspsRaw
    .split("\n")
    .map((line) => line.replace(/^[•\-\*]\s*/, "").trim())
    .filter(Boolean);

  const headerImage = fields.headerImage;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        fontFamily: BRAND.font,
        background: BRAND.white,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header block */}
      <div
        style={{
          background: `linear-gradient(135deg, ${BRAND.primaryDark}, ${BRAND.primary})`,
          padding: "50px 50px 44px",
          position: "relative",
          overflow: "hidden",
          ...(headerImage
            ? {
                backgroundImage: `url(${headerImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}),
        }}
      >
        {/* Header overlay when image is set */}
        {headerImage && (
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

        {/* Decorative shapes in header */}
        <div
          style={{
            position: "absolute",
            top: -30,
            right: 40,
            width: 140,
            height: 140,
            borderRadius: "50%",
            border: `2px solid rgba(255,255,255,0.1)`,
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -50,
            right: -20,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            zIndex: 1,
          }}
        />

        {/* School name — large */}
        <div
          style={{
            fontSize: 42,
            fontWeight: 800,
            color: BRAND.white,
            lineHeight: 1.1,
            marginBottom: 12,
            position: "relative",
            zIndex: 2,
            ...(headerImage ? { textShadow: "0 2px 12px rgba(0,0,0,0.3)" } : {}),
          }}
        >
          {school.name}
        </div>
        <div
          style={{
            fontSize: 15,
            color: BRAND.accentLight,
            fontWeight: 500,
            position: "relative",
            zIndex: 2,
          }}
        >
          Est. {school.founded} · {school.tagline}
        </div>
      </div>

      {/* Gold accent bar */}
      <div
        style={{
          height: 5,
          background: `linear-gradient(90deg, ${BRAND.accent}, ${BRAND.accentLight}, ${BRAND.accent})`,
        }}
      />

      {/* Main content */}
      <div style={{ flex: 1, padding: "44px 50px", display: "flex", flexDirection: "column" }}>
        {/* Headline */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: BRAND.primaryDark,
            lineHeight: 1.2,
            marginBottom: 10,
          }}
        >
          {fields.headline || "Welcome to Kids Planet"}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 17,
            color: BRAND.textMuted,
            marginBottom: 32,
            fontStyle: "italic",
          }}
        >
          {fields.tagline || "Where Every Child Shines"}
        </div>

        {/* Divider */}
        <div
          style={{
            width: 50,
            height: 4,
            background: BRAND.accent,
            borderRadius: 2,
            marginBottom: 32,
          }}
        />

        {/* USPs section */}
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: BRAND.primary,
            textTransform: "uppercase" as const,
            letterSpacing: 2,
            marginBottom: 20,
          }}
        >
          Why Choose Us
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginBottom: 36,
          }}
        >
          {usps.map((usp, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryLight})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: BRAND.white,
                  fontSize: 14,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                ✓
              </div>
              <div
                style={{
                  fontSize: 17,
                  color: BRAND.textDark,
                  fontWeight: 500,
                  lineHeight: 1.4,
                  paddingTop: 6,
                }}
              >
                {usp}
              </div>
            </div>
          ))}
        </div>

        {/* Programs offered */}
        <div
          style={{
            background: BRAND.cream,
            borderRadius: 12,
            padding: "24px 28px",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: BRAND.primary,
              textTransform: "uppercase" as const,
              letterSpacing: 2,
              marginBottom: 14,
            }}
          >
            Programs Offered
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap" as const,
              gap: 8,
            }}
          >
            {school.classes.map((cls, i) => (
              <div
                key={i}
                style={{
                  background: BRAND.white,
                  border: `1px solid ${BRAND.primaryLight}`,
                  borderRadius: 6,
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: BRAND.primaryDark,
                }}
              >
                {cls}
              </div>
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Contact section */}
        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${BRAND.accent}, ${BRAND.accentDark})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: BRAND.primaryDark,
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            ✆
          </div>
          <div>
            <div style={{ fontSize: 12, color: BRAND.textMuted, marginBottom: 2 }}>
              Contact Us
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: BRAND.primaryDark }}>
              {fields.phone || school.phone}
            </div>
            <div style={{ fontSize: 12, color: BRAND.textMuted, marginTop: 2 }}>
              {school.email}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          background: BRAND.primaryDark,
          padding: "16px 50px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 12, color: BRAND.white, opacity: 0.7 }}>
          {school.address}
        </div>
      </div>
    </div>
  );
}
