import { Icons } from '../../../components/icons';

// ── Mini components ────────────────────────────────────────────────────────

function TransitBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{
        background: 'var(--st-transit-bg)',
        color: 'var(--st-transit-fg)',
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      Garraioan
    </span>
  );
}

function Progress({ value }: { value: number }) {
  return (
    <div
      className="w-full h-1.5 rounded-full mt-1"
      style={{ background: 'var(--bg-darkest)' }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${value}%`,
          background:
            'linear-gradient(90deg, var(--accent-primary), var(--accent-light))',
        }}
      />
    </div>
  );
}

function FakeMap() {
  // Simulated map with dots and a subtle route line
  const points = [
    { x: 60, y: 140, status: 'delivered' },
    { x: 140, y: 80, status: 'delivered' },
    { x: 220, y: 120, status: 'in_transit' },
    { x: 300, y: 60, status: 'assigned' },
  ];
  const colorMap: Record<string, string> = {
    delivered: 'var(--st-delivered-fg)',
    in_transit: 'var(--st-transit-fg)',
    assigned: 'var(--st-assigned-fg)',
  };
  const polyline = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{ background: 'var(--bg-darkest)' }}
    >
      {/* grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={i * 50}
            x2="360"
            y2={i * 50}
            stroke="var(--border-normal)"
            strokeWidth="1"
          />
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line
            key={`v${i}`}
            x1={i * 60}
            y1="0"
            x2={i * 60}
            y2="200"
            stroke="var(--border-normal)"
            strokeWidth="1"
          />
        ))}
      </svg>
      {/* route + points */}
      <svg className="absolute inset-0 w-full h-full">
        <polyline
          points={polyline}
          fill="none"
          stroke="var(--accent-primary)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity="0.5"
        />
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="10"
              fill={colorMap[p.status]}
              opacity="0.15"
            />
            <circle cx={p.x} cy={p.y} r="5" fill={colorMap[p.status]} />
            <text
              x={p.x + 8}
              y={p.y - 8}
              fill="var(--text-secondary)"
              fontSize="9"
            >
              #{i + 1}
            </text>
          </g>
        ))}
      </svg>
      {/* label */}
      <span
        className="absolute bottom-2 right-3 text-[9px] font-mono"
        style={{ color: 'var(--text-disabled)' }}
      >
        Tolosa · Aduna
      </span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function RightPanel() {
  return (
    <div
      className="relative inset-0 w-full h-full overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, var(--bg-darkest) 0%, var(--bg-dark) 100%)',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 80% 20%, rgba(124,58,237,0.22) 0%, transparent 65%), ' +
            'radial-gradient(ellipse 40% 40% at 20% 80%, rgba(61,41,96,0.3) 0%, transparent 60%)',
        }}
      />

      {/* ── Card 1: Package ───────────────────── top-right, rotate 6deg */}
      <div
        className="absolute"
        style={{
          top: '8%',
          right: '-2%',
          transform: 'rotate(6deg)',
          width: 300,
        }}
      >
        <div
          className="rounded-xl p-4 border"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--border-normal)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="font-mono text-[11px]"
              style={{ color: 'var(--accent-light)' }}
            >
              PKG-261042
            </span>
            <TransitBadge />
          </div>
          <div className="text-sm font-semibold mb-1">Itziar Etxeberria</div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Kale Nagusia 12, Tolosa
          </div>
          <div
            className="mt-3 h-px"
            style={{ background: 'var(--border-normal)' }}
          />
          <div
            className="flex justify-between mt-2.5 text-[11px]"
            style={{ color: 'var(--text-disabled)' }}
          >
            <span>Geldialdia #3</span>
            <span>ETA 10:20</span>
          </div>
        </div>
      </div>

      {/* ── Card 2: Route ─────────────────────── mid-right, rotate -4deg */}
      <div
        className="absolute"
        style={{
          top: '40%',
          right: '12%',
          transform: 'rotate(-4deg)',
          width: 260,
        }}
      >
        <div
          className="rounded-xl p-4 border"
          style={{
            background: 'var(--bg-elevated)',
            borderColor: 'var(--border-normal)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: 'var(--accent-subtle)',
                color: 'var(--accent-light)',
              }}
            >
              <Icons.Truck size={16} />
            </div>
            <div>
              <div
                className="text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                Gaurko ibilbidea
              </div>
              <div className="text-sm font-semibold">8 geldialdia · 24 km</div>
            </div>
          </div>
          <Progress value={62} />
          <div
            className="text-[11px] mt-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span
              className="font-semibold"
              style={{ color: 'var(--accent-light)' }}
            >
              8tik 5
            </span>{' '}
            osatuta
          </div>
        </div>
      </div>

      {/* ── Card 3: Map ───────────────────────── bottom-right, rotate 3deg */}
      <div
        className="absolute"
        style={{
          bottom: '12%',
          right: '6%',
          transform: 'rotate(3deg)',
          width: 340,
          height: 190,
        }}
      >
        <div
          className="rounded-xl overflow-hidden border w-full h-full"
          style={{
            borderColor: 'var(--border-normal)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <FakeMap />
        </div>
      </div>

      {/* ── Headline ──────────────────────────── bottom-left */}
      <div className="absolute bottom-10 left-10 right-10 z-10">
        <h2
          className="font-bold leading-tight"
          style={{ fontSize: 40, letterSpacing: '-0.03em' }}
        >
          Pakete bakoitza
          <br />
          <span style={{ color: 'var(--accent-light)' }}>bere lekuan.</span>
        </h2>
        <p
          className="mt-3 text-sm max-w-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          Adunako banaketa-flotarako operazio-zentroa — ibilbidea, egoera eta
          trazabilitatea pantaila bakarrean.
        </p>
      </div>
    </div>
  );
}
