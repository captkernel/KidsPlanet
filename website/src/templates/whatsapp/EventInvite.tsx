import { BRAND, school } from "@/templates/shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function EventInvite({ fields }: Props) {
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
      {/* Elegant top border - double line */}
      <div
        style={{
          height: 3,
          background: BRAND.accent,
        }}
      />
      <div style={{ height: 4, background: BRAND.cream }} />
      <div
        style={{
          height: 1,
          background: BRAND.accent,
          opacity: 0.5,
        }}
      />

      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${BRAND.primaryDark}, ${BRAND.primary})`,
          padding: "32px 52px 28px",
          marginTop: 24,
          marginLeft: 40,
          marginRight: 40,
          borderRadius: "16px 16px 0 0",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Corner decorations */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 16,
            width: 20,
            height: 20,
            borderTop: `2px solid ${BRAND.accentLight}`,
            borderLeft: `2px solid ${BRAND.accentLight}`,
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 16,
            width: 20,
            height: 20,
            borderTop: `2px solid ${BRAND.accentLight}`,
            borderRight: `2px solid ${BRAND.accentLight}`,
            opacity: 0.5,
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
          Cordially Invites You
        </div>
      </div>

      {/* Main invitation content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 56px",
          textAlign: "center",
          marginLeft: 40,
          marginRight: 40,
          borderLeft: `1px solid ${BRAND.accent}`,
          borderRight: `1px solid ${BRAND.accent}`,
          position: "relative",
        }}
      >
        {/* Headline */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: BRAND.accent,
            letterSpacing: 1,
            marginBottom: 20,
          }}
        >
          {fields.headline || "You're Invited!"}
        </div>

        {/* Decorative divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 40,
              height: 1,
              background: BRAND.accent,
            }}
          />
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              border: `2px solid ${BRAND.accent}`,
            }}
          />
          <div
            style={{
              width: 40,
              height: 1,
              background: BRAND.accent,
            }}
          />
        </div>

        {/* Event name - prominent */}
        <div
          style={{
            fontSize: 46,
            fontWeight: 800,
            color: BRAND.primaryDark,
            lineHeight: 1.15,
            marginBottom: 36,
          }}
        >
          {fields.event || "Annual Day Celebration"}
        </div>

        {/* Date & Venue details */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            width: "100%",
            maxWidth: 560,
          }}
        >
          {/* Date */}
          <div
            style={{
              background: `linear-gradient(135deg, ${BRAND.primaryDark}, ${BRAND.primary})`,
              borderRadius: 12,
              padding: "22px 32px",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: BRAND.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                color: BRAND.primaryDark,
                fontWeight: 800,
              }}
            >
              ...
            </div>
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: BRAND.accentLight,
                  textTransform: "uppercase" as const,
                  letterSpacing: 2,
                  marginBottom: 4,
                }}
              >
                Date & Time
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: BRAND.white,
                }}
              >
                {fields.date || "March 30, 2026 · 10 AM"}
              </div>
            </div>
          </div>

          {/* Venue */}
          <div
            style={{
              background: BRAND.white,
              border: `2px solid ${BRAND.primaryLight}`,
              borderRadius: 12,
              padding: "22px 32px",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: BRAND.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                color: BRAND.white,
                fontWeight: 700,
              }}
            >
              @
            </div>
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: BRAND.primary,
                  textTransform: "uppercase" as const,
                  letterSpacing: 2,
                  marginBottom: 4,
                }}
              >
                Venue
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: BRAND.primaryDark,
                }}
              >
                {fields.venue || "Kids Planet Campus, Dhalpur"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section with elegant border */}
      <div
        style={{
          background: `linear-gradient(135deg, ${BRAND.primaryDark}, ${BRAND.primary})`,
          padding: "20px 52px",
          marginLeft: 40,
          marginRight: 40,
          marginBottom: 24,
          borderRadius: "0 0 16px 16px",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Corner decorations */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            left: 16,
            width: 20,
            height: 20,
            borderBottom: `2px solid ${BRAND.accentLight}`,
            borderLeft: `2px solid ${BRAND.accentLight}`,
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 12,
            right: 16,
            width: 20,
            height: 20,
            borderBottom: `2px solid ${BRAND.accentLight}`,
            borderRight: `2px solid ${BRAND.accentLight}`,
            opacity: 0.5,
          }}
        />
        <div
          style={{
            fontSize: 13,
            color: BRAND.white,
            opacity: 0.8,
          }}
        >
          We look forward to seeing you there!
        </div>
      </div>

      {/* Elegant bottom border */}
      <div
        style={{
          height: 1,
          background: BRAND.accent,
          opacity: 0.5,
        }}
      />
      <div style={{ height: 4, background: BRAND.cream }} />
      <div
        style={{
          height: 3,
          background: BRAND.accent,
        }}
      />
    </div>
  );
}
