export function buildPageSvgDataUrl(
  index: number,
  quality: "low" | "high",
  width: number,
  height: number
) {
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
    <path d="M${Math.round(width * 0.12)} ${Math.round(height * 0.32)} H${Math.round(width * 0.88)}" />
    <path d="M${Math.round(width * 0.12)} ${Math.round(height * 0.38)} H${Math.round(width * 0.88)}" />
    <path d="M${Math.round(width * 0.12)} ${Math.round(height * 0.44)} H${Math.round(width * 0.88)}" />
    <path d="M${Math.round(width * 0.12)} ${Math.round(height * 0.5)} H${Math.round(width * 0.88)}" />
    <path d="M${Math.round(width * 0.12)} ${Math.round(height * 0.56)} H${Math.round(width * 0.88)}" />
  </g>`
      : "";

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${bgA}" />
      <stop offset="100%" stop-color="${bgB}" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g)" />
  <rect
    x="${Math.round(width * 0.075)}"
    y="${Math.round(height * 0.07)}"
    width="${Math.round(width * 0.85)}"
    height="${Math.round(height * 0.86)}"
    rx="${Math.round(width * 0.025)}"
    fill="rgba(255,255,255,0.9)"
  />
  <text x="${Math.round(width * 0.11)}" y="${Math.round(height * 0.15)}" font-size="${Math.round(
    width * 0.05
  )}" font-family="Arial, sans-serif" fill="#132036" font-weight="700">
    CRL Longgang Brochure
  </text>
  <text x="${Math.round(width * 0.11)}" y="${Math.round(height * 0.22)}" font-size="${Math.round(
    width * 0.038
  )}" font-family="Arial, sans-serif" fill="#2b3a55">
    Facing Pages Demo - Page ${index}
  </text>
  <text x="${Math.round(width * 0.11)}" y="${Math.round(height * 0.86)}" font-size="${Math.round(
    width * 0.024
  )}" font-family="Arial, sans-serif" fill="#4d5f81">
    Replace this generated page with your real export images (WebP preferred).
  </text>
  <circle cx="${Math.round(width * 0.5)}" cy="${Math.round(height * 0.52)}" r="${Math.round(
    Math.min(width, height) * 0.18
  )}" fill="rgba(20,44,90,0.08)" />
  ${detailLayer}
  <text x="${Math.round(width * 0.5)}" y="${Math.round(height * 0.54)}" text-anchor="middle" font-size="${Math.round(
    Math.min(width, height) * 0.16
  )}" font-family="Arial, sans-serif" fill="#1f3f76" font-weight="800">
    ${index}
  </text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
