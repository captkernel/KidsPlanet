import { BRAND, school } from "@/templates/shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function SummerCampFlyer({ fields }: Props) {
  const activities = (fields.activities || "Art · Dance · Sports · Science Fun · Storytelling")
    .split(" · ")
    .map((a) => a.trim())
    .filter(Boolean);

  const accentColors = [
    "#e85d75",
    "#f5a623",
    "#4ecdc4",
    "#7c5cbf",
    "#45b7d1",
    "#96c93d",
  ];

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
      {/* Colorful top bar */}
      <div style={{ display: "flex", height: 10 }}>
        {accentColors.map((c, i) => (
          <div key={i} style={{ flex: 1, background: c }} />
        ))}
      </div>

      {/* Decorative shapes */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 30,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "#f5a623",
          opacity: 0.12,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 120,
          right: 80,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#4ecdc4",
          opacity: 0.15,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: -30,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "#e85d75",
          opacity: 0.08,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 300,
          left: -40,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "#7c5cbf",
          opacity: 0.08,
        }}
      />

      {/* Header */}
      <div style={{ padding: "40px 50px 0" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: BRAND.primary,
            textTransform: "uppercase" as const,
            letterSpacing: 3,
            marginBottom: 6,
          }}
        >
          {school.name}
        </div>
        <div style={{ fontSize: 11, color: BRAND.textMuted }}>
          {school.tagline}
        </div>
      </div>

      {/* Headline */}
      <div
        style={{
          padding: "36px 50px 0",
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: BRAND.primaryDark,
            lineHeight: 1.05,
            marginBottom: 8,
          }}
        >
          {fields.headline || "Summer Camp 2026"}
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#e85d75",
            textTransform: "uppercase" as const,
            letterSpacing: 2,
          }}
        >
          Fun-filled learning awaits!
        </div>
      </div>

      {/* Dates and Age banner */}
      <div
        style={{
          margin: "32px 50px 0",
          display: "flex",
          gap: 16,
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryLight})`,
            borderRadius: 12,
            padding: "16px 24px",
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: BRAND.accentLight,
              textTransform: "uppercase" as const,
              letterSpacing: 1,
              marginBottom: 4,
            }}
          >
            Dates
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: BRAND.white }}>
            {fields.dates || "May 15 – June 15, 2026"}
          </div>
        </div>
        <div
          style={{
            background: `linear-gradient(135deg, #e85d75, #f5a623)`,
            borderRadius: 12,
            padding: "16px 24px",
            minWidth: 150,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(255,255,255,0.8)",
              textTransform: "uppercase" as const,
              letterSpacing: 1,
              marginBottom: 4,
            }}
          >
            Age Group
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: BRAND.white }}>
            {fields.age || "Ages 3–12 Years"}
          </div>
        </div>
      </div>

      {/* Activities section */}
      <div style={{ padding: "36px 50px 0", flex: 1 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: BRAND.textMuted,
            textTransform: "uppercase" as const,
            letterSpacing: 2,
            marginBottom: 20,
          }}
        >
          Activities
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {activities.map((activity, i) => (
            <div
              key={i}
              style={{
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
                  background: accentColors[i % accentColors.length],
                  opacity: 0.9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: BRAND.white,
                  fontSize: 20,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: BRAND.textDark,
                }}
              >
                {activity}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact section */}
      <div
        style={{
          margin: "0 50px",
          padding: "20px 0",
          borderTop: `2px solid ${BRAND.cream}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: BRAND.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: BRAND.white,
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          ✆
        </div>
        <div>
          <div style={{ fontSize: 12, color: BRAND.textMuted }}>Register now</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: BRAND.primaryDark }}>
            {fields.phone || school.phone}
          </div>
        </div>
      </div>

      {/* Bottom colorful bar */}
      <div style={{ display: "flex", height: 10 }}>
        {accentColors.map((c, i) => (
          <div key={i} style={{ flex: 1, background: c }} />
        ))}
      </div>
    </div>
  );
}
