import { BRAND, school } from "@/templates/shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function AdmissionInquiryReply({ fields }: Props) {
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
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          height: 6,
          background: `linear-gradient(90deg, ${BRAND.primary}, ${BRAND.primaryLight}, ${BRAND.primary})`,
        }}
      />

      {/* Header with school branding */}
      <div
        style={{
          background: `linear-gradient(135deg, ${BRAND.primaryDark}, ${BRAND.primary})`,
          padding: "44px 52px 38px",
          position: "relative",
        }}
      >
        {/* Decorative circle */}
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: BRAND.primaryLight,
            opacity: 0.15,
          }}
        />
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: BRAND.accentLight,
            textTransform: "uppercase" as const,
            letterSpacing: 3,
            marginBottom: 6,
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

      {/* Accent divider */}
      <div
        style={{
          height: 4,
          background: `linear-gradient(90deg, ${BRAND.accent}, ${BRAND.accentLight})`,
        }}
      />

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 56px",
          textAlign: "center",
        }}
      >
        {/* Headline */}
        <div
          style={{
            fontSize: 42,
            fontWeight: 800,
            color: BRAND.primaryDark,
            lineHeight: 1.15,
            marginBottom: 24,
          }}
        >
          {fields.headline || "Thank You for Your Interest!"}
        </div>

        {/* Message */}
        <div
          style={{
            fontSize: 20,
            color: BRAND.textMuted,
            lineHeight: 1.6,
            marginBottom: 40,
            maxWidth: 720,
          }}
        >
          {fields.message ||
            "We'd love to welcome your child to the Kids Planet family. Visit us to learn more!"}
        </div>

        {/* Decorative divider */}
        <div
          style={{
            width: 60,
            height: 4,
            background: BRAND.accent,
            borderRadius: 2,
            marginBottom: 40,
          }}
        />

        {/* Visit Hours card */}
        <div
          style={{
            background: BRAND.white,
            border: `2px solid ${BRAND.primaryLight}`,
            borderRadius: 14,
            padding: "28px 44px",
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
              marginBottom: 10,
            }}
          >
            Visit Hours
          </div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: BRAND.primaryDark,
            }}
          >
            {fields.visitHours || "Mon–Sat: 9 AM – 1 PM"}
          </div>
        </div>

        {/* Phone */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: BRAND.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: BRAND.white,
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            ✆
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: BRAND.primaryDark,
            }}
          >
            {fields.phone || school.phone}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: BRAND.primaryDark,
          padding: "14px 52px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 11, color: BRAND.white, opacity: 0.6 }}>
          {school.address}
        </div>
      </div>
    </div>
  );
}
