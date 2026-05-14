// W + Star mark explorations for Wright Family UI.
// All marks use currentColor so they pick up the brick or bone color from
// their container. They're drawn in 100×100 (or similar) viewBoxes and
// scale via the width/height props.

function _starPath(cx, cy, R, r) {
  r = r != null ? r : R * 0.42;
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? R : r;
    pts.push((cx + rad * Math.cos(ang)).toFixed(2) + ',' + (cy + rad * Math.sin(ang)).toFixed(2));
  }
  return 'M' + pts.join(' L') + ' Z';
}

// ============================================================
// A · APEX STAR  —  W with the middle peak replaced by a star.
// The two outer V's lean inward, and the star sits exactly where
// the W's inner peak would be. Star is structurally part of the
// letterform, not a sidekick.
// ============================================================
const MarkApex = ({ size = 64 }) => {
  const sw = 10;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none"
         stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {/* outer-left and outer-right strokes of the W, each ends at the star perimeter */}
      <path d="M 9 22 L 27 78 L 41 50" />
      <path d="M 59 50 L 73 78 L 91 22" />
      {/* the star sits on the inner-peak coordinate (~50,38) */}
      <path d={_starPath(50, 41, 16)} fill="currentColor" stroke="none" />
    </svg>
  );
};

// ============================================================
// B · PIERCED STAR  —  Solid star, bold W knocked out of the body
// as negative space. One unified glyph; reads as either a "starred
// W" or a "W-shaped star".
// ============================================================
const MarkPierced = ({ size = 64 }) => {
  const uid = React.useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <mask id={'m-' + uid}>
          <rect width="100" height="100" fill="white" />
          <text
            x="50" y="68"
            textAnchor="middle"
            fontFamily="'IBM Plex Sans Condensed','IBM Plex Sans',system-ui,sans-serif"
            fontWeight="700"
            fontSize="56"
            fill="black"
            letterSpacing="-2"
          >W</text>
        </mask>
      </defs>
      <path d={_starPath(50, 52, 48)} fill="currentColor" mask={'url(#m-' + uid + ')'} />
    </svg>
  );
};

// ============================================================
// C · CONSTELLATION  —  Five points in W formation, central peak
// is a star, hairlines connect the points like a star chart.
// ============================================================
const MarkConstellation = ({ size = 64 }) => {
  const pts = [[14, 22], [33, 80], [50, 36], [67, 80], [86, 22]];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* connecting hairlines */}
      <path
        d={pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ' ' + p[1]).join(' ')}
        fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"
        opacity="0.45"
      />
      {/* the dots */}
      {pts.map((p, i) => i === 2 ? null : (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === 0 || i === 4 ? 6 : 7} fill="currentColor" />
      ))}
      {/* central star */}
      <path d={_starPath(50, 36, 13)} fill="currentColor" />
    </svg>
  );
};

// ============================================================
// D · STENCIL BAR  —  Vertical architectural plate. Bold stenciled
// W up top, a hairline rule, a star below. Cornerstone / cap-badge
// energy. Reads as a small monument.
// ============================================================
const MarkStencilBar = ({ size = 64 }) => {
  const uid = React.useId().replace(/:/g, '');
  return (
    <svg width={size * (62 / 100)} height={size} viewBox="0 0 62 100">
      <defs>
        <mask id={'sb-' + uid}>
          <rect width="62" height="100" fill="white" />
          {/* stencil-W cutout: a W with two thin vertical "stencil bridges" */}
          <text
            x="31" y="48" textAnchor="middle"
            fontFamily="'IBM Plex Sans Condensed','IBM Plex Sans',system-ui,sans-serif"
            fontWeight="700" fontSize="40" fill="black" letterSpacing="-1.5"
          >W</text>
          {/* horizontal hairline divider — knocked through */}
          <rect x="14" y="58" width="34" height="1.6" fill="black" />
          {/* star cutout */}
          <g transform="translate(0,18)">
            <path d={_starPath(31, 60, 12)} fill="black" />
          </g>
        </mask>
      </defs>
      <rect x="2" y="2" width="58" height="96" rx="6" fill="currentColor" mask={'url(#sb-' + uid + ')'} />
    </svg>
  );
};

