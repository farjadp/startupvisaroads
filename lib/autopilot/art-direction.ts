// ============================================================================
// lib/autopilot/art-direction.ts
// One visual system for every generated photograph, so the blog reads as a
// single campaign and not as five stock libraries. Pure constants: no
// imports, so a script can load this file directly to preview a prompt.
//
// Derived from the site itself: paper #F2F0E9, ink #1a1a1a, acid #CCFF00,
// brutalist borders and hard offset shadows, serif display type.
//
// Two rules here were learned from real renders, not taste. Writing surfaces
// are banned outright because flux renders paper as garbled pseudo-text, and
// the first pass put fake prose on every notebook in frame. And the palette
// is stated as a negative ("avoid warm orange, amber, golden") as well as a
// positive, because asking for \"warm paper tones\" reliably produced sepia
// desk scenes that look nothing like the cool, flat site chrome.
// ============================================================================

export const ART_DIRECTION = `A real editorial photograph, part of one professionally art-directed campaign for a contemporary founder-advisory brand. Photographed on a real camera, not rendered and not generated; small natural imperfections and real grain are welcome.
Subject: ONE clear real-world detail, object, material or space, slightly off-centre, with room breathing around it. Medium-close. Draw from: architecture and thresholds (doorways, staircases, handrails, glass, concrete, brick), city and transit detail (platforms, benches, crossings, bicycles, luggage, a coat on a hook), interiors stripped back (an empty room, a windowsill, a chair, a plant against a plain wall), and materials (linen, wool, matte metal, unglazed ceramic, stone). Never a wide establishing skyline, no posed professional, no meeting room, no handshake, nobody looking at the camera; when a person appears it is a hand or a partial figure at the edge of the frame.
NOTHING WITH WRITING ON IT. No paper, documents, forms, letters, books, notebooks, sticky notes, business cards, passports, maps, whiteboards, signage, or screens showing content. Any writing surface comes out as garbled pseudo-text and ruins the frame. A laptop or phone, if present, is closed or dark.
Light: soft, flat, overcast daylight from one side. Cool and even. No golden hour, no warm lamplight, no sunset tones, no dramatic lighting, no HDR, no heavy grading, no lens flare. Gentle depth of field.
Palette: cool and desaturated overall — off-white, bone, pale grey, and the deep near-black of ink (#1a1a1a) in shadows and objects. Muted, almost monochrome. Deliberately avoid warm orange, amber, golden, brown and sepia casts; avoid teal-and-orange grading entirely.
Accent, optional and small: at most one minor object may carry a sharp yellow-green — a cable, a strap, a tag, a painted line, a bicycle frame. It is never the subject, never a wall, never a door, and never more than a tenth of the frame. If the scene has no natural place for it, leave it out entirely; a purely grey and bone frame is correct. Nothing else in the frame is saturated.
Composition: one dominant subject, low visual noise, generous negative space, subject held near the centre so it survives cropping to 16:9 and 4:3.
No text, no lettering, no readable labels, no brand names, no logos, no watermark, no borders, no infographic elements, no flags, no maple leaf, no landmark clichés.`;

/**
 * The full prompt for one image.
 *
 * The scene goes FIRST and the art direction second. With the order reversed,
 * flux weighted the 350-word style block over the one-line subject and
 * returned the art direction's own examples instead of the requested scene —
 * three separate prompts (a bicycle, an empty chair, a suitcase) all came
 * back as a painted door.
 */
export function brandPrompt(scene: string): string {
  return `${scene.trim()}\n\nArt direction for this photograph:\n${ART_DIRECTION}`;
}
