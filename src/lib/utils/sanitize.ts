/**
 * Sanitize HTML string to prevent XSS. Use before dangerouslySetInnerHTML.
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== 'string') return '';

  const allowedTags = new Set([
    'p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'span', 'div',
  ]);
  const allowedAttrs = new Set(['href', 'target', 'rel', 'class']);

  const stripDangerousUrl = (value: string): string => {
    const normalized = value.trim().replace(/[\u0000-\u001F\u007F\s]+/g, '');
    if (
      normalized.toLowerCase().startsWith('javascript:') ||
      normalized.toLowerCase().startsWith('data:text/html')
    ) {
      return '';
    }
    return value;
  };

  const escapeAttr = (value: string): string => value.replace(/"/g, '&quot;');

  const withoutDangerousBlocks = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|iframe|object|embed|svg|math)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/\son[a-z]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, '');

  return withoutDangerousBlocks.replace(
    /<\/?([a-z0-9-]+)([^>]*)>/gi,
    (fullMatch: string, rawTagName: string, rawAttrs: string) => {
      const tagName = rawTagName.toLowerCase();
      if (!allowedTags.has(tagName)) {
        return '';
      }

      if (fullMatch.startsWith('</')) {
        return `</${tagName}>`;
      }

      const keptAttrs: string[] = [];
      const attrRegex = /([a-z0-9-:]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/gi;
      let attrMatch: RegExpExecArray | null = attrRegex.exec(rawAttrs);
      while (attrMatch) {
        const attrName = attrMatch[1].toLowerCase();
        const rawValue = attrMatch[3] ?? attrMatch[4] ?? attrMatch[5] ?? '';
        if (allowedAttrs.has(attrName)) {
          const value = attrName === 'href' ? stripDangerousUrl(rawValue) : rawValue;
          if (value) {
            keptAttrs.push(`${attrName}="${escapeAttr(value)}"`);
          }
        }
        attrMatch = attrRegex.exec(rawAttrs);
      }

      const attrsPart = keptAttrs.length > 0 ? ` ${keptAttrs.join(' ')}` : '';
      return tagName === 'br' ? `<${tagName}${attrsPart} />` : `<${tagName}${attrsPart}>`;
    },
  );
}
