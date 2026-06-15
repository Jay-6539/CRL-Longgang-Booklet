export const viewerConfig = {
  // 阶段 3: 显示策略可在这里逐项冻结
  displayMode: {
    desktop: "double",
    tablet: "double",
    mobile: "single"
  },
  pageRatio: {
    width: 1200,
    height: 1700
  },
  animation: {
    flipTimeMs: 520,
    maxShadowOpacity: 0.3,
    showCover: true
  },
  toolbar: {
    showZoom: true,
    showJumpToPage: true,
    showFullscreen: true,
    showThumbsEntry: false
  },
  performance: {
    preloadRadius: Number(process.env.NEXT_PUBLIC_PRELOAD_RADIUS ?? 2),
    highResOnlyOnZoom: true
  }
} as const;

export type ViewerConfig = typeof viewerConfig;
