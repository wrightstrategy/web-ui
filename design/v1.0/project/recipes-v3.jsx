// Wright UI System · Batch B recipes
// Login (default + error + mobile) · Auth stub conventions
// Mobile triage queue (scan-router) · Async / job status (Sentinel briefing)

// ============================================================
// 1) LOGIN — centered card. Default + error variants share most code.
// ============================================================
const LoginCard = ({ sub = 'Sentinel', error }) => (
  <div style={{
    maxWidth: 400, width: '100%',
    background: 'var(--surface-raised)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '36px 30px 28px',
    display: 'flex', flexDirection: 'column', gap: 18,
    boxShadow: '0 24px 60px rgba(0,0,0,.35), 0 1px 2px rgba(0,0,0,.2)',
  }}>
    <div style={{textAlign:'center'}}>
      <span style={{color:'var(--accent)',display:'inline-flex'}}>
        <MarkStencilBar size={56} />
      </span>
      <div className="mono" style={{fontSize:10,letterSpacing:'0.22em',color:'var(--text-subtle)',marginTop:18}}>WRIGHT FAMILY</div>
      <div style={{fontSize:19,fontWeight:600,letterSpacing:'-0.01em',marginTop:4}}>Sign in to {sub}</div>
    </div>

    {error && (
      <div style={{
        padding:'10px 12px',
        background:'color-mix(in srgb, var(--danger) 12%, var(--surface))',
        border:'1px solid var(--danger)',
        borderRadius:'var(--radius-sm)',
        display:'flex',alignItems:'flex-start',gap:8,fontSize:12.5,
      }}>
        <span style={{color:'var(--danger)',marginTop:1}}><IconAlert size={14} /></span>
        <div>
          <div style={{fontWeight:600,color:'var(--text)'}}>Sign-in failed</div>
          <div style={{color:'var(--text-muted)',marginTop:2}}>Email or password didn't match. 2 attempts remaining.</div>
        </div>
      </div>
    )}

    <div className="wf-field">
      <label className="wf-field-label">Email</label>
      <input className="wf-input" defaultValue="scott@wrightfamily.org" style={{minHeight:44}} />
    </div>
    <div className="wf-field">
      <label className="wf-field-label">Password</label>
      <input className={'wf-input' + (error ? ' err' : '')} type="password" defaultValue="••••••••••" style={{minHeight:44}} />
    </div>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:-4}}>
      <span className="wf-check on" style={{fontSize:13}}><span className="box"><IconCheck size={11} /></span> Remember me</span>
      <a className="wf-accent" style={{fontSize:12}}>Forgot?</a>
    </div>
    <button className="wf-btn primary" style={{minHeight:44,justifyContent:'center',fontSize:14}}>
      Sign in
    </button>
    <div style={{display:'flex',alignItems:'center',gap:10,color:'var(--text-subtle)'}}>
      <div className="wf-grow" style={{height:1,background:'var(--border)'}} />
      <span className="mono" style={{fontSize:10,letterSpacing:'0.16em'}}>OR</span>
      <div className="wf-grow" style={{height:1,background:'var(--border)'}} />
    </div>
    <button className="wf-btn" style={{minHeight:44,justifyContent:'center',fontSize:14}}>
      <span style={{color:'var(--text-subtle)'}}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v6c0 5.5 4.3 9.8 10 11 5.7-1.2 10-5.5 10-11V7l-10-5z" /></svg>
      </span>
      Continue with Tailscale SSO
    </button>
  </div>
);

const LoginPage = ({ error = false }) => (
  <div style={{
    width:'100%',height:'100%',position:'relative',
    background:'var(--bg)',
    display:'flex',alignItems:'center',justifyContent:'center',
    padding:'40px 20px',
    backgroundImage:`radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--accent) 7%, transparent), transparent 50%),
                      radial-gradient(circle at 80% 80%, color-mix(in srgb, var(--info) 6%, transparent), transparent 55%)`,
  }}>
    <LoginCard sub="Sentinel" error={error} />
    <div style={{position:'absolute',bottom:22,left:0,right:0,textAlign:'center'}}>
      <div className="mono" style={{fontSize:10,letterSpacing:'0.18em',color:'var(--text-subtle)'}}>WRIGHTFAMILY.ORG · sentinel · v0.1</div>
    </div>
  </div>
);

