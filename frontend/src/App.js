import React, { useState } from 'react';

const API = 'http://localhost:8000';

// ─── Inline styles (no build deps needed) ─────────────────────────────────────
const styles = {
  root: {
    margin: 0,
    padding: 0,
    background: '#0a0a0f',
    minHeight: '100vh',
    fontFamily: '"DM Sans", sans-serif',
    color: '#e8e6df',
  },
  header: {
    borderBottom: '1px solid #1e1e2e',
    padding: '20px 40px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    background: '#0d0d18',
  },
  logo: {
    fontFamily: '"Space Mono", monospace',
    fontSize: 20,
    fontWeight: 700,
    color: '#7c6af7',
    letterSpacing: '-0.5px',
  },
  logoSub: { color: '#4a4a6a', fontSize: 13, fontFamily: '"Space Mono", monospace' },
  main: { maxWidth: 1100, margin: '0 auto', padding: '48px 24px' },

  hero: { textAlign: 'center', marginBottom: 48 },
  heroTitle: {
    fontFamily: '"Space Mono", monospace',
    fontSize: 36,
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-1px',
    lineHeight: 1.2,
    marginBottom: 12,
  },
  heroAccent: { color: '#7c6af7' },
  heroSub: { color: '#6b6b8a', fontSize: 16, lineHeight: 1.6 },

  searchBox: {
    background: '#111120',
    border: '1px solid #2a2a40',
    borderRadius: 12,
    padding: '6px 6px 6px 20px',
    display: 'flex',
    gap: 8,
    maxWidth: 720,
    margin: '0 auto 48px',
    transition: 'border-color 0.2s',
  },
  searchInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#e8e6df',
    fontSize: 16,
    fontFamily: '"DM Sans", sans-serif',
    padding: '10px 0',
  },
  searchBtn: {
    background: '#7c6af7',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '12px 28px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: '"DM Sans", sans-serif',
    transition: 'background 0.2s',
  },
  searchBtnDisabled: {
    background: '#3a3a5a',
    cursor: 'not-allowed',
  },

  statusBar: {
    background: '#111120',
    border: '1px solid #1e1e2e',
    borderRadius: 8,
    padding: '10px 20px',
    marginBottom: 32,
    display: 'flex',
    gap: 24,
    fontSize: 13,
    color: '#6b6b8a',
    fontFamily: '"Space Mono", monospace',
  },
  statusVal: { color: '#7c6af7', fontWeight: 700 },

  sectionTitle: {
    fontFamily: '"Space Mono", monospace',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#7c6af7',
    marginBottom: 16,
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginBottom: 40,
  },

  card: {
    background: '#111120',
    border: '1px solid #1e1e2e',
    borderRadius: 12,
    padding: 20,
    transition: 'border-color 0.2s, transform 0.1s',
    cursor: 'default',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 8,
    lineHeight: 1.4,
  },
  cardMeta: {
    display: 'flex',
    gap: 12,
    marginBottom: 10,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  badge: {
    background: '#1a1a2e',
    border: '1px solid #2a2a40',
    borderRadius: 4,
    padding: '2px 8px',
    fontSize: 11,
    color: '#9b9bc0',
    fontFamily: '"Space Mono", monospace',
  },
  badgeScore: {
    background: '#1a1230',
    border: '1px solid #3d2a7f',
    color: '#7c6af7',
  },
  cardAbstract: {
    fontSize: 13,
    color: '#7a7a9a',
    lineHeight: 1.6,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  cardLink: {
    display: 'inline-block',
    marginTop: 10,
    fontSize: 12,
    color: '#7c6af7',
    textDecoration: 'none',
    fontFamily: '"Space Mono", monospace',
  },

  insightPanel: {
    background: '#0d0d18',
    border: '1px solid #1e1e2e',
    borderRadius: 12,
    padding: 28,
    marginBottom: 40,
  },
  insightGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
  },
  insightSection: { marginBottom: 0 },
  insightSectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#4a4a6a',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
    fontFamily: '"Space Mono", monospace',
  },
  gapItem: {
    background: '#150f25',
    border: '1px solid #2d1f5c',
    borderRadius: 8,
    padding: '10px 14px',
    marginBottom: 8,
  },
  gapArea: { fontSize: 13, fontWeight: 600, color: '#c8b8ff', marginBottom: 4 },
  gapDesc: { fontSize: 12, color: '#7a6aaa', lineHeight: 1.5 },

  trendItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  trendDot: (dir) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: 5,
    background: dir === 'growing' ? '#4ade80' : dir === 'saturated' ? '#f87171' : '#facc15',
  }),
  trendText: { fontSize: 13, color: '#8a8aaa', lineHeight: 1.5 },

  themeChips: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  themeChip: {
    background: '#151530',
    border: '1px solid #2a2a50',
    borderRadius: 20,
    padding: '4px 12px',
    fontSize: 12,
    color: '#a0a0c8',
    fontFamily: '"Space Mono", monospace',
  },

  futureList: { paddingLeft: 0, listStyle: 'none', margin: 0 },
  futureItem: {
    fontSize: 13,
    color: '#7a7aaa',
    lineHeight: 1.6,
    marginBottom: 8,
    paddingLeft: 16,
    position: 'relative',
  },

  error: {
    background: '#200a0a',
    border: '1px solid #5a1a1a',
    borderRadius: 8,
    padding: '16px 20px',
    color: '#f87171',
    fontSize: 14,
    marginBottom: 32,
  },

  loader: {
    textAlign: 'center',
    padding: '60px 0',
    color: '#4a4a6a',
    fontFamily: '"Space Mono", monospace',
    fontSize: 14,
  },
  loaderDot: {
    display: 'inline-block',
    animation: 'pulse 1.4s infinite',
    color: '#7c6af7',
  },

  exampleQueries: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 16,
  },
  exampleBtn: {
    background: '#111120',
    border: '1px solid #2a2a40',
    borderRadius: 20,
    padding: '6px 14px',
    fontSize: 12,
    color: '#7a7a9a',
    cursor: 'pointer',
    fontFamily: '"DM Sans", sans-serif',
    transition: 'all 0.15s',
  },
};

