import { useState } from "react";

const tints = ["from-brand-100 to-brand-200", "from-amber-100 to-amber-200", "from-sky-100 to-sky-200", "from-rose-100 to-rose-200"];

/**
 * The product photo over a coloured placeholder with initials. The placeholder shows while the
 * photo loads, and stays if there's no photo or it fails to load, so nothing ever looks broken.
 */
export function ProductImage({ src, name, className = "" }: { src?: string; name: string; className?: string }) {
  const [failed, setFailed] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<string | null>(null);
  const initials = name.split(/\s+/).filter(w => /[a-z0-9]/i.test(w)).slice(0, 2).map(w => w[0]!.toUpperCase()).join("");
  const tint = tints[[...name].reduce((n, c) => n + c.charCodeAt(0), 0) % tints.length];
  const showImg = !!src && failed !== src;
  return (
    <div className={`relative h-full w-full overflow-hidden bg-gradient-to-br ${tint}`} style={{ containerType: "size" }}>
      {loaded !== src && (
        <div role={showImg ? undefined : "img"} aria-label={showImg ? undefined : name} className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold tracking-tight text-ink/35" style={{ fontSize: "clamp(0.7rem, 22cqmin, 2.5rem)" }}>{initials}</span>
        </div>
      )}
      {showImg && (
        <img src={src} alt={name} loading="lazy" decoding="async"
          onLoad={() => setLoaded(src)} onError={() => setFailed(src)}
          className={`relative h-full w-full object-cover transition-opacity duration-300 ${loaded === src ? "opacity-100" : "opacity-0"} ${className}`} />
      )}
    </div>
  );
}
