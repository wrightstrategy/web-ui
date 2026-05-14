// Wright UI System · Batch C polish
// App-letter marks · Chart tokens · Mobile-first proof
// Iconography spec · Motion · Print stylesheet

// ============================================================
// Shared local helper (star path) — same shape as in marks.jsx
// ============================================================
function _starPath2(cx, cy, R, r) {
  r = r != null ? r : R * 0.42;
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? R : r;
    pts.push((cx + rad * Math.cos(ang)).toFixed(2) + ',' + (cy + rad * Math.sin(ang)).toFixed(2));
  }
  return 'M' + pts.join(' L') + ' Z';
}

// Same vocabulary as MarkStencilBar but parametric on the letter.
const MarkLetter = ({ letter = 'W', size = 64 }) => {
  const uid = React.useId().replace(/:/g, '');
  return (
    <svg width={size * (62 / 100)} height={size} viewBox="0 0 62 100" aria-hidden="true">
      <defs>
        <mask id={'ml-' + uid}>
          <rect width="62" height="100" fill="white" />
          <text
            x="31" y="48" textAnchor="middle"
            fontFamily="'IBM Plex Sans Condensed','IBM Plex Sans',system-ui,sans-serif"
            fontWeight="700" fontSize="40" fill="black" letterSpacing="-1.5"
          >{letter}</text>
          <rect x="14" y="58" width="34" height="1.6" fill="black" />
          <g transform="translate(0,18)">
            <path d={_starPath2(31, 60, 12)} fill="black" />
          </g>
        </mask>
      </defs>
      <rect x="2" y="2" width="58" height="96" rx="6" fill="currentColor" mask={'url(#ml-' + uid + ')'} />
    </svg>
  );
};

// ============================================================
// 1) APP-LETTER MARKS ATLAS
// ============================================================
const APP_MARKS = [
  { letter: 'W', app: 'Wright Family', tag: 'parent · brand', note: 'Used in the homepage / SSO surface when it lands. Reserved for top-level brand.' },
  { letter: 'S', app: 'Sentinel',      tag: 'monitoring',    note: 'Homelab incidents, jobs, costs. Brick on dark in every product surface.' },
  { letter: 'P', app: 'Paperless',     tag: 'documents',     note: 'Document ingest, classification, routing.' },
  { letter: 'H', app: 'Higgins',       tag: 'trust console', note: 'Trust agent + assistant. Reuses the Stencil bar slot the same way.' },
  { letter: 'R', app: 'Scan-router',   tag: 'mobile triage', note: 'Phone-first; the mark works at 12px in a tab bar.' },
];

