// Decorative homepage backdrop: a huge, slowly turning zodiac wheel, a
// twinkling starfield and a few faint tarot cards. Pure SVG + CSS, very low
// contrast so it never competes with the copy.

const SIGNS = [
  // Glyphs on a 24x24 grid, in zodiac order starting at Aries.
  "M12 21V9M12 9C12 3 5 3 5 8M12 9C12 3 19 3 19 8",
  "M12 20a5 5 0 1 0 0-10a5 5 0 0 0 0 10ZM6 4C6 10 18 10 18 4",
  "M5 4C9 6 15 6 19 4M5 20C9 18 15 18 19 20M9 5.5V18.5M15 5.5V18.5",
  "M9 10.5a2.5 2.5 0 1 0-5 0a2.5 2.5 0 0 0 5 0ZM20 9C17 4 8 4 6.5 8M20 14.5a2.5 2.5 0 1 0-5 0a2.5 2.5 0 0 0 5 0ZM4 15C7 20 16 20 17.5 16",
  "M11 14a3 3 0 1 0-6 0a3 3 0 0 0 6 0ZM11 14C11 6 19 4 19 10C19 15 15 18 16 20C16.5 21 18 21 19 20",
  "M4 6V18M4 8C4 4 10 4 10 8V18M10 8C10 4 16 4 16 8V16C16 19 18 20 20 19M14 14C20 12 21 18 15 20",
  "M4 19H20M4 15H9C7 8 17 8 15 15H20",
  "M4 6V18M4 8C4 4 10 4 10 8V18M10 8C10 4 16 4 16 8V18C16 20 19 20 20 17M20 17L18 15M20 17L22 15",
  "M5 19L19 5M12 5H19V12M7 11L13 17",
  "M4 6C6 6 8 8 8 12V16M8 12C8 5 14 5 14 11C14 16 12 20 16 20C20 20 20 14 16 14",
  "M3 9L7 5L11 9L15 5L19 9M3 17L7 13L11 17L15 13L19 17",
  "M6 4C11 8 11 16 6 20M18 4C13 8 13 16 18 20M5 12H19",
];

const GOLD = "#f0c050";
const ORCHID = "#c084fc";

// Deterministic so server and client render identical markup.
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const STARS = Array.from({ length: 70 }, (_, i) => ({
  x: rand(i + 1) * 100,
  y: rand(i + 101) * 100,
  s: 1 + rand(i + 201) * 1.8,
  d: 4 + rand(i + 301) * 6,
  delay: -rand(i + 401) * 8,
  hi: 0.35 + rand(i + 501) * 0.45,
  warm: rand(i + 601) > 0.7,
}));

function Wheel() {
  const ticks = Array.from({ length: 72 }, (_, i) => i);
  return (
    <svg
      viewBox="-500 -500 1000 1000"
      className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2"
      style={{ width: "min(135vmin, 1300px)", height: "min(135vmin, 1300px)" }}
      fill="none"
      stroke={ORCHID}
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g className="hb-wheel" opacity={0.22}>
        <circle r={490} />
        <circle r={486} strokeDasharray="1 7" opacity={0.7} />
        <circle r={400} />
        <circle r={330} />
        {/* 12 sign divisions */}
        {SIGNS.map((_, i) => (
          <line key={i} x1={0} y1={-330} x2={0} y2={-400} transform={`rotate(${i * 30})`} />
        ))}
        {/* degree ticks between the outer rings */}
        {ticks.map((i) => (
          <line
            key={i}
            x1={0}
            y1={-490}
            x2={0}
            y2={i % 6 === 0 ? -470 : -480}
            transform={`rotate(${i * 5})`}
            opacity={i % 6 === 0 ? 1 : 0.6}
          />
        ))}
        {/* sign glyphs, centred in each 30° sector */}
        {SIGNS.map((d, i) => (
          <g key={i} transform={`rotate(${i * 30 + 15}) translate(0 -368)`}>
            <g transform="translate(-24 -24) scale(2)" stroke={i % 3 === 0 ? GOLD : ORCHID} strokeWidth={1.2}>
              <path d={d} />
            </g>
          </g>
        ))}
      </g>
      <g className="hb-wheel-inner" opacity={0.13}>
        <circle r={250} strokeDasharray="2 10" />
        <circle r={170} />
        <path d="M0 -170L147 85L-147 85Z" />
        <path d="M0 170L147 -85L-147 -85Z" />
        <circle r={6} fill={GOLD} stroke="none" />
      </g>
    </svg>
  );
}

function Card({ className, rot, d, children }: { className: string; rot: number; d: number; children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 60 100"
      className={`hb-card absolute ${className}`}
      style={{ "--r": `${rot}deg`, "--d": `${d}s`, opacity: 0.17 } as React.CSSProperties}
      fill="none"
      stroke={GOLD}
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="56" height="96" rx="5" />
      <rect x="6.5" y="6.5" width="47" height="87" rx="3" opacity={0.6} />
      {/* corner stars */}
      <path d="M12 12v4M10 14h4M48 12v4M46 14h4M12 84v4M10 86h4M48 84v4M46 86h4" opacity={0.7} />
      {children}
    </svg>
  );
}

export default function HomeBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <Wheel />

      {STARS.map((s, i) => (
        <span
          key={i}
          className="hb-star absolute rounded-full"
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.s,
              height: s.s,
              background: s.warm ? GOLD : "#ede4d8",
              "--hi": s.hi,
              "--lo": 0.1,
              "--d": `${s.d}s`,
              animationDelay: `${s.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}

      <Card className="left-[3%] top-[18%] w-16 sm:w-24" rot={-11} d={32}>
        <path d="M30 32L34 44L47 44L37 52L41 65L30 57L19 65L23 52L13 44L26 44Z" />
      </Card>
      <Card className="right-[4%] top-[12%] w-14 sm:w-20" rot={9} d={36}>
        <path d="M36 32A17 17 0 1 0 42 62A13 13 0 0 1 36 32Z" />
        <path d="M16 76H44M22 82H38" />
      </Card>
      <Card className="right-[6%] top-[58%] hidden w-24 md:block" rot={-7} d={38}>
        <circle cx="30" cy="48" r="9" />
        <path d="M30 31V35M30 61V65M13 48H17M43 48H47M18 36L21 39M39 57L42 60M42 36L39 39M21 57L18 60" />
      </Card>
      <Card className="left-[7%] top-[66%] hidden w-20 md:block" rot={13} d={34}>
        <path d="M30 34L44 62H16Z" />
        <circle cx="30" cy="52" r="3" />
      </Card>
    </div>
  );
}
