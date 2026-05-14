// Wright UI System · Batch A recipes
// Detail · Form/edit · Settings · Mobile form · States library
// All Frontier theme, share Sidebar + PAPERLESS_NAV from shared/screens.jsx.

// ---------- PageHeader · shared layout primitive ----------
const PageHeader = ({ crumbs = [], title, sub, badges = [], actions, tabs }) => (
  <div style={{display:'flex',flexDirection:'column',gap:10}}>
    <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
      <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',minWidth:0}}>
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <IconChevronRight size={12} style={{color:'var(--text-subtle)'}} />}
            <span style={{
              fontSize: i === crumbs.length - 1 ? 16 : 13,
              fontWeight: i === crumbs.length - 1 ? 600 : 450,
              color: i === crumbs.length - 1 ? 'var(--text)' : 'var(--text-muted)',
              letterSpacing: i === crumbs.length - 1 ? '-0.005em' : 'normal',
            }}>{c}</span>
          </React.Fragment>
        ))}
      </div>
      {badges.map((b, i) => <React.Fragment key={i}>{b}</React.Fragment>)}
      <div style={{flex:1}} />
      {actions}
    </div>
    {title && (
      <div>
        <h1 style={{fontSize:24,fontWeight:600,letterSpacing:'-0.015em',color:'var(--text)',lineHeight:1.18}}>{title}</h1>
        {sub && <div style={{fontSize:13,color:'var(--text-muted)',marginTop:4}}>{sub}</div>}
      </div>
    )}
    {tabs && <div className="wf-tabs" style={{marginTop:4}}>{tabs}</div>}
  </div>
);

