export const viewerConfig = {
  // 阶段 3: 显示策略可在这里逐项冻结
  displayMode: {
    desktop: "double",
    tablet: "double",
    mobile: "double",
    mobileBreakpoint: 768
  },
  pageRatio: {
    // 单页比例；双页展开即 2 * width : height = 1356:762
    width: 678,
    height: 762
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