const EXAMPLES = [
  "privacy in federated learning",
  "transformer attention mechanisms NLP",
  "deep learning cancer detection",
  "reinforcement learning robotics",
  "graph neural networks recommendation",
];

// ─── Components ───────────────────────────────────────────────────────────────

function PaperCard({ paper, rank }) {
  const scoreColor = paper.final_score > 0.7 ? '#7c6af7' : paper.final_score > 0.5 ? '#a0a0c8' : '#4a4a6a';
  return (
    <div style={styles.card}>
      <div style={styles.cardMeta}>
        <span style={{ ...styles.badge, color: '#4a4a6a', fontSize: 10 }}>#{rank}</span>
        <span style={{ ...styles.badge, ...styles.badgeScore }}>
          ⭐ {(paper.final_score * 100).toFixed(0)}%
        </span>
        {paper.year && <span style={styles.badge}>{paper.year}</span>}
        {paper.citation_count > 0 && (
          <span style={styles.badge}>🔖 {paper.citation_count.toLocaleString()} citations</span>
        )}
        <span style={{ ...styles.badge, color: paper.source === 'arxiv' ? '#4a8af7' : '#4af7b0' }}>
          {paper.source === 'arxiv' ? 'arXiv' : 'S2'}
        </span>
      </div>
      <div style={styles.cardTitle}>{paper.title}</div>
      {paper.authors.length > 0 && (
        <div style={{ fontSize: 12, color: '#4a4a6a', marginBottom: 8 }}>
          {paper.authors.slice(0, 3).join(', ')}{paper.authors.length > 3 ? ' et al.' : ''}
        </div>
      )}
      <div style={styles.cardAbstract}>{paper.abstract}</div>
      {paper.url && (
        <a href={paper.url} target="_blank" rel="noopener noreferrer" style={styles.cardLink}>
          → View Paper
        </a>
      )}
    </div>
  );
}


