import { BRAND, school } from "./shared-styles";

interface Props {
  fields: Record<string, string>;
}

export default function PlaceholderTemplate({ fields }: Props) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: `linear-gradient(135deg, ${BRAND.primaryDark}, ${BRAND.primary})`,
      fontFamily: BRAND.font, color: BRAND.white, padding: 40,
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
      textAlign: "center", position: "relative",
    }}>
      <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>
        {fields.headline || fields.greeting || school.name}
      </div>
      <div style={{ fontSize: 18, opacity: 0.8, marginBottom: 24 }}>
        {fields.subheadline || fields.message || school.tagline}
      </div>
      {fields.cta && (
        <div style={{
          background: BRAND.accent, color: BRAND.primaryDark,
          padding: "12px 32px", borderRadius: 8, fontWeight: 700, fontSize: 16,
        }}>
          {fields.cta}
        </div>
      )}
      <div style={{ position: "absolute", bottom: 20, opacity: 0.5, fontSize: 12 }}>
        {school.name} · {school.phone}
      </div>
    </div>
  );
}
