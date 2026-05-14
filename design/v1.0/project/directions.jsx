// Per-direction wrappers: each composes the shared screens with its
// theme class and brand mark, and supplies the tokens card.

// ---------- Direction 1 — Frontier ----------
const Frontier = {
  brandSentinel:   () => <BrandFrontier sub="SENTINEL" />,
  brandPaperless:  () => <BrandFrontier sub="PAPERLESS" />,
  themeClass: 'theme-frontier',
  tokens: (
    <TokensCard
      title="Frontier"
      blurb="Restrained dusty Texas. Oxidized navy as the ambient surface, brick red used sparingly for accent and primary action. Bone-cream text. Star appears in the brand mark only — every other element is plain admin chrome. Feels like a courthouse ledger that's been quietly digitized."
      brand={<BrandFrontier label="WRIGHT FAMILY · UI" sub="FRONTIER · v0.1" size={36} />}
      swatches={[
        { name: 'bg',          bg: '#13171f', fg: '#ebe4d4' },
        { name: 'surface',     bg: '#181d27', fg: '#ebe4d4' },
        { name: 'raised',      bg: '#1f2531', fg: '#ebe4d4' },
        { name: 'border',      bg: '#2a3142', fg: '#ebe4d4' },
        { name: 'text',        bg: '#ebe4d4', fg: '#13171f' },
        { name: 'muted',       bg: '#8d95a6', fg: '#13171f' },
        { name: 'accent',      bg: '#c24b3a', fg: '#f7ede0' },
        { name: 'accent-soft', bg: '#5d2a23', fg: '#ebe4d4' },
        { name: 'success',     bg: '#7fa370', fg: '#13171f' },
        { name: 'warning',     bg: '#d4a14a', fg: '#13171f' },
        { name: 'danger',      bg: '#c24b3a', fg: '#f7ede0' },
        { name: 'info',        bg: '#5e83a8', fg: '#13171f' },
      ]}
      types={[
        { label: 'Display · Plex Sans 24/600', font: '600 24px/1.2 IBM Plex Sans', text: 'Overview · Wright Family' },
        { label: 'Body · Plex Sans 14/450',    font: '450 14px/1.45 IBM Plex Sans', text: 'Overnight was quiet except for the ledger webhook situation — third consecutive cycle.' },
        { label: 'Mono · Plex Mono 12/500',    font: '500 12px/1.4 IBM Plex Mono', text: '$3.83 / $25.00 · 15% · 2026-05-14T21:35:14Z', note: 'Tabular nums for data alignment' },
        { label: 'Caps · Plex Mono 10/500',    font: '500 10px/1 IBM Plex Mono', text: 'NEEDS REVIEW · ACTIVITY · 7D', tracking: '0.16em', note: 'Section labels & status badges' },
      ]}
    />
  ),
};

// ---------- Direction 2 — Lone Star ----------
const LoneStar = {
  brandSentinel:   () => <BrandLoneStar sub="Sentinel" />,
  brandPaperless:  () => <BrandLoneStar sub="Paperless" />,
  themeClass: 'theme-lonestar',
  tokens: (
    <TokensCard
      title="Lone Star"
      blurb="Same dusty Texas family, used with more confidence. Bluebonnet indigo joins brick red as a secondary accent. The five-point star earns its keep across the UI — it's the active-nav glyph, the loading indicator, and a bullet in long lists. Geometric Geist sans for body and data."
      brand={<BrandLoneStar label="WRIGHT FAMILY · UI" sub="Lone Star · v0.1" size={40} />}
      swatches={[
        { name: 'bg',         bg: '#0e1521', fg: '#ede5d2' },
        { name: 'surface',    bg: '#141c2a', fg: '#ede5d2' },
        { name: 'raised',     bg: '#1c2535', fg: '#ede5d2' },
        { name: 'border',     bg: '#2a3548', fg: '#ede5d2' },
        { name: 'text',       bg: '#ede5d2', fg: '#0e1521' },
        { name: 'muted',      bg: '#8590a3', fg: '#0e1521' },
        { name: 'accent',     bg: '#c95442', fg: '#f7ede0' },
        { name: 'indigo',     bg: '#5b6fb0', fg: '#f7ede0' },
        { name: 'success',    bg: '#7ba070', fg: '#0e1521' },
        { name: 'warning',    bg: '#d8a44a', fg: '#0e1521' },
        { name: 'danger',     bg: '#c95442', fg: '#f7ede0' },
        { name: 'info',       bg: '#5b6fb0', fg: '#f7ede0' },
      ]}
      types={[
        { label: 'Display · Geist 26/600',  font: '600 26px/1.18 Geist',  text: 'Sentinel · Overview' },
        { label: 'Body · Geist 14/450',     font: '450 14px/1.5 Geist',   text: "Mist 67° this morning, high of 98 — apparently summer decided to skip spring entirely." },
        { label: 'Mono · Geist Mono 12/500',font: '500 12px/1.4 "Geist Mono"', text: '#212  $74,820.00  2026-05-04T05:45:50Z', note: 'Numbers + IDs + timestamps' },
        { label: 'Caps · Geist Mono 10/500',font: '500 10px/1 "Geist Mono"', text: 'NEEDS REVIEW · ACTIVITY · 7D', tracking: '0.18em', note: 'Section labels & status badges' },
      ]}
    />
  ),
};

