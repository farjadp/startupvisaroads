"""
scripts/brand-start-up-chile-checklists.py

Builds the four downloadable Start-Up Chile BIG 13 checklists offered on
/en/start-up-chile and /fa/start-up-chile (DOCX + PDF, English + Persian)
from Farjad's blank checklists.

What it changes, and nothing else:
  - replaces the personal byline ("<date> · @Farjad") with the VisaRoads
    publisher line, the guide URL and a "not legal advice" line;
  - applies the corrections passed in CORRECTIONS (figures the official
    documents state differently from the draft);
  - puts a header and a copyright footer on every page:
      © 2026 VisaRoads Inc. · visaroads.com · farjad@visaroads.com · Telegram @visaroads
  - Persian: Vazirmatn on every run (ascii, hAnsi and cs), RTL on the section,
    header and footer, so LibreOffice and Word both lay it out right to left;
  - sets the document properties (title, author, company).
Then converts each DOCX to PDF with LibreOffice (soffice must be on PATH and
Vazirmatn installed, or the Persian PDF falls back to another font).

Usage:
  python3 scripts/brand-start-up-chile-checklists.py <en.docx> <fa.docx> <out-dir>
"""
import copy
import subprocess
import sys
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Pt, RGBColor

CONTACT = '© 2026 VisaRoads Inc. · visaroads.com · farjad@visaroads.com · Telegram @visaroads'
INK = RGBColor(0x1A, 0x1A, 0x1A)
MUTED = RGBColor(0x55, 0x55, 0x55)

COPY = {
    'en': {
        'url': 'https://visaroads.com/en/start-up-chile',
        'title': 'Start-Up Chile BIG 13 — Application checklist (blank)',
        'header': 'Start-Up Chile BIG 13 · Application checklist · VisaRoads',
        'byline': 'Published by VisaRoads · 23 November 2026 · free to share with attribution · not legal advice',
        'source': 'Guide and sources: https://visaroads.com/en/start-up-chile',
        'closing_title': 'About this checklist',
        'closing': [
            'Published by VisaRoads Inc. (an Ashavid company), visaroads.com. You may copy and share this file freely, unchanged, with attribution to VisaRoads and a link to https://visaroads.com/en/start-up-chile.',
            'This is a preparation aid, not legal or immigration advice, and VisaRoads is not affiliated with CORFO or Start-Up Chile. The portal questions were read on 23 November 2026; the official call documents on corfo.gob.cl and startupchile.org prevail over anything here.',
            'Questions: farjad@visaroads.com · Telegram channel @visaroads',
        ],
        'byline_match': '@Farjad',
        'page': 'Page',
    },
    'fa': {
        'url': 'https://visaroads.com/fa/start-up-chile',
        'title': 'چک‌لیست درخواست Start-Up Chile BIG 13 (نسخه‌ی خالی، فارسی)',
        'header': 'چک‌لیست درخواست Start-Up Chile BIG 13 · ویزارودز',
        'byline': 'منتشرشده از سوی ویزارودز · ۲ آذر ۱۴۰۵ (۲۳ نوامبر ۲۰۲۶) · بازنشر آزاد با ذکر منبع · مشاوره‌ی حقوقی نیست',
        'source': 'راهنما و منابع: https://visaroads.com/fa/start-up-chile',
        'closing_title': 'درباره‌ی این چک‌لیست',
        'closing': [
            'این فایل را VisaRoads Inc. (از شرکت‌های Ashavid)، visaroads.com، منتشر کرده است. کپی و بازنشر آن بدون تغییر و با ذکر نام ویزارودز و لینک https://visaroads.com/fa/start-up-chile آزاد است.',
            'این فایل ابزار آماده‌سازی است، نه مشاوره‌ی حقوقی یا مهاجرتی، و ویزارودز وابسته به CORFO یا Start-Up Chile نیست. سؤال‌های پورتال در ۲۳ نوامبر ۲۰۲۶ خوانده شده‌اند؛ اسناد رسمی فراخوان در corfo.gob.cl و startupchile.org بر هر چیزی در این فایل مقدم‌اند.',
            'پرسش‌ها: farjad@visaroads.com · کانال تلگرام @visaroads',
        ],
        'byline_match': '@Farjad',
        'page': 'صفحه',
    },
}

