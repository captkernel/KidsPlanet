import { BRAND, school } from "@/templates/shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function WhyKidsPlanet({ fields }: Props) {
  const reasons = [
    { num: "01", text: fields.reason1 },
    { num: "02", text: fields.reason2 },
    { num: "03", text: fields.reason3 },
    { num: "04", text: fields.reason4 },
  ];

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
        padding: 60,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 12,
          height: "100%",
          background: `linear-gradient(180deg, ${BRAND.primary}, ${BRAND.accent})`,
        }}
      />

      {/* Headline */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 900,
          color: BRAND.primary,
          marginBottom: 12,
          lineHeight: 1.1,
        }}
      >
        {fields.headline}
      </div>

      {/* Divider */}
      <div
        style={{
          width: 80,
          height: 5,
          background: BRAND.accent,
          borderRadius: 3,
          marginBottom: 40,
        }}
      />

      {/* Reasons list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1 }}>
        {reasons.map((r) => (
          <div
            key={r.num}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              background: BRAND.white,
              borderRadius: 16,
              padding: "24px 28px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              borderLeft: `5px solid ${BRAND.primary}`,
            }}
          >
            <div
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: BRAND.accent,
                minWidth: 56,
              }}
            >
              {r.num}
            </div>
            <div style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.3 }}>
              {r.text}
            </div>
          </div>
        ))}
      </div>

      {/* School footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 32,
          paddingTop: 20,
          borderTop: `2px solid ${BRAND.primary}20`,
        }}
      >
        <div style={{ fontSize: 22, fontWeight: 800, color: BRAND.primary }}>
          {school.name}
        </div>
        <div style={{ fontSize: 16, color: BRAND.textMuted }}>
          {school.phone}
        </div>
      </div>
    </div>
  );
}
