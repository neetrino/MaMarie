import { HOME_PRODUCT_CARD_HEART_INACTIVE_FILL_OPACITY } from '../../constants/home-sections';

/** Figma `51:643` — mdi:heart-outline in 34×34. */
const WISHLIST_ICON_VIEWBOX_SIZE = 34;

/** Full outline — inactive ring. */
const WISHLIST_ICON_OUTLINE_PATH =
  'M17.1443 26.2792L17.0026 26.4208L16.8468 26.2792C10.1176 20.1733 5.66927 16.1358 5.66927 12.0417C5.66927 9.20833 7.79427 7.08333 10.6276 7.08333C12.8093 7.08333 14.9343 8.5 15.6851 10.4267H18.3201C19.0709 8.5 21.1959 7.08333 23.3776 7.08333C26.2109 7.08333 28.3359 9.20833 28.3359 12.0417C28.3359 16.1358 23.8876 20.1733 17.1443 26.2792ZM23.3776 4.25C20.9126 4.25 18.5468 5.3975 17.0026 7.19667C15.4584 5.3975 13.0926 4.25 10.6276 4.25C6.26427 4.25 2.83594 7.66417 2.83594 12.0417C2.83594 17.3825 7.6526 21.76 14.9484 28.3758L17.0026 30.2458L19.0568 28.3758C26.3526 21.76 31.1693 17.3825 31.1693 12.0417C31.1693 7.66417 27.7409 4.25 23.3776 4.25Z';

/** Inner heart — fills the outline center when active. */
const WISHLIST_ICON_SOLID_PATH =
  'M17.1443 26.2792L17.0026 26.4208L16.8468 26.2792C10.1176 20.1733 5.66927 16.1358 5.66927 12.0417C5.66927 9.20833 7.79427 7.08333 10.6276 7.08333C12.8093 7.08333 14.9343 8.5 15.6851 10.4267H18.3201C19.0709 8.5 21.1959 7.08333 23.3776 7.08333C26.2109 7.08333 28.3359 9.20833 28.3359 12.0417C28.3359 16.1358 23.8876 20.1733 17.1443 26.2792Z';

interface WishlistIconProps {
  isActive?: boolean;
  size?: number;
}

export function WishlistIcon({ isActive = false, size = 24 }: WishlistIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${WISHLIST_ICON_VIEWBOX_SIZE} ${WISHLIST_ICON_VIEWBOX_SIZE}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {isActive ? (
        <>
          <path d={WISHLIST_ICON_OUTLINE_PATH} fill="currentColor" />
          <path d={WISHLIST_ICON_SOLID_PATH} fill="currentColor" />
        </>
      ) : (
        <path
          d={WISHLIST_ICON_OUTLINE_PATH}
          fill="#000000"
          fillOpacity={HOME_PRODUCT_CARD_HEART_INACTIVE_FILL_OPACITY}
        />
      )}
    </svg>
  );
}
