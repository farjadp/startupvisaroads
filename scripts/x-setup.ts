// ============================================================================
// scripts/x-setup.ts
// Produces the OAuth 1.0a access token and secret for ONE X account.
//
//   X_CONSUMER_KEY=... X_CONSUMER_SECRET=... npx tsx scripts/x-setup.ts
//
// Run it once per account. The developer app is created under one account,
// but any account can authorise it — which is how the second account gets
// tokens without a second app.
//
// It uses the PIN flow, so nothing has to listen on a callback URL and the
// tokens never leave your terminal. What it prints at the end contains
// secrets: run it, do not paste it anywhere.
// ============================================================================
import { createInterface } from 'node:readline/promises';
import { TwitterApi } from 'twitter-api-v2';

const appKey = process.env.X_CONSUMER_KEY?.trim();
const appSecret = process.env.X_CONSUMER_SECRET?.trim();

if (!appKey || !appSecret) {
  console.error('X_CONSUMER_KEY and X_CONSUMER_SECRET are required.\n');
  console.error('  X_CONSUMER_KEY=... X_CONSUMER_SECRET=... npx tsx scripts/x-setup.ts\n');
  console.error('Both come from the app\'s "Keys and tokens" tab on developer.x.com.');
  process.exit(1);
}

async function main() {
  const client = new TwitterApi({ appKey: appKey!, appSecret: appSecret! });

  let link;
  try {
    // 'oob' asks X for the PIN flow instead of a callback redirect.
    link = await client.generateAuthLink('oob', { linkMode: 'authorize' });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`✗ could not start the flow: ${msg}\n`);
    console.error('A 401 here almost always means the consumer key and secret are wrong,');
    console.error('or that the app has no "User authentication settings" configured yet.');
    process.exit(1);
  }

  console.log('\n1. Open this while logged in as THE ACCOUNT YOU WANT TO POST AS:\n');
  console.log(`   ${link.url}\n`);
  console.log('   Check the account name on that page before authorising — this is the');
  console.log('   one step where posting as the wrong account becomes possible.\n');

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const pin = (await rl.question('2. Paste the PIN it gives you: ')).trim();
  rl.close();

  try {
    const { accessToken, accessSecret, screenName } = await client.login(pin);
    console.log(`\n✓ authorised as @${screenName}\n`);

    const suffix = screenName.toLowerCase().includes('asha') ? 'ASHAVID' : 'FARJAD';
    console.log('────────────────────────────────────────────────');
    console.log('Run this. It contains secrets — run it, do not paste it into chat:\n');
    console.log(`gcloud run services update startupvisaroads --region europe-west1 \\
  --update-env-vars "X_CONSUMER_KEY=${appKey},X_CONSUMER_SECRET=${appSecret},X_TOKEN_${suffix}=${accessToken},X_SECRET_${suffix}=${accessSecret}"`);
    console.log('────────────────────────────────────────────────');
    console.log(`\nThe suffix was guessed from @${screenName}. If that is the wrong`);
    console.log('destination, change X_TOKEN_* and X_SECRET_* before running it.');
    console.log('\nThen run this again, logged in as the other account.');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`\n✗ the PIN was rejected: ${msg}`);
    console.error('PINs expire quickly — start again and paste it promptly.');
    process.exit(1);
  }
}

main();
