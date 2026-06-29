import { BRAND_COLORS } from './brand';
import { HOME_SECTION_MAX_WIDTH_PX } from './home-sections';

/** Figma node `51:428` — site footer. */
export const FOOTER_MAX_WIDTH_PX = HOME_SECTION_MAX_WIDTH_PX;
export const FOOTER_CONTENT_MAX_WIDTH_PX = 1326;
export const FOOTER_HEIGHT_PX = 507;
export const FOOTER_PADDING_X_PX = 82;
/** Copyright block inset from footer edge — Figma x=57 on 1440px (`51:492`). */
export const FOOTER_COPYRIGHT_INSET_X_PX = (FOOTER_MAX_WIDTH_PX - FOOTER_CONTENT_MAX_WIDTH_PX) / 2;
/** Shift copyright left from padded wrapper so it sits on the footer center line. */
export const FOOTER_COPYRIGHT_OFFSET_X_PX = FOOTER_COPYRIGHT_INSET_X_PX - FOOTER_PADDING_X_PX;
/** Content inset from yellow background top (Figma y=102). */
export const FOOTER_PADDING_TOP_PX = 102;
export const FOOTER_PADDING_BOTTOM_PX = 45;
export const FOOTER_BORDER_RADIUS_TOP_PX = 30;
/** Pull footer up so transparent top reveals section bg in rounded corner wedges. */
export const FOOTER_TOP_OVERLAP_PX = FOOTER_BORDER_RADIUS_TOP_PX;
/** Extra yellow visible above the rounded body (overlap alone hid the top edge). */
export const FOOTER_TOP_VISIBLE_EXTRA_PX = 20;
/** Yellow layer inset from footer top — only corner wedges stay transparent. */
export const FOOTER_YELLOW_TOP_PX = FOOTER_TOP_OVERLAP_PX - FOOTER_TOP_VISIBLE_EXTRA_PX;
export const FOOTER_BG_COLOR = BRAND_COLORS.yellow;
export const FOOTER_DECORATION_Z_INDEX = 0;
export const FOOTER_CONTENT_Z_INDEX = 10;
/** Strawberry clay — above footer content, may extend past top edge (Figma `1:225`). */
export const FOOTER_STRAWBERRY_Z_INDEX = 20;

/** Gap from payment badges bottom to copyright (Figma y=360 → y=442). */
export const FOOTER_CONTENT_GAP_PX = 82;

export const FOOTER_BRAND_COLUMN_WIDTH_PX = 257;
export const FOOTER_BRAND_COLUMN_GAP_PX = 20;
export const FOOTER_LINKS_COLUMN_GAP_PX = 24;
export const FOOTER_LINKS_ITEM_GAP_PX = 16;
export const FOOTER_COMPANY_COLUMN_WIDTH_PX = 164;
export const FOOTER_SUPPORT_COLUMN_WIDTH_PX = 277;
export const FOOTER_CONTACT_COLUMN_WIDTH_PX = 242.706;

export const FOOTER_TEXT_COLOR = BRAND_COLORS.brown;
export const FOOTER_HEADING_COLOR = '#705d00';
export const FOOTER_TEXT_SIZE_PX = 14;
export const FOOTER_TEXT_LINE_HEIGHT_PX = 20;
export const FOOTER_DESCRIPTION_LINE_HEIGHT_PX = 22.75;
export const FOOTER_HEADING_LETTER_SPACING_PX = 0.7;
export const FOOTER_LINK_LETTER_SPACING_PX = -0.3125;

export const FOOTER_LOGO_WIDTH_PX = 101;
export const FOOTER_LOGO_HEIGHT_PX = 54;
export const FOOTER_LOGO_CROP_HEIGHT_PERCENT = 207.48;
export const FOOTER_LOGO_CROP_WIDTH_PERCENT = 112.61;
export const FOOTER_LOGO_CROP_LEFT_PERCENT = -7.56;
export const FOOTER_LOGO_CROP_TOP_PERCENT = -53.74;

export const FOOTER_SOCIAL_GAP_PX = 22;
export const FOOTER_SOCIAL_MARGIN_TOP_PX = 7;
export const FOOTER_SOCIAL_ICON_FACEBOOK_WIDTH_PX = 11;
export const FOOTER_SOCIAL_ICON_FACEBOOK_HEIGHT_PX = 19;
export const FOOTER_SOCIAL_ICON_SIZE_PX = 19;
export const FOOTER_SOCIAL_ICON_LINKEDIN_HEIGHT_PX = 18;

export const FOOTER_CONTACT_ICON_PHONE_SIZE_PX = 26;
export const FOOTER_CONTACT_ICON_MAIL_SIZE_PX = 24;
export const FOOTER_CONTACT_ICON_LOCATION_SIZE_PX = 27;
export const FOOTER_CONTACT_ROW_GAP_PX = 10;
/** Title top → first contact row top (Figma y=0 → y=40). */
export const FOOTER_CONTACT_TITLE_TO_ROWS_PX = 40;
export const FOOTER_CONTACT_HEADING_TO_ROWS_GAP_PX =
  FOOTER_CONTACT_TITLE_TO_ROWS_PX - FOOTER_TEXT_LINE_HEIGHT_PX;
export const FOOTER_CONTACT_ITEMS_GAP_PX = 20;
/** Contact block bottom → payment badges top (Figma y=276 → y=331). */
export const FOOTER_PAYMENT_MARGIN_TOP_PX = 55;
export const FOOTER_PAYMENT_GAP_PX = 11;
export const FOOTER_PAYMENT_BADGE_HEIGHT_PX = 30;
export const FOOTER_PAYMENT_BADGE_RADIUS_PX = 8;

