import { BRAND, school } from "@/templates/shared-styles";
import { feeStructure } from "@/data/finance";

interface Props {
  fields: Record<string, string>;
}

export default function FeeStructureCard({ fields }: Props) {
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
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${BRAND.primaryDark}, ${BRAND.primary})`,
          padding: "40px 50px 36px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -20,
            right: 30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: `2px solid rgba(255,255,255,0.08)`,
          }}
        />
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: BRAND.accentLight,
            textTransform: "uppercase" as const,
            letterSpacing: 3,
            marginBottom: 8,
          }}
        >
          {school.name}
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: BRAND.white,
            lineHeight: 1.15,
          }}
        >
          {fields.headline || "Fee Structure 2026-27"}
        </div>
        <div
          style={{
            fontSize: 14,
            color: BRAND.accentLight,
            marginTop: 8,
            opacity: 0.8,
          }}
        >
          Academic Year {fields.year || "2026-27"}
        </div>
      </div>

      {/* Gold accent */}
      <div
        style={{
          height: 4,
          background: `linear-gradient(90deg, ${BRAND.accent}, ${BRAND.accentLight}, ${BRAND.accent})`,
        }}
      />

      {/* Fee Table */}
      <div style={{ flex: 1, padding: "36px 50px", display: "flex", flexDirection: "column" }}>
        {/* Table header */}
        <div
          style={{
            display: "flex",
            padding: "14px 20px",
            background: BRAND.primaryDark,
            borderRadius: "10px 10px 0 0",
          }}
        >
          <div
            style={{
              flex: 2,
              fontSize: 12,
              fontWeight: 700,
              color: BRAND.accentLight,
              textTransform: "uppercase" as const,
              letterSpacing: 1,
            }}
          >
            Class
          </div>
          <div
            style={{
              flex: 1,
              fontSize: 12,
              fontWeight: 700,
              color: BRAND.accentLight,
              textTransform: "uppercase" as const,
              letterSpacing: 1,
              textAlign: "right",
            }}
          >
            Quarterly
          </div>
          <div
            style={{
              flex: 1,
              fontSize: 12,
              fontWeight: 700,
              color: BRAND.accentLight,
              textTransform: "uppercase" as const,
              letterSpacing: 1,
              textAlign: "right",
            }}
          >
            Annual
          </div>
          <div
            style={{
              flex: 1,
              fontSize: 12,
              fontWeight: 700,
              color: BRAND.accentLight,
              textTransform: "uppercase" as const,
              letterSpacing: 1,
              textAlign: "right",
            }}
          >
            Admission
          </div>
        </div>

        {/* Table rows */}
        {feeStructure.map((row, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              padding: "16px 20px",
              background: i % 2 === 0 ? BRAND.cream : BRAND.white,
              borderLeft: `1px solid ${BRAND.cream}`,
              borderRight: `1px solid ${BRAND.cream}`,
              ...(i === feeStructure.length - 1
                ? { borderRadius: "0 0 10px 10px", borderBottom: `1px solid ${BRAND.cream}` }
                : {}),
            }}
          >
            <div
              style={{
                flex: 2,
                fontSize: 15,
                fontWeight: 600,
                color: BRAND.primaryDark,
              }}
            >
              {row.class}
            </div>
            <div
              style={{
                flex: 1,
                fontSize: 15,
                fontWeight: 500,
                color: BRAND.textDark,
                textAlign: "right",
              }}
            >
              ₹{row.quarterly.toLocaleString("en-IN")}
            </div>
            <div
              style={{
                flex: 1,
                fontSize: 15,
                fontWeight: 500,
                color: BRAND.textDark,
                textAlign: "right",
              }}
            >
              ₹{row.annual.toLocaleString("en-IN")}
            </div>
            <div
              style={{
                flex: 1,
                fontSize: 15,
                fontWeight: 500,
                color: BRAND.textDark,
                textAlign: "right",
              }}
            >
              ₹{row.admission.toLocaleString("en-IN")}
            </div>
          </div>
        ))}

        {/* Note */}
        <div
          style={{
            marginTop: 28,
            padding: "18px 22px",
            background: BRAND.cream,
            borderRadius: 10,
            borderLeft: `4px solid ${BRAND.accent}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: BRAND.primary,
              textTransform: "uppercase" as const,
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            Please Note
          </div>
          <div
            style={{
              fontSize: 14,
              color: BRAND.textMuted,
              lineHeight: 1.5,
            }}
          >
            {fields.note || "Fees payable quarterly. Sibling discount available."}
          </div>
        </div>

        {/* Additional info */}
        <div
          style={{
            marginTop: 20,
            display: "flex",
            gap: 16,
          }}
        >
          {["UPI", "Cash", "Bank Transfer"].map((method, i) => (
            <div
              key={i}
              style={{
                padding: "8px 16px",
                border: `1px solid ${BRAND.primaryLight}`,
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                color: BRAND.primary,
              }}
            >
              {method}
            </div>
          ))}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Contact */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 24,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
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
            <div style={{ fontSize: 11, color: BRAND.textMuted }}>For inquiries</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: BRAND.primaryDark }}>
              {fields.phone || school.phone}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: BRAND.primaryDark,
          padding: "14px 50px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 11, color: BRAND.white, opacity: 0.7 }}>
          {school.address}
        </div>
        <div style={{ fontSize: 11, color: BRAND.accentLight }}>
          {school.email}
        </div>
      </div>
    </div>
  );
}
