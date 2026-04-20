// Stylized SVG "map" that fits pakAG dark theme — no external APIs
// Renders a dark-mode roadmap with purple accents, numbered markers, route polyline

const MapCanvas = ({
  points = [],          // [{lat, lng, status, stop}]
  route = false,        // draw connected polyline
  origin = null,        // {lat, lng}
  activeStop = null,
  onPointClick,
  height = 420,
  compact = false,
  showControls = true,
}) => {
  // Project lat/lng to SVG space. Simple linear projection with padding.
  const all = [...points, ...(origin?[origin]:[])];
  const lats = all.map(p=>p.lat), lngs = all.map(p=>p.lng);
  const pad = 0.015;
  const minLat = Math.min(...lats) - pad, maxLat = Math.max(...lats) + pad;
  const minLng = Math.min(...lngs) - pad, maxLng = Math.max(...lngs) + pad;
  const W = 1200, H = 700;
  const project = (lat, lng) => ({
    x: ((lng - minLng) / (maxLng - minLng)) * W,
    y: H - ((lat - minLat) / (maxLat - minLat)) * H,
  });

  // Procedural decorative roads (deterministic)
  const roads = React.useMemo(() => {
    const paths = [];
    // horizontal arterial
    paths.push(`M 0 ${H*0.55} C ${W*0.3} ${H*0.45}, ${W*0.6} ${H*0.65}, ${W} ${H*0.4}`);
    paths.push(`M 0 ${H*0.2} C ${W*0.4} ${H*0.3}, ${W*0.6} ${H*0.1}, ${W} ${H*0.25}`);
    paths.push(`M 0 ${H*0.85} C ${W*0.25} ${H*0.75}, ${W*0.55} ${H*0.95}, ${W} ${H*0.7}`);
    paths.push(`M ${W*0.15} 0 C ${W*0.2} ${H*0.4}, ${W*0.1} ${H*0.7}, ${W*0.2} ${H}`);
    paths.push(`M ${W*0.55} 0 C ${W*0.6} ${H*0.3}, ${W*0.5} ${H*0.6}, ${W*0.58} ${H}`);
    paths.push(`M ${W*0.8} 0 C ${W*0.85} ${H*0.35}, ${W*0.78} ${H*0.65}, ${W*0.83} ${H}`);
    return paths;
  }, []);

  const secondaryRoads = React.useMemo(() => {
    const out = [];
    for (let i=0;i<14;i++) {
      const x1 = (i*0.09) * W + (i%2?40:0);
      const y1 = ((i*0.11)%1) * H;
      const x2 = x1 + 120 + (i%3)*60;
      const y2 = y1 + 80 + (i%2)*40;
      out.push(`M ${x1} ${y1} L ${x2} ${y2}`);
    }
    return out;
  }, []);

  const projected = points.map(p => ({ ...p, ...project(p.lat, p.lng) }));
  const originProj = origin ? { ...origin, ...project(origin.lat, origin.lng) } : null;

  const routePath = route && projected.length > 1
    ? (originProj ? `M ${originProj.x} ${originProj.y} ` : `M ${projected[0].x} ${projected[0].y} `)
      + projected.map((p,i) => {
          if (i===0 && !originProj) return '';
          const prev = i===0 ? originProj : projected[i-1];
          const cx = (prev.x + p.x)/2 + ((i%2)?30:-30);
          const cy = (prev.y + p.y)/2 + ((i%2)?-20:20);
          return `Q ${cx} ${cy} ${p.x} ${p.y}`;
        }).join(' ')
    : null;

  const statusColor = (s) => ({
    pending: '#F59E0B', assigned: '#3B82F6', in_transit: '#A78BFA',
    delivered: '#10B981', failed: '#EF4444',
  })[s] || '#A78BFA';

  return (
    <div style={{
      position:'relative', width:'100%', height, borderRadius: 12,
      overflow:'hidden',
      background:'linear-gradient(135deg, #0E0B16 0%, #1A1626 50%, #231D35 100%)',
      border:'1px solid var(--border-normal)',
      boxShadow: 'inset 0 0 80px rgba(124,58,237,0.08)',
    }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice"
        style={{position:'absolute', inset:0, width:'100%', height:'100%'}}>
        <defs>
          <pattern id="mapgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#231D35" strokeWidth="1" opacity="0.6"/>
          </pattern>
          <radialGradient id="water" cx="30%" cy="70%">
            <stop offset="0%" stopColor="#14102A"/>
            <stop offset="100%" stopColor="#0E0B16"/>
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="softglow">
            <feGaussianBlur stdDeviation="8"/>
          </filter>
        </defs>

        {/* water/base */}
        <rect width={W} height={H} fill="url(#water)"/>

        {/* land blobs */}
        <path d={`M 0 ${H*0.3} C ${W*0.3} ${H*0.1}, ${W*0.7} ${H*0.4}, ${W} ${H*0.2} L ${W} ${H} L 0 ${H} Z`} fill="#14102A" opacity="0.7"/>
        <path d={`M 0 ${H*0.5} C ${W*0.2} ${H*0.4}, ${W*0.5} ${H*0.7}, ${W} ${H*0.55} L ${W} ${H} L 0 ${H} Z`} fill="#1A1626" opacity="0.8"/>

        {/* grid */}
        <rect width={W} height={H} fill="url(#mapgrid)"/>

        {/* secondary roads */}
        {secondaryRoads.map((d,i)=>(
          <path key={i} d={d} stroke="#2D2545" strokeWidth="4" fill="none" opacity="0.7"/>
        ))}

        {/* primary roads */}
        {roads.map((d,i)=>(
          <g key={i}>
            <path d={d} stroke="#3D2960" strokeWidth="10" fill="none" opacity="0.6"/>
            <path d={d} stroke="#2D2545" strokeWidth="6" fill="none"/>
          </g>
        ))}

        {/* poi hints */}
        {[[0.2,0.3],[0.7,0.25],[0.4,0.75],[0.85,0.6]].map(([x,y],i)=>(
          <circle key={i} cx={x*W} cy={y*H} r="22" fill="#3D2960" opacity="0.15"/>
        ))}

        {/* route */}
        {routePath && (
          <>
            <path d={routePath} stroke="#7C3AED" strokeWidth="5" fill="none" opacity="0.25" filter="url(#softglow)"/>
            <path d={routePath} stroke="#A78BFA" strokeWidth="3" fill="none" strokeDasharray="8 6" strokeLinecap="round"/>
          </>
        )}

        {/* origin */}
        {originProj && (
          <g transform={`translate(${originProj.x},${originProj.y})`}>
            <circle r="22" fill="#7C3AED" opacity="0.25" filter="url(#softglow)"/>
            <rect x="-14" y="-14" width="28" height="28" rx="7" fill="#231D35" stroke="#7C3AED" strokeWidth="2"/>
            <path d="M -6 -2 L 0 -8 L 6 -2 L 6 6 L -6 6 Z" fill="#A78BFA"/>
          </g>
        )}

        {/* markers */}
        {projected.map((p, i) => {
          const c = statusColor(p.status);
          const isActive = activeStop === p.stop;
          return (
            <g key={i} transform={`translate(${p.x},${p.y})`}
              style={{cursor:'pointer'}}
              onClick={()=>onPointClick?.(p)}>
              {isActive && <circle r="26" fill={c} opacity="0.2" className="pulse-dot"/>}
              <circle r="18" fill={c} opacity="0.22"/>
              <path d="M 0 -22 C -10 -22 -16 -14 -16 -6 C -16 4 -6 14 0 22 C 6 14 16 4 16 -6 C 16 -14 10 -22 0 -22 Z"
                fill="#231D35" stroke={c} strokeWidth="2.5"/>
              <circle cx="0" cy="-6" r="10" fill={c}/>
              <text x="0" y="-2" textAnchor="middle" fontSize="12" fontWeight="700" fill="white" fontFamily="Inter">
                {p.stop}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Controls */}
      {showControls && (
        <div style={{
          position:'absolute', top:12, right:12,
          display:'flex', flexDirection:'column', gap:6,
        }}>
          {[<I.Plus size={16}/>, <span style={{fontSize:16,fontWeight:600}}>−</span>, <I.Navigation size={15}/>, <I.Layers size={15}/>].map((icon,i)=>(
            <button key={i} style={{
              width:36, height:36, borderRadius:8,
              background:'rgba(35,29,53,0.9)', backdropFilter:'blur(8px)',
              border:'1px solid var(--border-normal)',
              color:'var(--text-primary)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>{icon}</button>
          ))}
        </div>
      )}

      {/* Legend */}
      {!compact && (
        <div style={{
          position:'absolute', bottom:12, left:12,
          display:'flex', gap:6, alignItems:'center',
          background:'rgba(14,11,22,0.85)', backdropFilter:'blur(8px)',
          padding:'6px 10px', borderRadius:8,
          border:'1px solid var(--border-normal)',
          fontSize:11, color:'var(--text-secondary)',
        }}>
          <span style={{width:6,height:6,borderRadius:'50%', background:'#A78BFA'}}/> En tránsito
          <span style={{width:4}}/>
          <span style={{width:6,height:6,borderRadius:'50%', background:'#10B981'}}/> Entregado
          <span style={{width:4}}/>
          <span style={{width:6,height:6,borderRadius:'50%', background:'#3B82F6'}}/> Asignado
        </div>
      )}

      {/* Attribution stylized */}
      <div style={{
        position:'absolute', bottom:8, right:12,
        fontSize:10, color:'var(--text-disabled)', letterSpacing:'0.05em'
      }}>pakMaps · Gipuzkoa</div>
    </div>
  );
};

window.MapCanvas = MapCanvas;
