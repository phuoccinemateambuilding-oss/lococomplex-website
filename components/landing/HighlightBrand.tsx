import { Fragment, type ReactNode } from "react";

const BRAND_REGEX = /(LOCO)/g;

export function HighlightBrand({ text }: { text: string }): ReactNode {
  const parts = text.split(BRAND_REGEX);
  return (
    <>
      {parts.map((p, i) => {
        if (!p) return null;
        const isBrand = p === "LOCO";
        return isBrand ? (
          <span key={i} className="brand-inline inline-block whitespace-nowrap text-loco-red">
            {p}
          </span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        );
      })}
    </>
  );
}
