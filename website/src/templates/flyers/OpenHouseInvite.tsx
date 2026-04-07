import { BRAND, school } from "@/templates/shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function OpenHouseInvite({ fields }: Props) {
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
        alignItems: "center",
      }}
    >
      {/* Elegant border frame */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          right: 24,
          bottom: 24,
          border: `2px solid ${BRAND.accent}`,
          borderRadius: 4,
          pointerEvents: "none" as const,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 30,
          right: 30,
          bottom: 30,
          border: `1px solid ${BRAND.accentLight}`,
          borderRadius: 2,
          pointerEvents: "none" as const,
        }}
      />

      {/* Corner ornaments */}
      {[
        { top: 18, left: 18 },
        { top: 18, right: 18 },
        { bottom: 18, left: 18 },
        { bottom: 18, right: 18 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos,
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: BRAND.accent,
            opacity: 0.6,
          } as React.CSSProperties}
        />
      ))}

      {/* Top decorative element */}
      <div
        style={{
          marginTop: 70,
          width: 60,
          height: 3,
          background: BRAND.accent,
          borderRadius: 2,
          marginBottom: 24,
        }}
      />

      {/* "You're Invited" label */}
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: BRAND.accent,
          textTransform: "uppercase" as const,
          letterSpacing: 6,
          marginBottom: 8,
        }}
      >
        You&apos;re Invited
      </div>

      {/* School name */}
      <div
        style={{
          fontSize: 13,
          color: BRAND.textMuted,
          marginBottom: 40,
        }}
      >
        {school.name} · {school.tagline}
      </div>

      {/* Main headline */}
      <div
        style={{
          fontSize: 46,
          fontWeight: 800,
          color: BRAND.primaryDark,
          textAlign: "center",
          lineHeight: 1.15,
          padding: "0 70px",
          marginBottom: 16,
        }}
      >
        {fields.headline || "Open House — Visit Kids Planet!"}
      </div>

      {/* CTA message */}
      <div
        style={{
          fontSize: 18,
          color: BRAND.textMuted,
          textAlign: "center",
          fontStyle: "italic",
          padding: "0 80px",
          lineHeight: 1.5,
          marginBottom: 50,
        }}
      >
        {fields.cta || "Come See Where Learning Comes Alive"}
      </div>

      {/* Decorative divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 50,
        }}
      >
        <div style={{ width: 40, height: 1, background: BRAND.accent }} />
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: BRAND.accent,
          }}
        />
        <div style={{ width: 40, height: 1, background: BRAND.accent }} />
      </div>

      {/* Date and Time — elegant cards */}
      <div
        style={{
          display: "flex",
          gap: 0,
          marginBottom: 50,
        }}
      >
        <div
          style={{
            background: BRAND.primaryDark,
            padding: "28px 40px",
            textAlign: "center",
            borderRadius: "12px 0 0 12px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: BRAND.accentLight,
              textTransform: "uppercase" as const,
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            Date
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: BRAND.white,
            }}
          >
            {fields.date || "April 5, 2026"}
          </div>
        </div>
        <div
          style={{
            background: BRAND.accent,
            padding: "28px 40px",
            textAlign: "center",
            borderRadius: "0 12px 12px 0",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: BRAND.primaryDark,
              textTransform: "uppercase" as const,
              letterSpacing: 2,
              marginBottom: 8,
              opacity: 0.7,
            }}
          >
            Time
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: BRAND.primaryDark,
            }}
          >
            {fields.time || "9:00 AM – 1:00 PM"}
          </div>
        </div>
      </div>

      {/* What to expect */}
      <div
        style={{
          display: "flex",
          gap: 32,
          padding: "0 60px",
          marginBottom: 40,
        }}
      >
        {["Meet Our Teachers", "Explore Campus", "Know Our Curriculum"].map(
          (item, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: BRAND.white,
                  border: `2px solid ${BRAND.primary}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 10px",
                  fontSize: 18,
                  fontWeight: 800,
                  color: BRAND.primary,
                }}
              >
                {i + 1}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: BRAND.textDark,
                  lineHeight: 1.3,
                }}
              >
                {item}
              </div>
            </div>
          )
        )}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Contact */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 12, color: BRAND.textMuted, marginBottom: 4 }}>
          For details, call
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: BRAND.primaryDark,
          }}
        >
          {fields.phone || school.phone}
        </div>
      </div>

      {/* Address */}
      <div
        style={{
          fontSize: 11,
          color: BRAND.textMuted,
          textAlign: "center",
          padding: "0 60px",
          marginBottom: 50,
          lineHeight: 1.5,
        }}
      >
        {school.address}
      </div>
    </div>
  );
}
