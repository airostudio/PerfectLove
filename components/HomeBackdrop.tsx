// Decorative, non-interactive backdrop for the landing page: outline-only
// zodiac glyphs, tarot cards, figures and stars, drifting slowly at very low
// opacity so they sit behind the copy instead of competing with it.

type Kind =
  | "female" | "male" | "card-star" | "card-moon" | "card-sun" | "moon" | "sparkle"
  | "aries" | "taurus" | "gemini" | "cancer" | "leo" | "virgo"
  | "libra" | "scorpio" | "sagittarius" | "capricorn" | "aquarius" | "pisces";

interface Item {
  k: Kind;
  l?: number; // left %
  r?: number; // right %
  t: number; // top %
  s: number; // size px
  rot?: number;
  o?: number; // opacity
  dur?: number;
  delay?: number;
  c?: "orchid" | "gold" | "rose" | "bone";
  hideOnMobile?: boolean;
}

const ITEMS: Item[] = [
  // figures — larger, pushed toward the edges
  { k: "female", l: 1, t: 12, s: 210, rot: -4, o: 0.1, dur: 36, c: "orchid" },
  { k: "male", r: 2, t: 26, s: 200, rot: 3, o: 0.1, dur: 40, delay: -8, c: "rose" },
  { k: "female", r: 9, t: 70, s: 170, rot: 5, o: 0.09, dur: 44, delay: -15, c: "gold", hideOnMobile: true },
  { k: "male", l: 7, t: 68, s: 170, rot: -3, o: 0.09, dur: 38, delay: -5, c: "orchid", hideOnMobile: true },

  // tarot cards
  { k: "card-star", l: 14, t: 40, s: 84, rot: -12, o: 0.12, dur: 30, c: "gold" },
  { k: "card-moon", r: 15, t: 6, s: 78, rot: 9, o: 0.12, dur: 33, delay: -9, c: "orchid" },
  { k: "card-sun", r: 6, t: 52, s: 90, rot: -7, o: 0.11, dur: 35, delay: -18, c: "gold", hideOnMobile: true },
  { k: "card-moon", l: 3, t: 88, s: 74, rot: 14, o: 0.1, dur: 31, delay: -12, c: "rose", hideOnMobile: true },

  // zodiac glyphs
  { k: "aries", l: 24, t: 8, s: 44, o: 0.14, dur: 26, c: "gold" },
  { k: "taurus", l: 44, t: 4, s: 40, o: 0.12, dur: 29, delay: -4, c: "orchid" },
  { k: "gemini", r: 32, t: 14, s: 42, o: 0.13, dur: 27, delay: -10, c: "bone" },
  { k: "cancer", l: 6, t: 33, s: 46, o: 0.13, dur: 32, delay: -6, c: "rose" },
  { k: "leo", r: 4, t: 8, s: 48, o: 0.14, dur: 28, delay: -14, c: "gold" },
  { k: "virgo", l: 30, t: 58, s: 44, o: 0.12, dur: 30, delay: -2, c: "orchid", hideOnMobile: true },
  { k: "libra", r: 24, t: 44, s: 46, o: 0.12, dur: 34, delay: -11, c: "bone", hideOnMobile: true },
  { k: "scorpio", l: 52, t: 82, s: 44, o: 0.13, dur: 29, delay: -7, c: "rose" },
  { k: "sagittarius", r: 38, t: 76, s: 46, o: 0.13, dur: 31, delay: -16, c: "gold" },
  { k: "capricorn", l: 18, t: 22, s: 42, o: 0.12, dur: 33, delay: -3, c: "orchid", hideOnMobile: true },
  { k: "aquarius", r: 20, t: 88, s: 48, o: 0.12, dur: 28, delay: -13, c: "bone", hideOnMobile: true },
  { k: "pisces", l: 40, t: 94, s: 44, o: 0.12, dur: 30, delay: -9, c: "orchid" },

  // moons + sparkles
  { k: "moon", l: 36, t: 20, s: 54, rot: -20, o: 0.13, dur: 40, c: "gold" },
  { k: "moon", r: 44, t: 62, s: 44, rot: 25, o: 0.11, dur: 37, delay: -20, c: "bone", hideOnMobile: true },
  { k: "sparkle", l: 20, t: 14, s: 22, delay: -1, dur: 5, c: "gold" },
  { k: "sparkle", l: 58, t: 30, s: 16, delay: -3, dur: 6, c: "bone" },
  { k: "sparkle", r: 10, t: 40, s: 24, delay: -2, dur: 7, c: "orchid" },
  { k: "sparkle", l: 12, t: 56, s: 18, delay: -4, dur: 5.5, c: "rose" },
  { k: "sparkle", r: 28, t: 28, s: 14, delay: -5, dur: 6.5, c: "gold" },
  { k: "sparkle", l: 46, t: 70, s: 20, delay: -2.5, dur: 7.5, c: "bone" },
  { k: "sparkle", r: 5, t: 90, s: 16, delay: -6, dur: 5, c: "orchid" },
  { k: "sparkle", l: 66, t: 8, s: 18, delay: -1.5, dur: 6, c: "rose" },
];

