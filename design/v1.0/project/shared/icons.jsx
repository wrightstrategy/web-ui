// Minimal icon set. Stroke-based, 24x24 viewBox, Lucide-style proportions.
// Render with size prop (number, default 16).

const Icon = ({ d, size = 16, fill, strokeWidth = 1.75, viewBox = '0 0 24 24', style }) => (
  <svg
    width={size}
    height={size}
    viewBox={viewBox}
    fill={fill || 'none'}
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    aria-hidden="true"
  >{d}</svg>
);

const IconGauge = (p) => <Icon {...p} d={<>
  <path d="M12 14l4-4" />
  <path d="M6.34 17.66A8 8 0 1 1 12 20" />
  <circle cx="12" cy="14" r="1" fill="currentColor" />
</>} />;

const IconBell = (p) => <Icon {...p} d={<>
  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
  <path d="M10 21a2 2 0 0 0 4 0" />
</>} />;

const IconActivity = (p) => <Icon {...p} d={<>
  <path d="M3 12h4l3-9 4 18 3-9h4" />
</>} />;

const IconJobs = (p) => <Icon {...p} d={<>
  <rect x="3" y="7" width="18" height="13" rx="2" />
  <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
</>} />;

const IconQueue = (p) => <Icon {...p} d={<>
  <rect x="3" y="4" width="18" height="4" rx="1" />
  <rect x="3" y="10" width="18" height="4" rx="1" />
  <rect x="3" y="16" width="18" height="4" rx="1" />
</>} />;

const IconCost = (p) => <Icon {...p} d={<>
  <path d="M12 2v20" />
  <path d="M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
</>} />;

const IconSettings = (p) => <Icon {...p} d={<>
  <circle cx="12" cy="12" r="3" />
  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9 1.65 1.65 0 0 0 4.27 7.18l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.36.16.66.43.86.77.2.34.3.74.28 1.14a2 2 0 0 1 .56 1.41 2 2 0 0 1-.56 1.41c.02.4-.08.8-.28 1.14-.2.34-.5.61-.86.77z" />
</>} />;

const IconFile = (p) => <Icon {...p} d={<>
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
  <path d="M14 2v6h6" />
</>} />;

const IconChat = (p) => <Icon {...p} d={<>
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
</>} />;

const IconBrain = (p) => <Icon {...p} d={<>
  <path d="M9.5 2a4 4 0 0 0-3.95 3.4A3.5 3.5 0 0 0 4 12a3.5 3.5 0 0 0 1.5 6.6 4 4 0 0 0 7 0A3.5 3.5 0 0 0 20 12a3.5 3.5 0 0 0-1.55-6.6A4 4 0 0 0 14.5 2 4 4 0 0 0 12 3 4 4 0 0 0 9.5 2z" />
</>} />;

const IconChevronRight = (p) => <Icon {...p} d={<>
  <path d="M9 6l6 6-6 6" />
</>} />;

const IconHome = (p) => <Icon {...p} d={<>
  <path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z" />
</>} />;

const IconSearch = (p) => <Icon {...p} d={<>
  <circle cx="11" cy="11" r="7" />
  <path d="M21 21l-4.3-4.3" />
</>} />;

const IconPlus = (p) => <Icon {...p} d={<>
  <path d="M12 5v14M5 12h14" />
</>} />;

const IconClock = (p) => <Icon {...p} d={<>
  <circle cx="12" cy="12" r="9" />
  <path d="M12 7v5l3 2" />
</>} />;

const IconCheck = (p) => <Icon {...p} d={<>
  <path d="M4 12l5 5L20 6" />
</>} />;

const IconAlert = (p) => <Icon {...p} d={<>
  <path d="M12 2L2 21h20z" />
  <path d="M12 9v5" />
  <circle cx="12" cy="17.5" r="0.6" fill="currentColor" />
</>} />;

const IconWifi = (p) => <Icon {...p} d={<>
  <path d="M2 9c5.5-5 14.5-5 20 0" />
  <path d="M5 12.5c3.7-3.3 10.3-3.3 14 0" />
  <path d="M8.5 16c2.1-1.7 4.9-1.7 7 0" />
  <circle cx="12" cy="19.5" r="0.8" fill="currentColor" />
</>} />;

const IconBattery = (p) => <Icon {...p} d={<>
  <rect x="2" y="8" width="16" height="8" rx="2" />
  <rect x="20" y="11" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" />
  <rect x="4" y="10" width="11" height="4" rx="0.5" fill="currentColor" stroke="none" />
</>} />;