const MobileLogin = () => (
  <div className="wf-phone" style={{
    backgroundImage:`radial-gradient(circle at 20% 10%, color-mix(in srgb, var(--accent) 8%, transparent), transparent 55%)`,
  }}>
    <div className="wf-phone-status">
      <span>9:41</span>
      <span className="wf-status-right"><IconWifi size={14} /><IconBattery size={16} /></span>
    </div>
    <div style={{flex:1,display:'flex',flexDirection:'column',padding:'24px 20px',gap:18,justifyContent:'center'}}>
      <div style={{textAlign:'center'}}>
        <span style={{color:'var(--accent)',display:'inline-flex'}}>
          <MarkStencilBar size={64} />
        </span>
        <div className="mono" style={{fontSize:10,letterSpacing:'0.22em',color:'var(--text-subtle)',marginTop:18}}>WRIGHT FAMILY</div>
        <div style={{fontSize:22,fontWeight:600,letterSpacing:'-0.01em',marginTop:4}}>Sign in to Sentinel</div>
      </div>
      <div className="wf-field">
        <label className="wf-field-label">Email</label>
        <input className="wf-input" type="email" defaultValue="scott@wrightfamily.org" style={{minHeight:48}} />
      </div>
      <div className="wf-field">
        <label className="wf-field-label">Password</label>
        <input className="wf-input" type="password" defaultValue="••••••••••" style={{minHeight:48}} />
      </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:-4}}>
        <span className="wf-check on"><span className="box"><IconCheck size={11} /></span> Remember me</span>
        <a className="wf-accent" style={{fontSize:13}}>Forgot?</a>
      </div>
      <button className="wf-btn primary" style={{minHeight:50,justifyContent:'center',fontSize:15,marginTop:4}}>
        Sign in
      </button>
      <div style={{display:'flex',alignItems:'center',gap:10,color:'var(--text-subtle)'}}>
        <div className="wf-grow" style={{height:1,background:'var(--border)'}} />
        <span className="mono" style={{fontSize:10,letterSpacing:'0.16em'}}>OR</span>
        <div className="wf-grow" style={{height:1,background:'var(--border)'}} />
      </div>
      <button className="wf-btn" style={{minHeight:50,justifyContent:'center',fontSize:14}}>
        Continue with Tailscale SSO
      </button>
    </div>
    <div style={{padding:'12px 20px 28px',textAlign:'center'}}>
      <div className="mono" style={{fontSize:10,letterSpacing:'0.18em',color:'var(--text-subtle)'}}>WRIGHTFAMILY.ORG · v0.1</div>
    </div>
  </div>
);

// ============================================================
// 2) AUTH STUB CONVENTIONS — spec card explaining what the kit ships.
// ============================================================
const CodeBlock = ({ children }) => (
  <pre style={{
    margin: 0,
    padding: '12px 14px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-mono)',
    fontSize: 11.5,
    lineHeight: 1.55,
    color: 'var(--text)',
    overflow: 'auto',
    whiteSpace: 'pre',
  }}>{children}</pre>
);

