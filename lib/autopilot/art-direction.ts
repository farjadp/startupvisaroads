// ============================================================================
// lib/autopilot/art-direction.ts
// One visual system for every generated photograph, so the blog reads as a
// single campaign and not as five stock libraries. Pure constants: no
// imports, so a script can load this file directly to preview a prompt.
//
// Derived from the site itself: paper #F2F0E9, ink #1a1a1a, acid #CCFF00,
// brutalist borders and hard offset shadows, serif display type. The photo
// answers that with warm paper tones, deep ink shadows and the acid green
// only as one restrained accent in a real object.
// ============================================================================

export const ART_DIRECTION = `A real editorial photograph, part of one professionally art-directed campaign for a contemporary founder-advisory brand. It must look photographed on a real camera, not rendered and not generated; allow small natural imperfections, real film grain is fine.
Subject: ONE clear real-world detail, object, material or space, slightly off-centre, with room breathing around it. Medium-close. Founder's workspace, documents and stationery, architecture and streets of Canadian, American and European cities, airports and transit, notebooks, passports closed, maps, keys, desks, coffee, glass and concrete. Never a wide establishing skyline, no posed professional, no handshake, nobody looking at the camera; when a person appears it is a hand or a partial figure at the edge of the frame.
Light: soft natural daylight from one side, restrained contrast, no dramatic lighting, no HDR, no heavy grading. Gentle depth of field.
Palette: warm paper and cream (#F2F0E9) as the dominant tone, deep ink black (#1a1a1a) in shadows and objects. One restrained accent of acid green (#CCFF00) in a real object — a sticky note, a pen cap, a lanyard, a bicycle frame, a painted door — never as a colour cast. No purple, no blue-purple gradients, no neon glow.
Materials: paper, cream stone, warm wood, matte black metal, glass, linen, concrete. Contemporary. No flags, no maple leaf, no eagle, no landmark clichés.
Composition: one dominant subject, low visual noise, generous negative space, subject held near the centre so it survives cropping to 16:9 and 4:3.
Absolutely no text, no lettering, no signage, no readable labels, no brand names, no logos, no watermark, no borders, no infographic elements. Paper, screens and covers are blank, turned away, or softly out of focus — the model must never try to render writing, because it comes out as garbled pseudo-text. Passports and documents show plain covers without crests or emblems.`;

/** The full prompt for one image: art direction first, then the writer's scene. */
export function brandPrompt(scene: string): string {
  return `${ART_DIRECTION}\n\nScene: ${scene.trim()}`;
}
