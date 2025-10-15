import ResultCard from './components/ResultCard'
import { useAppState } from './context/ipIntelContext'

export default function App() {
  const { ip, setIp, loading, error, result, history, submit, loadFromHistory } = useAppState()

  return (
    <div className="container">
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="title" style={{ marginBottom: 8 }}>Threat Intelligence Dashboard</div>

        <form className="row" onSubmit={submit} aria-label="IP Form">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter IPv4 or IPv6 (e.g., 8.8.8.8)"
            value={ip}
            onChange={(e) => setIp(e.target.value.trim())}
            aria-label="IP Address"
          />
          <button type="submit" disabled={loading}>
            {loading && <span className="loading-spinner"></span>}
            {loading ? 'Analyzing...' : 'Check'}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: 12, color: 'var(--danger)' }} role="alert">
            {error}
          </div>
        )}

        {history.length > 0 && (
          <>
            <div className="divider" />
            <div style={{ marginBottom: 8 }}>
              <span className="muted small">Recent searches:</span>
            </div>
            <div className="history">
              {history.map((item) => (
                <button
                  key={item.ip}
                  type="button"
                  onClick={() => loadFromHistory(item)}
                  className={ip === item.ip ? 'active' : ''}
                  title={`Click to load ${item.ip}`}
                >
                  {item.ip}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {loading && !result && (
        <div className="loading-card">
          <div className="loading-content">
            <span className="loading-spinner"></span>
            <span className="loading-text">Analyzing IP threat intelligence</span>
          </div>
          <div style={{ marginTop: '2rem' }}>
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-line long"></div>
            <div className="skeleton skeleton-line medium"></div>
            <div className="skeleton skeleton-line short"></div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <div className="skeleton skeleton-badge"></div>
              <div className="skeleton skeleton-badge"></div>
              <div className="skeleton skeleton-badge"></div>
            </div>
          </div>
        </div>
      )}

      {loading && result && (
        <div style={{ position: 'relative' }}>
          <ResultCard data={result} />
          <div className="loading-overlay">
            <div className="loading-content">
              <span className="loading-spinner"></span>
              <span className="loading-text">Updating threat analysis</span>
            </div>
          </div>
        </div>
      )}

      {!loading && result && <ResultCard data={result} />}
    </div>
  )
}
