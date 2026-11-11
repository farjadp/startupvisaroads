// Puts the signed unsubscribe link into a campaign's HTML.
//
// A designed template can place its own unsubscribe button by writing the
// placeholder {{unsubscribe_url}} wherever the link belongs; every occurrence
// is replaced and nothing else is added. A body without the placeholder gets
// the plain bilingual footer, inserted before </body> when there is one, so
// it does not land after </html>. CASL requires the link either way.

export const UNSUBSCRIBE_PLACEHOLDER = /\{\{\s*unsubscribe_url\s*\}\}/g;

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

export function applyUnsubscribe(html: string, url: string): string {
  if (!url) return html;
  if (UNSUBSCRIBE_PLACEHOLDER.test(html)) {
    UNSUBSCRIBE_PLACEHOLDER.lastIndex = 0;
    return html.replace(UNSUBSCRIBE_PLACEHOLDER, escapeAttr(url));
  }
  const footer = `<div style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;font-size:12px;color:#999;text-align:center;font-family:sans-serif;" dir="auto">
      <a href="${escapeAttr(url)}" style="color:#999;text-decoration:underline;">لغو عضویت / Unsubscribe</a>
    </div>`;
  const close = html.search(/<\/body\s*>/i);
  return close === -1 ? html + footer : html.slice(0, close) + footer + html.slice(close);
}
