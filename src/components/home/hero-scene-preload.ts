import { HERO_ASSETS, HERO_SCENE_LAYERS } from '../../constants/hero';

/** Unique hero scene URLs — one preload entry per asset file. */
export const HERO_SCENE_PRELOAD_URLS = [
  ...new Set(HERO_SCENE_LAYERS.map((layer) => HERO_ASSETS[layer.assetKey])),
] as string[];

function loadHeroAsset(src: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new window.Image();
    const finish = () => resolve();

    image.onload = finish;
    image.onerror = finish;
    image.src = src;

    if (image.complete) {
      finish();
    }
  });
}

/** Resolves when every hero scene asset has finished loading (or failed). */
export function preloadHeroSceneAssets(): Promise<void> {
  return Promise.all(HERO_SCENE_PRELOAD_URLS.map(loadHeroAsset)).then(() => undefined);
}