const AppMarksAtlas = () => (
  <div className="wf-spec wf-root theme-frontier" style={{overflow:'auto'}}>
    <div>
      <div className="upper mono" style={{color:'var(--text-subtle)'}}>BRAND · 07a</div>
      <div className="wf-spec-title" style={{marginTop:4}}>App-letter marks</div>
      <div className="wf-spec-blurb" style={{marginTop:6}}>
        Each app gets the same Stencil-bar plate, swapping just the letter. The shared chassis is
        what makes the family read as one system; the letter is what makes each app addressable.
        Letterforms are <span className="mono">IBM Plex Sans Condensed 700</span>, hairline
        divider, five-point star — identical proportions across all apps.
      </div>
    </div>

    {/* Atlas row */}
    <div style={{display:'grid',gridTemplateColumns:'repeat(5, 1fr)',gap:14}}>
      {APP_MARKS.map((m, i) => (
        <div key={m.letter} style={{
          padding:'20px 16px 18px',
          background:'var(--surface-raised)',
          border:'1px solid var(--border)',
          borderRadius:'var(--radius-md)',
          display:'flex',flexDirection:'column',alignItems:'center',gap:10,
        }}>
          <div style={{
            background:'#f2ece0',
            borderRadius:'var(--radius-md)',
            border:'1px solid var(--border)',
            width:'100%',aspectRatio:'1/1',
            display:'flex',alignItems:'center',justifyContent:'center',
            color:'#c24b3a',
          }}>
            <MarkLetter letter={m.letter} size={92} />
          </div>
          <div style={{display:'flex',gap:6,alignItems:'baseline',marginTop:4}}>
            <span style={{fontSize:15,fontWeight:600,color:'var(--text)'}}>{m.app}</span>
          </div>
          <div className="mono" style={{fontSize:10,letterSpacing:'0.14em',color:'var(--accent)',textTransform:'uppercase'}}>{m.tag}</div>
          <div style={{fontSize:11.5,color:'var(--text-muted)',textAlign:'center',lineHeight:1.45}}>{m.note}</div>
        </div>
      ))}
    </div>

    {/* In context · sidebar slices */}
    <div>
      <h3>In place · sidebar lockups</h3>
      <div style={{display:'grid',gridTemplateColumns:'repeat(5, 1fr)',gap:10}}>
        {APP_MARKS.map((m,i) => (
          <div key={i} style={{
            padding:'14px 16px',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',
            display:'flex',alignItems:'center',gap:10,
          }}>
            <span style={{color:'var(--accent)',display:'flex'}}><MarkLetter letter={m.letter} size={30} /></span>
            <div style={{lineHeight:1.05,minWidth:0}}>
              <div className="mono" style={{fontSize:9,letterSpacing:'0.18em',color:'var(--text-subtle)'}}>WRIGHT FAMILY</div>
              <div style={{fontWeight:600,fontSize:13,marginTop:2,color:'var(--text)'}}>{m.app}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Scale + tab bar context */}
    <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:18}}>
      <div>
        <h3>Scale</h3>
        <div style={{display:'flex',alignItems:'flex-end',gap:18,padding:'18px 22px',background:'var(--surface-raised)',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',color:'var(--accent)'}}>
          {[12, 16, 24, 32, 48].map(s => (
            <div key={s} style={{display:'flex',gap:6,alignItems:'flex-end'}}>
              {['W','S','P','H','R'].map(L => (
                <div key={L} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                  <MarkLetter letter={L} size={s} />
                </div>
              ))}
              <div style={{width:1,height:30,background:'var(--border)',marginLeft:6,marginRight:0,alignSelf:'flex-end'}} />
              <span className="mono" style={{fontSize:10,color:'var(--text-subtle)',marginLeft:4,alignSelf:'flex-end',marginBottom:4}}>{s}px</span>
            </div>
          ))}
        </div>
        <div className="mono" style={{fontSize:10.5,color:'var(--text-subtle)',marginTop:8}}>
          The letter stays readable down to 16px; below that, the mark functions purely as a silhouette in tab bars.
        </div>
      </div>

      <div>
        <h3>Mobile tab bar</h3>
        <div style={{padding:'12px 14px',background:'var(--surface-raised)',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',display:'flex',justifyContent:'space-around'}}>
          {APP_MARKS.map((m,i) => (
            <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,minWidth:48,color: i === 1 ? 'var(--accent)' : 'var(--text-subtle)'}}>
              <MarkLetter letter={m.letter} size={22} />
              <span className="mono" style={{fontSize:9,letterSpacing:'0.06em'}}>{m.app.toUpperCase().split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ============================================================
// 2) CHART TOKENS + SAMPLES
// ============================================================
const SampleLineChart = () => {
  const w = 480, h = 200, padX = 36, padY = 20;
  const xs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const s1 = [3.20, 3.65, 3.45, 3.90, 3.85, 4.10, 4.05, 3.95, 4.20, 3.75, 3.83, 3.65, 3.83];
  const s2 = [1.10, 1.20, 1.05, 1.25, 1.18, 1.32, 1.30, 1.15, 1.40, 1.20, 1.25, 1.30, 1.28];
  const maxY = 5;
  const xAt = i => padX + (i / (xs.length - 1)) * (w - padX - 12);
  const yAt = v => h - padY - (v / maxY) * (h - padY * 2);
  const path = arr => arr.map((v, i) => (i === 0 ? 'M' : 'L') + xAt(i).toFixed(1) + ',' + yAt(v).toFixed(1)).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display:'block'}}>
      {/* Grid */}
      {[1, 2, 3, 4].map(y => (
        <line key={y} x1={padX} x2={w - 12} y1={yAt(y)} y2={yAt(y)} stroke="var(--border)" strokeWidth="1" strokeDasharray={y % 2 === 0 ? 'none' : '2 4'} />
      ))}
      {/* Y labels */}
      {[1, 2, 3, 4].map(y => (
        <text key={y} x={padX - 6} y={yAt(y) + 3} textAnchor="end"
          fontFamily="var(--font-mono)" fontSize="9" fill="var(--text-subtle)">${y}.00</text>
      ))}
      {/* X labels */}
      {[0, 3, 6, 9, 12].map(x => (
        <text key={x} x={xAt(x)} y={h - 6} textAnchor="middle"
          fontFamily="var(--font-mono)" fontSize="9" fill="var(--text-subtle)">D-{12 - x}</text>
      ))}
      {/* Axes */}
      <line x1={padX} x2={w - 12} y1={h - padY} y2={h - padY} stroke="var(--border-strong)" strokeWidth="1" />
      {/* Area fill under series 1 */}
      <path
        d={path(s1) + ` L${xAt(s1.length - 1)},${h - padY} L${xAt(0)},${h - padY} Z`}
        fill="var(--accent)" fillOpacity="0.10"
      />
      <path d={path(s1)} fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinejoin="round" />
      <path d={path(s2)} fill="none" stroke="var(--info)" strokeWidth="1.8" strokeLinejoin="round" strokeDasharray="3 3" />
      {/* Points */}
      {s1.map((v, i) => <circle key={i} cx={xAt(i)} cy={yAt(v)} r="2.5" fill="var(--accent)" />)}
    </svg>
  );
};

const SampleBarChart = () => {
  const data = [
    ['mon', 92, 24],
    ['tue', 78, 30],
    ['wed', 84, 18],
    ['thu', 110, 22],
    ['fri', 95, 26],
    ['sat', 64, 14],
    ['sun', 52, 10],
  ];
  const w = 320, h = 170, padX = 28, padY = 18;
  const maxY = 140;
  const bw = (w - padX - 8) / data.length - 6;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display:'block'}}>
      {[35, 70, 105, 140].map(y => (
        <line key={y} x1={padX} x2={w - 8} y1={h - padY - (y / maxY) * (h - padY * 2)} y2={h - padY - (y / maxY) * (h - padY * 2)}
          stroke="var(--border)" strokeWidth="1" strokeDasharray="2 4" />
      ))}
      {data.map(([day, a, b], i) => {
        const x = padX + 4 + i * (bw + 6);
        const aH = (a / maxY) * (h - padY * 2);
        const bH = (b / maxY) * (h - padY * 2);
        return (
          <g key={i}>
            <rect x={x} y={h - padY - aH} width={bw} height={aH} fill="var(--accent)" rx="2" />
            <rect x={x} y={h - padY - aH - bH} width={bw} height={bH} fill="var(--info)" rx="2" />
            <text x={x + bw/2} y={h - 6} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--text-subtle)">{day}</text>
          </g>
        );
      })}
    </svg>
  );
};