// Lone star — varies in fill / stroke
const IconStar = ({ size = 14, fill = 'currentColor', stroke, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke || 'none'} strokeWidth="1.4" strokeLinejoin="round"
    style={style} aria-hidden="true">
    <path d="M12 2.5l2.6 6.6 7.1.4-5.5 4.6 1.8 6.9L12 17l-6 3 1.8-6.9L2.3 9.5l7.1-.4z" />
  </svg>
);
const IconStarLine = ({ size = 14, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
    style={style} aria-hidden="true">
    <path d="M12 2.5l2.6 6.6 7.1.4-5.5 4.6 1.8 6.9L12 17l-6 3 1.8-6.9L2.3 9.5l7.1-.4z" />
  </svg>
);

// Wright brand mark — variations per direction (created here so we can pull
// the same component into every screen of a direction).
const BrandFrontier = ({ size = 28, label = 'WRIGHT FAMILY', sub = 'SENTINEL' }) => (
  <div style={{display:'flex',alignItems:'center',gap:10}}>
    <div style={{
      width:size,height:size,borderRadius:6,
      background:'var(--accent)',color:'var(--accent-on)',
      display:'flex',alignItems:'center',justifyContent:'center',
      fontFamily:'var(--font-mono)',fontWeight:600,
      position:'relative'
    }}>
      <IconStar size={size*0.6} />
    </div>
    <div style={{lineHeight:1.05}}>
      <div style={{fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'0.16em',color:'var(--text-subtle)'}}>{label}</div>
      <div style={{fontWeight:600,fontSize:13,letterSpacing:'0.01em',color:'var(--text)'}}>{sub}</div>
    </div>
  </div>
);

const BrandLoneStar = ({ size = 28, label = 'WRIGHT FAMILY', sub = 'SENTINEL' }) => (
  <div style={{display:'flex',alignItems:'center',gap:10}}>
    <div style={{
      width:size,height:size,
      display:'flex',alignItems:'center',justifyContent:'center',
      color:'var(--accent)',
      position:'relative'
    }}>
      <IconStar size={size} />
    </div>
    <div style={{lineHeight:1.05}}>
      <div style={{fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'0.18em',color:'var(--text-subtle)'}}>{label}</div>
      <div style={{fontWeight:600,fontSize:14,letterSpacing:'-0.005em',color:'var(--text)'}}>{sub}</div>
    </div>
  </div>
);

const BrandCapitol = ({ size = 32, label = 'WRIGHT FAMILY', sub = 'SENTINEL' }) => (
  <div style={{display:'flex',alignItems:'center',gap:12}}>
    <div style={{
      width:size,height:size,
      border:'1.5px solid var(--accent)',
      borderRadius:4,
      display:'flex',alignItems:'center',justifyContent:'center',
      color:'var(--accent)',
      position:'relative',
      flexDirection:'column'
    }}>
      <IconStar size={size*0.52} style={{marginTop:1}} />
      <div style={{fontFamily:'var(--font-display)',fontSize:size*0.32,fontWeight:700,lineHeight:1,marginTop:-1,letterSpacing:'0.04em'}}>W</div>
    </div>
    <div style={{lineHeight:1.05}}>
      <div style={{fontFamily:'var(--font-mono)',fontSize:9.5,letterSpacing:'0.2em',color:'var(--text-subtle)'}}>{label}</div>
      <div style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:15,letterSpacing:'0.005em',color:'var(--text)'}}>{sub}</div>
    </div>
  </div>
);

// Sparkline-as-svg: just a static smooth path for visual interest.
const Sparkline = ({ width = 220, height = 36, color = 'currentColor', points = [12, 18, 14, 22, 16, 20, 28, 22, 30, 26, 34, 30, 32] }) => {
  const max = Math.max(...points), min = Math.min(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1);
  const d = points.map((p, i) => {
    const x = i * step;
    const y = height - 4 - ((p - min) / range) * (height - 8);
    return (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
  }).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{display:'block'}}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

// Make available to other Babel scripts.
Object.assign(window, {
  IconGauge, IconBell, IconActivity, IconJobs, IconQueue, IconCost,
  IconSettings, IconFile, IconChat, IconBrain, IconChevronRight,
  IconHome, IconSearch, IconPlus, IconClock, IconCheck, IconAlert,
  IconWifi, IconBattery, IconStar, IconStarLine,
  BrandFrontier, BrandLoneStar, BrandCapitol, Sparkline,
});
