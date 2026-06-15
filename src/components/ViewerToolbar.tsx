"use client";

type ViewerToolbarProps = {
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
};

export function ViewerToolbar({
  page,
  totalPages,
  zoom,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onZoomIn,
  onZoomOut,
  onJump
}: ViewerToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button type="button" onClick={onPrev} disabled={!canPrev}>
          上一页
        </button>
        <button type="button" onClick={onNext} disabled={!canNext}>
          下一页
        </button>
        <span className="toolbar-metric">
          第 {page} / {totalPages} 页
        </span>
      </div>
      <div className="toolbar-group">
        <button type="button" onClick={onZoomOut} disabled={zoom <= 0.75}>
          缩小
        </button>
        <button type="button" onClick={onZoomIn} disabled={zoom >= 1.8}>
          放大
        </button>
        <button type="button" onClick={() => onJump(1)}>
          首页
        </button>
        <button type="button" onClick={() => onJump(totalPages)}>
          末页
        </button>
      </div>
    </div>
  );
}
