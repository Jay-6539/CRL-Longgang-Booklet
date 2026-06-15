import { NextResponse } from "next/server";

export const dynamic = "force-static";

function createSvgPage(index: number, quality: "low" | "high") {
  const palette = [
    ["#0f1728", "#1e2f52"],
    ["#1a2440", "#293d67"],
    ["#17283d", "#2a4b66"],
    ["#13293f", "#2f5d7a"]
  ];
  const [bgA, bgB] = palette[index % palette.length];

  const detailLayer =
    quality === "high"
      ? `
    <g fill="none" stroke="rgba(20,50,93,0.16)">
      <path d="M180 500 H1020" />
      <path d="M180 560 H1020" />
      <path d="M180 620 H1020" />
      <path d="M180 680 H1020" />
      <path d="M180 740 H1020" />
    </g>
`
      : "";

  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1700">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="${bgA}" />
        <stop offset="100%" stop-color="${bgB}" />
      </linearGradient>
    </defs>
    <rect width="1200" height="1700" fill="url(#g)" />
    <rect x="90" y="120" width="1020" height="1460" rx="24" fill="rgba(255,255,255,0.9)" />
    <text x="140" y="260" font-size="58" font-family="Arial, sans-serif" fill="#132036" font-weight="700">
      CRL Longgang Brochure
    </text>
    <text x="140" y="350" font-size="42" font-family="Arial, sans-serif" fill="#2b3a55">
      Facing Pages Demo - Page ${index}
    </text>
    <text x="140" y="1460" font-size="30" font-family="Arial, sans-serif" fill="#4d5f81">
      Replace this generated page with your real export images (WebP preferred).
    </text>
    <circle cx="600" cy="880" r="250" fill="rgba(20,44,90,0.08)" />
    ${detailLayer}
    <text x="600" y="900" text-anchor="middle" font-size="180" font-family="Arial, sans-serif" fill="#1f3f76" font-weight="800">
      ${index}
    </text>
  </svg>
`;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ index: string }> }
) {
  const params = await context.params;
  const pageIndex = Number(params.index);
  const qualityParam = new URL(request.url).searchParams.get("q");
  const quality = qualityParam === "high" ? "high" : "low";

  if (!Number.isInteger(pageIndex) || pageIndex < 1) {
    return NextResponse.json({ error: "Invalid page index" }, { status: 400 });
  }

  const svg = createSvgPage(pageIndex, quality);
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