# (lang, old text, new text): figures the official documents state otherwise.
# Filled in after the fact-check; each entry is applied inside runs, so it must
# match text within a single run.
CORRECTIONS: list[tuple[str, str, str]] = [
    # Not in any CORFO or Start-Up Chile document; SERMIG's rule (DS 177/2022)
    # is a passport valid one year and police certificates at most 60 days old.
    ('en', 'Foreign Team Leader: start on an apostilled police certificate and a passport valid 18 months from March 2027. Both must be from your country of permanent residence.',
     'Foreign Team Leader: plan your police certificates (country of origin and every country you lived in during the last 5 years; at most 60 days old when you apply for the visa; apostilled or legalised) and a passport valid at least 1 year from the visa application. These are SERMIG rules (DS 177/2022).'),
    ('en', 'Apostilled police certificate from your country of permanent residence',
     'Police certificates from your country of origin and every country you lived in during the last 5 years, at most 60 days old when you apply for the visa, apostilled or legalised'),
    ('en', 'Passport valid 18 months from March 2027',
     'Passport valid at least 1 year from the visa application (DS 177/2022, art. 11); more is safer'),
    ('fa', 'لیدر خارجی: از همین حالا گواهی عدم سوءپیشینه\u200cی آپوستیل\u200cشده و پاسپورتی با ۱۸ ماه اعتبار از مارس ۲۰۲۷ را پیگیری کنید. هر دو باید از کشور اقامت دائم شما باشند.',
     'لیدر خارجی: گواهی عدم سوءپیشینه از کشور تابعیت و هر کشوری که در ۵ سال گذشته در آن زندگی کرده‌اید (حداکثر ۶۰ روزه هنگام درخواست ویزا، آپوستیل‌شده یا قانونی‌شده) و پاسپورتی با دست‌کم یک سال اعتبار از تاریخ درخواست ویزا را برنامه‌ریزی کنید. این‌ها قواعد اداره‌ی مهاجرت شیلی است (DS 177/2022).'),
]

FA_DIGITS = str.maketrans('0123456789', '۰۱۲۳۴۵۶۷۸۹')


def complete_fa(doc):
    """Append Steps 4–8 and the closing lists to the Persian draft, which
    stops after Step 3, cloning its own paragraphs and table for the format."""
    import importlib.util
    spec = importlib.util.spec_from_file_location('rest', Path(__file__).with_name('start-up-chile-checklist-fa-rest.py'))
    rest = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(rest)

    pars = doc.paragraphs
    h2 = next(p for p in pars if p.style.name == 'Heading 2' and 'مرحله ۳' in p.text)
    note = next(p for p in pars if p.text.startswith('ویدئوی پیچ باید'))
    item = next(p for p in pars if p.text.startswith('☐ مرحله ۳'))
    table = doc.tables[-1]
    if any('مرحله ۴' in p.text for p in pars):
        return  # already complete

    body = doc.element.body
    sectPr = body.find(qn('w:sectPr'))

    def put(el):
        if sectPr is not None:
            sectPr.addprevious(el)
        else:
            body.append(el)

    def par(template, text):
        el = copy.deepcopy(template._p)
        runs = el.findall(qn('w:r'))
        for r in runs[1:]:
            el.remove(r)
        t = runs[0].find(qn('w:t'))
        t.text = text
        t.set(qn('xml:space'), 'preserve')
        put(el)

    def set_cell(tc, text):
        p = tc.find(qn('w:p'))
        runs = p.findall(qn('w:r'))
        if not runs:
            return
        for r in runs[1:]:
            p.remove(r)
        t = runs[0].find(qn('w:t'))
        t.text = text

    def tbl(rows):
        el = copy.deepcopy(table._tbl)
        trs = el.findall(qn('w:tr'))
        header, template = trs[0], trs[1]
        for tr in trs[1:]:
            el.remove(tr)
        for i, (q, fmt) in enumerate(rows, 1):
            tr = copy.deepcopy(template)
            tcs = tr.findall(qn('w:tc'))
            set_cell(tcs[0], str(i).translate(FA_DIGITS))
            set_cell(tcs[1], q)
            set_cell(tcs[2], fmt)
            if len(tcs) > 3:
                set_cell(tcs[3], '')
            el.append(tr)
        put(el)

    for n, step in enumerate(rest.STEPS, 4):
        par(h2, step['heading'])
        par(note, step['note'])
        tbl(step['rows'])
        par(item, f'☐ مرحله {str(n).translate(FA_DIGITS)} ذخیره شد')
    par(h2, rest.DECLARATIONS_HEADING)
    par(note, rest.DECLARATIONS_NOTE)
    for line in rest.DECLARATIONS:
        par(item, line)
    par(h2, rest.REVIEW_HEADING)
    for line in rest.REVIEW:
        par(item, line)
    par(h2, rest.AFTER_HEADING)
    for line in rest.AFTER:
        par(item, line)