export interface FooterPaymentBadge {
  alt: string;
  logoSrc: string;
  widthPx: number;
  logoLeftPx: number;
  logoTopPx: number;
  logoWidthPx: number;
  logoHeightPx: number;
}

export const FOOTER_PAYMENT_BADGES: FooterPaymentBadge[] = [
  {
    alt: 'Mastercard',
    logoSrc: '/assets/footer/payments/mastercard.png',
    widthPx: 73,
    logoLeftPx: 19,
    logoTopPx: 0.5,
    logoWidthPx: 35,
    logoHeightPx: 28,
  },
  {
    alt: 'ArCa',
    logoSrc: '/assets/footer/payments/arca.png',
    widthPx: 74,
    logoLeftPx: 12,
    logoTopPx: 9,
    logoWidthPx: 50,
    logoHeightPx: 13,
  },
  {
    alt: 'Visa',
    logoSrc: '/assets/footer/payments/visa.png',
    widthPx: 73,
    logoLeftPx: 13,
    logoTopPx: 4,
    logoWidthPx: 48,
    logoHeightPx: 22,
  },
];

export interface FooterDecorationLayout {
  leftPx: number;
  topPx: number;
  wrapperSizePx: number;
  imageSizePx: number;
  rotateDeg: number;
  scaleX?: number;
  scaleY?: number;
}

export const FOOTER_STRAWBERRY_DECORATION: FooterDecorationLayout = {
  leftPx: 145,
  topPx: -93,
  wrapperSizePx: 324.021,
  imageSizePx: 245.114,
  rotateDeg: -24.19,
};

export const FOOTER_BUNNY_DECORATION: FooterDecorationLayout = {
  leftPx: 1194,
  topPx: 228,
  wrapperSizePx: 413.207,
  imageSizePx: 352.329,
  rotateDeg: 11.03,
  scaleX: 1,
};

export const FOOTER_ASSETS = {
  logoInline: '/assets/footer/logo-inline.png',
  decoBunny: '/assets/footer/deco-bunny.png',
  decoCamera: '/assets/footer/deco-camera.png',
  iconFacebook: '/assets/footer/icon-facebook.svg',
  iconInstagram: '/assets/footer/icon-instagram.svg',
  iconLinkedin: '/assets/footer/icon-linkedin.svg',
  iconWhatsapp: '/assets/footer/icon-whatsapp.svg',
  iconPhone: '/assets/footer/icon-phone.svg',
  iconMail: '/assets/footer/icon-mail.png',
  iconLocation: '/assets/footer/icon-location.svg',
} as const;

export interface FooterNavLink {
  labelKey: string;
  href: string;
}

export const FOOTER_COMPANY_LINKS: FooterNavLink[] = [
  { labelKey: 'common.footer.company.shop', href: '/products' },
  { labelKey: 'common.footer.company.about', href: '/about' },
  { labelKey: 'common.footer.company.partners', href: '/about' },
  { labelKey: 'common.footer.company.categories', href: '/products' },
  { labelKey: 'common.footer.company.contact', href: '/contact' },
];

export const FOOTER_SUPPORT_LINKS: FooterNavLink[] = [
  { labelKey: 'common.footer.support.deliveryReturns', href: '/returns' },
  { labelKey: 'common.footer.support.installment', href: '/delivery-terms' },
  { labelKey: 'common.footer.support.warranty', href: '/support' },
  { labelKey: 'common.footer.support.privacy', href: '/privacy' },
  { labelKey: 'common.footer.support.faq', href: '/faq' },
];

export interface FooterSocialLink {
  href: string;
  labelKey: string;
  iconSrc: string;
  widthPx: number;
  heightPx: number;
}

export const FOOTER_SOCIAL_LINKS: FooterSocialLink[] = [
  {
    href: 'https://facebook.com',
    labelKey: 'common.footer.social.facebook',
    iconSrc: FOOTER_ASSETS.iconFacebook,
    widthPx: FOOTER_SOCIAL_ICON_FACEBOOK_WIDTH_PX,
    heightPx: FOOTER_SOCIAL_ICON_FACEBOOK_HEIGHT_PX,
  },
  {
    href: 'https://instagram.com',
    labelKey: 'common.footer.social.instagram',
    iconSrc: FOOTER_ASSETS.iconInstagram,
    widthPx: FOOTER_SOCIAL_ICON_SIZE_PX,
    heightPx: FOOTER_SOCIAL_ICON_SIZE_PX,
  },
  {
    href: 'https://linkedin.com',
    labelKey: 'common.footer.social.linkedin',
    iconSrc: FOOTER_ASSETS.iconLinkedin,
    widthPx: FOOTER_SOCIAL_ICON_SIZE_PX,
    heightPx: FOOTER_SOCIAL_ICON_LINKEDIN_HEIGHT_PX,
  },
  {
    href: 'https://wa.me',
    labelKey: 'common.footer.social.whatsapp',
    iconSrc: FOOTER_ASSETS.iconWhatsapp,
    widthPx: FOOTER_SOCIAL_ICON_SIZE_PX,
    heightPx: FOOTER_SOCIAL_ICON_SIZE_PX,
  },
];

export const FOOTER_PHONE_HREF = 'tel:+37410000000';
export const FOOTER_EMAIL_HREF = 'mailto:info@marco.am';
export const FOOTER_COPYRIGHT_COMPANY_HREF = 'https://neetrino.com';