// ============================================================
// 1) DETAIL PAGE  ·  Paperless document #207
// ============================================================
const DetailPage = ({ brand }) => (
  <div className="wf-shell">
    <Sidebar brand={brand} nav={PAPERLESS_NAV} />
    <main className="wf-main">
      <header className="wf-topbar" style={{padding:'10px 28px'}}>
        <button className="wf-btn ghost" style={{padding:'6px 10px'}}><IconChevronRight size={14} style={{transform:'rotate(180deg)'}} /> Back to queue</button>
        <div className="wf-spacer" />
        <span className="mono" style={{fontSize:11,color:'var(--text-subtle)'}}>#207 of 192</span>
        <button className="wf-btn ghost" style={{padding:'6px 10px'}}>‹</button>
        <button className="wf-btn ghost" style={{padding:'6px 10px'}}>›</button>
      </header>

      <div className="wf-content" style={{gap:18}}>
        <PageHeader
          crumbs={["Paperless", "Queue", "#207"]}
          title="Rivian Motor Vehicle Purchase Agreement"
          sub="Received 2026-05-04 · ingested by paperless-enricher v2.4 · classifier vehicle.purchase-agreement"
          badges={[
            <span key="b" className="wf-badge warn"><span className="dot" />NEEDS REVIEW</span>,
            <span key="c" className="mono" style={{fontSize:11,color:'var(--text-muted)'}}>64% confidence</span>,
          ]}
          actions={
            <div className="wf-spec-row" style={{gap:8}}>
              <button className="wf-btn ghost"><IconActivity size={14} /> Re-classify</button>
              <button className="wf-btn">Re-queue</button>
              <button className="wf-btn primary"><IconCheck size={14} /> Approve & file</button>
            </div>
          }
          tabs={
            <>
              <div className="tab active">Overview</div>
              <div className="tab">Source PDF</div>
              <div className="tab">Activity <span className="wf-badge" style={{marginLeft:6,padding:'1px 6px'}}>7</span></div>
              <div className="tab">Permissions</div>
            </>
          }
        />

        <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:18,flex:1,minHeight:0,overflow:'hidden'}}>
          {/* LEFT — extracted fields + document preview */}
          <div style={{display:'flex',flexDirection:'column',gap:14,minHeight:0,overflow:'hidden'}}>
            <div className="wf-card" style={{padding:0,display:'flex',flexDirection:'column'}}>
              <div style={{display:'flex',alignItems:'center',padding:'14px 18px',borderBottom:'1px solid var(--border)'}}>
                <h3 style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--text-subtle)',fontWeight:500}}>Extracted fields</h3>
                <div className="wf-spacer" />
                <span className="mono" style={{fontSize:11,color:'var(--text-subtle)'}}>14 of 14 extracted · 3 low-confidence</span>
              </div>
              <table className="wf-table" style={{fontSize:13}}>
                <tbody>
                  {[
                    ['Document type', 'Vehicle purchase agreement', 96, false],
                    ['Vendor',        'Rivian Automotive, LLC',     97, false],
                    ['Buyer',         'Scott A. Wright',            92, false],
                    ['Total',         '$74,820.00',                 71, true],
                    ['Date',          'May 4, 2026',                94, false],
                    ['VIN',           '7FCRGAAA8RN012345',          58, true],
                    ['Plate state',   'Texas',                      99, false],
                    ['Delivery ETA',  'June 12, 2026',              62, true],
                    ['Address',       '4218 Lone Star Trail, Austin, TX 78739', 88, false],
                  ].map(([k, v, conf, low], i) => (
                    <tr key={i} style={{borderBottom: i < 8 ? '1px solid var(--border)' : 'none'}}>
                      <td style={{width:'30%'}}><span className="upper mono" style={{color:'var(--text-subtle)'}}>{k}</span></td>
                      <td><span className={k==='VIN'||k==='Total'?'mono':''} style={{color:'var(--text)'}}>{v}</span></td>
                      <td style={{width:120,textAlign:'right'}}>
                        <span className={'mono ' + (low ? 'wf-warning' : 'wf-muted')} style={{fontSize:11}}>{conf}%</span>
                      </td>
                      <td style={{width:36,textAlign:'right'}}>
                        {low ? <IconAlert size={14} style={{color:'var(--warning)'}} /> : <IconCheck size={14} style={{color:'var(--text-subtle)'}} />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="wf-card" style={{flex:1,display:'flex',flexDirection:'column',padding:0,minHeight:160,overflow:'hidden'}}>
              <div style={{display:'flex',alignItems:'center',padding:'14px 18px',borderBottom:'1px solid var(--border)'}}>
                <h3 style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--text-subtle)',fontWeight:500}}>Source preview</h3>
                <div className="wf-spacer" />
                <span className="mono" style={{fontSize:11,color:'var(--text-subtle)'}}>2 pages · 1.4 MB · application/pdf</span>
              </div>
              <div style={{
                flex:1,
                background:`repeating-linear-gradient(135deg, var(--surface) 0 12px, var(--surface-raised) 12px 14px)`,
                display:'flex',alignItems:'center',justifyContent:'center',
              }}>
                <div className="mono" style={{fontSize:11,color:'var(--text-subtle)',padding:'8px 14px',background:'var(--surface)',border:'1px dashed var(--border)',borderRadius:6}}>
                  [pdf · page 1 of 2]
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — meta / tags / activity */}
          <div style={{display:'flex',flexDirection:'column',gap:14,minHeight:0,overflow:'hidden'}}>
            <div className="wf-card">
              <div className="wf-card-head"><h3>Metadata</h3></div>
              <div style={{display:'flex',flexDirection:'column'}}>
                {[
                  ['ID', '#207', true],
                  ['Source', 'Paperless · inbox/auto-import'],
                  ['Ingested', '2026-05-04 05:45:07Z', true],
                  ['Classifier', 'vehicle.purchase-agreement', true],
                  ['Model', 'gpt-5-nano · v2.4', true],
                  ['Cost', '$0.011', true],
                ].map(([k,v,mono],i)=>(
                  <div key={i} style={{display:'flex',justifyContent:'space-between',gap:14,padding:'8px 0',borderBottom:i<5?'1px solid var(--border)':'none'}}>
                    <span className="upper mono" style={{color:'var(--text-subtle)'}}>{k}</span>
                    <span className={mono?'mono':''} style={{fontSize:13,color:'var(--text)',textAlign:'right'}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="wf-card">
              <div className="wf-card-head"><h3>Tags</h3><span className="wf-meta mono">5</span></div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {['vehicle','rivian','2026','>$50k','registration-pending'].map((t,i)=>(
                  <span key={i} className="wf-badge">{t}</span>
                ))}
                <span className="wf-badge" style={{borderStyle:'dashed',color:'var(--text-subtle)'}}>+ add</span>
              </div>
            </div>

            <div className="wf-card" style={{flex:1,display:'flex',flexDirection:'column',minHeight:0,overflow:'hidden'}}>
              <div className="wf-card-head"><h3>Activity</h3><a className="mono" style={{fontSize:11,color:'var(--accent)'}}>view all</a></div>
              <div style={{display:'flex',flexDirection:'column',gap:0,fontSize:13}}>
                {[
                  { who: 'classifier', what: 'Re-classified as vehicle.purchase-agreement', ago: '2h',  tone: 'info' },
                  { who: 'scott',      what: 'Flagged for review', ago: '5h', tone: 'warn' },
                  { who: 'classifier', what: 'Initial classification: contract.generic', ago: '6h', tone: 'info' },
                  { who: 'enricher',   what: 'Extracted 14 fields (3 low-confidence)', ago: '6h', tone: 'info' },
                  { who: 'inbox',      what: 'Document ingested · 1.4 MB', ago: '7h', tone: 'info' },
                ].map((r,i)=>{
                  const c = r.tone==='warn'?'var(--warning)':'var(--info)';
                  return (
                    <div key={i} style={{display:'flex',gap:10,padding:'8px 0',borderBottom:i<4?'1px solid var(--border)':'none'}}>
                      <span style={{width:7,height:7,borderRadius:'50%',background:c,flex:'0 0 auto',marginTop:7}} />
                      <div className="wf-grow">
                        <div style={{color:'var(--text)'}}>{r.what}</div>
                        <div className="mono" style={{fontSize:11,color:'var(--text-subtle)',marginTop:2}}>{r.who} · {r.ago} ago</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);

// ============================================================
// 2) FORM / EDIT PAGE  ·  Edit document #207
// ============================================================
const EditPage = ({ brand }) => (
  <div className="wf-shell">
    <Sidebar brand={brand} nav={PAPERLESS_NAV} />
    <main className="wf-main">
      <header className="wf-topbar">
        <button className="wf-btn ghost" style={{padding:'6px 10px'}}><IconChevronRight size={14} style={{transform:'rotate(180deg)'}} /> Back</button>
        <span className="wf-crumb">Paperless / Queue / #207</span>
        <h1>Edit document</h1>
        <div className="wf-spacer" />
        <span className="mono" style={{fontSize:11,color:'var(--text-subtle)'}}>unsaved changes</span>
        <button className="wf-btn ghost">Cancel</button>
        <button className="wf-btn primary"><IconCheck size={14} /> Save changes</button>
      </header>

      <div className="wf-content" style={{maxWidth:880,width:'100%',alignSelf:'center',gap:22,paddingTop:32,overflow:'auto'}}>

        {/* Section 1 */}
        <div style={{display:'grid',gridTemplateColumns:'200px 1fr',gap:32}}>
          <div>
            <div style={{fontSize:14,fontWeight:600,color:'var(--text)'}}>Basic info</div>
            <div style={{fontSize:12,color:'var(--text-muted)',marginTop:4}}>How the document shows up in queue, search, and the file tree.</div>
          </div>
          <div className="wf-card" style={{display:'flex',flexDirection:'column',gap:14}}>
            <div className="wf-field">
              <label className="wf-field-label">Title</label>
              <input className="wf-input" defaultValue="Rivian Motor Vehicle Purchase Agreement" />
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div className="wf-field">
                <label className="wf-field-label">Document type</label>
                <div className="wf-select">Vehicle Purchase Agreement</div>
              </div>
              <div className="wf-field">
                <label className="wf-field-label">Date</label>
                <input className="wf-input mono" defaultValue="2026-05-04" />
              </div>
            </div>
            <div className="wf-field">
              <label className="wf-field-label">Vendor</label>
              <input className="wf-input" defaultValue="Rivian Automotive, LLC" />
              <span className="wf-field-hint">Matched to existing vendor · 2 prior documents</span>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div style={{display:'grid',gridTemplateColumns:'200px 1fr',gap:32}}>
          <div>
            <div style={{fontSize:14,fontWeight:600,color:'var(--text)'}}>Extracted fields</div>
            <div style={{fontSize:12,color:'var(--text-muted)',marginTop:4}}>Override the model's extraction. Low-confidence fields are highlighted.</div>
          </div>
          <div className="wf-card" style={{display:'flex',flexDirection:'column',gap:14}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div className="wf-field">
                <label className="wf-field-label">Total</label>
                <div className="wf-input-affix">
                  <span className="wf-affix-icon"><IconCost size={14} /></span>
                  <input className="wf-input focused mono" defaultValue="74820.00" />
                </div>
                <span className="wf-field-hint"><span className="wf-warning">71% confidence</span> · model read "$74,820.00"</span>
              </div>
              <div className="wf-field">
                <label className="wf-field-label">VIN</label>
                <input className="wf-input err mono" defaultValue="7FCRGAAA8RN0123" />
                <span className="wf-field-err"><IconAlert size={12} /> VIN must be 17 characters. Currently 15.</span>
              </div>
            </div>
            <div className="wf-field">
              <label className="wf-field-label">Delivery address</label>
              <textarea className="wf-input" rows={2} defaultValue={"4218 Lone Star Trail\nAustin, TX 78739"} style={{resize:'vertical',fontFamily:'var(--font-sans)'}} />
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div style={{display:'grid',gridTemplateColumns:'200px 1fr',gap:32}}>
          <div>
            <div style={{fontSize:14,fontWeight:600,color:'var(--text)'}}>Tags & routing</div>
            <div style={{fontSize:12,color:'var(--text-muted)',marginTop:4}}>Where the document gets filed once approved.</div>
          </div>
          <div className="wf-card" style={{display:'flex',flexDirection:'column',gap:14}}>
            <div className="wf-field">
              <label className="wf-field-label">Tags</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:6,padding:'8px',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-sm)'}}>
                {['vehicle','rivian','2026','>$50k','registration-pending'].map((t,i)=>(
                  <span key={i} className="wf-badge" style={{paddingRight:6}}>{t} <span style={{marginLeft:2,color:'var(--text-subtle)'}}>×</span></span>
                ))}
                <input className="wf-input" placeholder="add tag..." style={{flex:1,minWidth:120,border:'none',padding:'2px 6px',background:'transparent'}} />
              </div>
            </div>
            <div className="wf-field">
              <label className="wf-field-label">File to</label>
              <div className="wf-select"><span className="mono" style={{fontSize:13,color:'var(--text-muted)'}}>/vehicles/rivian/</span>2026-r1s-purchase</div>
              <span className="wf-field-hint">Routing rule: "vehicle purchase + Rivian" → /vehicles/rivian/</span>
            </div>
            <div className="wf-field">
              <label className="wf-field-label">After save</label>
              <div className="wf-spec-row" style={{gap:14}}>
                <span className="wf-radio on"><span className="dot" /> Approve & file</span>
                <span className="wf-radio"><span className="dot" /> Save as draft</span>
                <span className="wf-radio"><span className="dot" /> Re-queue for review</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Sticky footer */}
      <div style={{borderTop:'1px solid var(--border)',background:'var(--surface)',padding:'12px 28px',display:'flex',alignItems:'center',gap:10}}>
        <span className="mono" style={{fontSize:11,color:'var(--text-subtle)'}}>1 error · 1 low-confidence override</span>
        <div className="wf-spacer" />
        <button className="wf-btn ghost">Discard</button>
        <button className="wf-btn">Save as draft</button>
        <button className="wf-btn primary"><IconCheck size={14} /> Approve & file</button>
      </div>
    </main>
  </div>
);

// ============================================================
// 3) SETTINGS PAGE  ·  Paperless · Notifications
// ============================================================
const SettingsPage = ({ brand }) => {
  const sections = [
    { id: 'general',     label: 'General' },
    { id: 'notif',       label: 'Notifications', active: true },
    { id: 'sources',     label: 'Sources' },
    { id: 'routing',     label: 'Routing rules' },
    { id: 'triage',      label: 'Auto-triage' },
    { id: 'keys',        label: 'API keys' },
    { id: 'audit',       label: 'Audit log' },
  ];
  return (
    <div className="wf-shell">
      <Sidebar brand={brand} nav={PAPERLESS_NAV} />
      <main className="wf-main">
        <header className="wf-topbar">
          <span className="wf-crumb">Paperless</span>
          <IconChevronRight size={12} style={{color:'var(--text-subtle)'}} />
          <h1>Settings</h1>
          <div className="wf-spacer" />
          <span className="mono" style={{fontSize:11,color:'var(--text-subtle)'}}>last saved 18m ago</span>
        </header>

        <div style={{display:'grid',gridTemplateColumns:'240px 1fr',flex:1,minHeight:0,overflow:'hidden'}}>
          {/* In-page nav */}
          <aside style={{padding:'24px 16px',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',gap:2,background:'var(--surface)'}}>
            <div className="upper mono" style={{color:'var(--text-subtle)',padding:'4px 12px 10px'}}>SETTINGS</div>
            {sections.map(s => (
              <a key={s.id} style={{
                display:'flex',alignItems:'center',gap:10,
                padding:'8px 12px',borderRadius:'var(--radius-sm)',
                color: s.active ? 'var(--text)' : 'var(--text-muted)',
                background: s.active ? 'var(--accent-soft)' : 'transparent',
                fontSize:14,fontWeight:s.active?500:450,position:'relative',
                minHeight:36,
              }}>
                {s.active && <span style={{position:'absolute',left:-16,top:6,bottom:6,width:2,background:'var(--accent)',borderRadius:2}} />}
                {s.label}
              </a>
            ))}
          </aside>

          {/* Section content */}
          <div style={{padding:'28px 32px',overflow:'auto',display:'flex',flexDirection:'column',gap:22}}>
            <div>
              <h1 style={{fontSize:22,fontWeight:600,letterSpacing:'-0.015em'}}>Notifications</h1>
              <div style={{fontSize:13,color:'var(--text-muted)',marginTop:4,maxWidth:'62ch'}}>
                Choose when Paperless sends you a heads-up. Channels are independent — turn each one on by triggering rule.
              </div>
            </div>

            <div className="wf-card" style={{display:'flex',flexDirection:'column',gap:0,padding:0}}>
              <div style={{padding:'14px 18px',borderBottom:'1px solid var(--border)'}}>
                <h3 style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'0.16em',textTransform:'uppercase',color:'var(--text-subtle)',fontWeight:500}}>Triggers</h3>
              </div>
              {[
                { k: 'Document needs review',         on: true,  sub: 'Confidence below the floor in Auto-triage settings.' },
                { k: 'Classifier error',              on: true,  sub: 'A model call failed or returned malformed output.' },
                { k: 'Daily digest',                  on: false, sub: 'A summary email at 7:00 AM CT covering the prior day.' },
                { k: 'Webhook silence',               on: true,  sub: 'An ingest webhook hasn’t fired in 24h.' },
                { k: 'Budget over 80%',               on: false, sub: 'Monthly LLM spend crossing 80% of the budget cap.' },
              ].map((r,i,a)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 18px',borderBottom:i<a.length-1?'1px solid var(--border)':'none'}}>
                  <div className="wf-grow">
                    <div style={{fontSize:14,fontWeight:500,color:'var(--text)'}}>{r.k}</div>
                    <div style={{fontSize:12,color:'var(--text-muted)',marginTop:2}}>{r.sub}</div>
                  </div>
                  <div className={'wf-toggle' + (r.on?' on':'')} />
                </div>
              ))}
            </div>

            <div className="wf-card" style={{display:'flex',flexDirection:'column',gap:14}}>
              <div className="wf-card-head"><h3>Channels</h3><span className="wf-meta mono">2 active</span></div>

              <div className="wf-field">
                <label className="wf-field-label">Slack</label>
                <div className="wf-input-affix">
                  <span className="wf-affix-icon"><IconChat size={14} /></span>
                  <input className="wf-input" defaultValue="#paperless-feed" />
                </div>
                <span className="wf-field-hint"><span className="wf-success">✓</span> Connected as wright-family-bot · 3 ago</span>
              </div>

              <div className="wf-field">
                <label className="wf-field-label">Email recipients</label>
                <div style={{display:'flex',flexWrap:'wrap',gap:6,padding:'8px',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-sm)'}}>
                  {['scott@wrightfamily.org','admin@wrightfamily.org'].map((e,i)=>(
                    <span key={i} className="wf-badge" style={{paddingRight:6}}>{e} <span style={{marginLeft:2,color:'var(--text-subtle)'}}>×</span></span>
                  ))}
                  <input className="wf-input" placeholder="add email..." style={{flex:1,minWidth:160,border:'none',padding:'2px 6px',background:'transparent'}} />
                </div>
              </div>

              <div className="wf-field">
                <label className="wf-field-label">Webhook</label>
                <div className="wf-input-affix">
                  <span className="wf-affix-icon"><IconActivity size={14} /></span>
                  <input className="wf-input mono" placeholder="https://…" />
                </div>
                <span className="wf-field-hint">POST a JSON payload to this URL when triggers fire.</span>
              </div>
            </div>

            <div style={{display:'flex',gap:10}}>
              <button className="wf-btn">Send test notification</button>
              <div className="wf-spacer" />
              <button className="wf-btn ghost">Discard changes</button>
              <button className="wf-btn primary"><IconCheck size={14} /> Save</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// ============================================================
// 4) MOBILE FORM  ·  Mobile edit document (375px target)
// ============================================================
const MobileForm = ({ brand }) => (
  <div className="wf-phone">
    <div className="wf-phone-status">
      <span>9:41</span>
      <span className="wf-status-right"><IconWifi size={14} /><IconBattery size={16} /></span>
    </div>
    <div className="wf-phone-top">
      <button className="wf-btn ghost" style={{padding:'8px 10px',minHeight:44,minWidth:44,marginLeft:-8}}>
        <IconChevronRight size={18} style={{transform:'rotate(180deg)'}} />
      </button>
      <div style={{flex:1,textAlign:'center'}}>
        <div className="upper mono" style={{color:'var(--text-subtle)'}}>EDIT</div>
        <div style={{fontSize:15,fontWeight:600,marginTop:2}}>#207 Rivian</div>
      </div>
      <button className="wf-btn ghost" style={{padding:'8px 10px',minHeight:44,minWidth:44,color:'var(--accent)'}}>Save</button>
    </div>

    <div className="wf-phone-content" style={{paddingBottom:0,overflow:'auto',gap:16}}>
      <div>
        <div className="upper mono" style={{color:'var(--text-subtle)',marginBottom:6}}>BASIC INFO</div>
        <div className="wf-card" style={{padding:'4px 14px'}}>
          <div className="wf-field" style={{padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
            <label className="wf-field-label">Title</label>
            <input className="wf-input" style={{minHeight:44}} defaultValue="Rivian Motor Vehicle Purchase Agreement" />
          </div>
          <div className="wf-field" style={{padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
            <label className="wf-field-label">Type</label>
            <div className="wf-select" style={{minHeight:44}}>Vehicle Purchase Agreement</div>
          </div>
          <div className="wf-field" style={{padding:'10px 0'}}>
            <label className="wf-field-label">Date</label>
            <input className="wf-input mono" style={{minHeight:44}} defaultValue="2026-05-04" />
          </div>
        </div>
      </div>

      <div>
        <div className="upper mono" style={{color:'var(--text-subtle)',marginBottom:6}}>EXTRACTED</div>
        <div className="wf-card" style={{padding:'4px 14px'}}>
          <div className="wf-field" style={{padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
            <label className="wf-field-label">Total</label>
            <div className="wf-input-affix">
              <span className="wf-affix-icon"><IconCost size={14} /></span>
              <input className="wf-input focused mono" style={{minHeight:44}} defaultValue="74820.00" />
            </div>
            <span className="wf-field-hint"><span className="wf-warning">71% confidence</span></span>
          </div>
          <div className="wf-field" style={{padding:'10px 0'}}>
            <label className="wf-field-label">VIN</label>
            <input className="wf-input err mono" style={{minHeight:44}} defaultValue="7FCRGAAA8RN0123" />
            <span className="wf-field-err"><IconAlert size={12} /> Must be 17 chars · currently 15</span>
          </div>
        </div>
      </div>

      <div>
        <div className="upper mono" style={{color:'var(--text-subtle)',marginBottom:6}}>AFTER SAVE</div>
        <div className="wf-card" style={{padding:'4px 14px'}}>
          {[
            { l: 'Approve & file', on: true },
            { l: 'Save as draft',  on: false },
            { l: 'Re-queue for review', on: false },
          ].map((r,i,a)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 0',borderBottom:i<a.length-1?'1px solid var(--border)':'none',minHeight:44}}>
              <span className={'wf-radio' + (r.on?' on':'')} style={{margin:0,minHeight:0}}><span className="dot" /></span>
              <span style={{fontSize:14}}>{r.l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div style={{padding:'12px 16px 28px',borderTop:'1px solid var(--border)',background:'var(--surface)',display:'flex',gap:8}}>
      <button className="wf-btn" style={{flex:1,justifyContent:'center',minHeight:48,fontSize:14}}>Cancel</button>
      <button className="wf-btn primary" style={{flex:2,justifyContent:'center',minHeight:48,fontSize:14}}>
        <IconCheck size={16} /> Save
      </button>
    </div>
  </div>
);

// ============================================================
// 5) STATES LIBRARY  ·  loading / empty / error
// ============================================================
const StatesLibrary = () => (
  <div className="wf-spec wf-root theme-frontier" style={{overflow:'auto'}}>
    <div>
      <div className="upper mono" style={{color:'var(--text-subtle)'}}>STATES · 06</div>
      <div className="wf-spec-title" style={{marginTop:4}}>Loading · Empty · Error</div>
      <div className="wf-spec-blurb" style={{marginTop:6}}>
        Every recipe should have a deliberate take on these three states. Patterns below cover
        the three surface shapes the kit produces: card · table · page.
      </div>
    </div>

    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
      {/* Column 1 — Loading */}
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        <h3>Loading</h3>
        <div className="wf-card">
          <div className="wf-card-head">
            <div className="wf-skeleton" style={{width:80,height:10}} />
            <div className="wf-skeleton" style={{width:40,height:10}} />
          </div>
          <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:14}}>
            <div className="wf-skeleton" style={{width:100,height:24}} />
            <div className="wf-skeleton" style={{width:50,height:12}} />
          </div>
          <div className="wf-skeleton" style={{marginBottom:8}} />
          <div className="wf-skeleton" style={{width:'72%',marginBottom:8}} />
          <div className="wf-skeleton" style={{width:'88%'}} />
        </div>

        <div className="wf-card" style={{padding:0,overflow:'hidden'}}>
          <table className="wf-table">
            <thead><tr><th>ID</th><th>Document</th><th>Status</th><th style={{textAlign:'right'}}>Confidence</th></tr></thead>
            <tbody>
              {[60, 72, 55, 80, 68].map((w,i)=>(
                <tr key={i}>
                  <td><div className="wf-skeleton" style={{width:36,height:10}} /></td>
                  <td><div className="wf-skeleton" style={{width:`${w}%`,height:10}} /></td>
                  <td><div className="wf-skeleton" style={{width:72,height:14,borderRadius:999}} /></td>
                  <td style={{textAlign:'right'}}><div className="wf-skeleton" style={{width:34,height:10,marginLeft:'auto'}} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="wf-card" style={{padding:18,display:'flex',alignItems:'center',gap:12}}>
          <span style={{color:'var(--accent)',display:'flex',animation:'wfSpin 2.4s linear infinite'}}>
            <MarkStencilBar size={28} />
          </span>
          <div>
            <div style={{fontSize:13,fontWeight:500,color:'var(--text)'}}>Triaging queue…</div>
            <div className="mono" style={{fontSize:11,color:'var(--text-subtle)',marginTop:2}}>processing 12 of 44</div>
          </div>
        </div>
      </div>

      {/* Column 2 — Empty */}
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        <h3>Empty</h3>
        <div className="wf-card" style={{padding:0}}>
          <div className="wf-empty">
            <span className="glyph"><MarkStencilBar size={36} /></span>
            <h4>Queue is clear</h4>
            <div style={{fontSize:12.5,maxWidth:'30ch'}}>
              No documents are waiting for review. New uploads land here automatically.
            </div>
            <button className="wf-btn ghost" style={{marginTop:8}}>View archive</button>
          </div>
        </div>

        <div className="wf-card" style={{padding:0}}>
          <div className="wf-empty" style={{padding:'20px 24px'}}>
            <span className="glyph" style={{opacity:.6}}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </span>
            <h4>No matches</h4>
            <div style={{fontSize:12.5,maxWidth:'32ch'}}>
              Nothing under "rivian 2025". Try widening the date range or removing tags.
            </div>
            <div className="wf-spec-row" style={{marginTop:8,gap:6}}>
              <span className="wf-badge" style={{paddingRight:6}}>rivian <span style={{marginLeft:2,color:'var(--text-subtle)'}}>×</span></span>
              <span className="wf-badge" style={{paddingRight:6}}>2025 <span style={{marginLeft:2,color:'var(--text-subtle)'}}>×</span></span>
              <button className="wf-btn ghost" style={{padding:'4px 8px',fontSize:12}}>clear all</button>
            </div>
          </div>
        </div>

        <div className="wf-card" style={{padding:0}}>
          <div className="wf-empty">
            <span className="glyph"><IconPlus size={32} /></span>
            <h4>No routing rules yet</h4>
            <div style={{fontSize:12.5,maxWidth:'30ch'}}>
              Rules send approved documents to the right folder. Add one to start auto-filing.
            </div>
            <button className="wf-btn primary" style={{marginTop:8}}><IconPlus size={14} /> New rule</button>
          </div>
        </div>
      </div>

      {/* Column 3 — Error */}
      <div style={{display:'flex',flexDirection:'column',gap:14}}>
        <h3>Error</h3>
        <div className="wf-card" style={{borderColor:'var(--danger)',background:'color-mix(in srgb,var(--danger) 8%, var(--surface-raised))'}}>
          <div className="wf-row" style={{gap:10,alignItems:'flex-start'}}>
            <span style={{color:'var(--danger)',marginTop:2}}><IconAlert size={18} /></span>
            <div className="wf-grow">
              <div style={{fontSize:14,fontWeight:600,color:'var(--text)'}}>Classifier failed</div>
              <div style={{fontSize:12.5,color:'var(--text-muted)',marginTop:2}}>
                The vehicle.purchase-agreement model returned a 502 from gpt-5-nano · attempt 3 of 3.
              </div>
              <div className="mono" style={{fontSize:11,color:'var(--text-subtle)',marginTop:8,padding:'8px 10px',background:'var(--surface)',borderRadius:4}}>
                err.classifier.upstream_502 · doc=#207 · 2026-05-14T21:42Z
              </div>
              <div className="wf-spec-row" style={{marginTop:10,gap:6}}>
                <button className="wf-btn">Retry</button>
                <button className="wf-btn ghost">Re-queue</button>
                <button className="wf-btn ghost">View logs</button>
              </div>
            </div>
          </div>
        </div>

        <div className="wf-card" style={{padding:0}}>
          <div className="wf-empty">
            <span className="glyph" style={{color:'var(--danger)'}}><IconAlert size={36} /></span>
            <h4>Couldn’t reach Paperless</h4>
            <div style={{fontSize:12.5,maxWidth:'32ch'}}>
              Connection to <span className="mono">paperless.wrightfamily.org</span> timed out after 8s.
            </div>
            <div className="wf-spec-row" style={{marginTop:8,gap:6,justifyContent:'center'}}>
              <button className="wf-btn">Retry</button>
              <button className="wf-btn ghost">Status page</button>
            </div>
          </div>
        </div>

        <div style={{padding:'14px 16px',background:'color-mix(in srgb,var(--danger) 10%, var(--surface))',border:'1px solid var(--danger)',borderRadius:'var(--radius-md)',display:'flex',alignItems:'flex-start',gap:10}}>
          <span style={{color:'var(--danger)',marginTop:1}}><IconAlert size={16} /></span>
          <div className="wf-grow">
            <div style={{fontSize:13,fontWeight:600,color:'var(--text)'}}>Form has errors</div>
            <div style={{fontSize:12.5,color:'var(--text-muted)',marginTop:2}}>
              VIN must be 17 characters. <a className="wf-accent" style={{textDecoration:'underline'}}>Jump to field</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

Object.assign(window, {
  PageHeader, DetailPage, EditPage, SettingsPage, MobileForm, StatesLibrary,
});