def set_rtl_par(p):
    pPr = p._p.get_or_add_pPr()
    if pPr.find(qn('w:bidi')) is None:
        pPr.insert(0, OxmlElement('w:bidi'))


def set_run_font(run, font, rtl=False, size=None, bold=None, color=None):
    rPr = run._r.get_or_add_rPr()
    rFonts = rPr.find(qn('w:rFonts'))
    if rFonts is None:
        rFonts = OxmlElement('w:rFonts')
        rPr.insert(0, rFonts)
    for k in ('ascii', 'hAnsi', 'cs', 'eastAsia'):
        rFonts.set(qn(f'w:{k}'), font)
    if rtl and rPr.find(qn('w:rtl')) is None:
        rPr.append(OxmlElement('w:rtl'))
    if size:
        run.font.size = Pt(size)
        szCs = OxmlElement('w:szCs')
        szCs.set(qn('w:val'), str(int(size * 2)))
        rPr.append(szCs)
    if bold is not None:
        run.bold = bold
    if color is not None:
        run.font.color.rgb = color


def add_field(par, instr, font, rtl, size):
    """A PAGE / NUMPAGES field as three runs, styled like the text around it."""
    def r(tag, **attrs):
        run = par.add_run()
        set_run_font(run, font, rtl=rtl, size=size, color=MUTED)
        el = OxmlElement(tag)
        for k, v in attrs.items():
            el.set(qn(k), v)
        if tag == 'w:instrText':
            el.text = instr
            el.set(qn('xml:space'), 'preserve')
        run._r.append(el)
    r('w:fldChar', **{'w:fldCharType': 'begin'})
    r('w:instrText')
    r('w:fldChar', **{'w:fldCharType': 'end'})


