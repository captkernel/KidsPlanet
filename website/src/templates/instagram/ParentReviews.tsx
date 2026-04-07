import { BRAND, school } from "@/templates/shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function ParentReviews({ fields }: Props) {
  const ratingNum = parseFloat(fields.rating) || 4.4;
  const fullStars = Math.floor(ratingNum);
  const hasHalf = ratingNum - fullStars >= 0.3;
  const totalStars = 5;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(170deg, ${BRAND.primaryDark} 0%, ${BRAND.primary} 100%)`,
        fontFamily: BRAND.font,
        color: BRAND.white,
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
      {/* Subtle background pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 30%, rgba(200,168,78,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(200,168,78,0.08) 0%, transparent 50%)",
        }}
      />

      {/* Headline */}
      <div
        style={{
          fontSize: 44,
          fontWeight: 800,
          marginBottom: 32,
          letterSpacing: 1,
          position: "relative",
        }}
      >
        {fields.headline}
      </div>

      {/* Rating display */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 40,
          position: "relative",
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 900, color: BRAND.accent }}>
          {ratingNum.toFixed(1)}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {Array.from({ length: totalStars }).map((_, i) => (
            <div
              key={i}
              style={{
                fontSize: 32,
                color: i < fullStars || (i === fullStars && hasHalf) ? BRAND.accent : "rgba(255,255,255,0.3)",
              }}
            >
              {"\u2605"}
            </div>
          ))}
        </div>
      </div>

      {/* Large quotation mark */}
      <div
        style={{
          fontSize: 120,
          lineHeight: 0.6,
          color: BRAND.accent,
          opacity: 0.4,
          fontFamily: "Georgia, serif",
          marginBottom: 8,
          position: "relative",
        }}
      >
        {"\u201C"}
      </div>

      {/* Review quote */}
      <div
        style={{
          fontSize: 30,
          fontWeight: 500,
          lineHeight: 1.5,
          maxWidth: "85%",
          fontStyle: "italic",
          marginBottom: 28,
          position: "relative",
        }}
      >
        {fields.review}
      </div>

      {/* Closing quotation mark */}
      <div
        style={{
          fontSize: 120,
          lineHeight: 0.3,
          color: BRAND.accent,
          opacity: 0.4,
          fontFamily: "Georgia, serif",
          marginBottom: 24,
          position: "relative",
        }}
      >
        {"\u201D"}
      </div>

      {/* Reviewer */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: BRAND.accentLight,
          position: "relative",
        }}
      >
        {fields.reviewer}
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: 36,
          display: "flex",
          gap: 16,
          alignItems: "center",
          fontSize: 16,
          opacity: 0.6,
        }}
      >
        <span>{school.name}</span>
        <span style={{ color: BRAND.accent }}>{"\u00B7"}</span>
        <span>Google Reviews</span>
      </div>
    </div>
  );
}