const ChartTokens = () => (
  <div className="wf-spec wf-root theme-frontier" style={{overflow:'auto'}}>
    <div>
      <div className="upper mono" style={{color:'var(--text-subtle)'}}>TOKENS · 07b</div>
      <div className="wf-spec-title" style={{marginTop:4}}>Chart-adjacent tokens</div>
      <div className="wf-spec-blurb" style={{marginTop:6}}>
        Per the strategy doc, no chart library is blessed yet — apps choose their own (uPlot, Charts.js,
        d3, hand-rolled SVG). The kit ships the tokens that every library needs to look like a
        Wright Family product: axis, grid, the categorical series ramp, and tooltip surface.
      </div>
    </div>

    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
      {/* Token list */}
      <div>
        <h3>Tokens</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          {[
            { k: '--chart-axis',    v: '#3a445a' },
            { k: '--chart-grid',    v: '#2a3142' },
            { k: '--chart-tip-bg',  v: '#1f2531' },
            { k: '--chart-tip-fg',  v: '#ebe4d4' },
            { k: '--chart-1',       v: '#c24b3a' },
            { k: '--chart-2',       v: '#5e83a8' },
            { k: '--chart-3',       v: '#d4a14a' },
            { k: '--chart-4',       v: '#7fa370' },
            { k: '--chart-5',       v: '#9b7ab0' },
            { k: '--chart-6',       v: '#7c8693' },
          ].map((t,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',background:'var(--surface-raised)',border:'1px solid var(--border)',borderRadius:'var(--radius-sm)'}}>
              <span style={{width:18,height:18,borderRadius:4,background:t.v,border:'1px solid var(--border)',flex:'0 0 auto'}} />
              <span className="mono" style={{fontSize:11,color:'var(--text)'}}>{t.k}</span>
              <span className="mono" style={{fontSize:10,color:'var(--text-subtle)',marginLeft:'auto'}}>{t.v}</span>
            </div>
          ))}
        </div>

        <h3 style={{marginTop:16}}>Layout · density</h3>
        <ul style={{display:'flex',flexDirection:'column',gap:6,fontSize:12.5,color:'var(--text-muted)',lineHeight:1.5}}>
          <li><span style={{color:'var(--text)'}}>Plot margins:</span> 36 / 12 / 20 / 36 (T / R / B / L)</li>
          <li><span style={{color:'var(--text)'}}>Axis labels:</span> mono 10/500, color <span className="mono">--text-subtle</span></li>
          <li><span style={{color:'var(--text)'}}>Grid lines:</span> 1px, even <span className="mono">--chart-grid</span>, odd dashed 2/4</li>
          <li><span style={{color:'var(--text)'}}>Series lines:</span> 1.8px, round joins. Dashed for secondary series.</li>
          <li><span style={{color:'var(--text)'}}>Area fills:</span> primary @ 10% alpha, never 100%.</li>
          <li><span style={{color:'var(--text)'}}>Tooltips:</span> raised card, 10px radius, no shadow on dark.</li>
        </ul>
      </div>

      {/* Sample charts */}
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        <div className="wf-card">
          <div className="wf-card-head"><h3>Cost · 12d trend</h3><span className="wf-meta mono">$3.83/day avg</span></div>
          <SampleLineChart />
          <div style={{display:'flex',gap:18,marginTop:8,fontSize:11.5}}>
            <span><span style={{display:'inline-block',width:10,height:2,background:'var(--accent)',verticalAlign:'middle',marginRight:6}} />gpt-5-nano</span>
            <span><span style={{display:'inline-block',width:10,height:2,background:'var(--info)',borderTop:'2px dashed var(--info)',verticalAlign:'middle',marginRight:6}} />gpt-5-mini</span>
          </div>
        </div>

        <div className="wf-card">
          <div className="wf-card-head"><h3>Jobs · 7d</h3><span className="wf-meta mono">scheduled vs ad-hoc</span></div>
          <SampleBarChart />
        </div>
      </div>
    </div>
  </div>
);

