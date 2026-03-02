import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const truncate = (value: string, max: number) => {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, max - 1)}...`;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = truncate(searchParams.get("title") || "Arcanine Tecnologia", 90);
  const description = truncate(
    searchParams.get("description") || "Desenvolvimento web com foco em resultado.",
    140,
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "radial-gradient(circle at top left, #14b8a6 0%, #e2e8f0 42%, #f8fafc 100%)",
        color: "#0f172a",
        padding: "64px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignSelf: "flex-start",
          borderRadius: "999px",
          border: "2px solid #0f766e",
          background: "rgba(20, 184, 166, 0.18)",
          color: "#115e59",
          padding: "10px 18px",
          fontSize: 28,
          fontWeight: 600,
        }}
      >
        Arcanine Tecnologia
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontSize: 64,
            lineHeight: 1.1,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 34,
            lineHeight: 1.35,
            color: "#334155",
            maxWidth: 960,
          }}
        >
          {description}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 26,
          color: "#334155",
        }}
      >
        <span>arcanine.com.br</span>
        <span>Sites, sistemas, automacoes e IA aplicada</span>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
