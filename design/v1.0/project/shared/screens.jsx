// Shared screen scaffolds. Render inside a wrapper with a `theme-*` class.
// Brand component is injected so each direction can supply its own mark.

// ---------- mock data ----------
const SENTINEL_ACTIVITY = [
  { kind: 'info',    label: 'LiteLLM metrics endpoint authenticated',     ago: '6h',  cost: '$0.50' },
  { kind: 'success', label: 'Backup snapshot completed · ledger',         ago: '6h',  cost: '$0.61' },
  { kind: 'info',    label: 'Receipt webhook silence cleared',            ago: '6h',  cost: '$0.66' },
  { kind: 'warn',    label: 'Scheduled job: quiltshow-keepalive',         ago: '8h',  cost: '—'     },
  { kind: 'warn',    label: 'Scheduled job: briefing-morning',            ago: '10h', cost: '$0.11' },
  { kind: 'info',    label: 'ArrQueueWarnings: scraparr (monitoring)',    ago: '18h', cost: '$0.59' },
  { kind: 'success', label: 'WebhookSilence: ledger resolved',            ago: '22h', cost: '$0.50' },
  { kind: 'info',    label: 'Scheduled job: briefing-evening',            ago: '22h', cost: '$0.28' },
  { kind: 'warn',    label: 'OPNsenseGatewayDown: opnsense-exporter',     ago: '1d',  cost: '$0.58' },
];

const PAPERLESS_QUEUE = [
  { id: 212, kind: 'review',   doc: 'HCTRA EZ TAG Fulfillment — Scott Wright',    when: '2026-05-06', conf: 78 },
  { id: 211, kind: 'auto',     doc: 'AT&T Statement — April 2026',                 when: '2026-05-06', conf: 96 },
  { id: 210, kind: 'auto',     doc: 'Centerpoint Energy Bill',                     when: '2026-05-05', conf: 94 },
  { id: 209, kind: 'review',   doc: 'Extension of Residential Lease — Texas',     when: '2026-05-05', conf: 71 },
  { id: 208, kind: 'auto',     doc: 'Vanguard Q1 Statement',                      when: '2026-05-04', conf: 99 },
  { id: 207, kind: 'review',   doc: 'Rivian Motor Vehicle Purchase Agreement',     when: '2026-05-04', conf: 64 },
  { id: 206, kind: 'auto',     doc: 'Comcast Internet — April',                    when: '2026-05-03', conf: 98 },
  { id: 205, kind: 'error',    doc: 'Funeral Purchase Agreement — Barbara Kennedy', when: '2026-05-03', conf: null },
  { id: 204, kind: 'auto',     doc: 'Travis County Property Tax Notice',           when: '2026-05-02', conf: 92 },
  { id: 203, kind: 'review',   doc: 'Certificate of Membership — Golden Eagle RV', when: '2026-05-02', conf: 73 },
  { id: 202, kind: 'auto',     doc: 'State Farm Auto Renewal',                     when: '2026-05-01', conf: 95 },
  { id: 201, kind: 'auto',     doc: 'Frost Bank Statement',                        when: '2026-04-30', conf: 97 },
];

// ---------- Sidebar nav links ----------
const SENTINEL_NAV = [
  { sect: 'Monitoring', items: [
    { icon: IconGauge,    label: 'Overview', active: true },
    { icon: IconBell,     label: 'Events' },
    { icon: IconActivity, label: 'Activity' },
  ]},
  { sect: 'Operations', items: [
    { icon: IconBrain,    label: 'Memory' },
    { icon: IconJobs,     label: 'Operations' },
  ]},
  { sect: 'System', items: [
    { icon: IconSettings, label: 'Settings' },
  ]},
];

const PAPERLESS_NAV = [
  { sect: 'Monitoring', items: [
    { icon: IconGauge,    label: 'Dashboard' },
    { icon: IconQueue,    label: 'Queue', active: true },
    { icon: IconActivity, label: 'Activity' },
    { icon: IconJobs,     label: 'Jobs' },
  ]},
  { sect: 'Analysis', items: [
    { icon: IconCost,     label: 'Cost' },
  ]},
  { sect: 'System', items: [
    { icon: IconSettings, label: 'Settings' },
  ]},
];

