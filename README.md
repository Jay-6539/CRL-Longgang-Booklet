# CRL Longgang Flipbook

一个可深度微调的翻页站点模板，参考 FlipHTML5 画册阅读体验，默认采用“性能优先”的加载策略。

## 已实现能力

- 翻页阅读器：`react-pageflip` 双页/单页阅读。
- 性能优先：
  - 仅渲染当前页附近窗口（`current ± preloadRadius`）。
  - 其余页按需占位，进入窗口后再加载。
  - 低倍缩放默认 low 资源，高倍缩放切换 high 资源。
- 显示策略集中配置：`src/lib/viewerConfig.ts`
  - 单双页规则
  - 页面比例
  - 动画参数
  - 工具栏能力开关

## 目录结构

- `src/app/page.tsx` 主阅读器页面
- `src/components/FlipbookViewer.tsx` 翻页核心与性能策略
- `src/components/ViewerToolbar.tsx` 操作栏
- `src/lib/viewerConfig.ts` 显示策略冻结点
- `src/lib/pageManifest.ts` 页面资源清单
- `src/lib/pageSvg.ts` 示例页 SVG 生成（静态部署兼容）

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## 替换为真实画册内容

1. 准备导出的页图（建议 WebP，多分辨率）。
2. 在 `src/lib/pageManifest.ts` 维护页数与元数据。
3. 在 `src/components/FlipbookViewer.tsx` 将 `buildPageSvgDataUrl(...)` 替换为你的真实图片 URL 逻辑。
4. 如使用 CDN，可按缩放倍率拼接不同分辨率 URL。

## GitHub Pages 发布

推送到 `main` 后会自动触发 `.github/workflows/deploy-pages.yml`。  
首次发布完成后，站点地址为：

`https://jay-6539.github.io/CRL-Longgang-Booklet/`

## 逐条微调显示策略（阶段 3）

编辑 `src/lib/viewerConfig.ts`：

- `displayMode`：桌面/平板/手机单双页规则
- `pageRatio`：页面宽高比例
- `animation`：翻页时长与阴影
- `toolbar`：操作项保留与隐藏

## 发布到 Git

```bash
git init
git add .
git commit -m "feat: implement performance-first flipbook viewer"
git branch -M main
git remote add origin <your-repository-url>
git push -u origin main
```

如果仓库已存在，只需：

```bash
git add .
git commit -m "feat: add flipbook viewer with performance tuning"
git push
```
