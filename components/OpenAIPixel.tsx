import Script from 'next/script';

// OpenAI Ads (ChatGPT ads) pixel loader — OpenAI's snippet, verbatim apart
// from the pixel id coming from env. Renders nothing when the id is unset.
export default function OpenAIPixel() {
  const pixelId = process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID;
  if (!pixelId) return null;

  return (
    <Script id="openai-pixel" strategy="afterInteractive">
      {`(function (w, d, s, u) {
  if (w.oaiq) return;
  var q = function () { q.q.push(arguments); };
  q.q = []; w.oaiq = q;
  var js = d.createElement(s); js.async = true; js.src = u;
  var f = d.getElementsByTagName(s)[0]; f.parentNode.insertBefore(js, f);
})(window, document, "script", "https://bzrcdn.openai.com/sdk/oaiq.min.js");
oaiq("init", { pixelId: ${JSON.stringify(pixelId)} });`}
    </Script>
  );
}
