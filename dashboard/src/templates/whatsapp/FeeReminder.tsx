import { BRAND, school } from "@/templates/shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function FeeReminder({ fields }: Props) {
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

      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${BRAND.primaryDark}, ${BRAND.primary})`,
          padding: "36px 52px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: BRAND.accentLight,
              textTransform: "uppercase" as const,
              letterSpacing: 3,
              marginBottom: 4,
            }}
          >
            {school.name}
          </div>
          <div style={{ fontSize: 12, color: BRAND.white, opacity: 0.7 }}>
            {school.tagline}
          </div>
        </div>
        {/* Calendar icon motif */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: BRAND.white,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "100%",
              height: 14,
              background: BRAND.accent,
            }}
          />
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 800,
              color: BRAND.primaryDark,
            }}
          >
            !
          </div>
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
          padding: "48px 56px",
        }}
      >
        {/* Headline */}
        <div
          style={{
            fontSize: 40,
            fontWeight: 800,
            color: BRAND.primaryDark,
            lineHeight: 1.15,
            marginBottom: 12,
          }}
        >
          {fields.headline || "Fee Payment Reminder"}
        </div>

        {/* Gentle intro */}
        <div
          style={{
            fontSize: 17,
            color: BRAND.textMuted,
            lineHeight: 1.5,
            marginBottom: 36,
          }}
        >
          Dear Parent, this is a gentle reminder regarding fee payment for the
          current quarter.
        </div>

        {/* Quarter & Due Date cards */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginBottom: 36,
          }}
        >
          {/* Quarter card */}
          <div
            style={{
              flex: 1,
              background: BRAND.white,
              border: `2px solid ${BRAND.primaryLight}`,
              borderRadius: 14,
              padding: "24px 28px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: BRAND.primary,
                textTransform: "uppercase" as const,
                letterSpacing: 2,
                marginBottom: 10,
              }}
            >
              Quarter
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: BRAND.primaryDark,
                lineHeight: 1.3,
              }}
            >
              {fields.quarter || "Q1 (April – June 2026)"}
            </div>
          </div>

          {/* Due Date card - emphasized */}
          <div
            style={{
              flex: 1,
              background: `linear-gradient(135deg, ${BRAND.primaryDark}, ${BRAND.primary})`,
              borderRadius: 14,
              padding: "24px 28px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: BRAND.accentLight,
                textTransform: "uppercase" as const,
                letterSpacing: 2,
                marginBottom: 10,
              }}
            >
              Due Date
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: BRAND.white,
              }}
            >
              {fields.dueDate || "April 15, 2026"}
            </div>
          </div>
        </div>

        {/* Payment note */}
        <div
          style={{
            background: BRAND.white,
            borderLeft: `4px solid ${BRAND.accent}`,
            borderRadius: "0 10px 10px 0",
            padding: "20px 28px",
            marginBottom: 36,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: BRAND.primary,
              textTransform: "uppercase" as const,
              letterSpacing: 2,
              marginBottom: 6,
            }}
          >
            Payment Options
          </div>
          <div
            style={{
              fontSize: 17,
              color: BRAND.textDark,
              fontWeight: 600,
            }}
          >
            {fields.note || "Pay via UPI, Cash, or Bank Transfer"}
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Contact */}
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
          <div>
            <div style={{ fontSize: 12, color: BRAND.textMuted }}>
              Questions? Contact us
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: BRAND.primaryDark,
              }}
            >
              {fields.phone || school.phone}
            </div>
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
          {school.name} · {school.address}
        </div>
      </div>
    </div>
  );
}