// ============================================================
// 3) MOBILE-FIRST CHECKLIST · visual proof
// ============================================================
const MobileFirstProof = () => {
  // Render a real mobile dashboard, then layer SVG annotations on top.
  return (
    <div className="wf-spec wf-root theme-frontier" style={{overflow:'auto'}}>
      <div>
        <div className="upper mono" style={{color:'var(--text-subtle)'}}>MOBILE · 07c</div>
        <div className="wf-spec-title" style={{marginTop:4}}>Mobile-first checklist · proof</div>
        <div className="wf-spec-blurb" style={{marginTop:6}}>
          Every app passes this checklist before shipping. Captured below from the live
          Sentinel mobile dashboard; callouts are annotation only.
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:32,alignItems:'flex-start'}}>
        {/* Annotated phone */}
        <div style={{position:'relative',width:390,height:740,border:'1px solid var(--border-strong)',borderRadius:24,overflow:'hidden',background:'var(--bg)'}}>
          <MobileDashboard brand={<BrandStencil sub="Sentinel" />} />
          {/* Annotations */}
          <svg style={{position:'absolute',inset:0,pointerEvents:'none'}} width="390" height="740">
            {/* Tap target around search button (top-right ~ 348, 76) */}
            <rect x="338" y="68" width="44" height="44" fill="none" stroke="#ffd66b" strokeWidth="1.5" strokeDasharray="3 3" rx="6" />
            <text x="290" y="60" fontFamily="var(--font-mono)" fontSize="10" fill="#ffd66b">44 × 44</text>

            {/* Tap target around tab item (~ 24, 700) */}
            <rect x="14" y="680" width="60" height="44" fill="none" stroke="#ffd66b" strokeWidth="1.5" strokeDasharray="3 3" rx="6" />
            <text x="80" y="710" fontFamily="var(--font-mono)" fontSize="10" fill="#ffd66b">tabs · 44h min</text>

            {/* Width marker */}
            <line x1="0" y1="6" x2="390" y2="6" stroke="#ffd66b" strokeWidth="1" />
            <text x="195" y="20" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="#ffd66b">390 PX · DESIGN TARGET</text>
          </svg>
        </div>

        {/* Checklist */}
        <div style={{display:'flex',flexDirection:'column',gap:18,paddingTop:8}}>
          <div>
            <h3>The 6 rules</h3>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {[
                ['Design at 375px first',     'every component is laid out for the narrowest phone, then expanded up.'],
                ['Tap targets \u2265 44px',   'buttons, tabs, table-row chevrons, swipe affordances. Below 44 is a bug.'],
                ['Containers wrap',           'no horizontal scroll on phone. Tables collapse to cards or scroll inside their card.'],
                ['No hover-only controls',    'every hover affordance has a tap equivalent (long-press, more menu, expand).'],
                ['Visible focus state',       'every focusable element shows the 3px brick focus ring on keyboard nav.'],
                ['View Transitions on',       'enabled in +layout.svelte; respects prefers-reduced-motion.'],
              ].map(([t,sub],i) => (
                <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                  <span style={{
                    width:20,height:20,borderRadius:6,background:'var(--success)',color:'#0e1521',
                    display:'flex',alignItems:'center',justifyContent:'center',flex:'0 0 auto',marginTop:1,
                  }}><IconCheck size={13} /></span>
                  <div>
                    <div style={{fontSize:13.5,fontWeight:500,color:'var(--text)'}}>{t}</div>
                    <div style={{fontSize:12,color:'var(--text-muted)',marginTop:2}}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{padding:'12px 14px',background:'var(--accent-soft)',color:'var(--accent)',borderRadius:'var(--radius-md)',fontSize:12.5,lineHeight:1.5}}>
            <span style={{fontWeight:600}}>Enforcement:</span> the kit ships a Storybook-side
            check that fails CI when a component exposes a control under 44px or hides an
            affordance behind hover only. The PR template includes this checklist as a copy-paste.
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 4) ICONOGRAPHY SPEC
// ============================================================
const IconographySpec = () => (
  <div className="wf-spec wf-root theme-frontier" style={{overflow:'auto'}}>
    <div>
      <div className="upper mono" style={{color:'var(--text-subtle)'}}>ICONS · 07d</div>
      <div className="wf-spec-title" style={{marginTop:4}}>Iconography</div>
      <div className="wf-spec-blurb" style={{marginTop:6}}>
        Lucide is the bedrock. The kit re-exports the subset apps actually need so we
        get tree-shakable bundles. Custom glyphs (Stencil bar, app-letter marks) are drawn
        to the same proportions so the families coexist without visual seams.
      </div>
    </div>

    <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:24}}>
      {/* Lucide subset */}
      <div>
        <h3>Lucide subset · @wright/ui/icons</h3>
        <div style={{display:'grid',gridTemplateColumns:'repeat(6, 1fr)',gap:8}}>
          {[
            ['Gauge',IconGauge],['Bell',IconBell],['Activity',IconActivity],['Jobs',IconJobs],['Queue',IconQueue],['Cost',IconCost],
            ['Settings',IconSettings],['File',IconFile],['Chat',IconChat],['Brain',IconBrain],['Home',IconHome],['Search',IconSearch],
            ['Plus',IconPlus],['Clock',IconClock],['Check',IconCheck],['Alert',IconAlert],['ChevronR',IconChevronRight],['Wifi',IconWifi],
          ].map(([name, Glyph], i) => (
            <div key={i} style={{
              display:'flex',flexDirection:'column',alignItems:'center',gap:6,
              padding:'12px 6px',background:'var(--surface-raised)',
              border:'1px solid var(--border)',borderRadius:'var(--radius-sm)',
              color:'var(--text)',
            }}>
              <Glyph size={20} />
              <span className="mono" style={{fontSize:9.5,color:'var(--text-subtle)'}}>{name}</span>
            </div>
          ))}
        </div>
        <div className="mono" style={{fontSize:10,color:'var(--text-subtle)',marginTop:10}}>
          import &#123; IconGauge, IconBell, ... &#125; from '@wright/ui/icons'
        </div>
      </div>

      {/* Drawing rules */}
      <div>
        <h3>Drawing rules · custom glyphs</h3>
        <div className="wf-card" style={{padding:'14px 16px',marginBottom:10}}>
          <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:'8px 14px',fontSize:12.5,color:'var(--text-muted)',lineHeight:1.5}}>
            <span className="mono" style={{color:'var(--text)'}}>viewBox</span><span>24 × 24, no fill on root</span>
            <span className="mono" style={{color:'var(--text)'}}>stroke</span><span><span className="mono">currentColor</span> · 1.75</span>
            <span className="mono" style={{color:'var(--text)'}}>cap / join</span><span>round / round</span>
            <span className="mono" style={{color:'var(--text)'}}>grid</span><span>half-pixel align (0.5 offsets) for crispness at 24px</span>
            <span className="mono" style={{color:'var(--text)'}}>fill</span><span>only when the glyph is meant to be a token (a star, a dot)</span>
            <span className="mono" style={{color:'var(--text)'}}>kerning</span><span>match Lucide's optical balance — leave 2px margin from viewBox edge</span>
          </div>
        </div>

        <div className="wf-card" style={{padding:14}}>
          <div className="upper mono" style={{color:'var(--text-subtle)',marginBottom:8}}>EXAMPLES</div>
          <div style={{display:'flex',gap:14,alignItems:'center',flexWrap:'wrap',color:'var(--accent)'}}>
            <MarkLetter letter="S" size={36} />
            <MarkLetter letter="P" size={36} />
            <div style={{width:1,height:30,background:'var(--border)'}} />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d={_starPath2(12, 12, 9)} /></svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round"><path d={_starPath2(12, 12, 9)} /></svg>
            <span className="mono" style={{fontSize:11,color:'var(--text-subtle)'}}>filled · outline · same anchor</span>
          </div>
        </div>

        <div style={{padding:'12px 14px',background:'color-mix(in srgb,var(--danger) 8%, var(--surface))',border:'1px solid var(--danger)',borderRadius:'var(--radius-md)',marginTop:10,fontSize:12.5,color:'var(--text-muted)'}}>
          <span style={{color:'var(--danger)',fontWeight:600}}>✕</span> Don't introduce a third icon family (e.g. Heroicons, Tabler). Tree-shake from Lucide instead.
        </div>
      </div>
    </div>
  </div>
);

