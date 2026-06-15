import { FlipbookViewer } from "@/components/FlipbookViewer";
import { viewerConfig } from "@/lib/viewerConfig";

export default function HomePage() {
  return (
    <main className="page-shell">
      <h1 className="viewer-title">CRL Longgang Flipbook</h1>
      <p className="viewer-subtitle">
        参考站点形态已复刻为可微调实现：先保证流畅加载，再逐条冻结显示策略。
      </p>

      <FlipbookViewer />

      <section className="settings-card">
        <h3>当前冻结配置（阶段 3 可继续微调）</h3>
        <ul className="settings-list">
          <li>单/双页策略：桌面双页，移动端单页。</li>
          <li>
            页面比例：{viewerConfig.pageRatio.width}:{viewerConfig.pageRatio.height}。
          </li>
          <li>
            动画：翻页 {viewerConfig.animation.flipTimeMs}ms，阴影
            {viewerConfig.animation.maxShadowOpacity}。
          </li>
          <li>
            性能：预加载半径 {viewerConfig.performance.preloadRadius}，其余页面按需加载。
          </li>
        </ul>
      </section>
    </main>
  );
}
