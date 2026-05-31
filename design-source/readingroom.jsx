/* global React, SocialCluster, Icon */

// ─────────────────────────────────────────────────────────
//  READING ROOM — Archive index (warm paper)
//  The research-analyst face. Calm, editorial, plain-language.
//  No source-record machinery here: that lives inside the atlas
//  products themselves, not on the personal hub.
// ─────────────────────────────────────────────────────────
function ReadingRoom() {
  const C = window.CONTENT;
  const A = C.archive;
  const tierLabel = { flagship: "Flagship", lab: "Lab", research: "Research", essay: "Writing" };
  // sort: flagship first, then lab, research, essay
  const order = { flagship: 0, lab: 1, research: 2, essay: 3 };
  const rows = [...C.projects].sort((a, b) => order[a.tier] - order[b.tier]);

  return (
    <div className="rr" style={{ background: 'var(--paper)' }}>
      {/* nav */}
      <header className="rr-nav">
        <div className="serif rr-wordmark">{C.brand.name}</div>
        <div className="rr-nav-right">
          <nav className="rr-links sans">
            <a className="is-active">Archive</a>
            {C.nav.filter(n => n !== "Archive").map(n => <a key={n}>{n}</a>)}
          </nav>
          <SocialCluster tone="light" />
        </div>
      </header>
      <div className="rr-rule" />

      {/* masthead */}
      <div className="rr-mast">
        <div>
          <div className="eyebrow" style={{ color: 'var(--oxblood)' }}>{A.eyebrow}</div>
          <h1 className="serif rr-h1">{A.headline}</h1>
        </div>
        <p className="serif rr-lede">{A.lede}</p>
      </div>

      {/* filter bar */}
      <div className="rr-filters">
        <div className="rr-filter-group sans">
          {A.filters.map((f, i) => <button key={f} className={`rr-filter ${i === 0 ? 'is-on' : ''}`}>{f}</button>)}
        </div>
        <div className="mono rr-count">{String(rows.length).padStart(2, '0')} PROJECTS</div>
      </div>

      {/* archive rows */}
      <div className="rr-list">
        {rows.map((r) => (
          <article key={r.id} className="rr-row">
            <div className="rr-row-id mono">
              <span className="rr-tier" style={{ color: r.tier === 'flagship' ? 'var(--oxblood)' : 'var(--ink-2)' }}>
                {tierLabel[r.tier]}
              </span>
              <span className="rr-status">{r.status}</span>
            </div>
            <div className="rr-row-main">
              <h2 className="serif rr-title">{r.title}</h2>
              <p className="serif rr-dek">{r.dek}</p>
              <div className="rr-row-ent">
                {r.tags.map(e => <span key={e} className="chip">{e}</span>)}
              </div>
            </div>
            <div className="rr-row-meta">
              <span className="mono rr-typeyear">{r.type} · {r.year}</span>
              <a className="sans rr-open">Open <Icon name="arrow" size={13} /></a>
            </div>
          </article>
        ))}
      </div>

      <footer className="rr-foot">
        <span className="mono rr-foot-l">jinhuayip.com · DC</span>
        <div className="rr-foot-r">
          <span className="mono rr-foot-reach">Reach me</span>
          <SocialCluster tone="light" size={15} />
        </div>
      </footer>
    </div>
  );
}

window.ReadingRoom = ReadingRoom;
