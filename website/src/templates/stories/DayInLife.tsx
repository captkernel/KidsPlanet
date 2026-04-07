import { BRAND, school } from "@/templates/shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function DayInLife({ fields }: Props) {
  const scheduleLines = (fields.schedule || "").split("\n").filter(Boolean);
  const entries = scheduleLines.map((line) => {
    const dashIdx = line.indexOf("\u2014");
    if (dashIdx !== -1) {
      return { time: line.slice(0, dashIdx).trim(), activity: line.slice(dashIdx + 1).trim() };
    }
    const hyphenIdx = line.indexOf(" - ");
    if (hyphenIdx !== -1) {
      return { time: line.slice(0, hyphenIdx).trim(), activity: line.slice(hyphenIdx + 3).trim() };
    }
    return { time: "", activity: line.trim() };
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: BRAND.cream,
        fontFamily: BRAND.font,
        color: BRAND.textDark,
        display: "flex",
        flexDirection: "column",
        padding: "72px 56px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 10,
          background: `linear-gradient(90deg, ${BRAND.primary}, ${BRAND.accent})`,
        }}
      />

      {/* School name */}
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: BRAND.primary,
          letterSpacing: 3,
          textTransform: "uppercase",
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        {school.name}
      </div>

      {/* Headline */}
      <div
        style={{
          fontSize: 52,
          fontWeight: 900,
          color: BRAND.primary,
          textAlign: "center",
          marginBottom: 48,
          lineHeight: 1.15,
        }}
      >
        {fields.headline}
      </div>

      {/* Timeline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          flex: 1,
          position: "relative",
          paddingLeft: 40,
        }}
      >
        {/* Vertical timeline line */}
        <div
          style={{
            position: "absolute",
            left: 12,
            top: 8,
            bottom: 8,
            width: 3,
            background: `linear-gradient(180deg, ${BRAND.primary}, ${BRAND.accent})`,
            borderRadius: 2,
          }}
        />

        {entries.map((entry, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              position: "relative",
              marginBottom: 8,
            }}
          >
            {/* Timeline dot */}
            <div
              style={{
                position: "absolute",
                left: -34,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: i % 2 === 0 ? BRAND.primary : BRAND.accent,
                border: `3px solid ${BRAND.cream}`,
                boxShadow: `0 0 0 2px ${i % 2 === 0 ? BRAND.primary : BRAND.accent}`,
              }}
            />

            {/* Time block */}
            <div
              style={{
                background: BRAND.white,
                borderRadius: 12,
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: 16,
                flex: 1,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                borderLeft: `4px solid ${i % 2 === 0 ? BRAND.primary : BRAND.accent}`,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: BRAND.primary,
                  minWidth: 120,
                  whiteSpace: "nowrap",
                }}
              >
                {entry.time}
              </div>
              <div style={{ fontSize: 22, fontWeight: 500, color: BRAND.textDark }}>
                {entry.activity}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          marginTop: 32,
          fontSize: 18,
          color: BRAND.textMuted,
        }}
      >
        {school.tagline}
      </div>
    </div>
  );
}