const AuthConventions = () => (
  <div className="wf-spec wf-root theme-frontier" style={{overflow:'auto'}}>
    <div>
      <div className="upper mono" style={{color:'var(--text-subtle)'}}>AUTH · 06b</div>
      <div className="wf-spec-title" style={{marginTop:4}}>Auth stub conventions</div>
      <div className="wf-spec-blurb" style={{marginTop:6}}>
        Per the strategy doc, the kit ships conventions, not infrastructure. Real identity lives
        in the future homepage/SSO project; these patterns let apps slot in cleanly when it lands.
      </div>
    </div>

    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
      {/* Cookie shape */}
      <div>
        <h3>Session cookie</h3>
        <CodeBlock>{`Name:    wf_session
Expires: rolling 7 days
SameSite: Lax
Secure:  true
HttpOnly: true

Payload (signed JWT):
  sub      "user-id"           // wright-family user id
  email    "scott@wrightfamily.org"
  apps     ["sentinel","paperless"]
  iat / exp / nbf`}</CodeBlock>
      </div>

      {/* requireSession helper */}
      <div>
        <h3>requireSession()</h3>
        <CodeBlock>{`// +layout.server.ts
import { requireSession } from '@wright/ui/auth';

export const load = async (event) => {
  const session = await requireSession(event);
  // \u2192 throws redirect to /login on miss
  return { user: session.user };
};`}</CodeBlock>
      </div>

      {/* Redirect helpers */}
      <div>
        <h3>Redirect helpers</h3>
        <CodeBlock>{`redirectToLogin(event, returnTo?)
  // \u2192 sets ?next=<encoded path>, returns 303

redirectAfterLogin(event)
  // \u2192 reads ?next, falls back to /

logoutAndRedirect(event)
  // \u2192 clears cookie, redirects to /login`}</CodeBlock>
      </div>

      {/* Login layout convention */}
      <div>
        <h3>Login layout</h3>
        <CodeBlock>{`routes/login/+page.svelte
  <Suspense fallback={<Skeleton />}>
    <LoginCard
      app="Sentinel"
      onSubmit={form}
      ssoProvider="tailscale"
    />
  </Suspense>

Components opt out of AppShell on this
route via <slot name="bare-layout" />.`}</CodeBlock>
      </div>
    </div>

    <div style={{padding:'14px 16px',background:'var(--accent-soft)',borderRadius:'var(--radius-md)',color:'var(--accent)',fontSize:12.5,lineHeight:1.5,marginTop:8}}>
      <span style={{fontWeight:600}}>Stub, not infra:</span> the kit doesn't ship password hashing, OAuth flows,
      session storage, or IdP integration. When the homepage SSO project lands, apps swap
      <span className="mono"> requireSession()</span> over without changing layouts.
    </div>
  </div>
);

// ============================================================
// 3) MOBILE TRIAGE QUEUE (scan-router)
// ============================================================
const TRIAGE_DOCS = [
  { id: 318, title: 'HEB Grocery Receipt',         src: 'Camera · 2:43 PM',  conf: 96, tags: ['receipt','food'],    status: 'auto' },
  { id: 317, title: 'Cap Metro Parking Stub',      src: 'Camera · 2:41 PM',  conf: 84, tags: ['vehicle','austin'],  status: 'review' },
  { id: 316, title: 'Round Rock ISD Permission Slip', src: 'Camera · 2:29 PM', conf: 67, tags: ['school','kids'],  status: 'review' },
  { id: 315, title: 'Frost Bank ATM Slip',         src: 'Camera · 11:08 AM', conf: 92, tags: ['banking'],           status: 'auto' },
  { id: 314, title: 'Veterinary Invoice — Cooper', src: 'Camera · 10:14 AM', conf: 58, tags: ['pets','medical'],    status: 'review' },
];

const TriageCard = ({ doc, swiped }) => (
  <div style={{
    position:'relative',
    borderRadius:'var(--radius-md)',
    border:'1px solid var(--border)',
    overflow:'hidden',
    background:'var(--surface-raised)',
  }}>
    {/* Swipe-revealed action */}
    {swiped && (
      <div style={{
        position:'absolute',inset:0,
        background:'var(--success)',
        display:'flex',alignItems:'center',justifyContent:'flex-end',
        padding:'0 22px',color:'#0e1521',
      }}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
          <IconCheck size={24} />
          <span className="mono" style={{fontSize:11,fontWeight:600,letterSpacing:'0.06em'}}>FILE</span>
        </div>
      </div>
    )}
    {/* The card itself, translated if mid-swipe */}
    <div style={{
      position:'relative',
      background:'var(--surface-raised)',
      padding:'12px',
      display:'flex',gap:12,
      transform: swiped ? 'translateX(-30%)' : 'none',
      transition: 'transform .25s ease',
      minHeight:88,
    }}>
      {/* Doc thumb */}
      <div style={{
        width:64,height:64,
        background:`repeating-linear-gradient(135deg, var(--surface) 0 6px, var(--surface-raised) 6px 7px)`,
        border:'1px solid var(--border)',
        borderRadius:'var(--radius-sm)',
        flex:'0 0 auto',
        display:'flex',alignItems:'center',justifyContent:'center',
      }}>
        <IconFile size={22} style={{color:'var(--text-subtle)'}} />
      </div>
      <div className="wf-grow" style={{minWidth:0,display:'flex',flexDirection:'column',gap:4}}>
        <div style={{fontSize:14,fontWeight:600,color:'var(--text)',lineHeight:1.25}}>{doc.title}</div>
        <div className="mono" style={{fontSize:11,color:'var(--text-subtle)'}}>{doc.src} · #{doc.id}</div>
        <div style={{display:'flex',alignItems:'center',gap:6,marginTop:4,flexWrap:'wrap'}}>
          {doc.status === 'review'
            ? <span className="wf-badge warn"><span className="dot" />REVIEW</span>
            : <span className="wf-badge ok"><span className="dot" />AUTO</span>}
          <span className={'mono ' + (doc.conf < 70 ? 'wf-warning' : 'wf-muted')} style={{fontSize:11}}>{doc.conf}%</span>
          {doc.tags.slice(0,1).map((t,i)=>(
            <span key={i} className="wf-badge" style={{fontSize:10,padding:'1px 6px'}}>{t}</span>
          ))}
        </div>
      </div>
      <IconChevronRight size={16} style={{color:'var(--text-subtle)',alignSelf:'center',flex:'0 0 auto'}} />
    </div>
  </div>
);