// ---------- Direction 3 — Capitol ----------
const Capitol = {
  brandSentinel:   () => <BrandCapitol sub="Sentinel" />,
  brandPaperless:  () => <BrandCapitol sub="Paperless" />,
  themeClass: 'theme-capitol',
  tokens: (
    <TokensCard
      title="Capitol"
      blurb="The most committed direction. Warmer navy, brick red, dusty granite gold — like the Texas Capitol's pink-granite rotunda at dusk. Plex Sans Condensed adds editorial weight to titles; active nav is a full red pill, not a tint. Star ornament appears as watermark and active-nav prefix."
      brand={<BrandCapitol label="WRIGHT FAMILY · UI" sub="Capitol · v0.1" size={44} />}
      swatches={[
        { name: 'bg',         bg: '#0f1626', fg: '#f0e5d2' },
        { name: 'surface',    bg: '#15203a', fg: '#f0e5d2' },
        { name: 'raised',     bg: '#1d2a48', fg: '#f0e5d2' },
        { name: 'border',     bg: '#2e3d5e', fg: '#f0e5d2' },
        { name: 'text',       bg: '#f0e5d2', fg: '#0f1626' },
        { name: 'muted',      bg: '#9aa3ba', fg: '#0f1626' },
        { name: 'accent',     bg: '#cf513e', fg: '#f9eed8' },
        { name: 'gold',       bg: '#cda36a', fg: '#0f1626' },
        { name: 'success',    bg: '#7fa86d', fg: '#0f1626' },
        { name: 'warning',    bg: '#cda36a', fg: '#0f1626' },
        { name: 'danger',     bg: '#cf513e', fg: '#f9eed8' },
        { name: 'info',       bg: '#6987b8', fg: '#0f1626' },
      ]}
      types={[
        { label: 'Display · Plex Cond 28/700', font: '700 28px/1.1 "IBM Plex Sans Condensed"', text: 'Wright Family · Sentinel', tracking: '0.005em' },
        { label: 'Body · Plex Sans 14/450',    font: '450 14px/1.5 "IBM Plex Sans"', text: 'Infrastructure is clean — pod healthy, tunnel up, no errors. Genuinely ambiguous root cause.' },
        { label: 'Mono · Plex Mono 12/500',    font: '500 12px/1.4 "IBM Plex Mono"', text: '#212  $74,820.00  2026-05-04T05:45:50Z', note: 'Slightly wider spacing for data tables' },
        { label: 'Caps · Plex Mono 10/500',    font: '500 10px/1 "IBM Plex Mono"', text: 'NEEDS REVIEW · ACTIVITY · 7D', tracking: '0.2em', note: 'Wider tracking for capital-letter labels' },
      ]}
    />
  ),
};

// ---------- Build one direction's section ----------
const DirectionSection = ({ id, dir, label, summary }) => (
  <DCSection id={id} title={label} subtitle={summary}>
    <DCArtboard id={id+'-tokens'} label="Brand & tokens" width={1120} height={680}>
      <div className={'wf-root ' + dir.themeClass}>{dir.tokens}</div>
    </DCArtboard>

    <DCArtboard id={id+'-sentinel'} label="Sentinel · Overview (dark, desktop)" width={1280} height={860}>
      <div className={'wf-root ' + dir.themeClass}>
        <SentinelDashboard brand={dir.brandSentinel()} />
      </div>
    </DCArtboard>

    <DCArtboard id={id+'-paperless'} label="Paperless · Queue (dark, desktop)" width={1280} height={860}>
      <div className={'wf-root ' + dir.themeClass}>
        <PaperlessTable brand={dir.brandPaperless()} />
      </div>
    </DCArtboard>

    <DCArtboard id={id+'-mobile-home'} label="Sentinel · Mobile home" width={390} height={844}>
      <div className={'wf-root ' + dir.themeClass}>
        <MobileDashboard brand={dir.brandSentinel()} />
      </div>
    </DCArtboard>

    <DCArtboard id={id+'-mobile-detail'} label="Paperless · Mobile detail" width={390} height={844}>
      <div className={'wf-root ' + dir.themeClass}>
        <MobileDetail brand={dir.brandPaperless()} />
      </div>
    </DCArtboard>

    <DCArtboard id={id+'-light'} label="Sentinel · Light theme proof" width={1280} height={860}>
      <div className={'wf-root ' + dir.themeClass + ' light'}>
        <SentinelDashboard brand={dir.brandSentinel()} />
      </div>
    </DCArtboard>
  </DCSection>
);

Object.assign(window, { Frontier, LoneStar, Capitol, DirectionSection });
