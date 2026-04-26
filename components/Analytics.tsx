const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
const AW_ID = process.env.NEXT_PUBLIC_AW_ID || "";

export function Analytics() {
  const ids = [GA_ID, AW_ID].filter(Boolean);
  if (ids.length === 0) return null;

  const initCode = `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);};
window.gtag('js', new Date());
${ids.map((id) => `window.gtag('config', '${id}');`).join("\n")}
`.trim();

  return (
    <>
      {ids.map((id) => (
        <script
          key={id}
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        />
      ))}
      <script dangerouslySetInnerHTML={{ __html: initCode }} />
    </>
  );
}