// ============================================================
// E · SLASH STAR  —  W where the upper-right arm continues outward
// as one ray of a 5-point star, so the W and the star are a single
// continuous form. Most "active" / kinetic of the set.
// ============================================================
const MarkSlash = ({ size = 64 }) => {
  const sw = 9;
  return (
    <svg width={size * (110 / 100)} height={size} viewBox="0 0 110 100" fill="none"
         stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {/* full W zigzag, but the right-most stroke stops at (78, 22), where the star takes over */}
      <path d="M 6 28 L 24 82 L 42 38 L 60 82 L 78 28" />
      {/* the star is anchored so its lower-left ray meets the W's upper-right point at (78, 28) */}
      <g>
        <path d={_starPath(88, 18, 16)} fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
};

// ============================================================
// F · FRAME PLATE  —  Horizontal plate: W on the left, vertical
// hairline, star on the right. License-plate / cattle-brand vibe.
// Works as a logotype-style mark; pairs with a wordmark below.
// ============================================================
const MarkFramePlate = ({ size = 64 }) => {
  const w = size * (150 / 100);
  return (
    <svg width={w} height={size} viewBox="0 0 150 80" fill="none"
         stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
      <rect x="2" y="2" width="146" height="76" rx="4" stroke="currentColor" />
      {/* divider */}
      <line x1="75" y1="14" x2="75" y2="66" strokeWidth="1.6" stroke="currentColor" opacity="0.55" />
      {/* W on left */}
      <text
        x="38" y="56" textAnchor="middle"
        fontFamily="'IBM Plex Sans Condensed','IBM Plex Sans',system-ui,sans-serif"
        fontWeight="700" fontSize="46" fill="currentColor" stroke="none" letterSpacing="-1"
      >W</text>
      {/* star on right */}
      <path d={_starPath(112, 41, 22)} fill="currentColor" stroke="none" />
    </svg>
  );
};

// ============================================================
// Showcase scaffold — one card per mark.
// ============================================================
const MARKS = [
  {
    id: 'apex',
    name: 'Apex',
    tagline: 'W + star, structurally fused.',
    note: 'The two outer V-strokes of the W lean inward, and a small 5-point star occupies the inner peak — exactly where the letterform would otherwise have a vertex. Reads at small sizes as "a W with a glint"; at large sizes the star is unmistakable.',
    Component: MarkApex,
    feel: 'subtle · integrated',
  },
  {
    id: 'pierced',
    name: 'Pierced',
    tagline: 'A star, with a W cut out of it.',
    note: 'The dominant shape is a single Texas star; the W appears as negative space carved out of the body. The most graphic of the set — best as favicon, app icon, and loading mark. Inverts cleanly between brick and bone.',
    Component: MarkPierced,
    feel: 'graphic · iconic',
  },
  {
    id: 'constellation',
    name: 'Constellation',
    tagline: 'A star chart spelling W.',
    note: 'Five points trace a W zigzag with hairline rules connecting them, like a constellation map. The central peak becomes a small star. Most abstract — leans on the W shape being recognisable from its silhouette alone.',
    Component: MarkConstellation,
    feel: 'abstract · cartographic',
  },
  {
    id: 'stencilbar',
    name: 'Stencil bar',
    tagline: 'Cornerstone plate. W over star.',
    note: 'A small vertical monument: stenciled W up top, hairline rule, star below. Reads like an architectural date stone or rifle-cabinet badge. Wider footprint than the others — best at 32px+, not as a tiny favicon.',
    Component: MarkStencilBar,
    feel: 'architectural · ceremonial',
  },
  {
    id: 'slash',
    name: 'Slash',
    tagline: 'W and star, one continuous stroke.',
    note: 'The W zigzags across the frame and on its upper-right peak the stroke continues outward into one of the points of a 5-point star — they\u2019re literally one form. Has motion built into it.',
    Component: MarkSlash,
    feel: 'kinetic · custom',
  },
  {
    id: 'frame',
    name: 'Frame plate',
    tagline: 'W · ★ — a wordmark in two glyphs.',
    note: 'A horizontal plate with the W on the left, a hairline divider, and a star on the right. Functions as a logotype on its own, or pairs naturally with a typed wordmark below it. Cattle-brand / vintage license-plate energy.',
    Component: MarkFramePlate,
    feel: 'logotype · vintage',
  },
];

// Card shown per mark: hero glyph, scale strip, in-context sidebar.
const MarkCard = ({ mark }) => {
  const M = mark.Component;
  return (
    <div className="wf-root theme-frontier" style={{padding:'28px 28px 24px',display:'flex',flexDirection:'column',gap:18,height:'100%'}}>
      {/* Header */}
      <div>
        <div className="upper mono" style={{color:'var(--text-subtle)'}}>OPTION · {mark.id.toUpperCase()}</div>
        <div style={{fontSize:24,fontWeight:600,letterSpacing:'-0.01em',marginTop:2}}>{mark.name}</div>
        <div style={{fontSize:13,color:'var(--text-muted)',marginTop:4}}>{mark.tagline}</div>
      </div>

      {/* Hero — brick on bone + bone on brick */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <div style={{
          aspectRatio:'1/1',
          background:'#f2ece0',
          borderRadius:'var(--radius-md)',
          border:'1px solid var(--border)',
          display:'flex',alignItems:'center',justifyContent:'center',
          color:'#c24b3a',
        }}>
          <M size={108} />
        </div>
        <div style={{
          aspectRatio:'1/1',
          background:'#c24b3a',
          borderRadius:'var(--radius-md)',
          display:'flex',alignItems:'center',justifyContent:'center',
          color:'#f2ece0',
        }}>
          <M size={108} />
        </div>
      </div>

      {/* Size scale */}
      <div>
        <div className="upper mono" style={{color:'var(--text-subtle)',marginBottom:8}}>SCALE</div>
        <div style={{
          display:'flex',alignItems:'flex-end',gap:18,
          padding:'18px 16px',
          background:'var(--surface-raised)',
          border:'1px solid var(--border)',
          borderRadius:'var(--radius-md)',
          color:'var(--accent)',
        }}>
          {[16, 24, 32, 48, 64].map(s => (
            <div key={s} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
              <M size={s} />
              <span className="mono" style={{fontSize:10,color:'var(--text-subtle)'}}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* In-context sidebar header */}
      <div>
        <div className="upper mono" style={{color:'var(--text-subtle)',marginBottom:8}}>IN PLACE</div>
        <div style={{
          display:'flex',alignItems:'center',gap:10,
          padding:'14px 16px',
          background:'var(--bg)',
          borderRadius:'var(--radius-md)',
          border:'1px solid var(--border)',
        }}>
          <span style={{color:'var(--accent)',display:'flex',alignItems:'center'}}>
            <M size={mark.id === 'frame' ? 36 : 30} />
          </span>
          <div style={{lineHeight:1.05}}>
            <div className="mono" style={{fontSize:10,letterSpacing:'0.18em',color:'var(--text-subtle)'}}>WRIGHT FAMILY</div>
            <div style={{fontWeight:600,fontSize:14,letterSpacing:'-0.005em'}}>Sentinel</div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div style={{marginTop:'auto'}}>
        <div className="upper mono" style={{color:'var(--text-subtle)',marginBottom:6}}>{mark.feel.toUpperCase()}</div>
        <p style={{fontSize:12.5,color:'var(--text-muted)',lineHeight:1.5,margin:0}}>{mark.note}</p>
      </div>
    </div>
  );
};

Object.assign(window, {
  MarkApex, MarkPierced, MarkConstellation, MarkStencilBar, MarkSlash, MarkFramePlate,
  MARKS, MarkCard,
});
