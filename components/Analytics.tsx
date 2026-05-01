const GA_ID = (process.env.NEXT_PUBLIC_GA_ID || "").trim();
const AW_ID = (process.env.NEXT_PUBLIC_AW_ID || "").trim();

export function Analytics() {
  const ids = [GA_ID, AW_ID].filter(Boolean);
  if (ids.length === 0) return null;

  // Inline stub: define dataLayer + gtag SYNC ngay khi parse HTML.
  // User tap trước khi gtag.js load → event vẫn push vào queue,
  // gtag.js flush queue khi load xong (transport_type:beacon đảm bảo bất kể navigation).
  const initCode = `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);};
window.gtag('js', new Date());
${ids.map((id) => `window.gtag('config', '${id}');`).join("\n")}
`.trim();

  // Defer gtag.js load qua first interaction OR 5000ms timeout safety net.
  // Tracking-safe: stub đã queue events SYNC, conversion fire khi gtag.js load.
  // transport_type:beacon trong reportCallConversion/reportZaloConversion
  // đảm bảo conversion request fire bất kể navigation tap-to-call.
  const loaderCode = `
(function(){
  var loaded = false;
  function loadGtag(){
    if (loaded) return; loaded = true;
    ${ids
      .map(
        (id) =>
          `(function(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${id}';document.head.appendChild(s);})();`,
      )
      .join("")}
  }
  var events = ['pointerdown','keydown','scroll','touchstart'];
  events.forEach(function(e){document.addEventListener(e,loadGtag,{once:true,passive:true});});
  setTimeout(loadGtag, 5000);
})();
`.trim();

  return (
    <>
      <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <script dangerouslySetInnerHTML={{ __html: initCode }} />
      <script dangerouslySetInnerHTML={{ __html: loaderCode }} />
    </>
  );
}
