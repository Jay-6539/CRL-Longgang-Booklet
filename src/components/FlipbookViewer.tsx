"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { pageManifest } from "@/lib/pageManifest";
import { buildPageSvgDataUrl } from "@/lib/pageSvg";
import { viewerConfig } from "@/lib/viewerConfig";
import { ViewerToolbar } from "./ViewerToolbar";

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
  const bootTime = useRef<number>(Date.now());
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [firstPaintMs, setFirstPaintMs] = useState<number | null>(null);
  const [lastFlipReactionMs, setLastFlipReactionMs] = useState<number | null>(null);
  const isMobile = useMobileMode(viewerConfig.displayMode.mobileBreakpoint);

  const totalPages = pageManifest.length;
  const preloadRadius = viewerConfig.performance.preloadRadius;

  const activeWindow = useMemo(() => {
    const start = Math.max(1, currentPage - preloadRadius);
    const end = Math.min(totalPages, currentPage + preloadRadius);
    return { start, end };
  }, [currentPage, preloadRadius, totalPages]);

  const pageWidth = Math.round(viewerConfig.pageRatio.width * zoom * (isMobile ? 0.58 : 0.5));
  const pageHeight = Math.round(viewerConfig.pageRatio.height * zoom * (isMobile ? 0.58 : 0.5));
  const showSinglePage = isMobile && viewerConfig.displayMode.mobile === "single";

  const goToPage = (page: number) => {
    const safePage = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(safePage);
    bookRef.current?.pageFlip().flip(safePage - 1);
  };

  useEffect(() => {
    if (firstPaintMs !== null) {
      return;
    }
    const id = window.requestAnimationFrame(() => {
      setFirstPaintMs(Date.now() - bootTime.current);
    });
    return () => window.cancelAnimationFrame(id);
  }, [firstPaintMs]);

  return (
    <>
      <ViewerToolbar
        page={currentPage}
        totalPages={totalPages}
        zoom={zoom}
        canPrev={currentPage > 1}
        canNext={currentPage < totalPages}
        onPrev={() => bookRef.current?.pageFlip().flipPrev()}
        onNext={() => bookRef.current?.pageFlip().flipNext()}
        onZoomIn={() => setZoom((value) => Math.min(1.8, +(value + 0.1).toFixed(2)))}
        onZoomOut={() => setZoom((value) => Math.max(0.75, +(value - 0.1).toFixed(2)))}
        onJump={goToPage}
      />

      <div className="viewer-frame">
        <HTMLFlipBook
          ref={bookRef}
          width={pageWidth}
          height={pageHeight}
          size="stretch"
          minWidth={260}
          maxWidth={viewerConfig.pageRatio.width}
          minHeight={360}
          maxHeight={viewerConfig.pageRatio.height}
          maxShadowOpacity={viewerConfig.animation.maxShadowOpacity}
          showCover={viewerConfig.animation.showCover}
          mobileScrollSupport
          drawShadow
          flippingTime={viewerConfig.animation.flipTimeMs}
          useMouseEvents
          disableFlipByClick={false}
          showPageCorners
          usePortrait={showSinglePage}
          onFlip={(event: FlipEvent) => {
            const start = performance.now();
            setCurrentPage(event.data + 1);
            window.requestAnimationFrame(() => {
              setLastFlipReactionMs(Number((performance.now() - start).toFixed(1)));
            });
          }}
          startPage={0}
          className=""
          style={{}}
          startZIndex={1}
          autoSize
          clickEventForward
          swipeDistance={30}
        >
          {pageManifest.map((asset) => {
            const shouldLoad = asset.id >= activeWindow.start && asset.id <= activeWindow.end;
            const quality = viewerConfig.performance.highResOnlyOnZoom && zoom <= 1.15 ? "low" : "high";
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
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(160deg, rgba(229,237,251,1) 0%, rgba(248,251,255,1) 65%, rgba(226,233,247,1) 100%)"
                    }}
                  />
                )}
                <span className="page-label">P{asset.id}</span>
              </div>
            );
          })}
        </HTMLFlipBook>
      </div>
      <div className="perf-metric">
        首屏基线: {firstPaintMs ?? "-"}ms | 最近翻页响应: {lastFlipReactionMs ?? "-"}ms
      </div>
    </>
  );
}
