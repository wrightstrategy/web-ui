// Wright UI System spec — brand atlas, tokens, component library.
// Uses MarkStencilBar from marks.jsx + the screens from shared/screens.jsx.

// ---------- BrandStencil — sidebar lockup using the chosen mark ----------
const BrandStencil = ({ sub = 'SENTINEL', size = 30 }) => (
  <div style={{display:'flex',alignItems:'center',gap:12}}>
    <span style={{color:'var(--accent)',display:'flex',alignItems:'center'}}>
      <MarkStencilBar size={size} />
    </span>
    <div style={{lineHeight:1.05}}>
      <div className="mono" style={{fontSize:9.5,letterSpacing:'0.2em',color:'var(--text-subtle)'}}>WRIGHT FAMILY</div>
      <div style={{fontWeight:600,fontSize:14,letterSpacing:'-0.005em',color:'var(--text)',marginTop:2}}>{sub}</div>
    </div>
  </div>
);

// ============================================================
// 1) BRAND ATLAS
// ============================================================
const BrandAtlas = () => (
  <div className="wf-spec wf-root theme-frontier">
    <div>
      <div className="upper mono" style={{color:'var(--text-subtle)'}}>BRAND · 01</div>
      <div className="wf-spec-title" style={{marginTop:4}}>Mark, wordmark, and lockups</div>
      <div className="wf-spec-blurb" style={{marginTop:6}}>
        The Wright Family mark is a single architectural plate: stenciled W over a five-point star.
        Brick red on bone is the default; inverts to bone on brick on dark surfaces. Always paired
        with the wordmark in sidebar contexts; mark-only is reserved for favicons, app icons, and
        the loading spinner.
      </div>
    </div>

    <div style={{display:'grid',gridTemplateColumns:'1.1fr 1.6fr',gap:24,minHeight:0}}>
      {/* Hero pair */}
      <div style={{display:'grid',gridTemplateRows:'1fr 1fr',gap:14}}>
        <div style={{background:'#f2ece0',borderRadius:'var(--radius-md)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',color:'#c24b3a'}}>
          <MarkStencilBar size={130} />
        </div>
        <div style={{background:'var(--accent)',borderRadius:'var(--radius-md)',display:'flex',alignItems:'center',justifyContent:'center',color:'#f2ece0'}}>
          <MarkStencilBar size={130} />
        </div>
      </div>

      {/* Right column: lockups, scale, contexts */}
      <div style={{display:'flex',flexDirection:'column',gap:18,minHeight:0}}>
        {/* Lockups */}
        <div>
          <h3>Lockups</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
            <div style={{padding:'18px 16px',background:'var(--surface-raised)',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',display:'flex',alignItems:'center',gap:12}}>
              <span style={{color:'var(--accent)'}}><MarkStencilBar size={36} /></span>
              <div style={{lineHeight:1.05}}>
                <div className="mono" style={{fontSize:9,letterSpacing:'0.2em',color:'var(--text-subtle)'}}>WRIGHT FAMILY</div>
                <div style={{fontWeight:600,fontSize:14,marginTop:3}}>Sentinel</div>
              </div>
            </div>
            <div style={{padding:'18px 16px',background:'var(--surface-raised)',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--accent)'}}>
              <MarkStencilBar size={44} />
            </div>
            <div style={{padding:'18px 16px',background:'var(--surface-raised)',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{textAlign:'center',lineHeight:1.05}}>
                <div className="mono" style={{fontSize:9,letterSpacing:'0.22em',color:'var(--text-subtle)'}}>WRIGHT FAMILY</div>
                <div style={{fontWeight:600,fontSize:16,marginTop:3,color:'var(--text)'}}>Sentinel</div>
              </div>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginTop:8}}>
            {['Primary lockup','Mark only · favicon, app icon','Wordmark only · long form copy'].map((c,i)=>(
              <div key={i} className="mono" style={{fontSize:10,color:'var(--text-subtle)',textAlign:'center'}}>{c}</div>
            ))}
          </div>
        </div>

        {/* Scale */}
        <div>
          <h3>Scale</h3>
          <div style={{display:'flex',alignItems:'flex-end',gap:22,padding:'16px 18px',background:'var(--surface-raised)',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',color:'var(--accent)'}}>
            {[16, 24, 32, 48, 64, 96].map(s => (
              <div key={s} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                <MarkStencilBar size={s} />
                <span className="mono" style={{fontSize:10,color:'var(--text-subtle)'}}>{s}px</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contexts */}
        <div>
          <h3>In context</h3>
          <div style={{display:'grid',gridTemplateColumns:'1.4fr 0.7fr 1fr',gap:10}}>
            {/* Browser tab */}
            <div style={{background:'#191c24',borderRadius:'10px 10px var(--radius-md) var(--radius-md)',padding:8,border:'1px solid var(--border)'}}>
              <div style={{display:'flex',alignItems:'center',gap:6,background:'var(--surface-raised)',padding:'6px 10px',borderRadius:'6px',maxWidth:'85%'}}>
                <span style={{color:'var(--accent)',display:'flex'}}><MarkStencilBar size={12} /></span>
                <span style={{fontSize:11,color:'var(--text)'}}>Sentinel · Overview</span>
                <span style={{marginLeft:'auto',color:'var(--text-subtle)',fontSize:13}}>×</span>
              </div>
              <div className="mono" style={{fontSize:9,color:'var(--text-subtle)',marginTop:8,marginLeft:2}}>BROWSER FAVICON</div>
            </div>
            {/* App icon */}
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
              <div style={{width:60,height:60,background:'var(--accent)',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',color:'#f2ece0',boxShadow:'0 4px 14px rgba(0,0,0,.4)'}}>
                <MarkStencilBar size={36} />
              </div>
              <div className="mono" style={{fontSize:9,color:'var(--text-subtle)'}}>APP ICON</div>
            </div>
            {/* Loading */}
            <div style={{padding:'14px 16px',background:'var(--surface-raised)',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',display:'flex',alignItems:'center',gap:10}}>
              <span style={{color:'var(--accent)',display:'flex',animation:'wfSpin 2.4s linear infinite',transformOrigin:'center'}}><MarkStencilBar size={24} /></span>
              <div>
                <div style={{fontSize:13,color:'var(--text)'}}>Loading queue…</div>
                <div className="mono" style={{fontSize:10,color:'var(--text-subtle)',marginTop:2}}>SPINNER MARK</div>
              </div>
            </div>
          </div>
        </div>

        {/* Don'ts */}
        <div style={{marginTop:'auto'}}>
          <h3>Do · Don't</h3>
          <ul style={{display:'flex',flexDirection:'column',gap:6,fontSize:12,color:'var(--text-muted)',lineHeight:1.5}}>
            <li><span style={{color:'var(--success)'}}>✓</span> Use brick on bone surfaces; invert to bone on brick. Keep aspect ratio.</li>
            <li><span style={{color:'var(--success)'}}>✓</span> Pair with the wordmark in every product surface; mark-only only in tight UI affordances.</li>
            <li><span style={{color:'var(--danger)'}}>✕</span> Don't recolor outside the palette. Don't apply effects (shadow, glow, gradient).</li>
            <li><span style={{color:'var(--danger)'}}>✕</span> Don't render below 14px height — falls below stencil legibility.</li>
          </ul>
        </div>
      </div>
    </div>

    <style>{`@keyframes wfSpin { from { transform: rotate(0); } to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ============================================================
// 2) TOKEN REFERENCE — color, type, spacing, radii, shadow, focus
// ============================================================
const Swatch = ({ name, value, fg, big }) => (
  <div style={{display:'flex',flexDirection:'column',gap:6}}>
    <div style={{
      background:value,height:big?64:48,borderRadius:'var(--radius-sm)',
      border:'1px solid var(--border)',color:fg||'var(--text)',
      padding:'8px 10px',display:'flex',alignItems:'flex-end',
    }}>
      <span className="mono" style={{fontSize:10,opacity:.8}}>{value}</span>
    </div>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
      <span className="mono" style={{fontSize:10.5,letterSpacing:'0.06em',color:'var(--text)'}}>{name}</span>
    </div>
  </div>
);

const TokenReference = () => (
  <div className="wf-spec wf-root theme-frontier" style={{overflow:'auto'}}>
    <div>
      <div className="upper mono" style={{color:'var(--text-subtle)'}}>TOKENS · 02</div>
      <div className="wf-spec-title" style={{marginTop:4}}>Semantic tokens</div>
      <div className="wf-spec-blurb" style={{marginTop:6}}>
        Every token below is defined as a CSS custom property in
        <span className="mono"> @wright/ui/styles.css</span>. Components reference tokens only —
        never hex. The light theme overrides the same names under
        <span className="mono"> [data-theme="light"]</span>.
      </div>
    </div>

    {/* Color · dark */}
    <div>
      <h3>Color · dark (default)</h3>
      <div style={{display:'grid',gridTemplateColumns:'repeat(6, 1fr)',gap:10}}>
        <Swatch name="--bg"           value="#13171f" fg="#ebe4d4" />
        <Swatch name="--surface"      value="#181d27" fg="#ebe4d4" />
        <Swatch name="--surface-raised" value="#1f2531" fg="#ebe4d4" />
        <Swatch name="--border"       value="#2a3142" fg="#ebe4d4" />
        <Swatch name="--border-strong" value="#3a445a" fg="#ebe4d4" />
        <Swatch name="--text"         value="#ebe4d4" fg="#13171f" />
        <Swatch name="--text-muted"   value="#8d95a6" fg="#13171f" />
        <Swatch name="--text-subtle"  value="#5d6477" fg="#ebe4d4" />
        <Swatch name="--accent"       value="#c24b3a" fg="#f7ede0" />
        <Swatch name="--accent-soft"  value="#5d2a23" fg="#ebe4d4" />
        <Swatch name="--success"      value="#7fa370" fg="#13171f" />
        <Swatch name="--warning"      value="#d4a14a" fg="#13171f" />
        <Swatch name="--danger"       value="#c24b3a" fg="#f7ede0" />
        <Swatch name="--info"         value="#5e83a8" fg="#13171f" />
        <Swatch name="--focus"        value="#c24b3a" fg="#f7ede0" />
      </div>
    </div>

    {/* Color · light */}
    <div>
      <h3>Color · light</h3>
      <div style={{display:'grid',gridTemplateColumns:'repeat(6, 1fr)',gap:10}}>
        <Swatch name="--bg"           value="#f2ece0" fg="#1d1f25" />
        <Swatch name="--surface"      value="#faf5e9" fg="#1d1f25" />
        <Swatch name="--surface-raised" value="#ffffff" fg="#1d1f25" />
        <Swatch name="--border"       value="#e0d6c1" fg="#1d1f25" />
        <Swatch name="--text"         value="#1d1f25" fg="#f2ece0" />
        <Swatch name="--text-muted"   value="#5a5e6a" fg="#f2ece0" />
        <Swatch name="--text-subtle"  value="#8a8a91" fg="#f2ece0" />
        <Swatch name="--accent"       value="#a83828" fg="#fff" />
        <Swatch name="--success"      value="#5a8550" fg="#fff" />
        <Swatch name="--warning"      value="#b78636" fg="#fff" />
        <Swatch name="--danger"       value="#a83828" fg="#fff" />
        <Swatch name="--info"         value="#3a6789" fg="#fff" />
      </div>
    </div>

    {/* Type scale */}
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
      <div>
        <h3>Type scale</h3>
        <div style={{display:'flex',flexDirection:'column'}}>
          {[
            { token: '--text-display', size: 28, weight: 600, label: 'Display · page hero',           text: 'Sentinel · Overview' },
            { token: '--text-h1',      size: 22, weight: 600, label: 'H1 · page title',               text: 'Queue' },
            { token: '--text-h2',      size: 18, weight: 600, label: 'H2 · section',                  text: 'Recent activity' },
            { token: '--text-h3',      size: 15, weight: 600, label: 'H3 · subsection',               text: 'Budget breakdown' },
            { token: '--text-body',    size: 14, weight: 450, label: 'Body',                          text: 'Overnight was quiet except for the ledger webhook situation — third consecutive cycle.' },
            { token: '--text-small',   size: 12, weight: 450, label: 'Small · metadata',              text: 'Received 2026-05-04 · 78% confidence' },
            { token: '--text-label',   size: 11, weight: 500, label: 'Caps label · mono', mono: true, tracking: '0.16em', text: 'NEEDS REVIEW · ACTIVITY · 7D' },
            { token: '--text-mono',    size: 12, weight: 500, label: 'Mono · data',          mono: true, text: '$3.83 / $25.00 · 2026-05-14T21:35:14Z' },
          ].map((t,i)=>(
            <div key={i} style={{padding:'10px 0',borderBottom:i<7?'1px solid var(--border)':'none'}}>
              <div className="mono" style={{fontSize:9.5,letterSpacing:'0.06em',color:'var(--text-subtle)',textTransform:'uppercase'}}>{t.label} · {t.size}/{t.weight}</div>
              <div style={{
                fontSize:t.size, fontWeight:t.weight,
                fontFamily: t.mono ? 'var(--font-mono)' : 'var(--font-sans)',
                color:'var(--text)',
                letterSpacing: t.tracking || (t.size > 20 ? '-0.01em' : 'normal'),
                marginTop:2,
                textTransform: t.tracking ? 'uppercase' : 'none',
              }}>{t.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:18}}>
        {/* Spacing */}
        <div>
          <h3>Spacing scale · 4px</h3>
          <div style={{display:'flex',gap:8,alignItems:'flex-end'}}>
            {[4,8,12,16,20,24,32,40,48,64].map(s => (
              <div key={s} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                <div style={{width:s,height:s,background:'var(--accent)',borderRadius:2}} />
                <span className="mono" style={{fontSize:9.5,color:'var(--text-subtle)'}}>{s}</span>
              </div>
            ))}
          </div>
          <div className="mono" style={{fontSize:10,color:'var(--text-subtle)',marginTop:8}}>--space-1 … --space-12</div>
        </div>

        {/* Radii */}
        <div>
          <h3>Radii</h3>
          <div style={{display:'flex',gap:14}}>
            {[
              { name: '--radius-sm', r: 6 },
              { name: '--radius-md', r: 8 },
              { name: '--radius-lg', r: 14 },
            ].map(({name,r}) => (
              <div key={r} style={{display:'flex',flexDirection:'column',gap:6,alignItems:'center'}}>
                <div style={{width:60,height:42,background:'var(--accent)',borderRadius:r,opacity:.95}} />
                <span className="mono" style={{fontSize:10,color:'var(--text-subtle)'}}>{name} · {r}px</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shadows */}
        <div>
          <h3>Shadows</h3>
          <div style={{display:'flex',gap:14}}>
            <div style={{width:120,height:56,background:'var(--surface-raised)',borderRadius:8,border:'1px solid var(--border)',boxShadow:'0 1px 2px rgba(0,0,0,.45)'}} />
            <div style={{width:120,height:56,background:'var(--surface-raised)',borderRadius:8,border:'1px solid var(--border)',boxShadow:'0 8px 24px rgba(0,0,0,.45),0 2px 4px rgba(0,0,0,.25)'}} />
          </div>
          <div className="mono" style={{fontSize:10,color:'var(--text-subtle)',marginTop:8}}>--shadow-sm · --shadow-md</div>
        </div>

        {/* Focus */}
        <div>
          <h3>Focus ring</h3>
          <input className="wf-input focused" defaultValue="Focused input · 3px brick ring" />
          <div className="mono" style={{fontSize:10,color:'var(--text-subtle)',marginTop:8}}>--focus · 0 0 0 3px color-mix(--accent 22%)</div>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================
// 3) COMPONENT LIBRARY
// ============================================================
const ComponentLibrary = () => (
  <div className="wf-spec wf-root theme-frontier" style={{overflow:'auto'}}>
    <div>
      <div className="upper mono" style={{color:'var(--text-subtle)'}}>COMPONENTS · 03</div>
      <div className="wf-spec-title" style={{marginTop:4}}>Foundational components</div>
      <div className="wf-spec-blurb" style={{marginTop:6}}>
        The 13 components shipped from <span className="mono">@wright/ui</span>. Each is shown
        with its primary variants, sizes, and states. Density and tap targets meet the mobile-
        first checklist (≥44px on interactive controls).
      </div>
    </div>

    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
      {/* Buttons */}
      <div>
        <h3>Button</h3>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          <div className="wf-spec-row">
            <button className="wf-btn primary"><IconPlus size={14} /> Primary</button>
            <button className="wf-btn">Secondary</button>
            <button className="wf-btn ghost">Ghost</button>
            <button className="wf-btn" style={{background:'var(--danger)',color:'var(--accent-on)',borderColor:'transparent'}}>Danger</button>
          </div>
          <div className="wf-spec-row">
            <button className="wf-btn primary" style={{padding:'6px 10px',fontSize:12}}>sm</button>
            <button className="wf-btn primary">md (default)</button>
            <button className="wf-btn primary" style={{padding:'12px 18px',fontSize:14}}>lg</button>
            <button className="wf-btn primary" disabled style={{opacity:.55,cursor:'not-allowed'}}>Disabled</button>
            <button className="wf-btn primary"><svg width="14" height="14" viewBox="0 0 24 24" style={{animation:'wfSpin 1.2s linear infinite'}}><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="14 30" strokeLinecap="round" /></svg> Loading</button>
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div>
        <h3>Input & FormField</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <div className="wf-field">
            <label className="wf-field-label">Document name</label>
            <input className="wf-input" defaultValue="Rivian Purchase Agreement" />
            <span className="wf-field-hint">Visible to anyone with access.</span>
          </div>
          <div className="wf-field">
            <label className="wf-field-label">Confidence floor</label>
            <div className="wf-input-affix">
              <span className="wf-affix-icon"><IconActivity size={14} /></span>
              <input className="wf-input" defaultValue="80" />
              <span className="wf-affix-suffix">%</span>
            </div>
            <span className="wf-field-hint">Below this, send to manual review.</span>
          </div>
          <div className="wf-field">
            <label className="wf-field-label">Email</label>
            <input className="wf-input err" defaultValue="not-an-email" />
            <span className="wf-field-err"><IconAlert size={12} /> Enter a valid email address.</span>
          </div>
          <div className="wf-field">
            <label className="wf-field-label">Source</label>
            <div className="wf-select">Paperless · Documents <span style={{flex:1}}></span></div>
            <span className="wf-field-hint">Where to ingest from.</span>
          </div>
        </div>
      </div>

      {/* Form controls */}
      <div>
        <h3>Toggle · Checkbox · Radio</h3>
        <div className="wf-spec-row">
          <div className="wf-toggle on" />
          <span style={{fontSize:13}}>Auto-triage above 90%</span>
        </div>
        <div className="wf-spec-row" style={{marginTop:10}}>
          <span className="wf-check on"><span className="box"><IconCheck size={11} /></span> Notify on errors</span>
          <span className="wf-check"><span className="box"></span> Notify on review needed</span>
        </div>
        <div className="wf-spec-row" style={{marginTop:10}}>
          <span className="wf-radio on"><span className="dot" /> Slack</span>
          <span className="wf-radio"><span className="dot" /> Email</span>
          <span className="wf-radio"><span className="dot" /> Webhook</span>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3>Badge</h3>
        <div className="wf-spec-row">
          <span className="wf-badge ok"><span className="dot" />OK</span>
          <span className="wf-badge warn"><span className="dot" />WARN</span>
          <span className="wf-badge err"><span className="dot" />ERR</span>
          <span className="wf-badge info"><span className="dot" />INFO</span>
          <span className="wf-badge accent"><span className="dot" />ACCENT</span>
          <span className="wf-badge">NEUTRAL</span>
          <span className="wf-badge" style={{background:'var(--accent-soft)',color:'var(--accent)',borderColor:'transparent'}}>NEEDS REVIEW · 44</span>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <h3>Tabs</h3>
        <div className="wf-tabs">
          <div className="tab active">Queue <span className="wf-badge" style={{marginLeft:6,padding:'1px 6px'}}>44</span></div>
          <div className="tab">Auto <span className="wf-badge" style={{marginLeft:6,padding:'1px 6px'}}>145</span></div>
          <div className="tab">Errors <span className="wf-badge err" style={{marginLeft:6,padding:'1px 6px'}}>3</span></div>
          <div className="tab">Archived</div>
        </div>
      </div>

      {/* Pagination */}
      <div>
        <h3>Pagination</h3>
        <div className="wf-spec-row">
          <button className="wf-btn ghost">‹ Prev</button>
          {['1','2','3','…','16'].map((p,i)=>(
            <button key={i} className={'wf-btn'+(p==='2'?' primary':'')} style={{minWidth:36,padding:'8px 10px',justifyContent:'center'}}>{p}</button>
          ))}
          <button className="wf-btn">Next ›</button>
        </div>
      </div>

      {/* Card variants */}
      <div>
        <h3>Card variants</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <div className="wf-card">
            <div className="wf-card-head"><h3>Standard</h3><span className="wf-meta mono">7d</span></div>
            <div style={{fontSize:13,color:'var(--text-muted)'}}>Surface-raised with border, padding 20.</div>
          </div>
          <div className="wf-card" style={{background:'transparent',border:'1px dashed var(--border)'}}>
            <div className="wf-card-head"><h3>Dashed · placeholder</h3></div>
            <div style={{fontSize:13,color:'var(--text-muted)'}}>For drop zones, empty groups.</div>
          </div>
          <div className="wf-card" style={{padding:14}}>
            <div className="wf-row" style={{gap:12}}>
              <span style={{color:'var(--accent)'}}><MarkStencilBar size={28} /></span>
              <div className="wf-grow">
                <div style={{fontSize:13,fontWeight:600}}>Compact list row</div>
                <div className="mono" style={{fontSize:11,color:'var(--text-subtle)'}}>density: 14 / 11</div>
              </div>
              <IconChevronRight size={14} style={{color:'var(--text-subtle)'}} />
            </div>
          </div>
          <div className="wf-card" style={{borderColor:'var(--accent)',background:'var(--accent-soft)'}}>
            <div className="wf-card-head"><h3 style={{color:'var(--accent)'}}>Accent · selection</h3></div>
            <div style={{fontSize:13,color:'var(--text)'}}>For active or highlighted items.</div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div>
        <h3>Toast</h3>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          <div className="wf-toast ok">
            <span style={{color:'var(--success)'}}><IconCheck size={16} /></span>
            <div><div className="title">Document approved</div><div className="body">#207 Rivian Purchase Agreement filed to /vehicles.</div></div>
          </div>
          <div className="wf-toast warn">
            <span style={{color:'var(--warning)'}}><IconAlert size={16} /></span>
            <div><div className="title">Low confidence</div><div className="body">3 documents fell below 80%. Sent to review.</div></div>
          </div>
          <div className="wf-toast err">
            <span style={{color:'var(--danger)'}}><IconAlert size={16} /></span>
            <div><div className="title">Webhook silent</div><div className="body">SparkReceipt webhook hasn't fired in 72h.</div></div>
          </div>
        </div>
      </div>

      {/* Modal preview */}
      <div style={{gridColumn:'1 / -1'}}>
        <h3>Modal & overlay</h3>
        <div style={{height:240,position:'relative',borderRadius:'var(--radius-md)',overflow:'hidden',border:'1px solid var(--border)'}}>
          <div className="wf-modal-shell">
            <div className="wf-modal">
              <h3 style={{fontFamily:'var(--font-sans)',textTransform:'none',letterSpacing:'-0.005em',fontSize:16,color:'var(--text)'}}>Re-queue this document?</h3>
              <p style={{fontSize:13,color:'var(--text-muted)',margin:0}}>
                #207 Rivian Motor Vehicle Purchase Agreement will be cleared from the auto-decision and sent back to the review queue. Tags will be kept.
              </p>
              <div className="actions">
                <button className="wf-btn ghost">Cancel</button>
                <button className="wf-btn primary">Re-queue</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* States */}
      <div>
        <h3>Loading skeleton</h3>
        <div className="wf-card" style={{padding:16}}>
          <div className="wf-skeleton" style={{width:'40%',marginBottom:10}} />
          <div className="wf-skeleton" style={{marginBottom:6}} />
          <div className="wf-skeleton" style={{width:'80%',marginBottom:6}} />
          <div className="wf-skeleton" style={{width:'65%'}} />
        </div>
      </div>

      <div>
        <h3>Empty state</h3>
        <div className="wf-card" style={{padding:0}}>
          <div className="wf-empty">
            <span className="glyph"><MarkStencilBar size={36} /></span>
            <h4>Queue is clear</h4>
            <div style={{fontSize:12.5,maxWidth:'34ch'}}>No documents are waiting for review. New uploads land here automatically.</div>
            <button className="wf-btn ghost" style={{marginTop:8}}>View archive</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================
// 4) ROADMAP — what's left
// ============================================================
const Roadmap = () => (
  <div className="wf-spec wf-root theme-frontier">
    <div>
      <div className="upper mono" style={{color:'var(--text-subtle)'}}>STATUS · 08</div>
      <div className="wf-spec-title" style={{marginTop:4}}>v1.0 · Ready to scaffold</div>
      <div className="wf-spec-blurb" style={{marginTop:6}}>
        All eight system pillars from the strategy doc are now drawn at fidelity. The next
        action is implementation — turn this canvas into <span className="mono">@wright/ui</span>
        and the template app, then ship the throwaway proof app to validate the vertical slice.
      </div>
    </div>

    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,minHeight:0}}>
      <div>
        <h3>Complete</h3>
        <ul style={{display:'flex',flexDirection:'column',gap:8,fontSize:13,color:'var(--text)'}}>
          {[
            ['Brand', 'Stencil bar mark · wordmark · favicon · app icon · do/don\u2019t'],
            ['App-letter marks', 'W · S · P · H · R in the Stencil-bar vocabulary'],
            ['Color tokens', 'dark + light · semantic mappings'],
            ['Type / spacing / radii / shadow / focus', 'paste-ready for tokens.css'],
            ['Chart tokens', 'axis · grid · 6-series ramp · tooltip · layout density'],
            ['Components', '13 foundational, full variants & states'],
            ['Page recipes · desktop', 'dashboard · table · detail · form · settings · async · login'],
            ['Page recipes · mobile', 'dashboard · detail · form · triage · login'],
            ['States', 'loading · empty · error across card · table · page'],
            ['Auth stub conventions', 'cookie shape · requireSession · redirects · layout'],
            ['Mobile-first checklist', '6 rules · annotated proof · CI gate'],
            ['Iconography', 'Lucide subset · custom-glyph drawing rules'],
            ['Motion', 'durations · easings · View Transitions preset'],
            ['Print', '@media print rules · paperless export preview'],
          ].map(([t,sub],i)=>(
            <li key={i} style={{display:'flex',gap:8,alignItems:'flex-start'}}>
              <span style={{color:'var(--success)',display:'flex',marginTop:1}}><IconCheck size={14} /></span>
              <span><span style={{color:'var(--text)'}}>{t}</span> <span style={{color:'var(--text-muted)'}}>· {sub}</span></span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Implementation · vertical slice</h3>
        <ul style={{display:'flex',flexDirection:'column',gap:8,fontSize:13,color:'var(--text)'}}>
          {[
            ['packages/ui', 'tokens.css, styles.css, Tailwind preset, 13 components'],
            ['templates/app', 'SvelteKit app implementing the 7 page recipes'],
            ['packages/create-app', 'bun create @wright/app scaffolder'],
            ['skill · homelab-web-ui', 'render-mode decision, recipe map, mobile checklist'],
            ['throwaway proof app', 'validate end-to-end · pass mobile smoke check'],
            ['then', 'scan-router · paperless-enricher · higgins · sentinel migrations'],
          ].map(([t,sub],i)=>(
            <li key={i} style={{display:'flex',gap:8,alignItems:'flex-start'}}>
              <span style={{color:'var(--text-subtle)',display:'flex',marginTop:2}}>
                <svg width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="2" width="10" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
              </span>
              <span><span style={{color:'var(--text)'}}>{t}</span> <span style={{color:'var(--text-muted)'}}>· {sub}</span></span>
            </li>
          ))}
        </ul>

        <div style={{marginTop:14,padding:'12px 14px',background:'var(--accent-soft)',borderRadius:'var(--radius-md)',color:'var(--accent)',fontSize:12.5,lineHeight:1.5}}>
          <span style={{fontWeight:600}}>Hand-off:</span> this canvas is the spec. Components,
          tokens, and recipes here are the source of truth; the SvelteKit code should render
          identically. Where they diverge, the canvas wins until updated.
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, {
  BrandStencil, BrandAtlas, TokenReference, ComponentLibrary, Roadmap,
});
