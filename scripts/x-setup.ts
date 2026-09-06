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

const appKey = (process.env.X_CONSUMER_KEY ?? process.env.X_KEY)?.trim();
const appSecret = (process.env.X_CONSUMER_SECRET ?? process.env.X_KEYSECRET)?.trim();

if (!appKey || !appSecret) {
  console.error('X_CONSUMER_KEY and X_CONSUMER_SECRET are required.\n');
  console.error('  X_CONSUMER_KEY=... X_CONSUMER_SECRET=... npx tsx scripts/x-setup.ts\n');
  console.error('Both come from the app\'s "Keys and tokens" tab on developer.x.com.');
  console.error('Use the keys of the app that belongs to the account you are authorising.');
  process.exit(1);
}

async function main() {
  const requestClient = new TwitterApi({ appKey: appKey!, appSecret: appSecret! });

  let link;
  try {
    // 'oob' asks X for the PIN flow instead of a callback redirect.
    link = await requestClient.generateAuthLink('oob', { linkMode: 'authorize' });
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
    // login() must run on a client carrying the REQUEST token from the step
    // above, not on the bare app client. Calling it on the app client returns
    // 401 no matter how valid the PIN is, which reads as "expired PIN" and
    // sends you round the loop again — which is exactly what it did.
    const pinClient = new TwitterApi({
      appKey: appKey!,
      appSecret: appSecret!,
      accessToken: link.oauth_token,
      accessSecret: link.oauth_token_secret,
    });
    const { accessToken, accessSecret, screenName } = await pinClient.login(pin);
    console.log(`\n✓ authorised as @${screenName}\n`);

    // Each destination has its own app, so the consumer key goes out under the
    // same suffix as the user tokens rather than as one shared pair.
    const suffix = screenName.toLowerCase().includes('asha') ? 'ASHAVID' : 'FARJAD';
    console.log('────────────────────────────────────────────────');
    console.log('Run this. It contains secrets — run it, do not paste it into chat:\n');
    console.log(`gcloud run services update startupvisaroads --region europe-west1 \\
  --update-env-vars "X_KEY_${suffix}=${appKey},X_KEYSECRET_${suffix}=${appSecret},X_TOKEN_${suffix}=${accessToken},X_SECRET_${suffix}=${accessSecret}"`);
    console.log('────────────────────────────────────────────────');
    console.log(`\nThe suffix was guessed from @${screenName}. If that is the wrong`);
    console.log('destination, change X_TOKEN_* and X_SECRET_* before running it.');
    console.log('\nThen run this again, logged in as the other account.');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`\n✗ the PIN was rejected: ${msg}`);
    console.error('If the authorise page said access was granted, the PIN is fine and the');
    console.error('problem is upstream — check the app has Read and Write permission.');
    process.exit(1);
  }
}

main();