// ============================================================
// 5) MOTION SPEC
// ============================================================
const MotionSpec = () => (
  <div className="wf-spec wf-root theme-frontier" style={{overflow:'auto'}}>
    <div>
      <div className="upper mono" style={{color:'var(--text-subtle)'}}>MOTION · 07e</div>
      <div className="wf-spec-title" style={{marginTop:4}}>Motion & transitions</div>
      <div className="wf-spec-blurb" style={{marginTop:6}}>
        Three durations, two easings, two View-Transitions presets. Motion is functional —
        it always serves orientation, never decoration. Respects
        <span className="mono"> prefers-reduced-motion</span>.
      </div>
    </div>

    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
      {/* Tokens */}
      <div>
        <h3>Tokens</h3>
        <div style={{display:'grid',gridTemplateColumns:'auto 1fr auto',gap:'10px 14px',fontSize:13,alignItems:'center'}}>
          <span className="mono" style={{color:'var(--text)'}}>--duration-fast</span>  <span style={{color:'var(--text-muted)'}}>hover, focus rings, tap feedback</span> <span className="mono" style={{color:'var(--accent)'}}>120 ms</span>
          <span className="mono" style={{color:'var(--text)'}}>--duration-base</span>  <span style={{color:'var(--text-muted)'}}>dropdown, badge swap, toast in</span>    <span className="mono" style={{color:'var(--accent)'}}>180 ms</span>
          <span className="mono" style={{color:'var(--text)'}}>--duration-slow</span>  <span style={{color:'var(--text-muted)'}}>modal in/out, full-page transition</span>  <span className="mono" style={{color:'var(--accent)'}}>280 ms</span>
          <div style={{height:1,background:'var(--border)',gridColumn:'1 / -1',margin:'4px 0'}} />
          <span className="mono" style={{color:'var(--text)'}}>--ease-out</span>     <span style={{color:'var(--text-muted)'}}>default for things appearing</span> <span className="mono" style={{color:'var(--text-subtle)',fontSize:10}}>cubic(.2,.7,.3,1)</span>
          <span className="mono" style={{color:'var(--text)'}}>--ease-in-out</span>  <span style={{color:'var(--text-muted)'}}>page navigation, drawer slides</span> <span className="mono" style={{color:'var(--text-subtle)',fontSize:10}}>cubic(.4,0,.2,1)</span>
        </div>

        <h3 style={{marginTop:18}}>View Transitions</h3>
        <CodeBlock>{`/* +layout.svelte */
import { onNavigate } from '$app/navigation';

onNavigate((nav) => {
  if (!document.startViewTransition) return;
  return new Promise((resolve) => {
    document.startViewTransition(async () => {
      resolve();
      await nav.complete;
    });
  });
});

/* presets */
::view-transition-old(root) { animation: fadeOut .12s ease-out both; }
::view-transition-new(root) { animation: fadeIn  .18s ease-out both; }`}</CodeBlock>
      </div>

      {/* Demos */}
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        <h3>Live</h3>

        <div className="wf-card" style={{padding:'16px 18px',display:'flex',alignItems:'center',gap:14}}>
          <button className="wf-btn primary motion-btn" style={{transition:'transform .12s var(--ease-out, ease-out), filter .12s'}}>
            Hover & press me
          </button>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:500}}>Tap feedback</div>
            <div className="mono" style={{fontSize:11,color:'var(--text-subtle)',marginTop:2}}>scale 0.96 on :active · 120ms · ease-out</div>
          </div>
        </div>

        <div className="wf-card" style={{padding:'16px 18px',position:'relative',overflow:'hidden'}}>
          <div className="motion-toast" style={{
            padding:'10px 14px',background:'var(--surface)',border:'1px solid var(--border)',borderLeft:'3px solid var(--success)',borderRadius:'var(--radius-md)',
            animation:'wfToastIn 2.4s ease-in-out infinite',
          }}>
            <div style={{fontWeight:600,fontSize:13}}>Saved</div>
            <div className="mono" style={{fontSize:11,color:'var(--text-subtle)',marginTop:2}}>document #207 written</div>
          </div>
          <div style={{position:'absolute',right:18,top:18}} className="mono">
            <span style={{fontSize:11,color:'var(--text-subtle)'}}>--duration-base · slide+fade</span>
          </div>
        </div>

        <div className="wf-card" style={{padding:'16px 18px'}}>
          <div style={{display:'flex',gap:8}}>
            <div className="motion-step" style={{
              width:120,height:36,background:'var(--accent-soft)',borderRadius:'var(--radius-sm)',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:12,color:'var(--accent)',
              animation:'wfStepShift 3.2s ease-in-out infinite',
            }}>Step 1 of 3</div>
            <div style={{flex:1,height:6,alignSelf:'center',background:'var(--surface)',borderRadius:999,overflow:'hidden',border:'1px solid var(--border)'}}>
              <div style={{height:'100%',background:'var(--accent)',animation:'wfProgress 3.2s ease-in-out infinite'}} />
            </div>
          </div>
          <div className="mono" style={{fontSize:11,color:'var(--text-subtle)',marginTop:8}}>page navigation · --duration-slow · ease-in-out</div>
        </div>
      </div>
    </div>

    <style>{`
      .motion-btn:hover { filter: brightness(1.05); }
      .motion-btn:active { transform: scale(0.96); }
      @keyframes wfToastIn {
        0%,8%        { transform: translateX(60px); opacity: 0; }
        18%,82%      { transform: none; opacity: 1; }
        92%,100%     { transform: translateX(60px); opacity: 0; }
      }
      @keyframes wfStepShift {
        0%,30%   { transform: translateX(0); }
        50%,80%  { transform: translateX(140px); }
        100%     { transform: translateX(0); }
      }
      @keyframes wfProgress {
        0%,30%   { width: 0%; }
        50%,80%  { width: 66%; }
        100%     { width: 0%; }
      }
    `}</style>
  </div>
);

