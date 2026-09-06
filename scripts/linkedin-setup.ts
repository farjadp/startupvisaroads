// ============================================================================
// scripts/linkedin-setup.ts
// Turns a LinkedIn access token into the values the app needs, and prints the
// command to set them.
//
//   LINKEDIN_TOKEN=AQW... npx tsx scripts/linkedin-setup.ts
//
// The token is read from the environment and never printed, so it stays in
// your shell. Everything this prints is safe to read out loud except the
// command at the end, which contains the token by necessity — run it, do not
// paste it anywhere.
//
// It answers three questions you would otherwise answer by hand:
//   - what is my person URN
//   - which pages can this token post to
//   - what exactly do I run to configure the service
// ============================================================================
const token = process.env.LINKEDIN_TOKEN?.trim();
if (!token) {
  console.error('LINKEDIN_TOKEN is not set.\n');
  console.error('  LINKEDIN_TOKEN=AQW... npx tsx scripts/linkedin-setup.ts\n');
  console.error('Generate one at linkedin.com/developers/tools/oauth/token-generator');
  process.exit(1);
}

const api = async (path: string) => {
  const res = await fetch(`https://api.linkedin.com${path}`, {
    headers: { Authorization: `Bearer ${token}`, 'X-Restli-Protocol-Version': '2.0.0' },
  });
  const text = await res.text();
  let json: unknown = null;
  try { json = JSON.parse(text); } catch { /* keep the raw body for the error */ }
  return { ok: res.ok, status: res.status, json: json as Record<string, unknown> | null, text };
};

async function main() {
  // 1. Who is this token for?
  const me = await api('/v2/userinfo');
  if (!me.ok) {
    console.error(`✗ userinfo failed (${me.status}): ${me.text.slice(0, 200)}`);
    console.error('\nA 401 means the token is expired or was revoked. A 403 means the app is');
    console.error('missing the "Sign In with LinkedIn using OpenID Connect" product.');
    process.exit(1);
  }
  const personUrn = `urn:li:person:${me.json?.sub}`;
  console.log(`✓ person URN   ${personUrn}`);
  console.log(`  name         ${me.json?.name ?? '(not shared)'}`);

  // 2. Which pages can it act for?
  const acl = await api('/v2/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED&count=20');
  const pages: { urn: string }[] = [];
  if (acl.ok) {
    const elements = (acl.json?.elements as { organization?: string }[] | undefined) ?? [];
    for (const e of elements) if (e.organization) pages.push({ urn: e.organization });
    if (!pages.length) console.log('\n! this token administers no pages');
    for (const p of pages) console.log(`✓ page URN     ${p.urn}`);
  } else {
    console.log(`\n! cannot list pages (${acl.status}) — this token has no w_organization_social,`);
    console.log('  so it can post to the profile but not to a company page. Add the');
    console.log('  "Community Management API" product to the app and generate a new token.');
  }

  // 3. What to run.
  console.log('\n────────────────────────────────────────────────');
  console.log('Run this. It contains the token, so run it — do not paste it into chat:\n');
  const vars = [`LINKEDIN_AUTHOR_URN=${personUrn}`, `LINKEDIN_TOKEN_FARJAD=$LINKEDIN_TOKEN`];
  if (pages[0]) vars.push(`LINKEDIN_ORG_URN_VISAROADS=${pages[0].urn}`, 'LINKEDIN_TOKEN_VISAROADS=$LINKEDIN_TOKEN');
  if (pages[1]) vars.push(`LINKEDIN_ORG_URN_ASHAVID=${pages[1].urn}`, 'LINKEDIN_TOKEN_ASHAVID=$LINKEDIN_TOKEN');
  console.log(`gcloud run services update startupvisaroads --region europe-west1 \\
  --update-env-vars "${vars.join(',')}"`);
  if (pages.length > 1) {
    console.log('\n! Check which page is which before running: the two URNs above are in the');
    console.log('  order LinkedIn returned them, not necessarily VisaRoads then Ashavid.');
  }
  console.log('\nWhen everything is set, generate a fresh token in the LinkedIn console.');
  console.log('The one in your screenshot is readable and lives for two months.');
}

main();
