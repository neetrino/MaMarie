'use client';

import Link from 'next/link';

type ProductCardStretchedLinkProps = {
  href: string;
  ariaLabel: string;
  onBeforeNavigate?: () => void;
};

/** Full-card navigation overlay — place interactive controls above with `relative z-[2] pointer-events-auto`. */
export function ProductCardStretchedLink({
  href,
  ariaLabel,
  onBeforeNavigate,
}: ProductCardStretchedLinkProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="absolute inset-0 z-[1] rounded-[inherit]"
      onFocus={onBeforeNavigate}
      onPointerDown={onBeforeNavigate}
    />
  );
}