const MobileTriage = ({ brand }) => (
  <div className="wf-phone">
    <div className="wf-phone-status">
      <span>9:41</span>
      <span className="wf-status-right"><IconWifi size={14} /><IconBattery size={16} /></span>
    </div>
    <div className="wf-phone-top">
      <div className="wf-phone-brand">{brand}</div>
      <button className="wf-btn ghost" style={{padding:'8px 10px',minHeight:44,minWidth:44}}><IconPlus size={18} /></button>
    </div>

    <div style={{padding:'12px 20px 6px',display:'flex',alignItems:'baseline',justifyContent:'space-between'}}>
      <h1 style={{fontSize:22,fontWeight:600,letterSpacing:'-0.015em'}}>Triage</h1>
      <span className="mono" style={{fontSize:11,color:'var(--text-subtle)'}}>14 PENDING · 3 REVIEW</span>
    </div>

    {/* Filter chips */}
    <div style={{padding:'0 20px 14px',display:'flex',gap:6,overflowX:'auto'}}>
      {[
        { l: 'All',    n: 14, on: true },
        { l: 'Review', n: 3 },
        { l: 'Today',  n: 8 },
        { l: 'Auto',   n: 11 },
      ].map((c,i)=>(
        <span key={i} className="wf-badge" style={c.on?{
          background:'var(--accent-soft)',color:'var(--accent)',borderColor:'transparent',
          padding:'4px 10px',fontSize:11,
        }:{padding:'4px 10px',fontSize:11}}>
          {c.l} <span style={{opacity:.6,marginLeft:4}}>{c.n}</span>
        </span>
      ))}
    </div>

    <div style={{flex:1,overflow:'auto',padding:'0 20px',display:'flex',flexDirection:'column',gap:10}}>
      {TRIAGE_DOCS.map((d, i) => (
        <TriageCard key={d.id} doc={d} swiped={i === 1} />
      ))}
      {/* Hint */}
      <div style={{textAlign:'center',padding:'18px 0',color:'var(--text-subtle)'}}>
        <div className="mono" style={{fontSize:10,letterSpacing:'0.16em'}}>SWIPE LEFT TO FILE · RIGHT TO RE-QUEUE</div>
      </div>
    </div>

    <div style={{padding:'12px 16px 28px',borderTop:'1px solid var(--border)',background:'var(--surface)',display:'flex',gap:8,alignItems:'center'}}>
      <span className="mono" style={{fontSize:11,color:'var(--text-subtle)'}}>11 ready</span>
      <div className="wf-spacer" />
      <button className="wf-btn" style={{minHeight:44,fontSize:13}}>Skip all</button>
      <button className="wf-btn primary" style={{minHeight:44,fontSize:13}}>
        <IconCheck size={14} /> Triage 11 auto
      </button>
    </div>
  </div>
);

// ============================================================
// 4) ASYNC / JOB STATUS  ·  Sentinel briefing job
// ============================================================
const SENTINEL_JOB_NAV = [
  { sect: 'Monitoring', items: [
    { icon: IconGauge,    label: 'Overview' },
    { icon: IconBell,     label: 'Events' },
    { icon: IconActivity, label: 'Activity' },
  ]},
  { sect: 'Operations', items: [
    { icon: IconBrain,    label: 'Memory' },
    { icon: IconJobs,     label: 'Operations', active: true },
  ]},
  { sect: 'System', items: [
    { icon: IconSettings, label: 'Settings' },
  ]},
];

