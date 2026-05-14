// Wright UI System · Handoff & remaining visuals
// HandoffCard · MarkAssetsBoard · 2× email · 2× splash

// ============================================================
// HANDOFF CARD — concise on-canvas mirror of HANDOFF.md
// ============================================================
const HandoffCard = () => (
  <div className="wf-spec wf-root theme-frontier" style={{overflow:'auto'}}>
    <div>
      <div className="upper mono" style={{color:'var(--text-subtle)'}}>HANDOFF · 09a</div>
      <div className="wf-spec-title" style={{marginTop:4}}>Start here · Claude Code</div>
      <div className="wf-spec-blurb" style={{marginTop:6}}>
        Full handoff doc lives at <span className="mono">HANDOFF.md</span>. This card is the
        2-minute version. Build in 6 steps; the throwaway proof app validates the slice.
      </div>
    </div>

    <div style={{display:'grid',gridTemplateColumns:'1.1fr 1fr',gap:24}}>
      {/* Left — file tree + paste */}
      <div>
        <h3>Scaffold target</h3>
        <CodeBlock>{`web-ui/
\u251c\u2500\u2500 packages/
\u2502   \u251c\u2500\u2500 ui/                          @wright/ui
\u2502   \u2502   \u2514\u2500\u2500 src/lib/
\u2502   \u2502       \u251c\u2500\u2500 theme/
\u2502   \u2502       \u2502   \u251c\u2500\u2500 tokens.css       \u2190 /tokens.css
\u2502   \u2502       \u2502   \u251c\u2500\u2500 styles.css       \u2190 split from base.css
\u2502   \u2502       \u2502   \u2514\u2500\u2500 tailwind-preset.js
\u2502   \u2502       \u251c\u2500\u2500 components/          13 \u00d7 .svelte
\u2502   \u2502       \u251c\u2500\u2500 layout/              AppShell, PageHeader
\u2502   \u2502       \u251c\u2500\u2500 brand/               \u2190 /assets/marks
\u2502   \u2502       \u2514\u2500\u2500 icons/               Lucide re-exports
\u2502   \u2514\u2500\u2500 create-app/                  bun create @wright/app
\u251c\u2500\u2500 templates/app/                   reference SvelteKit app
\u251c\u2500\u2500 skills/                          3 markdown skills
\u2514\u2500\u2500 docs/`}</CodeBlock>

        <h3 style={{marginTop:18}}>Build order</h3>
        <ul style={{display:'flex',flexDirection:'column',gap:8,fontSize:13}}>
          {[
            ['1', 'packages/ui skeleton + tokens.css + styles.css'],
            ['2', '13 components in Svelte 5 — Button \u2192 Card \u2192 Input \u2192 FormField \u2192 \u2026'],
            ['3', '7 page recipes in templates/app (matches the canvas)'],
            ['4', 'packages/create-app scaffolder'],
            ['5', 'Skills · homelab-web-ui / -backend-bridge / -component-add'],
            ['6', 'Throwaway proof app \u2192 pass mobile smoke check'],
          ].map(([n,t],i)=>(
            <li key={i} style={{display:'flex',gap:10}}>
              <span className="mono" style={{color:'var(--accent)',fontWeight:600,minWidth:18}}>{n}.</span>
              <span style={{color:'var(--text)'}}>{t}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right — recipe map + smoke */}
      <div>
        <h3>Recipe \u2192 route map</h3>
        <div className="wf-card" style={{padding:0,overflow:'hidden'}}>
          <table className="wf-table" style={{fontSize:12}}>
            <thead><tr><th>Route</th><th>Artboard</th><th style={{textAlign:'right'}}>Render</th></tr></thead>
            <tbody>
              {[
                ['/+page.svelte',                    'sentinel',       'default'],
                ['/queue/+page.svelte',              'paperless',      'csr=false'],
                ['/queue/[id]/+page.svelte',         'detail',         'default'],
                ['/queue/[id]/edit/+page.svelte',    'edit',           'default'],
                ['/settings/+page.svelte',           'settings',       'default'],
                ['/operations/[id]/+page.svelte',    'async',          'default'],
                ['/login/+page.svelte',              'login',          'csr=false'],
                ['/triage/+page.svelte',             'mobile-triage',  'default'],
              ].map(([r,a,m],i)=>(
                <tr key={i}>
                  <td className="mono" style={{fontSize:11}}>{r}</td>
                  <td className="mono" style={{fontSize:11,color:'var(--accent)'}}>#{a}</td>
                  <td className="mono" style={{fontSize:11,color:'var(--text-subtle)',textAlign:'right'}}>{m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 style={{marginTop:18}}>Smoke-test checklist</h3>
        <ul style={{display:'flex',flexDirection:'column',gap:6,fontSize:12.5,color:'var(--text-muted)',lineHeight:1.5}}>
          {[
            '375px width, no horizontal scroll',
            'All interactive controls \u2265 44 \u00d7 44',
            'Tab order shows the 3px brick focus ring',
            'data-theme toggle dark \u2194 light without flash',
            'csr=false table works with JS disabled',
            'View Transitions animate route changes',
            'prefers-reduced-motion disables all transitions',
            'No unresolved var(--*) in DevTools',
          ].map((t,i)=>(
            <li key={i} style={{display:'flex',gap:8}}>
              <span style={{width:13,height:13,borderRadius:3,border:'1.5px solid var(--border-strong)',flex:'0 0 auto',marginTop:2}} />
              <span>{t}</span>
            </li>
          ))}
        </ul>

        <div style={{marginTop:14,padding:'12px 14px',background:'var(--accent-soft)',color:'var(--accent)',borderRadius:'var(--radius-md)',fontSize:12.5,lineHeight:1.5}}>
          <span style={{fontWeight:600}}>The canvas is the spec.</span> Don't translate JSX
          mechanically \u2014 re-author each component natively in Svelte 5 with matching DOM
          shape and class names. JSX files are visual reference only.
        </div>
      </div>
    </div>
  </div>
);

// ============================================================
// MARK ASSETS BOARD — show the 19 SVG files that ship
// ============================================================
const MarkAssets = () => (
  <div className="wf-spec wf-root theme-frontier" style={{overflow:'auto'}}>
    <div>
      <div className="upper mono" style={{color:'var(--text-subtle)'}}>ASSETS · 09b</div>
      <div className="wf-spec-title" style={{marginTop:4}}>Mark exports</div>
      <div className="wf-spec-blurb" style={{marginTop:6}}>
        19 standalone <span className="mono">.svg</span> files in this project under
        <span className="mono"> /assets/</span>. All use <span className="mono">currentColor</span> where
        appropriate so apps can recolour via CSS, and ship paired brick-on-bone fixed-color
        versions for surfaces that can't supply a colour.
      </div>
    </div>

    <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:24}}>
      {/* Visual grid */}
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        <div>
          <h3>Base marks · currentColor</h3>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5, 1fr)',gap:8}}>
            {['Wright','Sentinel','Paperless','Higgins','Scan-router'].map((n, i)=>(
              <div key={i} style={{padding:'18px 12px',background:'var(--surface-raised)',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                <span style={{color:'var(--accent)'}}><MarkLetter letter={'WSPHR'[i]} size={48} /></span>
                <span className="mono" style={{fontSize:10,color:'var(--text-subtle)'}}>{n.toLowerCase().replace(' ','-')}.svg</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3>App icons · 1024px on brick</h3>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5, 1fr)',gap:8}}>
            {['W','S','P','H','R'].map((L, i)=>(
              <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                <div style={{width:'100%',aspectRatio:'1/1',background:'#c24b3a',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',color:'#f2ece0',boxShadow:'0 4px 14px rgba(0,0,0,.4)'}}>
                  <MarkLetter letter={L} size={60} />
                </div>
                <span className="mono" style={{fontSize:10,color:'var(--text-subtle)',textAlign:'center'}}>{('whprs'[i] === 'w' ? 'wright' : ['sentinel','paperless','higgins','scan-router'][i-1] || 'wright')}-1024.svg</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3>Social · 1200 \u00d7 630</h3>
          <div style={{aspectRatio:'1200/630',background:'#181d27',borderRadius:'var(--radius-md)',padding:'42px 50px',position:'relative',overflow:'hidden'}}>
            <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 20% 20%, rgba(194,75,58,0.18), transparent 55%)'}} />
            <div style={{position:'relative',display:'flex',alignItems:'center',height:'100%',gap:50}}>
              <span style={{color:'var(--accent)'}}><MarkLetter letter="W" size={200} /></span>
              <div>
                <div className="mono" style={{fontSize:13,letterSpacing:'0.2em',color:'var(--text-muted)'}}>WRIGHT FAMILY</div>
                <div style={{fontSize:46,fontWeight:600,letterSpacing:'-0.015em',color:'var(--text)',marginTop:6}}>Sentinel</div>
                <div style={{width:60,height:3,background:'var(--accent)',marginTop:14}} />
                <div style={{fontSize:14,color:'var(--text-muted)',marginTop:14}}>wrightfamily.org</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3>Favicon · 32px (simplified)</h3>
          <div style={{display:'flex',gap:14,alignItems:'flex-end',padding:'16px 18px',background:'var(--surface-raised)',border:'1px solid var(--border)',borderRadius:'var(--radius-md)'}}>
            {[16, 20, 24, 32, 48].map(s=>(
              <div key={s} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                <div style={{
                  width:s,height:s,background:'#c24b3a',borderRadius:Math.max(2,s/5.5),
                  display:'flex',alignItems:'center',justifyContent:'center',
                  color:'#f2ece0',fontFamily:"'IBM Plex Sans Condensed',sans-serif",fontWeight:700,fontSize:s*0.68,
                  letterSpacing:'-1px',
                }}>W</div>
                <span className="mono" style={{fontSize:10,color:'var(--text-subtle)'}}>{s}</span>
              </div>
            ))}
            <div className="mono" style={{fontSize:10,color:'var(--text-subtle)',marginLeft:8,marginBottom:6}}>
              Drops the star + divider — illegible &lt; 14px height. The full Stencil bar
              kicks back in from 24px up.
            </div>
          </div>
        </div>
      </div>

      {/* File list */}
      <div>
        <h3>File index</h3>
        <div className="wf-card" style={{padding:0,overflow:'hidden'}}>
          <table className="wf-table" style={{fontSize:11.5}}>
            <thead><tr><th>Path</th><th style={{width:90,textAlign:'right'}}>Use</th></tr></thead>
            <tbody>
              {[
                ['assets/favicon.svg',                  'favicon'],
                ['assets/marks/wright.svg',             'inline'],
                ['assets/marks/sentinel.svg',           'inline'],
                ['assets/marks/paperless.svg',          'inline'],
                ['assets/marks/higgins.svg',            'inline'],
                ['assets/marks/scan-router.svg',        'inline'],
                ['assets/marks/*-brick.svg',            'static · 5 files'],
                ['assets/app-icons/wright-1024.svg',    'iOS / Android'],
                ['assets/app-icons/sentinel-1024.svg',  'iOS / Android'],
                ['assets/app-icons/paperless-1024.svg', 'iOS / Android'],
                ['assets/app-icons/higgins-1024.svg',   'iOS / Android'],
                ['assets/app-icons/scan-router-1024.svg','iOS / Android'],
                ['assets/social/og-wright.svg',         'social card'],
                ['assets/social/og-sentinel.svg',       'social card'],
                ['assets/social/og-paperless.svg',      'social card'],
              ].map(([p,u],i)=>(
                <tr key={i}>
                  <td className="mono" style={{color: p.startsWith('assets/favicon')?'var(--accent)':'var(--text)'}}>{p}</td>
                  <td className="mono" style={{color:'var(--text-subtle)',textAlign:'right'}}>{u}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{marginTop:14,padding:'12px 14px',background:'var(--surface-raised)',border:'1px solid var(--border)',borderRadius:'var(--radius-md)',fontSize:12,color:'var(--text-muted)',lineHeight:1.5}}>
          <div className="mono" style={{fontSize:10,letterSpacing:'0.16em',color:'var(--text-subtle)',marginBottom:6}}>USAGE</div>
          PNG variants of <span className="mono">app-icons/*-1024.svg</span> aren't shipped \u2014 export from the SVG at
          1024 / 512 / 192 / 180 / 60 when the kit needs them. The SVGs are designed so OS masks (rounded square / circle)
          give clean output on iOS, Android, and macOS.
        </div>
      </div>
    </div>
  </div>
);

// ============================================================
// EMAIL · client chrome wrapper
// ============================================================
const EmailFrame = ({ from, subject, children }) => (
  <div style={{
    width:'100%',height:'100%',
    background:'#f4eee2',
    display:'flex',flexDirection:'column',
    fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    color:'#111',
  }}>
    {/* Client chrome */}
    <div style={{padding:'12px 20px',borderBottom:'1px solid #d9d2c2',background:'#fbf7ec',display:'flex',alignItems:'center',gap:12}}>
      <div style={{width:36,height:36,borderRadius:'50%',background:'#a83828',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:600,fontSize:14}}>SW</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:'flex',alignItems:'baseline',gap:8}}>
          <span style={{fontWeight:600,fontSize:13}}>{from.name}</span>
          <span style={{color:'#757575',fontSize:11,fontFamily:'IBM Plex Mono,monospace'}}>&lt;{from.email}&gt;</span>
        </div>
        <div style={{fontSize:13,fontWeight:500,marginTop:1}}>{subject}</div>
        <div style={{color:'#757575',fontSize:11,marginTop:1}}>to me · {from.when}</div>
      </div>
      <div style={{display:'flex',gap:6,color:'#757575'}}>
        <span>↩</span><span>↪</span><span>⋯</span>
      </div>
    </div>

    {/* Email body container — 600px max */}
    <div style={{flex:1,overflow:'auto',padding:'24px 16px',display:'flex',justifyContent:'center'}}>
      <div style={{width:'100%',maxWidth:600,background:'#fff',border:'1px solid #e3dccb',borderRadius:6,overflow:'hidden'}}>
        {children}
      </div>
    </div>
  </div>
);

const EmailButton = ({ children, primary, href = '#' }) => (
  <a href={href} style={{
    display:'inline-block',
    padding:'12px 18px',
    background: primary ? '#a83828' : '#fff',
    border: primary ? '1px solid #a83828' : '1px solid #d9d2c2',
    color: primary ? '#fff' : '#111',
    fontWeight: 500,
    fontSize: 13,
    textDecoration:'none',
    borderRadius:6,
  }}>{children}</a>
);

const EmailHeader = ({ app }) => (
  <div style={{padding:'22px 28px',display:'flex',alignItems:'center',gap:12,borderBottom:'1px solid #ece4d0'}}>
    <span style={{color:'#a83828',display:'flex'}}><MarkLetter letter={app === 'Sentinel' ? 'S' : app === 'Paperless' ? 'P' : 'W'} size={32} /></span>
    <div style={{lineHeight:1.1}}>
      <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:9,letterSpacing:'0.22em',color:'#757575'}}>WRIGHT FAMILY</div>
      <div style={{fontSize:14,fontWeight:600,color:'#111',marginTop:2}}>{app}</div>
    </div>
  </div>
);

const EmailFooter = () => (
  <div style={{padding:'18px 28px 24px',borderTop:'1px solid #ece4d0',color:'#757575',fontSize:11,lineHeight:1.55}}>
    <div>You're getting this because notifications are on for this trigger.</div>
    <div style={{marginTop:6}}>
      <a href="#" style={{color:'#a83828',textDecoration:'underline'}}>Notification settings</a>
      &nbsp;·&nbsp;
      <a href="#" style={{color:'#a83828',textDecoration:'underline'}}>Unsubscribe</a>
      &nbsp;·&nbsp;
      <span style={{fontFamily:'IBM Plex Mono,monospace'}}>wrightfamily.org</span>
    </div>
  </div>
);

// ----- Sentinel alert email -----
const SentinelAlertEmail = () => (
  <EmailFrame
    from={{ name:'Sentinel', email:'noreply@wrightfamily.org', when:'10h ago' }}
    subject="🚨 OPNsenseGatewayDown · opnsense-exporter"
  >
    <EmailHeader app="Sentinel" />

    {/* Severity strip */}
    <div style={{background:'#a83828',color:'#fff',padding:'10px 28px',display:'flex',alignItems:'center',gap:10}}>
      <span style={{
        width:8,height:8,borderRadius:'50%',background:'#fff',
      }} />
      <span style={{fontWeight:600,fontSize:13,letterSpacing:'0.04em',textTransform:'uppercase'}}>Incident fired · critical</span>
      <span style={{marginLeft:'auto',fontFamily:'IBM Plex Mono,monospace',fontSize:11,opacity:0.85}}>22h ago · #1842</span>
    </div>

    <div style={{padding:'24px 28px'}}>
      <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:10,letterSpacing:'0.16em',textTransform:'uppercase',color:'#a83828'}}>OPNSENSEGATEWAYDOWN</div>
      <div style={{fontSize:20,fontWeight:600,letterSpacing:'-0.015em',marginTop:6,lineHeight:1.25}}>The OPNsense exporter has been unreachable for 22 minutes.</div>
      <p style={{fontSize:13,color:'#4a4a4a',lineHeight:1.55,marginTop:12,margin:0}}>
        The Prometheus scrape against <span style={{fontFamily:'IBM Plex Mono,monospace'}}>opnsense.wrightfamily.org:9100</span>{' '}
        last succeeded at 5/14 5:35 PM CT. Three consecutive scrape failures since.
        WAN may be affected.
      </p>

      <div style={{marginTop:18,padding:'14px 16px',background:'#fbf7ec',border:'1px solid #ece4d0',borderRadius:6,display:'grid',gridTemplateColumns:'auto 1fr',gap:'6px 18px',fontSize:12}}>
        <span style={{fontFamily:'IBM Plex Mono,monospace',color:'#757575',letterSpacing:'0.08em',textTransform:'uppercase',fontSize:10}}>HOST</span>
        <span style={{fontFamily:'IBM Plex Mono,monospace',fontSize:11.5}}>opnsense.wrightfamily.org</span>
        <span style={{fontFamily:'IBM Plex Mono,monospace',color:'#757575',letterSpacing:'0.08em',textTransform:'uppercase',fontSize:10}}>FIRST SEEN</span>
        <span style={{fontFamily:'IBM Plex Mono,monospace',fontSize:11.5}}>2026-05-13 23:35:14Z</span>
        <span style={{fontFamily:'IBM Plex Mono,monospace',color:'#757575',letterSpacing:'0.08em',textTransform:'uppercase',fontSize:10}}>DURATION</span>
        <span style={{fontFamily:'IBM Plex Mono,monospace',fontSize:11.5}}>22m 04s</span>
        <span style={{fontFamily:'IBM Plex Mono,monospace',color:'#757575',letterSpacing:'0.08em',textTransform:'uppercase',fontSize:10}}>RUNBOOK</span>
        <span style={{fontFamily:'IBM Plex Mono,monospace',fontSize:11.5,color:'#a83828'}}>sentinel.wrightfamily.org/rb/opnsense</span>
      </div>

      <div style={{marginTop:22,display:'flex',gap:10}}>
        <EmailButton primary>View incident →</EmailButton>
        <EmailButton>Acknowledge</EmailButton>
        <EmailButton>Silence 1h</EmailButton>
      </div>

      <p style={{fontSize:12,color:'#757575',lineHeight:1.55,marginTop:18}}>
        If you didn't expect this, the OPNsense box may have rebooted or the cloudflared
        tunnel may have dropped. The runbook walks the usual checks.
      </p>
    </div>

    <EmailFooter />
  </EmailFrame>
);

// ----- Paperless review email -----
const PaperlessReviewEmail = () => (
  <EmailFrame
    from={{ name:'Paperless', email:'noreply@wrightfamily.org', when:'2m ago' }}
    subject="1 document needs your review"
  >
    <EmailHeader app="Paperless" />

    <div style={{padding:'24px 28px'}}>
      <div style={{fontSize:14,fontWeight:600,color:'#a83828',display:'flex',alignItems:'center',gap:8}}>
        <span style={{width:8,height:8,borderRadius:'50%',background:'#a83828'}} />
        1 document fell below the confidence floor
      </div>
      <div style={{fontSize:19,fontWeight:600,letterSpacing:'-0.01em',marginTop:6,lineHeight:1.3}}>Rivian Motor Vehicle Purchase Agreement</div>
      <p style={{fontSize:13,color:'#4a4a4a',lineHeight:1.55,marginTop:10}}>
        The classifier extracted 14 fields, but 3 came in below 80%. Quick look
        and approve, or edit anything that's off.
      </p>

      <div style={{marginTop:18,padding:'14px 16px',background:'#fbf7ec',border:'1px solid #ece4d0',borderRadius:6,display:'flex',gap:14}}>
        <div style={{
          width:84,height:84,
          background:`repeating-linear-gradient(135deg, #ece4d0 0 10px, #fbf7ec 10px 12px)`,
          border:'1px solid #d9d2c2',borderRadius:4,
          display:'flex',alignItems:'center',justifyContent:'center',
          flex:'0 0 auto',
          color:'#757575',fontSize:10,fontFamily:'IBM Plex Mono,monospace',
        }}>pdf · p1</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:10,letterSpacing:'0.06em',color:'#757575',textTransform:'uppercase'}}>#207 · VEHICLE PURCHASE</div>
          <div style={{fontSize:13,fontWeight:600,color:'#111',marginTop:4}}>Total · $74,820.00 <span style={{color:'#b78636',fontFamily:'IBM Plex Mono,monospace',fontSize:11,fontWeight:400}}>71%</span></div>
          <div style={{fontSize:12,color:'#4a4a4a',marginTop:3}}>VIN · 7FCRGAAA8RN012345 <span style={{color:'#b78636',fontFamily:'IBM Plex Mono,monospace',fontSize:11}}>58%</span></div>
          <div style={{fontSize:12,color:'#4a4a4a',marginTop:3}}>Delivery · June 12, 2026 <span style={{color:'#b78636',fontFamily:'IBM Plex Mono,monospace',fontSize:11}}>62%</span></div>
        </div>
      </div>

      <div style={{marginTop:22,display:'flex',gap:10}}>
        <EmailButton primary>Approve &amp; file →</EmailButton>
        <EmailButton>Edit fields</EmailButton>
        <EmailButton>Re-queue</EmailButton>
      </div>

      <p style={{fontSize:12,color:'#757575',lineHeight:1.55,marginTop:18}}>
        Or batch-triage the whole queue in Paperless — 44 documents waiting.
      </p>
    </div>

    <EmailFooter />
  </EmailFrame>
);

// ============================================================
// SPLASH / FIRST-PAINT SCREENS
// ============================================================
const DesktopSplash = ({ hydrating = false, app = 'Sentinel' }) => (
  <div style={{
    width:'100%',height:'100%',background:'var(--bg)',
    display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
    color:'var(--text)',
    backgroundImage:`radial-gradient(circle at 50% 38%, color-mix(in srgb, var(--accent) 7%, transparent), transparent 55%)`,
  }}>
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
      <span style={{color:'var(--accent)',display:'inline-flex',animation: hydrating ? 'wfPulse 1.6s ease-in-out infinite' : 'none'}}>
        <MarkLetter letter={app === 'Sentinel' ? 'S' : app === 'Paperless' ? 'P' : 'W'} size={140} />
      </span>
      <div style={{textAlign:'center'}}>
        <div className="mono" style={{fontSize:11,letterSpacing:'0.22em',color:'var(--text-subtle)'}}>WRIGHT FAMILY</div>
        <div style={{fontSize:24,fontWeight:600,letterSpacing:'-0.015em',marginTop:6}}>{app}</div>
      </div>
      {hydrating && (
        <div style={{width:160,height:3,background:'var(--surface-raised)',borderRadius:999,overflow:'hidden',marginTop:14,position:'relative'}}>
          <div style={{position:'absolute',top:0,left:0,bottom:0,width:'40%',background:'var(--accent)',borderRadius:999,animation:'wfSlide 1.4s ease-in-out infinite'}} />
        </div>
      )}
      <div className="mono" style={{fontSize:10,letterSpacing:'0.18em',color:'var(--text-subtle)',marginTop:hydrating?6:18}}>
        {hydrating ? 'HYDRATING\u2026' : 'SSR \u00b7 INSTANT'}
      </div>
    </div>
    <div style={{position:'absolute',bottom:24,fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'0.16em',color:'var(--text-subtle)'}}>
      {app.toLowerCase()}.wrightfamily.org
    </div>
    <style>{`
      @keyframes wfSlide {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(250%); }
      }
    `}</style>
  </div>
);

const MobileSplash = ({ app = 'Sentinel', hydrating = true }) => (
  <div className="wf-phone" style={{
    backgroundImage:`radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--accent) 8%, transparent), transparent 55%)`,
  }}>
    <div className="wf-phone-status">
      <span>9:41</span>
      <span className="wf-status-right"><IconWifi size={14} /><IconBattery size={16} /></span>
    </div>
    <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16}}>
      <span style={{color:'var(--accent)',display:'inline-flex',animation:'wfPulse 1.6s ease-in-out infinite'}}>
        <MarkLetter letter={app === 'Sentinel' ? 'S' : app === 'Paperless' ? 'P' : 'W'} size={110} />
      </span>
      <div style={{textAlign:'center'}}>
        <div className="mono" style={{fontSize:10,letterSpacing:'0.22em',color:'var(--text-subtle)'}}>WRIGHT FAMILY</div>
        <div style={{fontSize:24,fontWeight:600,letterSpacing:'-0.015em',marginTop:6}}>{app}</div>
      </div>
      <div style={{width:120,height:3,background:'var(--surface-raised)',borderRadius:999,overflow:'hidden',marginTop:10,position:'relative'}}>
        <div style={{position:'absolute',top:0,left:0,bottom:0,width:'40%',background:'var(--accent)',borderRadius:999,animation:'wfSlide 1.4s ease-in-out infinite'}} />
      </div>
    </div>
    <div style={{padding:'14px 0 28px',textAlign:'center'}}>
      <div className="mono" style={{fontSize:10,letterSpacing:'0.18em',color:'var(--text-subtle)'}}>{app.toLowerCase()}.wrightfamily.org</div>
    </div>
  </div>
);

Object.assign(window, {
  HandoffCard, MarkAssets,
  EmailFrame, EmailButton, EmailHeader, EmailFooter,
  SentinelAlertEmail, PaperlessReviewEmail,
  DesktopSplash, MobileSplash,
});
