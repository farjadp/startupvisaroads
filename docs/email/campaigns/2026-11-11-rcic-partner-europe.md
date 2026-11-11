# RCIC partner outreach: Europe startup routes

- **Template:** `docs/email/templates/rcic-partner-europe.html` (v1, 11 Nov 2026, about 13 KB, so Gmail will not clip it)
- **Goal:** booked partner calls with RCICs and immigration lawyers who have entrepreneur clients. One metric: calls booked per 100 sent. Replies are the second signal; opens are ignored.
- **Audience:** RCIC firms on a corporate domain, from the Verixa registry export of 11 Nov 2026. One contact per firm, with farjadp.info bounces, unsubscribes and complaints removed. Order: the 216 firms that clicked in September, then the 434 that opened, then the 2,057 new firms. The list lives outside git.
- **Volume:** at most 20 a day, Mon–Thu, sent by Farjad from the VisaRoads admin.
- **Skills used:** marketing:draft-content (copy), marketing-psychology:dark-pattern-check rules (no fake urgency, no "Re:", the sender is named).

## Subject lines (pick one per batch and keep it for the whole batch)
1. A second road for your entrepreneur clients
2. Europe startup routes for clients Canada can't take
3. Partnering on Netherlands / Finland startup files

**Preview text:** You keep the client and the legal file. We build the startup side for the Netherlands, Finland, Denmark and Flanders.

## The personal paragraph (the only part that changes)
The agent reads the firm's own site and writes 1–3 sentences. Rules:
- Every claim comes from the firm's site; the agent keeps the URL in the batch sheet. No invented praise, no "I loved your post".
- No immigration figures. If one is needed, it must be cited to the official source.
- Choose the segment from the services page:

| Segment | Signal on their site | Paragraph pattern |
|---|---|---|
| A. Business practice | Start-up Visa, C11, self-employed, investor, PNP entrepreneur | "I was reading your Business Immigration page and saw you advise founders on the Start-up Visa and C11 work permits." |
| B. Community focus | Site in a second language, or a named diaspora | "I saw that much of your practice serves clients from [community], many of whom come to you with a business already running." |
| C. Already does Europe | Mentions EU, Portugal, Spain, Golden Visa | "I noticed you already advise clients on European options such as [route]. We could take the business-plan side off your team's desk." |
| Skip | Study and work permits only, or the site says "no solicitation" | Do not send. |

## Before each batch (Farjad)
- [ ] Sender email set to a VisaRoads address that is verified in Resend (today it is empty and falls back to noreply@farjadp.info)
- [ ] Mailing address filled in the footer
- [ ] Unsubscribe URL field in Settings is empty (it showed "admin", probably browser autofill)
- [ ] Daily limit set to 20
- [ ] Test send to yourself: check the unsubscribe link works and the reply-to reaches you
- [ ] Group holds only today's 20 contacts

## Known limits of the sending system (for cto, via cro)
1. No per-contact merge fields, so a fully personal email means one campaign per firm. Request: a `{{personal}}` field on MarketingContact, filled from the import CSV.
2. Done on this branch: a template can place `{{unsubscribe_url}}` itself (this one does, as a button), and the fallback footer now goes before `</body>` (`lib/unsubscribe-footer.ts`).
3. There is no `List-Unsubscribe` / `List-Unsubscribe-Post` header. Not required at 20 a day, but it helps inbox placement.
4. There is no reply-to setting, so replies go to the sender address. That address must be a mailbox Farjad reads.

## Footer (Mailchimp-style)
Social follow icons (LinkedIn, YouTube, Instagram, X, Telegram @visaroads) hosted at `visaroads.com/img/email/`; a short description of what VisaRoads does and does not do; "Our mailing address is"; "Why did I get this?"; an Unsubscribe button; and a copyright line. The icons and the button only work once this branch is merged and deployed.

## Compliance
- CASL: conspicuous publication, meaning the address is on the public register or the firm's site and the message concerns their practice. Keep the source per contact. Check the CICC register's terms of use before the first send (legal-compliance-specialist).
- Identification: VisaRoads Inc. and a mailing address in every email; unsubscribe without login, honoured immediately.
- No prices, no guarantees, and no immigration advice (the footer says so).
