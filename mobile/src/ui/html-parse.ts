// Parser for the article HTML the site sends the app (spec v4 §5, Amendment 5):
// p, h2–h4, ul, ol, li, strong, b, em, i, a[href], blockquote, img[src,alt],
// table/thead/tbody/tr/td/th, br, hr. Anything else is reduced to its text.
// Pure and dependency-free so `node --test` runs it; `Html.tsx` draws the blocks.

export type HNode = { type: 'text'; text: string } | { type: 'el'; tag: string; attrs: Record<string, string>; children: HNode[] };

export type Inline = { text: string; bold?: boolean; italic?: boolean; href?: string } | { br: true };

export type TableCell = { header: string | null; inlines: Inline[] };

export type Block =
  | { kind: 'p'; inlines: Inline[] }
  | { kind: 'h'; level: 2 | 3 | 4; inlines: Inline[] }
  | { kind: 'list'; ordered: boolean; items: Block[][] }
  | { kind: 'quote'; blocks: Block[] }
  | { kind: 'img'; src: string; alt: string }
  | { kind: 'table'; rows: TableCell[][] }
  | { kind: 'hr' };

const VOID = new Set(['br', 'hr', 'img', 'meta', 'link', 'input', 'source', 'wbr']);
const DROP = new Set(['script', 'style', 'iframe', 'noscript', 'svg', 'head', 'template']);

const NAMED: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', zwnj: '‌' };

export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === '#') {
      const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : m;
    }
    return NAMED[e.toLowerCase()] ?? m;
  });
}

function parseAttrs(src: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const m of src.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
    attrs[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? '');
  }
  return attrs;
}

/** HTML string → node tree. Tolerant: stray closers are ignored, unclosed tags close at the end. */
export function parseHtml(html: string): HNode[] {
  const root: HNode & { type: 'el' } = { type: 'el', tag: '#root', attrs: {}, children: [] };
  const stack: (HNode & { type: 'el' })[] = [root];
  let dropping: string | null = null;
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>|([^<]+)|</g;
  for (const m of html.matchAll(re)) {
    const top = stack[stack.length - 1];
    if (m[2]) {
      const tag = m[2].toLowerCase();
      const closing = m[1] === '/';
      if (dropping) {
        if (closing && tag === dropping) dropping = null;
        continue;
      }
      if (closing) {
        const at = stack.map((n) => n.tag).lastIndexOf(tag);
        if (at > 0) stack.length = at;
        continue;
      }
      if (DROP.has(tag)) {
        if (!/\/\s*$/.test(m[3])) dropping = tag;
        continue;
      }
      // A new <p> or <li> closes an open one, as browsers do.
      if (tag === 'p' || tag === 'li') {
        const open = stack.map((n) => n.tag).lastIndexOf(tag);
        const boundary = Math.max(stack.map((n) => n.tag).lastIndexOf('ul'), stack.map((n) => n.tag).lastIndexOf('ol'));
        if (open > 0 && (tag === 'p' || open > boundary)) stack.length = open;
      }
      const node: HNode & { type: 'el' } = { type: 'el', tag, attrs: parseAttrs(m[3]), children: [] };
      stack[stack.length - 1].children.push(node);
      if (!VOID.has(tag) && !/\/\s*$/.test(m[3])) stack.push(node);
    } else if (dropping) {
      continue;
    } else if (m[4] !== undefined || m[0] === '<') {
      const text = decodeEntities(m[4] ?? '<');
      const last = top.children[top.children.length - 1];
      if (last && last.type === 'text') last.text += text;
      else top.children.push({ type: 'text', text });
    }
  }
  return root.children;
}

/** Only https links are kept; site-relative links are resolved against visaroads.com. */
export function normaliseHref(href: string | undefined): string | undefined {
  if (!href) return undefined;
  const h = href.trim();
  if (h.startsWith('https://')) return h;
  if (h.startsWith('//')) return `https:${h}`;
  if (h.startsWith('/')) return `https://visaroads.com${h}`;
  return undefined;
}

const BLOCK = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'img', 'table', 'hr', 'div', 'section', 'article', 'figure', 'figcaption', 'header', 'footer', 'main', 'aside', 'nav', 'pre', 'dl', 'dt', 'dd']);

type Style = { bold?: boolean; italic?: boolean; href?: string };

function textOf(nodes: HNode[]): string {
  return nodes.map((n) => (n.type === 'text' ? n.text : n.tag === 'br' ? ' ' : textOf(n.children))).join('');
}

/** Collapses whitespace inside a run and trims the run's ends. */
function tidy(inlines: Inline[]): Inline[] {
  const out: Inline[] = [];
  for (const i of inlines) {
    if ('br' in i) {
      out.push(i);
      continue;
    }
    const text = i.text.replace(/[ \t\r\n\f]+/g, ' ');
    const prev = out[out.length - 1];
    if (prev && !('br' in prev) && prev.bold === i.bold && prev.italic === i.italic && prev.href === i.href) prev.text += text;
    else out.push({ ...i, text });
  }
  // Trim the start, the end, and around line breaks.
  for (let k = 0; k < out.length; k++) {
    const i = out[k];
    if ('br' in i) continue;
    const before = out[k - 1];
    const after = out[k + 1];
    if (k === 0 || (before && 'br' in before)) i.text = i.text.replace(/^ +/, '');
    if (k === out.length - 1 || (after && 'br' in after)) i.text = i.text.replace(/ +$/, '');
  }
  const kept = out.filter((i) => 'br' in i || i.text.length > 0);
  while (kept.length && 'br' in kept[kept.length - 1]) kept.pop();
  while (kept.length && 'br' in kept[0]) kept.shift();
  return kept;
}