const COLOR: Record<NonNullable<Item["c"]>, string> = {
  orchid: "#c084fc",
  gold: "#f0c050",
  rose: "#e8a0b4",
  bone: "#ede4d8",
};

function Symbols() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        {/* zodiac — simple single-weight line glyphs on a 24x24 grid */}
        <symbol id="bd-aries" viewBox="0 0 24 24"><path d="M12 21V9M12 9C12 3 5 3 5 8M12 9C12 3 19 3 19 8" /></symbol>
        <symbol id="bd-taurus" viewBox="0 0 24 24"><circle cx="12" cy="15" r="5" /><path d="M6 4C6 10 18 10 18 4" /></symbol>
        <symbol id="bd-gemini" viewBox="0 0 24 24"><path d="M5 4C9 6 15 6 19 4M5 20C9 18 15 18 19 20M9 5.5V18.5M15 5.5V18.5" /></symbol>
        <symbol id="bd-cancer" viewBox="0 0 24 24"><circle cx="6.5" cy="10.5" r="2.5" /><path d="M20 9C17 4 8 4 6.5 8" /><circle cx="17.5" cy="14.5" r="2.5" /><path d="M4 15C7 20 16 20 17.5 16" /></symbol>
        <symbol id="bd-leo" viewBox="0 0 24 24"><circle cx="8" cy="14" r="3" /><path d="M11 14C11 6 19 4 19 10C19 15 15 18 16 20C16.5 21 18 21 19 20" /></symbol>
        <symbol id="bd-virgo" viewBox="0 0 24 24"><path d="M4 6V18M4 8C4 4 10 4 10 8V18M10 8C10 4 16 4 16 8V16C16 19 18 20 20 19M14 14C20 12 21 18 15 20" /></symbol>
        <symbol id="bd-libra" viewBox="0 0 24 24"><path d="M4 19H20M4 15H9C7 8 17 8 15 15H20" /></symbol>
        <symbol id="bd-scorpio" viewBox="0 0 24 24"><path d="M4 6V18M4 8C4 4 10 4 10 8V18M10 8C10 4 16 4 16 8V18C16 20 19 20 20 17M20 17L18 15M20 17L22 15" /></symbol>
        <symbol id="bd-sagittarius" viewBox="0 0 24 24"><path d="M5 19L19 5M12 5H19V12M7 11L13 17" /></symbol>
        <symbol id="bd-capricorn" viewBox="0 0 24 24"><path d="M4 6C6 6 8 8 8 12V16M8 12C8 5 14 5 14 11C14 16 12 20 16 20C20 20 20 14 16 14" /></symbol>
        <symbol id="bd-aquarius" viewBox="0 0 24 24"><path d="M3 9L7 5L11 9L15 5L19 9M3 17L7 13L11 17L15 13L19 17" /></symbol>
        <symbol id="bd-pisces" viewBox="0 0 24 24"><path d="M6 4C11 8 11 16 6 20M18 4C13 8 13 16 18 20M5 12H19" /></symbol>

        <symbol id="bd-moon" viewBox="0 0 24 24"><path d="M16 3A9 9 0 1 0 21 15A7 7 0 0 1 16 3Z" /></symbol>
        <symbol id="bd-sparkle" viewBox="0 0 24 24"><path d="M12 2C12 8 16 12 22 12C16 12 12 16 12 22C12 16 8 12 2 12C8 12 12 8 12 2Z" /></symbol>

        {/* tarot cards: outer card, inner frame, central motif */}
        <symbol id="bd-card-star" viewBox="0 0 60 100">
          <rect x="2" y="2" width="56" height="96" rx="5" /><rect x="7" y="7" width="46" height="86" rx="3" />
          <path d="M30 30L34 42L47 42L37 50L41 63L30 55L19 63L23 50L13 42L26 42Z" />
        </symbol>
        <symbol id="bd-card-moon" viewBox="0 0 60 100">
          <rect x="2" y="2" width="56" height="96" rx="5" /><rect x="7" y="7" width="46" height="86" rx="3" />
          <path d="M36 32A17 17 0 1 0 42 62A13 13 0 0 1 36 32Z" /><path d="M16 76H44M22 82H38" />
        </symbol>
        <symbol id="bd-card-sun" viewBox="0 0 60 100">
          <rect x="2" y="2" width="56" height="96" rx="5" /><rect x="7" y="7" width="46" height="86" rx="3" />
          <circle cx="30" cy="48" r="9" />
          <path d="M30 31V35M30 61V65M13 48H17M43 48H47M18 36L21 39M39 57L42 60M42 36L39 39M21 57L18 60" />
        </symbol>

        {/* figures: outline-only busts */}
        <symbol id="bd-female" viewBox="0 0 100 120">
          <ellipse cx="50" cy="40" rx="14" ry="18" />
          <path d="M36 38C30 20 46 12 56 16C70 20 72 40 68 62C66 74 72 84 76 92M36 40C30 56 30 74 24 92" />
          <path d="M44 57V68M56 57V68M44 68C34 72 22 78 16 100M56 68C66 72 78 78 84 100" />
          <path d="M44 44C46 46 48 46 50 44M52 44C54 46 56 46 58 44M46 54C49 56 51 56 54 54" />
        </symbol>
        <symbol id="bd-male" viewBox="0 0 100 120">
          <ellipse cx="50" cy="40" rx="15" ry="19" />
          <path d="M35 36C34 20 50 14 62 20C68 24 66 34 65 38" />
          <path d="M36 44C38 56 44 58 50 58C56 58 62 56 64 44" />
          <path d="M43 58V70M57 58V70M43 70C30 72 16 76 10 100M57 70C70 72 84 76 90 100" />
          <path d="M43 40C45 42 47 42 49 40M52 40C54 42 56 42 58 40" />
        </symbol>
      </defs>
    </svg>
  );
}

