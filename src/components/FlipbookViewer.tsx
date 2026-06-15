"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { pageManifest } from "@/lib/pageManifest";
import { buildPageSvgDataUrl } from "@/lib/pageSvg";
import { viewerConfig } from "@/lib/viewerConfig";

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
  const bookRef = useRef<any>(null);
  const isMobile = useMobileMode(viewerConfig.displayMode.mobileBreakpoint);
  const [viewport, setViewport] = useState({ width: 1200, height: 800 });

  const pageRatio = viewerConfig.pageRatio.width / viewerConfig.pageRatio.height;
  const pageQuality = viewerConfig.performance.highResOnlyOnZoom ? "low" : "high";
  const pageSources = useMemo(
    () =>
      pageManifest.map((asset) => ({
        ...asset,
        src: buildPageSvgDataUrl(asset.id, pageQuality, asset.width, asset.height)
      })),
    [pageQuality]
  );

  const spreadCount = 2;
  const safePadding = 24;
  const safeWidth = Math.max(400, viewport.width - safePadding * 2);
  const safeHeight = Math.max(260, viewport.height - safePadding * 2);
  const widthFromHeight = Math.floor(safeHeight * pageRatio);
  const widthFromViewport = Math.floor(safeWidth / spreadCount);
  const pageWidth = Math.max(180, Math.min(widthFromHeight, widthFromViewport));
  const pageHeight = Math.max(200, Math.floor(pageWidth / pageRatio));
  const showSinglePage = isMobile && viewerConfig.displayMode.mobile === "single";
  const spreadWidth = showSinglePage ? pageWidth : pageWidth * 2;

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    const preloadImages = pageSources.map((asset) => {
      const image = new Image();
      image.src = asset.src;
      return image;
    });
    return () => {
      preloadImages.length = 0;
    };
  }, [pageSources]);

  return (
    <div className="viewer-frame">
      <div
        className="book-shell"
        style={{
          width: `${spreadWidth}px`,
          height: `${pageHeight}px`
        }}
      >
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
          startPage={0}
          className=""
          style={{}}
          startZIndex={1}
          autoSize={false}
          clickEventForward
          swipeDistance={30}
        >
          {pageSources.map((asset) => {
            return (
              <div key={asset.id} className="page-card">
                <img
                  src={asset.src}
                  alt={asset.alt}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  draggable={false}
                />
              </div>
            );
          })}
        </HTMLFlipBook>
        {!showSinglePage ? <div className="book-seam" /> : null}
      </div>
    </div>
  );
}