// ============================================================
// 6) PRINT STYLESHEET · paperless document export
// ============================================================
const PrintSpec = () => (
  <div className="wf-spec wf-root theme-frontier" style={{overflow:'auto'}}>
    <div>
      <div className="upper mono" style={{color:'var(--text-subtle)'}}>PRINT · 07f</div>
      <div className="wf-spec-title" style={{marginTop:4}}>Print stylesheet</div>
      <div className="wf-spec-blurb" style={{marginTop:6}}>
        @media print swaps the dark surface for paper-white, drops nav chrome, and switches the
        type system to ink. The mark renders as a single brick-red plate; everything else is
        grayscale-friendly. Used by Paperless document export and Sentinel briefing PDFs.
      </div>
    </div>

    <div style={{display:'grid',gridTemplateColumns:'1fr 1.3fr',gap:24}}>
      {/* Print rules */}
      <div>
        <h3>Rules</h3>
        <ul style={{display:'flex',flexDirection:'column',gap:8,fontSize:12.5,color:'var(--text-muted)',lineHeight:1.5}}>
          <li><span style={{color:'var(--text)'}}>Background:</span> <span className="mono">#fff</span> · <span className="mono">--text</span> becomes <span className="mono">#111</span></li>
          <li><span style={{color:'var(--text)'}}>Hide:</span> sidebars, top bars, action buttons, footer chrome</li>
          <li><span style={{color:'var(--text)'}}>Body type:</span> 11pt Plex Sans / 1.5 leading</li>
          <li><span style={{color:'var(--text)'}}>Mono / data:</span> 10pt Plex Mono</li>
          <li><span style={{color:'var(--text)'}}>Margins:</span> 0.75in · top + bottom 0.6in</li>
          <li><span style={{color:'var(--text)'}}>Page header:</span> mark + app + page no. · 9pt mono</li>
          <li><span style={{color:'var(--text)'}}>Color:</span> accent ink only on the mark and section rules · no fills</li>
          <li><span style={{color:'var(--text)'}}>Page breaks:</span> avoid inside cards; force after the cover page in PDF exports</li>
        </ul>

        <h3 style={{marginTop:18}}>Snippet</h3>
        <CodeBlock>{`@media print {
  :root {
    --bg: #fff;
    --surface: #fff;
    --surface-raised: #fff;
    --text: #111;
    --text-muted: #4a4a4a;
    --text-subtle: #757575;
    --border: #d9d2c2;
    --accent: #a83828;
  }
  .wf-sidebar, .wf-topbar,
  .wf-btn, .wf-tabs { display: none !important; }
  .wf-card { border: 1px solid #d9d2c2; box-shadow: none; }
  a { color: var(--text) !important; text-decoration: underline; }
}`}</CodeBlock>
      </div>

      {/* Paper preview */}
      <div>
        <h3>Preview · paperless document export</h3>
        <div style={{
          background:'#ffffff',
          color:'#111',
          fontFamily:'IBM Plex Sans, system-ui, sans-serif',
          width:'100%',
          aspectRatio:'8.5 / 11',
          padding:'42px 48px',
          borderRadius:6,
          border:'1px solid var(--border)',
          boxShadow:'0 16px 36px rgba(0,0,0,0.35)',
          display:'flex',flexDirection:'column',gap:14,
          maxHeight:'100%',overflow:'hidden',
        }}>
          {/* Page header */}
          <div style={{display:'flex',alignItems:'center',gap:10,paddingBottom:10,borderBottom:'1px solid #d9d2c2'}}>
            <span style={{color:'#a83828'}}><MarkStencilBar size={26} /></span>
            <div style={{lineHeight:1.05}}>
              <div style={{fontFamily:'IBM Plex Mono',fontSize:8,letterSpacing:'0.22em',color:'#757575'}}>WRIGHT FAMILY</div>
              <div style={{fontWeight:600,fontSize:11,marginTop:2,color:'#111'}}>Paperless · Document Export</div>
            </div>
            <div style={{flex:1}} />
            <div style={{fontFamily:'IBM Plex Mono',fontSize:9,color:'#757575'}}>#207 · pg 1 of 2</div>
          </div>

          {/* Title */}
          <div>
            <div style={{fontFamily:'IBM Plex Mono',fontSize:8,letterSpacing:'0.18em',color:'#a83828'}}>VEHICLE PURCHASE AGREEMENT</div>
            <div style={{fontSize:18,fontWeight:600,letterSpacing:'-0.01em',marginTop:4,lineHeight:1.2}}>Rivian Motor Vehicle Purchase Agreement</div>
            <div style={{fontFamily:'IBM Plex Mono',fontSize:9,color:'#757575',marginTop:6}}>Received 2026-05-04 · ingested via paperless-enricher v2.4</div>
          </div>

          {/* Fields */}
          <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:'5px 18px',fontSize:11,marginTop:4}}>
            {[
              ['Vendor',  'Rivian Automotive, LLC'],
              ['Buyer',   'Scott A. Wright'],
              ['Total',   '$74,820.00'],
              ['Date',    'May 4, 2026'],
              ['VIN',     '7FCRGAAA8RN012345'],
              ['Address', '4218 Lone Star Trail, Austin, TX 78739'],
            ].map(([k,v],i)=>(
              <React.Fragment key={i}>
                <div style={{fontFamily:'IBM Plex Mono',fontSize:8.5,letterSpacing:'0.1em',textTransform:'uppercase',color:'#757575',paddingTop:1}}>{k}</div>
                <div style={{color:'#111'}}>{v}</div>
              </React.Fragment>
            ))}
          </div>

          {/* Section rule */}
          <div style={{borderTop:'2px solid #a83828',width:60,margin:'6px 0 2px'}} />
          <div style={{fontSize:10,color:'#111',lineHeight:1.55}}>
            <p style={{margin:0,marginBottom:6}}>
              This agreement, dated May 4, 2026, is entered into by and between Rivian Automotive, LLC ("Seller") and
              Scott A. Wright ("Buyer") for the purchase of one (1) Rivian R1S all-electric vehicle, VIN 7FCRGAAA8RN012345.
            </p>
            <p style={{margin:0,marginBottom:6}}>
              Delivery is scheduled for on or about June 12, 2026, at the Buyer's address of record. Title transfers
              upon final payment and acceptance of delivery; registration to be filed with the Texas Department of
              Motor Vehicles within thirty (30) days.
            </p>
          </div>

          {/* Footer */}
          <div style={{marginTop:'auto',paddingTop:10,borderTop:'1px solid #d9d2c2',fontFamily:'IBM Plex Mono',fontSize:8,color:'#757575',display:'flex'}}>
            <span>paperless.wrightfamily.org/d/207</span>
            <span style={{marginLeft:'auto'}}>printed 2026-05-14 21:35Z</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, {
  MarkLetter, APP_MARKS, AppMarksAtlas,
  ChartTokens, MobileFirstProof, IconographySpec, MotionSpec, PrintSpec,
});
