"use client";

type ViewerToolbarProps = {
  showPrevNext: boolean;
  showZoom: boolean;
  showFullscreen: boolean;
  page: number;
  totalPages: number;
  zoom: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onJump: (page: number) => void;
  onToggleFullscreen: () => void;
};

export function ViewerToolbar({
  showPrevNext,
  showZoom,
  showFullscreen,
  page,
  totalPages,
  zoom,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onZoomIn,
  onZoomOut,
  onJump,
  onToggleFullscreen
}: ViewerToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-group">
        {showPrevNext ? (
          <>
            <button type="button" onClick={onPrev} disabled={!canPrev}>
              上一页
            </button>
            <button type="button" onClick={onNext} disabled={!canNext}>
              下一页
            </button>
          </>
        ) : null}
        <span className="toolbar-metric">
          第 {page} / {totalPages} 页
        </span>
      </div>
      <div className="toolbar-group">
        {showZoom ? (
          <>
            <button type="button" onClick={onZoomOut} disabled={zoom <= 0.75}>
              缩小
            </button>
            <button type="button" onClick={onZoomIn} disabled={zoom >= 1.8}>
              放大
            </button>
          </>
        ) : null}
        <button type="button" onClick={() => onJump(1)}>
          首页
        </button>
        <button type="button" onClick={() => onJump(totalPages)}>
          末页
        </button>
        {showFullscreen ? (
          <button type="button" onClick={onToggleFullscreen}>
            全屏
          </button>
        ) : null}
      </div>
    </div>
  );
}
