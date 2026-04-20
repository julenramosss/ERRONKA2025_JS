// Mi Ruta del Día

const RouteScreen = ({ packages, onUpdateStatus }) => {
  const pkgs = packages || MOCK.MOCK_PACKAGES;
  const [active, setActive] = React.useState(() => {
    const t = pkgs.find(p=>p.status==='in_transit');
    return t ? t.stop : pkgs.find(p=>p.status==='assigned')?.stop || 1;
  });
  const [toast, setToast] = React.useState(null);

  React.useEffect(()=>{
    const t = pkgs.find(p=>p.status==='in_transit');
    if (t) setActive(t.stop);
  }, [pkgs]);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null), 2500); };

  const activePkg = pkgs.find(p=>p.stop===active);

  const handleMarkVisited = () => {
    if (!activePkg) return;
    if (activePkg.status === 'assigned') {
      onUpdateStatus?.(activePkg.id, 'in_transit');
      showToast(`Entrega iniciada · ${activePkg.recipient}`);
    } else if (activePkg.status === 'in_transit') {
      onUpdateStatus?.(activePkg.id, 'delivered');
      showToast(`¡Entregado! · ${activePkg.recipient}`);
      // advance to next
      const next = pkgs.find(p=>p.stop > activePkg.stop && p.status !== 'delivered');
      if (next) setActive(next.stop);
    }
  };
  const [mobileTab, setMobileTab] = React.useState('map');

  const completed = pkgs.filter(p=>p.status==='delivered').length;

  return (
    <div style={{display:'flex', flexDirection:'column', gap:16, height:'calc(100vh - 180px)', minHeight:560, position:'relative'}}>
      {toast && (
        <div className="fade-in" style={{
          position:'fixed', top:24, right:24, zIndex:200,
          background:'var(--st-delivered-bg)', border:'1px solid var(--st-delivered-fg)',
          color:'var(--st-delivered-fg)', padding:'12px 16px', borderRadius:10,
          display:'flex', alignItems:'center', gap:10, fontSize:13, fontWeight:500,
          boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
        }}>
          <I.Check size={16} stroke={3}/> {toast}
        </div>
      )}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12}}>
        <div>
          <h1 style={{fontSize:24, fontWeight:700, margin:'0 0 4px', letterSpacing:'-0.02em'}}>
            Mi ruta del día
          </h1>
          <div style={{display:'flex', alignItems:'center', gap:12, fontSize:13, color:'var(--text-secondary)'}}>
            <span>Domingo, 19 abr 2026</span>
            <span style={{width:3, height:3, borderRadius:'50%', background:'var(--text-disabled)'}}/>
            <span style={{
              display:'inline-flex', alignItems:'center', gap:6,
              padding:'2px 10px', borderRadius:9999,
              background:'var(--accent-subtle)', color:'var(--accent-light)',
              border:'1px solid var(--accent-primary)', fontSize:11, fontWeight:600,
            }}>
              <span className="pulse-dot" style={{width:6, height:6, borderRadius:'50%', background:'var(--accent-light)'}}/>
              En curso
            </span>
          </div>
        </div>
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <div style={{display:'flex', gap:20, paddingRight:16, borderRight:'1px solid var(--border-normal)'}}>
            <StatChip value={pkgs.length} label="paradas"/>
            <StatChip value="24.8 km" label="distancia"/>
            <StatChip value="3h 40m" label="estimado"/>
          </div>
        <Btn variant="primary" icon={<I.Truck size={14}/>} onClick={handleMarkVisited}
          disabled={!activePkg || activePkg.status === 'delivered' || activePkg.status === 'failed'}>
          {activePkg?.status === 'in_transit' ? 'Marcar entregada' : activePkg?.status === 'assigned' ? 'Iniciar parada' : 'Sin parada activa'}
        </Btn>
        </div>
      </div>

      <Progress value={(completed/pkgs.length)*100}/>
      <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:-8}}>
        <span style={{color:'var(--accent-light)', fontWeight:600}}>{completed} de {pkgs.length}</span> paradas completadas
      </div>

      <div className="route-layout" style={{display:'grid', gridTemplateColumns:'420px 1fr', gap:16, flex:1, minHeight:0}}>
        <Card padding={0} style={{display:'flex', flexDirection:'column', overflow:'hidden'}}>
          <div style={{padding:'14px 18px', borderBottom:'1px solid var(--border-normal)',
            display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div style={{fontSize:14, fontWeight:600}}>Paradas</div>
            <Btn variant="ghost" size="sm" icon={<I.Filter size={12}/>}>Filtrar</Btn>
          </div>
          <div style={{overflow:'auto', flex:1}}>
            {pkgs.map((p, i) => {
              const isActive = active === p.stop;
              const isPast = p.status === 'delivered';
              return (
                <div key={p.id}
                  onClick={()=>setActive(p.stop)}
                  style={{
                    padding:'14px 18px', display:'flex', gap:12,
                    borderBottom:'1px solid var(--border-normal)',
                    background: isActive ? 'rgba(124,58,237,0.1)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                    cursor:'pointer', transition:'all 180ms',
                    opacity: isPast ? 0.65 : 1,
                  }}>
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:6, paddingTop:2}}>
                    <div style={{
                      width:30, height:30, borderRadius:'50%',
                      background: isPast ? 'var(--st-delivered-bg)' : isActive ? 'var(--accent-primary)' : 'var(--bg-elevated)',
                      color: isPast ? 'var(--st-delivered-fg)' : isActive ? 'white' : 'var(--text-secondary)',
                      border:`1.5px solid ${isPast ? 'var(--st-delivered-fg)' : isActive ? 'var(--accent-primary)' : 'var(--border-normal)'}`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontWeight:700, fontSize:12,
                      boxShadow: isActive ? '0 0 0 4px rgba(124,58,237,0.2)' : 'none',
                    }}>
                      {isPast ? <I.Check size={14} stroke={3}/> : p.stop}
                    </div>
                    {i<pkgs.length-1 && (
                      <div style={{width:2, flex:1, minHeight:20,
                        background: isPast ? 'var(--st-delivered-fg)' : 'var(--border-normal)',
                        opacity: isPast ? 0.4 : 1}}/>
                    )}
                  </div>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8, marginBottom:4}}>
                      <div style={{fontSize:13, fontWeight:600}}>{p.recipient}</div>
                      <StatusBadge status={p.status} size="sm"/>
                    </div>
                    <div style={{fontSize:12, color:'var(--text-secondary)', marginBottom:8, display:'flex', alignItems:'flex-start', gap:4}}>
                      <I.MapPin size={11} style={{marginTop:2, flexShrink:0, color:'var(--text-disabled)'}}/>
                      {p.address}
                    </div>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:8}}>
                      <div style={{fontSize:11, color:'var(--text-disabled)', display:'flex', alignItems:'center', gap:4}}>
                        <I.Clock size={11}/>
                        <span className="mono">{p.eta}</span>
                        {isPast && <span style={{color:'var(--st-delivered-fg)', marginLeft:4}}>✓ 09:18</span>}
                      </div>
                      {isActive && !isPast && (
                        <Btn variant="primary" size="sm" icon={<I.Navigation size={11}/>}>Navegar</Btn>
                      )}
                      {!isActive && !isPast && (
                        <button style={{
                          fontSize:11, color:'var(--accent-light)',
                          display:'inline-flex', alignItems:'center', gap:4,
                        }}>
                          <I.Navigation size={11}/> Navegar
                        </button>
                      )}
                    </div>
                    {isActive && (
                      <div style={{marginTop:10, padding:'6px 10px', borderRadius:6,
                        background:'var(--accent-subtle)', border:'1px solid var(--accent-primary)',
                        fontSize:11, color:'var(--accent-light)', fontWeight:600,
                        display:'inline-flex', alignItems:'center', gap:4,
                      }}>
                        <I.ArrowRight size={11}/> Parada actual
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card padding={0} style={{overflow:'hidden', position:'relative'}}>
          <MapCanvas
            points={pkgs.map(p=>({lat:p.lat, lng:p.lng, status:p.status, stop:p.stop}))}
            origin={{lat:43.145, lng:-2.085}}
            route activeStop={active}
            onPointClick={(p)=>setActive(p.stop)}
            height="100%"
          />
          {/* Active popup */}
          {(() => {
            const p = pkgs.find(x=>x.stop===active);
            if (!p) return null;
            return (
              <div style={{
                position:'absolute', top:16, left:16, width:280,
                background:'rgba(35,29,53,0.96)', backdropFilter:'blur(16px)',
                border:'1px solid var(--accent-primary)',
                borderRadius:12, padding:14,
                boxShadow:'0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px var(--accent-subtle)',
              }}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <div style={{
                      width:22, height:22, borderRadius:'50%',
                      background:'var(--accent-primary)', color:'white',
                      fontSize:11, fontWeight:700,
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>{p.stop}</div>
                    <span style={{fontSize:13, fontWeight:600}}>Parada {p.stop}</span>
                  </div>
                  <StatusBadge status={p.status} size="sm"/>
                </div>
                <div style={{fontSize:13, fontWeight:600, marginBottom:4}}>{p.recipient}</div>
                <div style={{fontSize:12, color:'var(--text-secondary)', marginBottom:10}}>{p.address}</div>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:10,
                  borderTop:'1px solid var(--border-normal)', fontSize:11}}>
                  <span className="mono" style={{color:'var(--text-disabled)'}}>ETA {p.eta}</span>
                  <Btn variant="primary" size="sm" icon={<I.Navigation size={11}/>}>Navegar</Btn>
                </div>
              </div>
            );
          })()}
        </Card>
      </div>
    </div>
  );
};

const StatChip = ({ value, label }) => (
  <div>
    <div style={{fontSize:15, fontWeight:700, letterSpacing:'-0.01em', lineHeight:1}}>{value}</div>
    <div style={{fontSize:10, color:'var(--text-disabled)', textTransform:'uppercase', letterSpacing:'0.05em', marginTop:3}}>{label}</div>
  </div>
);

window.RouteScreen = RouteScreen;