function symbolId(k: Kind): string {
  return `bd-${k}`;
}

function dims(item: Item): { w: number; h: number } {
  if (item.k.startsWith("card-")) return { w: item.s, h: Math.round(item.s * (100 / 60)) };
  if (item.k === "female" || item.k === "male") return { w: item.s, h: Math.round(item.s * 1.2) };
  return { w: item.s, h: item.s };
}

export default function HomeBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="home-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <Symbols />
      {ITEMS.map((item, i) => {
        const { w, h } = dims(item);
        const isSparkle = item.k === "sparkle";
        const color = COLOR[item.c ?? "orchid"];
        return (
          <svg
            key={i}
            width={w}
            height={h}
            className={`absolute ${isSparkle ? "bd-twinkle" : "bd-drift"} ${item.hideOnMobile ? "hidden md:block" : ""} ${item.k === "female" || item.k === "male" ? "bd-fig" : ""}`}
            style={
              {
                left: item.l !== undefined ? `${item.l}%` : undefined,
                right: item.r !== undefined ? `${item.r}%` : undefined,
                top: `${item.t}%`,
                color,
                opacity: isSparkle ? undefined : item.o ?? 0.1,
                "--r": `${item.rot ?? 0}deg`,
                "--dx": `${(i % 2 === 0 ? 1 : -1) * 8}px`,
                animationDuration: `${item.dur ?? 30}s`,
                animationDelay: `${item.delay ?? 0}s`,
              } as React.CSSProperties
            }
            fill="none"
            stroke="currentColor"
            strokeWidth={isSparkle ? 1.2 : 1}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <use href={`#${symbolId(item.k)}`} width="100%" height="100%" />
          </svg>
        );
      })}
    </div>
  );
}
