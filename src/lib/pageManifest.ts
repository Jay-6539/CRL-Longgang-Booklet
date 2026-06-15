export type PageAsset = {
  id: number;
  src: string;
  width: number;
  height: number;
  alt: string;
};

const PAGE_WIDTH = 1200;
const PAGE_HEIGHT = 1700;

export const pageManifest: PageAsset[] = Array.from({ length: 28 }, (_, index) => {
  const page = index + 1;
  return {
    id: page,
    src: `/api/page/${page}`,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    alt: `CRL Longgang page ${page}`
  };
});
