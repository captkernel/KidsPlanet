import { BRAND, school } from "@/templates/shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function AnnualDayFlyer({ fields }: Props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        fontFamily: BRAND.font,
        background: `linear-gradient(170deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 45%, ${BRAND.primaryLight} 100%)`,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Decorative top border — festive */}
      <div
        style={{
          width: "100%",
          height: 12,
          background: `repeating-linear-gradient(90deg, ${BRAND.accent} 0px, ${BRAND.accent} 20px, ${BRAND.accentLight} 20px, ${BRAND.accentLight} 40px, ${BRAND.accentDark} 40px, ${BRAND.accentDark} 60px)`,
        }}
      />

      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: -60,
          width: 200,
          height: 200,
          borderRadius: "50%",
          border: `3px solid ${BRAND.accentLight}`,
          opacity: 0.15,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 200,
          right: -80,
          width: 250,
          height: 250,
          borderRadius: "50%",
          border: `3px solid ${BRAND.accentLight}`,
          opacity: 0.1,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 150,
          left: -50,
          width: 180,
          height: 180,
          borderRadius: "50%",
          border: `2px solid ${BRAND.accent}`,
          opacity: 0.12,
        }}
      />

      {/* School name */}
      <div
        style={{
          marginTop: 60,
          fontSize: 14,
          fontWeight: 600,
          color: BRAND.accentLight,
          textTransform: "uppercase" as const,
          letterSpacing: 4,
        }}
      >
        {school.name} presents
      </div>

      {/* Decorative line */}
      <div
        style={{
          width: 80,
          height: 2,
          background: BRAND.accent,
          marginTop: 20,
          marginBottom: 20,
        }}
      />

      {/* Headline */}
      <div
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: BRAND.white,
          textAlign: "center",
          lineHeight: 1.15,
          padding: "0 60px",
          marginBottom: 16,
        }}
      >
        {fields.headline || "Annual Day Celebration 2026"}
      </div>

      {/* Decorative stars row */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 50,
          marginTop: 10,
        }}
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              background: BRAND.accent,
              borderRadius: "50%",
              opacity: i === 2 ? 1 : 0.5,
            }}
          />
        ))}
      </div>

      {/* Date — large and prominent */}
      <div
        style={{
          background: BRAND.accent,
          borderRadius: 16,
          padding: "28px 56px",
          marginBottom: 40,
          textAlign: "center",
          boxShadow: `0 8px 32px rgba(0,0,0,0.3)`,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: BRAND.primaryDark,
            textTransform: "uppercase" as const,
            letterSpacing: 2,
            marginBottom: 6,
          }}
        >
          Save the Date
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: BRAND.primaryDark,
            lineHeight: 1.2,
          }}
        >
          {fields.date || "March 30, 2026"}
        </div>
      </div>

      {/* Venue and Time cards */}
      <div
        style={{
          display: "flex",
          gap: 24,
          marginBottom: 50,
          padding: "0 60px",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "20px 28px",
            textAlign: "center",
            border: `1px solid rgba(255,255,255,0.15)`,
            flex: 1,
            maxWidth: 280,
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
            Venue
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: BRAND.white,
              lineHeight: 1.4,
            }}
          >
            {fields.venue || "Kids Planet School Campus, Dhalpur"}
          </div>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "20px 28px",
            textAlign: "center",
            border: `1px solid rgba(255,255,255,0.15)`,
            flex: 1,
            maxWidth: 280,
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
            Time
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: BRAND.white,
              lineHeight: 1.4,
            }}
          >
            {fields.time || "10:00 AM Onwards"}
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* CTA */}
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: BRAND.accentLight,
          textAlign: "center",
          fontStyle: "italic",
          padding: "0 60px",
          marginBottom: 40,
        }}
      >
        {fields.cta || "All Parents Are Cordially Invited"}
      </div>

      {/* Bottom section */}
      <div
        style={{
          width: "100%",
          background: "rgba(0,0,0,0.2)",
          padding: "20px 50px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 12, color: BRAND.white, opacity: 0.7 }}>
          {school.address}
        </div>
        <div style={{ fontSize: 13, color: BRAND.accentLight, fontWeight: 600 }}>
          {school.phone}
        </div>
      </div>

      {/* Festive bottom border */}
      <div
        style={{
          width: "100%",
          height: 12,
          background: `repeating-linear-gradient(90deg, ${BRAND.accent} 0px, ${BRAND.accent} 20px, ${BRAND.accentLight} 20px, ${BRAND.accentLight} 40px, ${BRAND.accentDark} 40px, ${BRAND.accentDark} 60px)`,
        }}
      />
    </div>
  );
}