function inlinesOf(nodes: HNode[], style: Style, out: Inline[]): Inline[] {
  for (const n of nodes) {
    if (n.type === 'text') out.push({ text: n.text, ...style });
    else if (n.tag === 'br') out.push({ br: true });
    else if (n.tag === 'strong' || n.tag === 'b') inlinesOf(n.children, { ...style, bold: true }, out);
    else if (n.tag === 'em' || n.tag === 'i') inlinesOf(n.children, { ...style, italic: true }, out);
    else if (n.tag === 'a') inlinesOf(n.children, { ...style, href: normaliseHref(n.attrs.href) ?? style.href }, out);
    else inlinesOf(n.children, style, out);
  }
  return out;
}

const hasText = (inlines: Inline[]) => inlines.some((i) => !('br' in i) && i.text.trim().length > 0);

function tableOf(table: HNode & { type: 'el' }): TableCell[][] {
  const rows: (HNode & { type: 'el' })[] = [];
  const collect = (nodes: HNode[]) => {
    for (const n of nodes) if (n.type === 'el') (n.tag === 'tr' ? rows.push(n) : n.tag !== 'table' && collect(n.children));
  };
  collect(table.children);
  const cellsOf = (tr: HNode & { type: 'el' }) => tr.children.filter((c): c is HNode & { type: 'el' } => c.type === 'el' && (c.tag === 'td' || c.tag === 'th'));
  // The header row is the first row made only of <th>.
  const first = rows[0] ? cellsOf(rows[0]) : [];
  const headed = first.length > 0 && first.every((c) => c.tag === 'th');
  const headers = headed ? first.map((c) => textOf(c.children).replace(/\s+/g, ' ').trim()) : [];
  return (headed ? rows.slice(1) : rows)
    .map((tr) =>
      cellsOf(tr).map((c, k) => {
        const inlines = tidy(inlinesOf(c.children, c.tag === 'th' ? { bold: true } : {}, []));
        return { header: headers[k] || null, inlines };
      }),
    )
    .filter((row) => row.some((c) => hasText(c.inlines)));
}

/** Node tree → the blocks the app draws. */
export function toBlocks(nodes: HNode[]): Block[] {
  const blocks: Block[] = [];
  let run: Inline[] = [];
  const flush = () => {
    const inlines = tidy(run);
    if (hasText(inlines)) blocks.push({ kind: 'p', inlines });
    run = [];
  };
  for (const n of nodes) {
    if (n.type === 'text' || !BLOCK.has(n.tag)) {
      if (n.type === 'el' && n.children.some((c) => c.type === 'el' && BLOCK.has(c.tag))) {
        // An inline wrapper around blocks (e.g. <a><img></a>): treat its content as blocks.
        flush();
        blocks.push(...toBlocks(n.children));
      } else inlinesOf([n], {}, run);
      continue;
    }
    flush();
    switch (n.tag) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6': {
        const inlines = tidy(inlinesOf(n.children, {}, []));
        const level = n.tag === 'h1' || n.tag === 'h2' ? 2 : n.tag === 'h3' ? 3 : 4;
        if (hasText(inlines)) blocks.push({ kind: 'h', level, inlines });
        break;
      }
      case 'ul':
      case 'ol': {
        const items = n.children
          .filter((c): c is HNode & { type: 'el' } => c.type === 'el' && c.tag === 'li')
          .map((li) => toBlocks(li.children))
          .filter((b) => b.length > 0);
        if (items.length) blocks.push({ kind: 'list', ordered: n.tag === 'ol', items });
        break;
      }
      case 'blockquote': {
        const inner = toBlocks(n.children);
        if (inner.length) blocks.push({ kind: 'quote', blocks: inner });
        break;
      }
      case 'img': {
        const src = normaliseHref(n.attrs.src);
        if (src) blocks.push({ kind: 'img', src, alt: (n.attrs.alt ?? '').trim() });
        break;
      }
      case 'table': {
        const rows = tableOf(n);
        if (rows.length) blocks.push({ kind: 'table', rows });
        break;
      }
      case 'hr':
        blocks.push({ kind: 'hr' });
        break;
      default:
        // p, li outside a list, div, figure… : their content, as blocks.
        blocks.push(...toBlocks(n.children));
    }
  }
  flush();
  return blocks;
}

export const htmlToBlocks = (html: string): Block[] => toBlocks(parseHtml(html));

/** Every https link in the article, once each, in reading order, with its text. */
export function linksOf(blocks: Block[]): { href: string; text: string }[] {
  const seen = new Map<string, string>();
  const fromInlines = (inlines: Inline[]) => {
    for (const i of inlines) if (!('br' in i) && i.href) seen.set(i.href, `${seen.get(i.href) ?? ''}${i.text}`);
  };
  // Adjacent runs of the same link (bold inside a link) join; later mentions keep the first text.
  const firstText = new Map<string, string>();
  const walk = (bs: Block[]) => {
    for (const b of bs) {
      if (b.kind === 'p' || b.kind === 'h') {
        seen.clear();
        fromInlines(b.inlines);
        for (const [h, t] of seen) if (!firstText.has(h)) firstText.set(h, t.trim());
      } else if (b.kind === 'list') b.items.forEach(walk);
      else if (b.kind === 'quote') walk(b.blocks);
      else if (b.kind === 'table')
        for (const row of b.rows)
          for (const cell of row) {
            seen.clear();
            fromInlines(cell.inlines);
            for (const [h, t] of seen) if (!firstText.has(h)) firstText.set(h, t.trim());
          }
    }
  };
  walk(blocks);
  return [...firstText].map(([href, text]) => ({ href, text: text || href }));
}