def brand(src: Path, lang: str, out: Path):
    c = COPY[lang]
    rtl = lang == 'fa'
    font = 'Vazirmatn' if rtl else 'Calibri'
    doc = Document(str(src))
    if rtl:
        complete_fa(doc)
        # Row numbers in the draft's tables are Latin digits; Persian text gets Persian digits.
        for t in doc.tables:
            for row in t.rows:
                c0 = row.cells[0]
                if c0.text.strip().isdigit():
                    for r in c0.paragraphs[0].runs:
                        r.text = r.text.translate(FA_DIGITS)

    # Defaults: one font everywhere, Persian on the complex-script slot too.
    for style in doc.styles:
        if getattr(style, 'font', None) is None:
            continue
        rPr = style.element.get_or_add_rPr()
        rFonts = rPr.find(qn('w:rFonts'))
        if rFonts is None:
            rFonts = OxmlElement('w:rFonts')
            rPr.insert(0, rFonts)
        mono = rFonts.get(qn('w:ascii')) == 'Consolas'
        if not mono:
            for k in ('ascii', 'hAnsi', 'cs', 'eastAsia'):
                rFonts.set(qn(f'w:{k}'), font)
        # Headings in ink, not Word's default blue.
        if style.name.startswith('Heading') or style.name == 'Title':
            style.font.color.rgb = INK

    body_pars = list(doc.paragraphs)
    for t in doc.tables:
        for row in t.rows:
            for cell in row.cells:
                body_pars.extend(cell.paragraphs)
    for p in body_pars:
        for run in p.runs:
            for l, old, new in CORRECTIONS:
                if l == lang and old in run.text:
                    run.text = run.text.replace(old, new)
            if rtl:
                set_run_font(run, font, rtl=True)
        if rtl:
            set_rtl_par(p)
            pPr = p._p.get_or_add_pPr()
            # numbering.xml has no bidi: the draft's bullets would land on the
            # wrong side in Word. Every list line already starts with ☐.
            numPr = pPr.find(qn('w:numPr'))
            if numPr is not None:
                pPr.remove(numPr)
            # In an RTL paragraph "right"/"end" is the visual left in Word.
            jc = pPr.find(qn('w:jc'))
            if jc is not None and jc.get(qn('w:val')) in ('right', 'end'):
                jc.set(qn('w:val'), 'start')

    # Byline → publisher line + guide URL.
    for p in doc.paragraphs:
        if c['byline_match'] in p.text:
            for r in p.runs[1:]:
                r._r.getparent().remove(r._r)
            if p.runs:
                p.runs[0].text = c['byline']
            else:
                p.add_run(c['byline'])
            set_run_font(p.runs[0], font, rtl=rtl, size=10, bold=True, color=MUTED)
            src_par = copy.deepcopy(p._p)
            p._p.addnext(src_par)
            from docx.text.paragraph import Paragraph
            sp = Paragraph(src_par, p._parent)
            sp.runs[0].text = c['source']
            sp.runs[0].bold = False
            break

    # Closing block.
    h = doc.add_paragraph()
    hr = h.add_run(c['closing_title'])
    set_run_font(hr, font, rtl=rtl, size=12, bold=True, color=INK)
    if rtl:
        set_rtl_par(h)
    for line in c['closing']:
        p = doc.add_paragraph()
        r = p.add_run(line)
        set_run_font(r, font, rtl=rtl, size=9.5, color=MUTED)
        if rtl:
            set_rtl_par(p)

    # Header and footer on every page of every section.
    for section in doc.sections:
        if rtl:
            sectPr = section._sectPr
            if sectPr.find(qn('w:bidi')) is None:
                sectPr.insert(0, OxmlElement('w:bidi'))
        section.header.is_linked_to_previous = False
        section.footer.is_linked_to_previous = False
        hp = section.header.paragraphs[0]
        hp.text = ''
        hr = hp.add_run(c['header'])
        set_run_font(hr, font, rtl=rtl, size=8.5, color=MUTED)
        if rtl:
            set_rtl_par(hp)
        fp = section.footer.paragraphs[0]
        fp.text = ''
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        fr = fp.add_run(CONTACT)
        set_run_font(fr, font, rtl=rtl, size=8, color=MUTED)
        if rtl:
            set_rtl_par(fp)
        fp2 = section.footer.add_paragraph()
        fp2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        lr = fp2.add_run(f"{c['url']} · {c['page']} ")
        set_run_font(lr, font, rtl=rtl, size=8, color=MUTED)
        add_field(fp2, 'PAGE', font, rtl, 8)
        if rtl:
            set_rtl_par(fp2)

    cp = doc.core_properties
    cp.title = c['title']
    cp.author = 'VisaRoads Inc.'
    cp.last_modified_by = 'VisaRoads Inc.'
    cp.comments = f"{CONTACT}. Free to share with attribution. Not legal advice. {c['url']}"
    cp.subject = 'Start-Up Chile BIG 13'
    out.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(out))


def main():
    en_src, fa_src, out_dir = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
    targets = {
        'en': out_dir / 'visaroads-start-up-chile-big13-checklist-en.docx',
        'fa': out_dir / 'visaroads-start-up-chile-big13-checklist-fa.docx',
    }
    brand(en_src, 'en', targets['en'])
    brand(fa_src, 'fa', targets['fa'])
    for t in targets.values():
        subprocess.run(['soffice', '--headless', '--convert-to', 'pdf', '--outdir', str(out_dir), str(t)], check=True, capture_output=True)
        print('wrote', t, t.with_suffix('.pdf'))


if __name__ == '__main__':
    main()