const AsyncJobPage = ({ brand }) => (
  <div className="wf-shell">
    <Sidebar brand={brand} nav={SENTINEL_JOB_NAV} />
    <main className="wf-main">
      <header className="wf-topbar">
        <span className="wf-crumb">Sentinel</span>
        <IconChevronRight size={12} style={{color:'var(--text-subtle)'}} />
        <span className="wf-crumb">Operations</span>
        <IconChevronRight size={12} style={{color:'var(--text-subtle)'}} />
        <h1>briefing-morning</h1>
        <div className="wf-spacer" />
        <button className="wf-btn ghost"><IconActivity size={14} /> View past runs</button>
        <button className="wf-btn" style={{background:'var(--danger)',color:'var(--accent-on)',borderColor:'transparent'}}>Cancel</button>
      </header>

      <div className="wf-content" style={{gap:18}}>
        {/* Hero progress card */}
        <div className="wf-card" style={{padding:'20px 22px',display:'grid',gridTemplateColumns:'1fr auto',gap:24,alignItems:'center'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
              <span style={{
                width:10,height:10,borderRadius:'50%',background:'var(--info)',
                boxShadow:'0 0 0 5px color-mix(in srgb,var(--info) 18%,transparent)',
                animation:'wfPulse 1.6s ease-in-out infinite',
              }} />
              <span className="wf-badge info"><span className="dot" />RUNNING</span>
              <span className="mono" style={{fontSize:11,color:'var(--text-subtle)'}}>started 2m 14s ago · ETA ~30s</span>
            </div>
            <div style={{fontSize:18,fontWeight:600,color:'var(--text)',marginBottom:8}}>Step 4 of 6 · Generating summary</div>
            <div className="wf-progress" style={{height:8}}><span style={{width:'68%'}} /></div>
            <div style={{display:'flex',gap:18,marginTop:10}} className="mono">
              <div><span style={{color:'var(--text-subtle)',fontSize:10,letterSpacing:'0.08em'}}>ELAPSED</span> <span style={{fontSize:13,color:'var(--text)'}}>2m 14s</span></div>
              <div><span style={{color:'var(--text-subtle)',fontSize:10,letterSpacing:'0.08em'}}>ETA</span> <span style={{fontSize:13,color:'var(--text)'}}>~30s</span></div>
              <div><span style={{color:'var(--text-subtle)',fontSize:10,letterSpacing:'0.08em'}}>COST</span> <span style={{fontSize:13,color:'var(--text)'}}>$0.08</span></div>
              <div><span style={{color:'var(--text-subtle)',fontSize:10,letterSpacing:'0.08em'}}>RUN</span> <span style={{fontSize:13,color:'var(--text)'}}>#1842</span></div>
            </div>
          </div>
          <div style={{textAlign:'right'}}>
            <div className="mono tnum" style={{fontSize:34,fontWeight:500,letterSpacing:'-0.02em',color:'var(--accent)'}}>68<span style={{color:'var(--text-subtle)',fontSize:18}}>%</span></div>
            <div className="upper mono" style={{color:'var(--text-subtle)'}}>COMPLETE</div>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:18,flex:1,minHeight:0,overflow:'hidden'}}>
          {/* Steps */}
          <div className="wf-card" style={{display:'flex',flexDirection:'column',padding:0,overflow:'hidden'}}>
            <div style={{padding:'14px 18px',borderBottom:'1px solid var(--border)'}}>
              <h3 style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--text-subtle)',fontWeight:500}}>Steps</h3>
            </div>
            <div style={{padding:'4px 14px'}}>
              {[
                { state:'done',    label:'Load overnight events',       sub:'1.2s · 23 events'   },
                { state:'done',    label:'Aggregate metrics',           sub:'0.8s · 6 sources'   },
                { state:'done',    label:'Pull weather',                sub:'2.4s · OpenWeather' },
                { state:'running', label:'Generate summary',            sub:'gpt-5-nano · 1m 18s elapsed' },
                { state:'pending', label:'Format output',               sub:'queued' },
                { state:'pending', label:'Deliver to Slack',            sub:'queued · #wright-briefing' },
              ].map((s,i,a)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 4px',borderBottom:i<a.length-1?'1px solid var(--border)':'none'}}>
                  <span style={{flex:'0 0 auto',width:20,height:20,display:'flex',alignItems:'center',justifyContent:'center'}}>
                    {s.state === 'done' && <span style={{width:20,height:20,borderRadius:'50%',background:'var(--success)',display:'flex',alignItems:'center',justifyContent:'center',color:'#0e1521'}}><IconCheck size={12} /></span>}
                    {s.state === 'running' && <span style={{
                      width:18,height:18,borderRadius:'50%',
                      border:'2px solid var(--accent)',borderTopColor:'transparent',
                      animation:'wfSpin 0.9s linear infinite',
                    }} />}
                    {s.state === 'pending' && <span style={{width:14,height:14,borderRadius:'50%',border:'1.5px solid var(--border-strong)'}} />}
                  </span>
                  <div className="wf-grow">
                    <div style={{fontSize:13,fontWeight:500,color: s.state==='pending'?'var(--text-muted)':'var(--text)'}}>{s.label}</div>
                    <div className="mono" style={{fontSize:11,color:'var(--text-subtle)',marginTop:2}}>{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Log tail */}
          <div className="wf-card" style={{display:'flex',flexDirection:'column',padding:0,overflow:'hidden'}}>
            <div style={{padding:'14px 18px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center'}}>
              <h3 style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--text-subtle)',fontWeight:500}}>Log tail · live</h3>
              <div className="wf-spacer" />
              <span className="mono" style={{fontSize:11,color:'var(--text-subtle)'}}>follow ON · last 200 lines</span>
              <span style={{width:6,height:6,borderRadius:'50%',background:'var(--success)',marginLeft:8,animation:'wfPulse 1.6s ease-in-out infinite'}} />
            </div>
            <div style={{
              flex:1,padding:'14px 16px',
              background:'var(--bg)',
              fontFamily:'var(--font-mono)',fontSize:11.5,lineHeight:1.55,
              overflow:'auto',
              borderBottomLeftRadius:'var(--radius-md)',
              borderBottomRightRadius:'var(--radius-md)',
            }}>
              {[
                ['07:00:00.012','INFO',  'briefing.start',           'tz=America/Chicago run=#1842'],
                ['07:00:00.341','INFO',  'events.load',              'last_run=2026-05-13 23:59 events=23'],
                ['07:00:01.504','INFO',  'metrics.aggregate',        'sources=[scraparr,ledger,opnsense] 6 ok'],
                ['07:00:02.318','DEBUG', 'weather.fetch',            'lat=30.27 lon=-97.74 cache=miss'],
                ['07:00:04.722','INFO',  'weather.ok',               'tempC=19 high=98 conditions=mist'],
                ['07:00:04.840','INFO',  'summary.start',            'model=gpt-5-nano tokens_in=4218'],
                ['07:01:14.103','DEBUG', 'summary.partial',          '"Mist 67° this morning, high of 98 \u2014"'],
                ['07:01:42.918','DEBUG', 'summary.partial',          '"...Overnight was quiet except for the ledger..."'],
                ['07:02:08.512','DEBUG', 'summary.partial',          '"...third consecutive alert cycle with the same..."'],
                ['07:02:14.000','INFO',  'summary.streaming',        'tokens_out=312 still_going=true'],
              ].map(([t,lvl,evt,arg],i)=>{
                const lvlColor = lvl === 'INFO' ? 'var(--info)' : lvl === 'DEBUG' ? 'var(--text-subtle)' : lvl === 'WARN' ? 'var(--warning)' : 'var(--danger)';
                return (
                  <div key={i} style={{whiteSpace:'pre',color:'var(--text-muted)'}}>
                    <span style={{color:'var(--text-subtle)'}}>{t}</span>{'  '}
                    <span style={{color:lvlColor,fontWeight:500}}>{lvl.padEnd(5)}</span>{'  '}
                    <span style={{color:'var(--text)'}}>{evt}</span>{'  '}
                    <span>{arg}</span>
                  </div>
                );
              })}
              <div style={{color:'var(--accent)',marginTop:6}}>▍</div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <style>{`
      @keyframes wfPulse {
        0%,100% { opacity: 1; }
        50%     { opacity: 0.55; }
      }
    `}</style>
  </div>
);

Object.assign(window, {
  LoginCard, LoginPage, MobileLogin, AuthConventions,
  MobileTriage, AsyncJobPage, TRIAGE_DOCS, SENTINEL_JOB_NAV,
});
