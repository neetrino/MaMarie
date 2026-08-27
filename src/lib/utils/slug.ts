const MAX_SLUG_INPUT_LENGTH = 500;

/** Multi-char sequences must be checked before single-char maps (Armenian ու). */
const TRANSLIT_DIGRAPHS: ReadonlyArray<readonly [string, string]> = [['ու', 'u']];

const TRANSLIT_CHARS: Readonly<Record<string, string>> = {
  // Armenian (Eastern)
  ա: 'a',
  բ: 'b',
  գ: 'g',
  դ: 'd',
  ե: 'e',
  զ: 'z',
  է: 'e',
  ը: 'y',
  թ: 't',
  ժ: 'zh',
  ի: 'i',
  լ: 'l',
  խ: 'kh',
  ծ: 'ts',
  կ: 'k',
  հ: 'h',
  ձ: 'dz',
  ղ: 'gh',
  ճ: 'ch',
  մ: 'm',
  յ: 'y',
  ն: 'n',
  շ: 'sh',
  ո: 'o',
  չ: 'ch',
  պ: 'p',
  ջ: 'j',
  ռ: 'r',
  ս: 's',
  վ: 'v',
  տ: 't',
  ր: 'r',
  ց: 'ts',
  փ: 'p',
  ք: 'q',
  և: 'ev',
  օ: 'o',
  ֆ: 'f',
  // Cyrillic
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'yo',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
};

/**
 * Transliterates Armenian / Cyrillic (and accented Latin) to ASCII lowercase letters.
 * Safe for user input: no regex on the full string.
 */
export function transliterateToLatin(input: string): string {
  const normalized = String(input)
    .normalize('NFKD')
    .toLowerCase()
    .trim();
  let out = '';
  let i = 0;

  while (i < Math.min(normalized.length, MAX_SLUG_INPUT_LENGTH)) {
    let matched = false;
    for (const [from, to] of TRANSLIT_DIGRAPHS) {
      if (normalized.startsWith(from, i)) {
        out += to;
        i += from.length;
        matched = true;
        break;
      }
    }
    if (matched) {
      continue;
    }

    const ch = normalized[i];
    const mapped = TRANSLIT_CHARS[ch];
    if (mapped !== undefined) {
      out += mapped;
    } else if (ch >= 'a' && ch <= 'z') {
      out += ch;
    } else if (ch >= '0' && ch <= '9') {
      out += ch;
    } else if (ch === ' ' || ch === '-' || ch === '_' || ch === '/') {
      out += '-';
    }
    // Combining marks and other symbols are dropped (NFKD already split accents)
    i += 1;
  }

  return out;
}

/**
 * Converts a string to a URL-safe Latin slug (hy/ru transliterated).
 * Avoids regex on user input to reduce ReDoS risk.
 */
export function toSlug(input: string): string {
  const s = transliterateToLatin(input);
  let out = '';
  let prevWasHyphen = false;

  for (let i = 0; i < Math.min(s.length, MAX_SLUG_INPUT_LENGTH); i++) {
    const c = s[i];
    const isAlnum = (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9');

    if (isAlnum) {
      out += c;
      prevWasHyphen = false;
    } else if (!prevWasHyphen && out.length > 0) {
      out += '-';
      prevWasHyphen = true;
    }
  }

  let end = out.length;
  while (end > 0 && out[end - 1] === '-') end--;
  return out.slice(0, end);
}