// ---------- Reusable: sidebar ----------
const Sidebar = ({ brand, nav }) => (
  <aside className="wf-sidebar">
    <div className="wf-brand">{brand}</div>
    <nav className="wf-nav">
      {nav.map((g, gi) => (
        <React.Fragment key={gi}>
          <div className="wf-nav-section">{g.sect}</div>
          {g.items.map((it, i) => {
            const I = it.icon;
            return (
              <a key={i} className={it.active ? 'active' : ''} href="#">
                <I className="wf-nav-icon" size={16} />
                <span>{it.label}</span>
              </a>
            );
          })}
        </React.Fragment>
      ))}
    </nav>
    <div className="wf-foot">
      <div style={{width:28,height:28,borderRadius:'50%',background:'var(--surface-raised)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-mono)',fontWeight:600,fontSize:11,color:'var(--text-muted)'}}>SW</div>
      <div className="wf-grow">
        <div style={{fontSize:13,color:'var(--text)'}}>Scott</div>
        <div style={{fontSize:11,color:'var(--text-subtle)'}} className="mono">wrightfamily.org</div>
      </div>
    </div>
  </aside>
);

// ---------- Sentinel-style overview dashboard ----------
const SentinelDashboard = ({ brand }) => (
  <div className="wf-shell">
    <Sidebar brand={brand} nav={SENTINEL_NAV} />
    <main className="wf-main">
      <header className="wf-topbar">
        <span className="wf-crumb">Sentinel</span>
        <IconChevronRight size={12} style={{color:'var(--text-subtle)'}} />
        <h1>Overview</h1>
        <div className="wf-spacer" />
        <button className="wf-btn ghost"><IconSearch size={14} /> Search</button>
        <button className="wf-btn"><IconPlus size={14} /> New incident</button>
      </header>
      <div className="wf-content">
        {/* Top status bar */}
        <div className="wf-card" style={{display:'grid',gridTemplateColumns:'1fr auto auto auto auto',alignItems:'center',gap:32,padding:'18px 22px'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
              <span style={{width:8,height:8,borderRadius:'50%',background:'var(--success)',boxShadow:'0 0 0 4px color-mix(in srgb,var(--success) 18%,transparent)'}} />
              <span style={{fontWeight:600,fontSize:15}}>All systems healthy</span>
            </div>
            <div style={{fontSize:12,color:'var(--text-muted)'}} className="mono">$3.83 spent today · 4 services online · briefing 10h ago</div>
          </div>
          {[
            { v: '0/1',  k: 'INCIDENTS', tone: 'success' },
            { v: '2',    k: 'CHATS',     tone: '' },
            { v: '2',    k: 'JOBS',      tone: '' },
            { v: '15%',  k: 'BUDGET',    tone: 'accent' },
          ].map((m, i) => (
            <div key={i} style={{textAlign:'right'}}>
              <div className="mono tnum" style={{
                fontSize:22,fontWeight:500,letterSpacing:'-0.02em',
                color: m.tone === 'success' ? 'var(--success)' : m.tone === 'accent' ? 'var(--accent)' : 'var(--text)'
              }}>{m.v}</div>
              <div className="upper mono" style={{color:'var(--text-subtle)',fontSize:10}}>{m.k}</div>
            </div>
          ))}
        </div>

        {/* 3-up cards */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
          <div className="wf-card">
            <div className="wf-card-head">
              <h3>Activity</h3>
              <span className="wf-meta mono">7d</span>
            </div>
            <table className="wf-table" style={{fontSize:12}}>
              <thead>
                <tr><th>&nbsp;</th><th style={{textAlign:'right'}}>Today</th><th style={{textAlign:'right'}}>7d</th><th style={{textAlign:'right'}}>30d</th></tr>
              </thead>
              <tbody>
                {[['Incidents','1','29','117'],['Chats','2','5','40'],['Jobs','2','18','73']].map((r,i)=>(
                  <tr key={i}>
                    <td>{r[0]}</td>
                    <td className="mono tnum" style={{textAlign:'right'}}>{r[1]}</td>
                    <td className="mono tnum" style={{textAlign:'right',color:'var(--text-muted)'}}>{r[2]}</td>
                    <td className="mono tnum" style={{textAlign:'right',color:'var(--text-muted)'}}>{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="wf-card">
            <div className="wf-card-head">
              <h3>Budget</h3>
              <span className="wf-meta mono">May</span>
            </div>
            <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',marginBottom:10}}>
              <div>
                <span className="mono" style={{fontSize:24,fontWeight:500,letterSpacing:'-0.01em'}}>$3.83</span>
                <span className="mono" style={{color:'var(--text-muted)',fontSize:13}}> / $25.00</span>
              </div>
              <span className="wf-badge accent"><span className="dot" />15%</span>
            </div>
            <div className="wf-progress"><span style={{width:'15%'}} /></div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:14}}>
              <span className="wf-muted mono" style={{fontSize:12}}>$21.17 left</span>
              <button className="wf-btn">Boost</button>
            </div>
          </div>

          <div className="wf-card">
            <div className="wf-card-head">
              <h3>Cost</h3>
              <span className="wf-meta mono">trending</span>
            </div>
            <Sparkline width={300} height={48} color="var(--accent)" />
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginTop:14}}>
              <div><div className="mono" style={{fontSize:16,fontWeight:500}}>$3.83</div><div className="upper mono" style={{color:'var(--text-subtle)'}}>today</div></div>
              <div><div className="mono" style={{fontSize:16,fontWeight:500,color:'var(--text-muted)'}}>$25.55</div><div className="upper mono" style={{color:'var(--text-subtle)'}}>7d</div></div>
              <div><div className="mono" style={{fontSize:16,fontWeight:500,color:'var(--text-muted)'}}>$3.65/d</div><div className="upper mono" style={{color:'var(--text-subtle)'}}>7d avg</div></div>
            </div>
          </div>
        </div>

        {/* Briefing + Activity */}
        <div style={{display:'grid',gridTemplateColumns:'1.15fr 1fr',gap:16,minHeight:0,flex:1}}>
          <div className="wf-card" style={{display:'flex',flexDirection:'column'}}>
            <div className="wf-card-head">
              <h3>Latest briefing</h3>
              <span className="wf-meta mono">5/14 · 7:00 AM (10h ago)</span>
            </div>
            <div style={{borderLeft:'2px solid var(--accent)',paddingLeft:14,marginLeft:2}}>
              <p style={{fontSize:14,marginBottom:10,color:'var(--text)',fontWeight:500}}>
                Mist 67° this morning, high of 98. Summer skipped spring.
              </p>
              <p style={{fontSize:13,color:'var(--text-muted)',lineHeight:1.55,marginBottom:8}}>
                Overnight was quiet except for the ledger webhook situation — third consecutive alert cycle with the same stale timestamp (2026-05-11 15:56 UTC, unchanged). That's ~72 hours with no SparkReceipt webhook activity.
              </p>
              <p style={{fontSize:13,color:'var(--text-muted)',lineHeight:1.55}}>
                Infra looks clean (pod healthy, tunnel up, no errors), so it's genuinely ambiguous: either nothing got scanned since Sunday, or the WAF started 403'ing SparkReceipt. The ODoH relay post on HN is worth a look if you've been eyeing anonymous DNS.
              </p>
            </div>
          </div>

          <div className="wf-card" style={{display:'flex',flexDirection:'column'}}>
            <div className="wf-card-head">
              <h3>Recent activity</h3>
              <a href="#" className="wf-meta" style={{color:'var(--accent)',fontSize:12}}>view all →</a>
            </div>
            <div style={{display:'flex',flexDirection:'column'}}>
              {SENTINEL_ACTIVITY.slice(0,8).map((r, i) => {
                const tone = r.kind === 'success' ? 'var(--success)' : r.kind === 'warn' ? 'var(--warning)' : 'var(--info)';
                return (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:i<7?'1px solid var(--border)':'none'}}>
                    <span style={{width:6,height:6,borderRadius:'50%',background:tone,flex:'0 0 auto'}} />
                    <span className="wf-grow wf-truncate" style={{fontSize:13}}>{r.label}</span>
                    <span className="mono" style={{fontSize:11,color:'var(--text-subtle)',width:36,textAlign:'right'}}>{r.ago}</span>
                    <span className="mono" style={{fontSize:11,color:'var(--text-muted)',width:42,textAlign:'right'}}>{r.cost}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);

// ---------- Paperless-style queue table ----------
const PaperlessTable = ({ brand }) => (
  <div className="wf-shell">
    <Sidebar brand={brand} nav={PAPERLESS_NAV} />
    <main className="wf-main">
      <header className="wf-topbar">
        <span className="wf-crumb">Paperless</span>
        <IconChevronRight size={12} style={{color:'var(--text-subtle)'}} />
        <h1>Queue</h1>
        <div className="wf-spacer" />
        <button className="wf-btn ghost"><IconSearch size={14} /> Filter</button>
        <button className="wf-btn primary"><IconCheck size={14} /> Triage all (44)</button>
      </header>

      <div className="wf-content" style={{gap:14}}>
        {/* Filter chips */}
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          {['All · 192','Needs review · 44','Auto · 145','Errors · 3'].map((c,i)=>(
            <span key={i} className="wf-badge" style={i===1?{background:'var(--accent-soft, var(--surface-raised))',color:'var(--accent)',borderColor:'transparent'}:{}}>{c}</span>
          ))}
          <div className="wf-spacer" />
          <span className="mono" style={{fontSize:11,color:'var(--text-subtle)'}}>showing 1–12 of 192</span>
        </div>

        <div className="wf-card" style={{padding:0,overflow:'hidden',flex:1,display:'flex',flexDirection:'column',minHeight:0}}>
          <table className="wf-table">
            <thead>
              <tr>
                <th style={{width:40}}>&nbsp;</th>
                <th style={{width:80}}>ID</th>
                <th>Document</th>
                <th style={{width:140}}>Received</th>
                <th style={{width:120}}>Status</th>
                <th style={{width:90,textAlign:'right'}}>Confidence</th>
                <th style={{width:60}}></th>
              </tr>
            </thead>
            <tbody>
              {PAPERLESS_QUEUE.map((row,i) => {
                const status = row.kind === 'review' ? { label: 'NEEDS REVIEW', tone: 'warn' }
                  : row.kind === 'error' ? { label: 'ERROR', tone: 'err' }
                  : { label: 'AUTO',  tone: 'ok' };
                return (
                  <tr key={i}>
                    <td><input type="checkbox" style={{accentColor:'var(--accent)'}} /></td>
                    <td className="id">#{row.id}</td>
                    <td><span style={{color:'var(--text)'}}>{row.doc}</span></td>
                    <td className="ts">{row.when}</td>
                    <td><span className={'wf-badge ' + status.tone}><span className="dot" />{status.label}</span></td>
                    <td className="mono tnum" style={{textAlign:'right',color: row.conf === null ? 'var(--danger)' : row.conf < 80 ? 'var(--warning)' : 'var(--text-muted)'}}>
                      {row.conf === null ? '—' : row.conf + '%'}
                    </td>
                    <td><IconChevronRight size={14} style={{color:'var(--text-subtle)'}} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{borderTop:'1px solid var(--border)',padding:'10px 14px',display:'flex',alignItems:'center',gap:10,background:'var(--surface)'}}>
            <span className="mono" style={{fontSize:11,color:'var(--text-subtle)'}}>Page 1 of 16</span>
            <div className="wf-spacer" />
            <button className="wf-btn ghost">‹ Prev</button>
            <button className="wf-btn">Next ›</button>
          </div>
        </div>
      </div>
    </main>
  </div>
);

// ---------- Mobile dashboard ----------
const MobileDashboard = ({ brand, appName = 'Sentinel' }) => (
  <div className="wf-phone">
    <div className="wf-phone-status">
      <span>9:41</span>
      <span className="wf-status-right">
        <IconWifi size={14} />
        <IconBattery size={16} />
      </span>
    </div>
    <div className="wf-phone-top">
      <div className="wf-phone-brand">{brand}</div>
      <button className="wf-btn ghost" style={{padding:'8px 10px',minHeight:44,minWidth:44}}><IconSearch size={18} /></button>
    </div>
    <div className="wf-phone-content">
      <div>
        <div className="upper mono" style={{color:'var(--text-subtle)',marginBottom:6}}>STATUS</div>
        <div className="wf-card" style={{padding:'16px 16px'}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
            <span style={{width:9,height:9,borderRadius:'50%',background:'var(--success)',boxShadow:'0 0 0 5px color-mix(in srgb,var(--success) 18%,transparent)'}} />
            <span style={{fontSize:17,fontWeight:600}}>All systems healthy</span>
          </div>
          <div className="mono" style={{fontSize:12,color:'var(--text-muted)'}}>$3.83 spent today · 15% of budget</div>
          <div className="wf-progress" style={{marginTop:12}}><span style={{width:'15%'}} /></div>
        </div>
      </div>

      <div>
        <div className="upper mono" style={{color:'var(--text-subtle)',marginBottom:6}}>TODAY</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <div className="wf-card" style={{padding:'14px 14px'}}>
            <div className="mono" style={{fontSize:22,fontWeight:500}}>0<span style={{color:'var(--text-subtle)',fontSize:14}}>/1</span></div>
            <div className="upper mono" style={{color:'var(--text-subtle)',marginTop:2}}>INCIDENTS</div>
          </div>
          <div className="wf-card" style={{padding:'14px 14px'}}>
            <div className="mono" style={{fontSize:22,fontWeight:500,color:'var(--accent)'}}>2</div>
            <div className="upper mono" style={{color:'var(--text-subtle)',marginTop:2}}>JOBS</div>
          </div>
        </div>
      </div>

      <div style={{flex:1,minHeight:0,overflow:'hidden'}}>
        <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',marginBottom:6}}>
          <div className="upper mono" style={{color:'var(--text-subtle)'}}>RECENT</div>
          <span className="wf-accent" style={{fontSize:12}}>view all →</span>
        </div>
        <div className="wf-card" style={{padding:'4px 14px'}}>
          {SENTINEL_ACTIVITY.slice(0,5).map((r,i)=> {
            const tone = r.kind === 'success' ? 'var(--success)' : r.kind === 'warn' ? 'var(--warning)' : 'var(--info)';
            return (
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'12px 0',borderBottom:i<4?'1px solid var(--border)':'none',minHeight:44}}>
                <span style={{width:7,height:7,borderRadius:'50%',background:tone,flex:'0 0 auto'}} />
                <span className="wf-grow wf-truncate" style={{fontSize:14}}>{r.label}</span>
                <span className="mono" style={{fontSize:11,color:'var(--text-subtle)'}}>{r.ago}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    <nav className="wf-phone-tabbar">
      <a className="wf-tab active"><IconHome size={22} /><span>Home</span></a>
      <a className="wf-tab"><IconBell size={22} /><span>Events</span></a>
      <a className="wf-tab"><IconActivity size={22} /><span>Activity</span></a>
      <a className="wf-tab"><IconSettings size={22} /><span>More</span></a>
    </nav>
  </div>
);

// ---------- Mobile detail / form ----------
const MobileDetail = ({ brand }) => (
  <div className="wf-phone">
    <div className="wf-phone-status">
      <span>9:41</span>
      <span className="wf-status-right">
        <IconWifi size={14} />
        <IconBattery size={16} />
      </span>
    </div>
    <div className="wf-phone-top">
      <button className="wf-btn ghost" style={{padding:'8px 10px',minHeight:44,minWidth:44,marginLeft:-8}}>
        <IconChevronRight size={18} style={{transform:'rotate(180deg)'}} />
      </button>
      <div style={{flex:1,textAlign:'center'}}>
        <div className="upper mono" style={{color:'var(--text-subtle)'}}>QUEUE</div>
        <div style={{fontSize:15,fontWeight:600,marginTop:2}}>#207 Review</div>
      </div>
      <button className="wf-btn ghost" style={{padding:'8px 10px',minHeight:44,minWidth:44}}><IconFile size={18} /></button>
    </div>
    <div className="wf-phone-content" style={{paddingBottom:0}}>
      <div className="wf-card" style={{padding:16}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
          <span className="wf-badge warn"><span className="dot" />NEEDS REVIEW</span>
          <span className="mono" style={{fontSize:11,color:'var(--text-subtle)'}}>64% confidence</span>
        </div>
        <div style={{fontSize:18,fontWeight:600,letterSpacing:'-0.01em',marginBottom:4,lineHeight:1.25}}>Rivian Motor Vehicle Purchase Agreement</div>
        <div className="mono" style={{fontSize:12,color:'var(--text-muted)'}}>Received 2026-05-04 · Scott Wright</div>
      </div>

      <div>
        <div className="upper mono" style={{color:'var(--text-subtle)',marginBottom:6}}>EXTRACTED</div>
        <div className="wf-card" style={{padding:'4px 14px'}}>
          {[
            ['Document type', 'Vehicle purchase agreement'],
            ['Vendor',        'Rivian Automotive'],
            ['Total',         '$74,820.00'],
            ['Date',          'May 4, 2026'],
            ['VIN',           '7FCRGAAA8RN012345'],
          ].map(([k,v],i)=> (
            <div key={i} style={{display:'flex',justifyContent:'space-between',gap:14,padding:'12px 0',borderBottom:i<4?'1px solid var(--border)':'none',minHeight:44,alignItems:'center'}}>
              <span className="upper mono" style={{color:'var(--text-subtle)',width:'40%'}}>{k}</span>
              <span style={{fontSize:14,textAlign:'right'}} className={k==='Total'?'mono tnum':''}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="upper mono" style={{color:'var(--text-subtle)',marginBottom:6}}>TAGS</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
          {['vehicle','rivian','2026','>$50k','registration-pending'].map((t,i)=>(
            <span key={i} className="wf-badge">{t}</span>
          ))}
          <span className="wf-badge" style={{borderStyle:'dashed',color:'var(--text-subtle)'}}>+ add</span>
        </div>
      </div>
    </div>
    <div style={{padding:'12px 16px 28px',borderTop:'1px solid var(--border)',background:'var(--surface)',display:'flex',gap:8}}>
      <button className="wf-btn" style={{flex:1,justifyContent:'center',minHeight:48,fontSize:14}}>Re-queue</button>
      <button className="wf-btn primary" style={{flex:2,justifyContent:'center',minHeight:48,fontSize:14}}>
        <IconCheck size={16} /> Approve & file
      </button>
    </div>
  </div>
);

// ---------- Brand / tokens reference card ----------
const TokensCard = ({ title, blurb, brand, swatches, types }) => (
  <div className="wf-tokens">
    <div>
      <div style={{marginBottom:22}}>{brand}</div>
      <h2>{title}</h2>
      <p className="lede" style={{marginTop:4}}>{blurb}</p>

      <div style={{marginTop:24}}>
        <h3 style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--text-subtle)',marginBottom:10,fontWeight:500}}>Palette</h3>
        <div className="wf-swatch-grid">
          {swatches.map((s,i)=>(
            <div key={i} className="wf-swatch" style={{background:s.bg,color:s.fg||'var(--text)'}}>
              <div className="name">{s.name}</div>
              <div className="hex">{s.bg}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{marginTop:24,display:'flex',gap:10,flexWrap:'wrap'}}>
        <span className="wf-badge ok"><span className="dot" />OK</span>
        <span className="wf-badge warn"><span className="dot" />WARN</span>
        <span className="wf-badge err"><span className="dot" />ERR</span>
        <span className="wf-badge info"><span className="dot" />INFO</span>
        <span className="wf-badge accent"><span className="dot" />ACCENT</span>
        <button className="wf-btn">Secondary</button>
        <button className="wf-btn primary">Primary action</button>
      </div>
    </div>

    <div className="wf-typespec">
      <h3>Typography</h3>
      {types.map((t,i)=>(
        <div key={i} className="sample">
          <div className="sample-label">{t.label}</div>
          <div style={{font: t.font, color:'var(--text)', letterSpacing: t.tracking || 'normal'}}>{t.text}</div>
          <div className="mono" style={{fontSize:10,color:'var(--text-subtle)',marginTop:6}}>{t.note}</div>
        </div>
      ))}
    </div>
  </div>
);

Object.assign(window, {
  SentinelDashboard, PaperlessTable, MobileDashboard, MobileDetail,
  TokensCard, Sidebar,
  SENTINEL_NAV, PAPERLESS_NAV, SENTINEL_ACTIVITY, PAPERLESS_QUEUE,
});
