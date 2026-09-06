// ============================================================================
// scripts/gen-fa-assets.ts
// Generate the Persian site's page imagery with the autopilot's art
// direction so the pages and the blog read as one campaign. Writes
// public/fa/img/<name>.webp. Skips names that already exist unless --force.
//
//   npx tsx scripts/gen-fa-assets.ts            # only missing
//   npx tsx scripts/gen-fa-assets.ts --force     # regenerate all
//   npx tsx scripts/gen-fa-assets.ts home finland  # a subset
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { brandPrompt } from '../lib/autopilot/art-direction';

// Load .env.local / .env the way Next does, without adding a dependency.
for (const f of ['.env.local', '.env']) {
  if (!fs.existsSync(f)) continue;
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) throw new Error('FAL_KEY missing');

/** One scene per page. Objects, thresholds, materials — never flags or landmarks. */
const SCENES: Record<string, string> = {
  home: 'A train platform edge in flat overcast light, a single small luggage tag in sharp yellow-green on a dark canvas bag, empty platform beyond',
  finland: 'A weathered timber dock reaching into still grey lake water, birch trunks at the edge of frame, flat cool light',
  denmark: 'An old bicycle with a matte black frame leaning on a pale brick wall, cobblestones, one yellow-green strap on the rack',
  estonia: 'A narrow medieval stone staircase with a matte steel handrail, cool daylight from a high window',
  netherlands: 'A narrow steel canal bridge railing over flat grey water, a dark bicycle leaning against it, low overcast light',
  'new-brunswick': 'A red-brick harbour warehouse doorway, a dark wool coat on a hook inside, morning fog outside',
  'nova-scotia': 'A weathered wooden pier post with a coiled grey rope, calm cold Atlantic water behind, overcast',
  'canada-startup-visa': 'A closed corrugated steel shutter on a concrete threshold, one thin painted yellow-green line on the floor in front',
  pnp: 'A row of empty wooden chairs along a tall window in a plain white hall, soft side light',
  'usa-eb2-niw': 'A laboratory glass door slightly ajar, matte aluminium frame, cool even light, nothing legible',
  mentorship: 'Two plain chairs facing each other at a bare oak table by a window, a closed dark notebook between them',
  about: 'A linen jacket over the back of a chair in an otherwise empty room, pale wall, soft daylight',
  'which-path': 'A fork in a gravel path between low dry-stone walls under an overcast sky, no signage',
  contact: 'A dark closed laptop on a wide windowsill, a single yellow-green cable, grey city light outside',
  // Second and third scenes for the destination guides, so a long page never
  // shows the same photograph twice. Same art direction, different subject.
  'finland-2': 'A pale birch plywood desk edge against a white wall, a matte grey ceramic cup, flat Nordic daylight',
  'finland-3': 'An empty tram stop shelter in soft snow light, steel and glass, no signage legible',
  'denmark-2': 'A row of dark timber cladding on a harbour building, one small yellow-green mooring cleat, overcast',
  'denmark-3': 'A plain oak meeting table by a tall window, two empty chairs, grey daylight',
  'netherlands-2': 'A steel drawbridge counterweight over flat grey water, low cloud, no people',
  'netherlands-3': 'A narrow brick warehouse doorway with a matte black steel door, canal reflection on the ground',
  'estonia-2': 'A limestone city wall corner meeting new matte glass, cool flat light',
  'estonia-3': 'A dark server-room door with a steel handle in a plain corridor, even lighting, nothing legible',
  'new-brunswick-2': 'A frozen river bank with bare birch, a dark timber jetty, flat winter light',
  'new-brunswick-3': 'An empty small-town main street shopfront with a closed matte green door, overcast',
  'nova-scotia-2': 'A stack of weathered lobster traps on a wet concrete pier, grey Atlantic behind',
  'nova-scotia-3': 'A lighthouse handrail in fog, painted steel, no horizon visible',
  'canada-startup-visa-2': 'A padlocked chain-link gate in front of a concrete loading bay, flat grey light',
  'canada-startup-visa-3': 'An empty glass office lobby seen from outside at dusk, no signage, cool tones',
  'pnp-2': 'A prairie grain elevator silhouette under a wide flat overcast sky',
  'pnp-3': 'A provincial highway guardrail curving into low fog, wet asphalt',
  'usa-eb2-niw-2': 'A microscope eyepiece and matte metal stage on a clean bench, cool even light',
  'usa-eb2-niw-3': 'A university corridor with tall windows and a polished concrete floor, empty, flat daylight',
  'mentorship-2': 'A whiteboard wiped clean with faint ghost marks, a single black marker on the tray',

};

async function generate(scene: string): Promise<Uint8Array> {
  const res = await fetch('https://fal.run/fal-ai/flux/dev', {
    method: 'POST',
    headers: { Authorization: `Key ${FAL_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: brandPrompt(scene), image_size: 'landscape_16_9', num_inference_steps: 28, guidance_scale: 3.5, num_images: 1, enable_safety_checker: false }),
  });
  if (!res.ok) throw new Error(`fal ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { images: { url: string }[] };
  const img = await fetch(data.images[0].url);
  if (!img.ok || !(img.headers.get('content-type') || '').startsWith('image/')) throw new Error('bad image response');
  return new Uint8Array(await img.arrayBuffer());
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const only = args.filter((a) => !a.startsWith('--'));
  const outDir = path.join('public', 'fa', 'img');
  fs.mkdirSync(outDir, { recursive: true });

  for (const [name, scene] of Object.entries(SCENES)) {
    if (only.length && !only.includes(name)) continue;
    const out = path.join(outDir, `${name}.webp`);
    if (fs.existsSync(out) && !force) { console.log(`skip   ${name} (exists)`); continue; }
    process.stdout.write(`gen    ${name} … `);
    try {
      const bytes = await generate(scene);
      const tmp = path.join(outDir, `${name}.tmp.png`);
      fs.writeFileSync(tmp, bytes);
      execFileSync('cwebp', ['-q', '82', '-resize', '1600', '0', tmp, '-o', out], { stdio: 'ignore' });
      fs.unlinkSync(tmp);
      console.log(`${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
    } catch (e) {
      console.log('FAILED', (e as Error).message.slice(0, 120));
    }
  }
}
main();
