import {
  HOME_PRODUCT_CARD_SWATCH_ACTIVE_BORDER,
  HOME_PRODUCT_CARD_SWATCH_GAP_PX,
  HOME_PRODUCT_CARD_SWATCH_SIZE_PX,
  HOME_PRODUCT_CARD_SWATCHES,
} from '../../constants/home-sections';

export function HomeProductCardColorSwatches() {
  return (
    <div className="flex items-center" style={{ gap: HOME_PRODUCT_CARD_SWATCH_GAP_PX, height: 24 }}>
      {HOME_PRODUCT_CARD_SWATCHES.map((swatch) => (
        <span
          key={swatch.color}
          className="shrink-0 rounded-full"
          style={{
            width: HOME_PRODUCT_CARD_SWATCH_SIZE_PX,
            height: HOME_PRODUCT_CARD_SWATCH_SIZE_PX,
            backgroundColor: swatch.color,
            border: swatch.active
              ? `2px solid ${HOME_PRODUCT_CARD_SWATCH_ACTIVE_BORDER}`
              : '2px solid transparent',
          }}
        />
      ))}
    </div>
  );
}