function InsightsPanel({ analysis }) {
  return (
    <div style={styles.insightPanel}>
      <div style={styles.sectionTitle}>Analysis &amp; Insights</div>

      {analysis.summary && (
        <div style={{ fontSize: 14, color: '#8a8aaa', lineHeight: 1.7, marginBottom: 24, borderLeft: '3px solid #2a2a50', paddingLeft: 16 }}>
          {analysis.summary}
        </div>
      )}

      <div style={styles.insightGrid}>
        {/* Key Themes */}
        <div style={styles.insightSection}>
          <div style={styles.insightSectionTitle}>Key Themes</div>
          <div style={styles.themeChips}>
            {analysis.key_themes.map((t) => (
              <span key={t} style={styles.themeChip}>{t}</span>
            ))}
          </div>
        </div>

        {/* Future Directions */}
        <div style={styles.insightSection}>
          <div style={styles.insightSectionTitle}>Future Directions</div>
          <ul style={styles.futureList}>
            {analysis.future_directions.map((d, i) => (
              <li key={i} style={styles.futureItem}>
                <span style={{ position: 'absolute', left: 0, color: '#7c6af7' }}>›</span>
                {d}
              </li>
            ))}
          </ul>
        </div>

        {/* Research Gaps */}
        <div style={styles.insightSection}>
          <div style={styles.insightSectionTitle}>Research Gaps Detected</div>
          {(() => {
            const gapsToShow = analysis.semantic_gaps && analysis.semantic_gaps.length > 0 ? analysis.semantic_gaps : analysis.gaps;
            if (gapsToShow.length === 0) {
              return <div style={{ fontSize: 13, color: '#4a4a6a' }}>No significant gaps detected.</div>;
            }
            return gapsToShow.map((g, i) => (
              <div key={i} style={styles.gapItem}>
                <div style={styles.gapArea}>
                  {g.concept || g.area}
                  <span style={g.status === 'covered' ? { color: '#4ade80', fontSize: '12px', fontWeight: '500' } : { color: '#f87171', fontSize: '12px', fontWeight: '500' }}>
                    ({g.status === 'covered' ? 'Covered' : 'Research Gap'} score: {(g.score || 0).toFixed(2)})
                  </span>
                </div>
                {g.description && <div style={styles.gapDesc}>{g.description}</div>}
              </div>
            ));
          })()}
        </div>

        {/* Trends */}
        <div style={styles.insightSection}>
          <div style={styles.insightSectionTitle}>Publication Trends</div>
          {analysis.trends.map((t, i) => (
            <div key={i} style={styles.trendItem}>
              <div style={styles.trendDot(t.direction)} />
              <div>
                <div style={{ fontSize: 13, color: '#c8c8e8', fontWeight: 600, marginBottom: 3 }}>
                  {t.topic}
                  <span style={{
                    fontSize: 10, marginLeft: 8, padding: '2px 6px', borderRadius: 3,
                    background: t.direction === 'growing' ? '#0a2010' : t.direction === 'saturated' ? '#200a0a' : '#1a1a10',
                    color: t.direction === 'growing' ? '#4ade80' : t.direction === 'saturated' ? '#f87171' : '#facc15',
                    fontFamily: '"Space Mono", monospace',
                  }}>
                    {t.direction}
                  </span>
                </div>
                <div style={styles.trendText}>{t.evidence}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleSearch(q) {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Fetching:', `${API}/search`, { query: searchQuery });
      const resp = await fetch(`${API}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, max_results: 12 }),
      });

      console.log('Response status:', resp.status, resp.statusText);
      if (!resp.ok) {
        const errText = await resp.text();
        console.error('API Error:', errText);
        throw new Error(errText || 'Search failed');
      }

      const data = await resp.json();
      console.log('API Response:', data);
      console.log('Papers length:', data.papers?.length || 0);

      setResult(data);

    } catch (err) {
      setError(err.message || 'Could not connect to backend. Is FastAPI running on port 8000?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.root}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        input::placeholder { color: #3a3a5a; }
        .paper-card:hover { border-color: #3a3a60 !important; transform: translateY(-1px); }
        .search-btn:hover:not(:disabled) { background: #6a5ae0 !important; }
        .example-btn:hover { border-color: #7c6af7 !important; color: #c8b8ff !important; }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.logo}>RIS //</div>
          <div style={styles.logoSub}>Research Intelligence System</div>
        </div>
      </div>

      <div style={styles.main}>
        {/* Hero */}
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>
            Discover Research.<br />
            <span style={styles.heroAccent}>Detect Gaps. Find Trends.</span>
          </h1>
          <p style={styles.heroSub}>
            AI-powered semantic search across Semantic Scholar &amp; arXiv.<br />
            Enter any research question — messy or precise.
          </p>
        </div>

        {/* Search */}
        <div style={styles.searchBox}>
          <input
            style={styles.searchInput}
            placeholder="e.g. I'm confused about privacy in federated learning..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            className="search-btn"
            style={{ ...styles.searchBtn, ...(loading ? styles.searchBtnDisabled : {}) }}
            onClick={() => handleSearch()}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Search'}
          </button>
        </div>

        {/* Example queries */}
        {!result && !loading && (
          <div style={styles.exampleQueries}>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                className="example-btn"
                style={styles.exampleBtn}
                onClick={() => { setQuery(ex); handleSearch(ex); }}
              >
                {ex}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={styles.loader}>
            <span style={styles.loaderDot}>■</span>{' '}
            Fetching papers, embedding abstracts, running analysis...
          </div>
        )}

        {/* Error */}
        {error && <div style={styles.error}>⚠ {error}</div>}

        {/* Results */}
        {result && (
          <>
            {/* Status bar */}
            <div style={styles.statusBar}>
              <span>QUERY <span style={styles.statusVal}>"{result.refined_query}"</span></span>
              <span>PAPERS <span style={styles.statusVal}>{result.papers?.length || 0}</span></span>
              <span>FETCHED <span style={styles.statusVal}>{result.total_fetched || 0}</span></span>
              <span>TIME <span style={styles.statusVal}>{result.processing_time_ms?.toFixed(0) || 0}ms</span></span>
            </div>

            {/* Insights Panel */}
            {result.analysis && <InsightsPanel analysis={result.analysis} />}

            {/* Papers Grid */}
            {(!result.papers || result.papers.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '60px 40px', color: '#6b6b8a', fontFamily: '"Space Mono", monospace', fontSize: 14 }}>
                <div style={{ marginBottom: 16 }}>📄 No papers found for "{result.query}"</div>
                <div>Backend returned {result.papers?.length || 0} papers. Check browser console (F12 → Console) for full API response.</div>
                <div style={{ marginTop: 24 }}>
                  <button
                    style={styles.searchBtn}
                    onClick={() => handleSearch('federated learning privacy')}
                  >
                    🔄 Test Query: federated learning privacy
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={styles.sectionTitle}>Top Papers ({result.papers.length})</div>
                <div style={styles.grid}>
                  {result.papers.map((paper, i) => (
                    <PaperCard key={paper.id} paper={paper} rank={i + 1} />
                  ))}
                </div>
              </>
            )}
          </>
        )}


      </div>
    </div>
  );
}
