// Latin inside right-to-left text. Persian route content keeps official names
// in Latin, often in parentheses: «استارتاپ دانمارک (Start-up Denmark)». Left
// to the Unicode bidi algorithm, the parentheses take the paragraph's RTL
// direction and a wrapped name splits across lines, so it rendered as
// "Start-) استارتاپ دانمارک" / "(up Denmark" (store screenshots, 15 Oct 2026).
// Each Latin run, with its parentheses when it fills them, is wrapped in a
// left-to-right isolate (LRI … PDI) so it lays out as one LTR unit. A run that
// fits on one line also gets no-break spaces and word joiners so a name does
// not split; a longer one may still wrap, inside its isolate.

const LRI = '⁦';
const PDI = '⁩';
const NBSP = ' ';
// Word joiner: no line break after a hyphen or slash, without needing a
// non-breaking-hyphen glyph in the brand fonts.
const WJ = '⁠';

// A run starts on a Latin letter (explicit ranges incl. Türkiye, Öğrenci İkamet
// İzni; no Unicode property escapes in a render path) and runs over everything
// that is not Arabic script (which holds Persian digits and ، ؛ ؟) or a line
// break, so "USCIS (I-140)" or a URL stays one isolate: two isolates side by
// side would swap places in an RTL paragraph.
const RUN = /[A-Za-zÀ-ÖØ-öø-ɏḀ-ỿ][^؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿\n]*/g;
/** A letter from a right-to-left script (Hebrew, Arabic incl. Persian). */
const RTL_CHAR = /[֐-ࣿיִ-﷿ﹰ-﻿]/;
// Also an opening "(" or quote the run ends on: in «فرم I-140 (کاغذی)» the "("
// opens the Persian aside, and inside an LTR isolate it would not mirror.
const TRAILING = /[\s.,:;!?(«»‹›“”"·]$/;

const count = (s: string, ch: string) => s.split(ch).length - 1;

/**
 * @param keepWhole longest run (in characters) that still fits on one line;
 *   runs up to it are made unbreakable. 0 isolates only.
 */
export function isolateLatin(text: string, keepWhole = 0): string {
  // Wholly Latin text has nothing to isolate from (the T component sets its
  // direction), and text already isolated is left as it is.
  if (!RTL_CHAR.test(text) || text.includes(LRI)) return text;
  let out = '';
  let last = 0;
  for (const m of text.matchAll(RUN)) {
    let start = m.index;
    let run = m[0];
    // Trim what belongs to the Persian sentence: trailing spaces and punctuation,
    // and a closing parenthesis the run did not open, unless the "(" sits just
    // before the run, in which case the parentheses go into the isolate with it.
    for (;;) {
      if (TRAILING.test(run)) run = run.slice(0, -1);
      else if (run.endsWith(')') && count(run, ')') > count(run, '(')) {
        if (start > last && text[start - 1] === '(') {
          start -= 1;
          run = `(${run}`;
          continue;
        }
        run = run.slice(0, -1);
      } else break;
    }
    const kept = run.length <= keepWhole ? run.replace(/ /g, NBSP).replace(/([-–/])/g, `$1${WJ}`) : run;
    out += `${text.slice(last, start)}${LRI}${kept}${PDI}`;
    last = start + run.length;
  }
  return out + text.slice(last);
}
