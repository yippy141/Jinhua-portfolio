/* global React, SocialCluster, Icon */
const { useState } = React;

// A faint, low-poly whale silhouette (drifts behind everything).
// ── To use your OWN whale art: replace this <path d="…"> with your SVG path,
//    or drop an <img src="whales/your-file.svg"> inside .whale-drift. ──
function WhaleSilhouette({ style, flip }) {
  return (
    <svg className="whale-drift" viewBox="0 0 240 90" style={style} aria-hidden="true"
         preserveAspectRatio="xMidYMid meet">
      <g transform={flip ? "scale(-1,1) translate(-240,0)" : ""}>
        <path d="M6 46 C40 22 96 16 150 26 C176 31 198 30 214 22 L226 8 L232 30 C234 40 232 50 224 56
                 C206 50 184 52 168 48 C150 70 110 80 70 76 C44 73 20 64 6 46 Z
                 M150 30 C150 38 152 44 156 48"
              fill="currentColor" />
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
//  FRONT DOOR A — "Living Graph"
//  Deep water. Drifting nodes ARE the concept graph.
//  Three distinct registers: faint italic-serif taxonomy (back),
//  sharp mono node labels (mid), bright upright-serif hero (front).
// ─────────────────────────────────────────────────────────
function FrontDoorA() {
  const C = window.CONTENT;
  const P = C.projects;
  const byId = Object.fromEntries(P.map(p => [p.id, p]));
  const [active, setActive] = useState("irwv");
  const act = byId[active];

  return (
    <div className="fd" style={{ background: 'var(--d-paper)' }}>
      <div className="fd-fog" />

      {/* ── BACK register: faint italic-serif whale taxonomy + silhouettes ── */}
      <div className="whale-layer" aria-hidden="true">
        {C.taxonomy.map((t, i) => (
          <span key={i} className="serif tax-word" style={{
            top: `${6 + (i * 9.3) % 88}%`,
            animationDuration: `${85 + (i % 5) * 18}s`,
            animationDelay: `${-(i * 11) % 90}s`,
            fontSize: `${22 + (i % 4) * 11}px`,
            opacity: 0.05 + (i % 3) * 0.018,
          }}>{t}</span>
        ))}
        <WhaleSilhouette style={{ top: '62%', width: 320, animationDuration: '120s', animationDelay: '-20s', opacity: 0.06 }} />
        <WhaleSilhouette flip style={{ top: '20%', width: 200, animationDuration: '165s', animationDelay: '-90s', opacity: 0.04 }} />
      </div>

      {/* graph links */}
      <svg className="fd-graph" viewBox="0 0 1440 900" preserveAspectRatio="none">
        {C.links.map(([a, b], i) => {
          const A = byId[a], B = byId[b];
          const lit = a === active || b === active;
          return <line key={i} x1={A.x / 100 * 1440} y1={A.y / 100 * 900} x2={B.x / 100 * 1440} y2={B.y / 100 * 900}
            stroke={lit ? 'var(--sonar)' : 'var(--d-rule)'} strokeWidth="1" opacity={lit ? 0.55 : 0.7} />;
        })}
      </svg>

      {/* ── MID register: nodes with readable mono labels ── */}
      {P.map((p, i) => {
        const isFlag = p.tier === 'flagship';
        const isActive = p.id === active;
        return (
          <div key={p.id} className="fd-node" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            animationDelay: `${-i * 1.6}s`, animationDuration: `${15 + (i % 5) * 3}s`,
            zIndex: isActive ? 7 : 4,
          }}
            onMouseEnter={() => setActive(p.id)}>
            <span className="fd-dot" style={{
              width: p.r * 2, height: p.r * 2,
              borderColor: isFlag ? 'var(--d-oxblood)' : (isActive ? 'var(--sonar)' : 'var(--d-ink-2)'),
              background: isFlag ? 'rgba(194,104,92,0.18)' : (isActive ? 'rgba(79,179,191,0.12)' : 'rgba(157,176,168,0.05)'),
            }} />
            <span className="fd-label mono" style={{
              color: isFlag ? 'var(--d-oxblood)' : (isActive ? 'var(--sonar)' : 'var(--d-ink-2)'),
            }}>{p.node}</span>
          </div>
        );
      })}

      {/* active-node dossier (hover→expand→play; video slot is a drop-in) */}
      <div className="fd-pop" style={{
        left: `${act.x}%`, top: `${act.y}%`,
        transform: act.x > 70 ? 'translate(-272px,-50%)' : 'translate(30px,-50%)',
        borderColor: act.tier === 'flagship' ? 'var(--d-oxblood)' : 'var(--sonar)',
      }}>
        <div className="fd-pop-head">
          <span className="mono fd-pop-kicker">{act.type} · {act.year}</span>
          <span className="mono fd-pop-status">{act.status}</span>
        </div>
        <div className="fd-pop-video">
          {/* Replace this block with: <video src={act.video} muted loop autoPlay playsInline /> */}
          <div className="fd-pop-scan" />
          <span className="mono fd-pop-rec">▶ DEMO LOOP {act.video ? '· ready' : '· placeholder'}</span>
        </div>
        <div className="fd-pop-title serif">{act.title}</div>
        <p className="fd-pop-dek serif">{act.dek}</p>
        <div className="fd-pop-foot">
          <span className="mono fd-pop-open">Open project</span>
          <Icon name="arrow" size={13} />
        </div>
      </div>

      {/* nav */}
      <header className="fd-nav">
        <a className="fd-brand" href="#">
          <div className="serif fd-wordmark">{C.brand.name}</div>
          <div className="mono fd-tag">{C.brand.tagline}</div>
        </a>
        <div className="fd-nav-right">
          <nav className="fd-links sans">
            {C.nav.map(n => <a key={n}>{n}</a>)}
          </nav>
          <SocialCluster tone="dark" />
        </div>
      </header>

      {/* hero — FRONT register */}
      <main className="fd-hero">
        <div className="eyebrow" style={{ color: 'var(--sonar)' }}>{C.hero.eyebrow}</div>
        <h1 className="serif fd-h1">{C.hero.headline}</h1>
        <p className="mono fd-positioning">↳ {C.hero.positioning}</p>
        <div className="fd-cta">
          <a className="sans fd-enter">{C.hero.ctaPrimary} <Icon name="arrow" size={14} /></a>
          <span className="mono fd-drift">{C.hero.ctaHint}</span>
        </div>
      </main>

      <footer className="fd-foot mono">
        {C.frontFooter.map((f, i) => <span key={i}>{f}</span>)}
      </footer>
    </div>
  );
}

window.FrontDoorA = FrontDoorA;
