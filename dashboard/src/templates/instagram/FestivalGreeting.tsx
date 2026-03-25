import { BRAND, school } from "@/templates/shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function FestivalGreeting({ fields }: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(180deg, #fdf6e8 0%, #fff8ee 40%, ${BRAND.cream} 100%)`,
        fontFamily: BRAND.font,
        color: BRAND.textDark,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 60,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative corner borders */}
      {/* Top-left */}
      <div
        style={{
          position: "absolute",
          top: 28,
          left: 28,
          width: 80,
          height: 80,
          borderTop: `4px solid ${BRAND.accent}`,
          borderLeft: `4px solid ${BRAND.accent}`,
          borderRadius: "8px 0 0 0",
        }}
      />
      {/* Top-right */}
      <div
        style={{
          position: "absolute",
          top: 28,
          right: 28,
          width: 80,
          height: 80,
          borderTop: `4px solid ${BRAND.accent}`,
          borderRight: `4px solid ${BRAND.accent}`,
          borderRadius: "0 8px 0 0",
        }}
      />
      {/* Bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: 28,
          width: 80,
          height: 80,
          borderBottom: `4px solid ${BRAND.accent}`,
          borderLeft: `4px solid ${BRAND.accent}`,
          borderRadius: "0 0 0 8px",
        }}
      />
      {/* Bottom-right */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          right: 28,
          width: 80,
          height: 80,
          borderBottom: `4px solid ${BRAND.accent}`,
          borderRight: `4px solid ${BRAND.accent}`,
          borderRadius: "0 0 8px 0",
        }}
      />

      {/* Inner decorative border */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 48,
          right: 48,
          bottom: 48,
          border: `1px solid ${BRAND.accent}40`,
          borderRadius: 4,
        }}
      />

      {/* Decorative top flourish */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 40,
        }}
      >
        <div style={{ width: 50, height: 2, background: BRAND.accent }} />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: BRAND.accent,
          }}
        />
        <div style={{ width: 50, height: 2, background: BRAND.accent }} />
      </div>

      {/* Greeting */}
      <div
        style={{
          fontSize: 72,
          fontWeight: 900,
          color: BRAND.primary,
          lineHeight: 1.1,
          marginBottom: 28,
          maxWidth: "85%",
        }}
      >
        {fields.greeting}
      </div>

      {/* Message */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 400,
          lineHeight: 1.6,
          color: BRAND.textMuted,
          maxWidth: "80%",
          marginBottom: 40,
          fontStyle: "italic",
        }}
      >
        {fields.message}
      </div>

      {/* Bottom flourish */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 36,
        }}
      >
        <div style={{ width: 50, height: 2, background: BRAND.accent }} />
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: BRAND.accent,
          }}
        />
        <div style={{ width: 50, height: 2, background: BRAND.accent }} />
      </div>

      {/* From / school name */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: BRAND.accent,
          letterSpacing: 1,
        }}
      >
        {fields.from}
      </div>
    </div>
  );
}
