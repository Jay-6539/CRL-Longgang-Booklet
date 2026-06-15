"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { pageManifest } from "@/lib/pageManifest";
import { buildPageSvgDataUrl } from "@/lib/pageSvg";
import { viewerConfig } from "@/lib/viewerConfig";

type FlipEvent = {
  data: number;
};

type FlipBookRef = {
  pageFlip: () => {
    flipPrev: () => void;
    flipNext: () => void;
    flip: (page: number) => void;
  };
};

function useMobileMode(breakpoint: number) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < breakpoint);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [breakpoint]);

  return isMobile;
}

export function FlipbookViewer() {
  const bookRef = useRef<FlipBookRef | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useMobileMode(viewerConfig.displayMode.mobileBreakpoint);
  const [viewport, setViewport] = useState({ width: 1200, height: 800 });

  const totalPages = pageManifest.length;
  const preloadRadius = viewerConfig.performance.preloadRadius;
  const pageRatio = viewerConfig.pageRatio.width / viewerConfig.pageRatio.height;

  const activeWindow = useMemo(() => {
    const start = Math.max(1, currentPage - preloadRadius);
    const end = Math.min(totalPages, currentPage + preloadRadius);
    return { start, end };
  }, [currentPage, preloadRadius, totalPages]);

  const spreadCount = 2;
  const safePadding = 24;
  const safeWidth = Math.max(400, viewport.width - safePadding * 2);
  const safeHeight = Math.max(260, viewport.height - safePadding * 2);
  const widthFromHeight = Math.floor(safeHeight * pageRatio);
  const widthFromViewport = Math.floor(safeWidth / spreadCount);
  const pageWidth = Math.max(180, Math.min(widthFromHeight, widthFromViewport));
  const pageHeight = Math.max(200, Math.floor(pageWidth / pageRatio));
  const showSinglePage = isMobile && viewerConfig.displayMode.mobile === "single";

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return (
    <div className="viewer-frame">
      <HTMLFlipBook
        ref={bookRef}
        width={pageWidth}
        height={pageHeight}
        size="fixed"
        minWidth={pageWidth}
        maxWidth={pageWidth}
        minHeight={pageHeight}
        maxHeight={pageHeight}
        maxShadowOpacity={viewerConfig.animation.maxShadowOpacity}
        showCover={viewerConfig.animation.showCover}
        mobileScrollSupport
        drawShadow
        flippingTime={viewerConfig.animation.flipTimeMs}
        useMouseEvents
        disableFlipByClick={false}
        showPageCorners={false}
        usePortrait={showSinglePage}
        onFlip={(event: FlipEvent) => setCurrentPage(event.data + 1)}
        startPage={0}
        className=""
        style={{}}
        startZIndex={1}
        autoSize={false}
        clickEventForward
        swipeDistance={30}
      >
        {pageManifest.map((asset) => {
          const shouldLoad = asset.id >= activeWindow.start && asset.id <= activeWindow.end;
          const quality = viewerConfig.performance.highResOnlyOnZoom ? "low" : "high";
          return (
            <div key={asset.id} className="page-card">
              {shouldLoad ? (
                <img
                  src={buildPageSvgDataUrl(asset.id, quality, asset.width, asset.height)}
                  alt={asset.alt}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              ) : (
                <div className="page-placeholder" />
              )}
            </div>
          );
        })}
      </HTMLFlipBook>
    </div>
  );
}
