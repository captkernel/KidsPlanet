import { BRAND, school } from "@/templates/shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function HolidayNotice({ fields }: Props) {
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
          background: `linear-gradient(90deg, ${BRAND.accent}, ${BRAND.accentLight}, ${BRAND.accent})`,
        }}
      />

      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${BRAND.primaryDark}, ${BRAND.primary})`,
          padding: "36px 52px 30px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: -20,
            right: 40,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: BRAND.primaryLight,
            opacity: 0.12,
          }}
        />
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
        {/* Notice badge */}
        <div
          style={{
            background: BRAND.accent,
            color: BRAND.primaryDark,
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase" as const,
            letterSpacing: 3,
            padding: "8px 24px",
            borderRadius: 20,
            marginBottom: 28,
          }}
        >
          {fields.headline || "Holiday Notice"}
        </div>

        {/* Occasion name - large */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: BRAND.primaryDark,
            lineHeight: 1.1,
            marginBottom: 12,
          }}
        >
          {fields.occasion || "Holi"}
        </div>

        {/* Decorative dots */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: BRAND.accent,
            }}
          />
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: BRAND.primaryLight,
            }}
          />
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: BRAND.accent,
            }}
          />
        </div>

        {/* Info cards row */}
        <div
          style={{
            display: "flex",
            gap: 20,
            width: "100%",
            maxWidth: 700,
          }}
        >
          {/* Holiday dates */}
          <div
            style={{
              flex: 1,
              background: BRAND.white,
              border: `2px solid ${BRAND.primaryLight}`,
              borderRadius: 14,
              padding: "28px 24px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: BRAND.primary,
                textTransform: "uppercase" as const,
                letterSpacing: 2,
                marginBottom: 12,
              }}
            >
              Holiday Dates
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: BRAND.primaryDark,
              }}
            >
              {fields.dates || "March 13–14, 2026"}
            </div>
          </div>

          {/* Resume date */}
          <div
            style={{
              flex: 1,
              background: `linear-gradient(135deg, ${BRAND.primaryDark}, ${BRAND.primary})`,
              borderRadius: 14,
              padding: "28px 24px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: BRAND.accentLight,
                textTransform: "uppercase" as const,
                letterSpacing: 2,
                marginBottom: 12,
              }}
            >
              School Resumes
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: BRAND.white,
              }}
            >
              {fields.resumeDate || "March 16, 2026 (Monday)"}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: BRAND.primaryDark,
          padding: "16px 52px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 12, color: BRAND.accentLight, fontWeight: 600 }}>
          {school.name}
        </div>
        <div style={{ fontSize: 11, color: BRAND.white, opacity: 0.5 }}>|</div>
        <div style={{ fontSize: 11, color: BRAND.white, opacity: 0.6 }}>
          {school.phone}
        </div>
      </div>
    </div>
  );
}
