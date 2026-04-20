// Dashboard screen

const StatCard = ({ label, value, icon, color = 'var(--accent-light)', delta, bg = 'var(--accent-subtle)' }) => (
  <Card padding={18} style={{position:'relative', overflow:'hidden'}}>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12}}>
      <div style={{
        width:36, height:36, borderRadius:10,
        background: bg, color,
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>{icon}</div>
      {delta && (
        <span style={{fontSize:11, color:'var(--text-secondary)', display:'inline-flex', alignItems:'center', gap:4}}>
          <I.TrendingUp size={11}/> {delta}
        </span>
      )}
    </div>
    <div style={{fontSize:28, fontWeight:700, letterSpacing:'-0.02em', lineHeight:1}}>{value}</div>
    <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:6}}>{label}</div>
  </Card>
);

const DashboardScreen = ({ onNav, packages }) => {
  const pkgs = packages || MOCK.MOCK_PACKAGES;
  const delivered = pkgs.filter(p=>p.status==='delivered').length;
  const transit = pkgs.filter(p=>p.status==='in_transit').length;
  const assigned = pkgs.filter(p=>p.status==='assigned').length;
  const next = pkgs.filter(p=>p.status!=='delivered').slice(0, 4);

  return (
    <div style={{display:'flex', flexDirection:'column', gap:20}}>
      {/* Welcome */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16}}>
        <div>
          <div style={{fontSize:12, color:'var(--accent-light)', letterSpacing:'0.05em', textTransform:'uppercase', fontWeight:500, marginBottom:6}}>
            Domingo · 19 abril 2026
          </div>
          <h1 style={{fontSize:28, fontWeight:700, margin:'0 0 8px', letterSpacing:'-0.02em'}}>
            Egun on, Mikel 👋
          </h1>
          <div style={{color:'var(--text-secondary)', fontSize:14}}>
            Tienes <span style={{color:'var(--accent-light)', fontWeight:600}}>{assigned + transit} paquetes pendientes</span> de entrega hoy · Ruta estimada {Math.round(24.8)} km
          </div>
        </div>
        <Btn variant="primary" icon={<I.Route size={16}/>} onClick={()=>onNav('ruta')}>
          Iniciar ruta
        </Btn>
      </div>

      {/* Stats */}
      <div style={{
        display:'grid', gap:16,
        gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',
      }}>
        <StatCard label="Asignados hoy" value={pkgs.length} icon={<I.Package size={18}/>}
          color="var(--accent-light)" bg="var(--accent-subtle)" delta="+2 vs ayer"/>
        <StatCard label="Entregados hoy" value={delivered} icon={<I.Check size={18} stroke={2.5}/>}
          color="var(--st-delivered-fg)" bg="var(--st-delivered-bg)"/>
        <StatCard label="En tránsito" value={transit} icon={<I.Truck size={18}/>}
          color="var(--st-transit-fg)" bg="var(--st-transit-bg)"/>
        <StatCard label="Fallidos hoy" value={0} icon={<I.AlertCircle size={18}/>}
          color="var(--st-failed-fg)" bg="var(--st-failed-bg)"/>
      </div>

      {/* Map + Next deliveries */}
      <div style={{display:'grid', gridTemplateColumns:'1.35fr 1fr', gap:20}} className="dash-grid">
        <Card padding={0} style={{overflow:'hidden'}}>
          <div style={{padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center',
            borderBottom:'1px solid var(--border-normal)'}}>
            <div>
              <div style={{fontSize:15, fontWeight:600}}>Vista de ruta</div>
              <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:2}}>
                8 paradas · Elduaien → Tolosa → Aduna
              </div>
            </div>
            <Btn variant="ghost" size="sm" iconRight={<I.ArrowRight size={14}/>} onClick={()=>onNav('ruta')}>
              Ver ruta completa
            </Btn>
          </div>
          <div style={{padding:16}}>
            <MapCanvas
              points={pkgs.map(p=>({lat:p.lat, lng:p.lng, status:p.status, stop:p.stop}))}
              origin={{lat:43.145, lng:-2.085}}
              route activeStop={3} height={340}
            />
          </div>
        </Card>

        <Card padding={0}>
          <div style={{padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center',
            borderBottom:'1px solid var(--border-normal)'}}>
            <div>
              <div style={{fontSize:15, fontWeight:600}}>Próximas entregas</div>
              <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:2}}>
                Paradas en orden
              </div>
            </div>
            <Btn variant="ghost" size="sm" onClick={()=>onNav('paquetes')}>Ver todas</Btn>
          </div>
          <div>
            {next.map((p, i)=>(
              <div key={p.id} style={{
                display:'flex', alignItems:'center', gap:12, padding:'14px 20px',
                borderBottom: i<next.length-1 ? '1px solid var(--border-normal)' : 'none',
                cursor:'pointer',
              }} onMouseEnter={e=>e.currentTarget.style.background='var(--bg-elevated)'}
                 onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                 onClick={()=>onNav('paquete', p.id)}>
                <div style={{
                  width:32, height:32, borderRadius:'50%', flexShrink:0,
                  background:'var(--accent-subtle)', color:'var(--accent-light)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontWeight:700, fontSize:13, border:'1px solid var(--accent-primary)',
                }}>{p.stop}</div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:13, fontWeight:600, marginBottom:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                    {p.recipient}
                  </div>
                  <div style={{fontSize:12, color:'var(--text-secondary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                    {p.address}
                  </div>
                </div>
                <div style={{textAlign:'right', flexShrink:0}}>
                  <div style={{fontSize:12, color:'var(--text-disabled)', marginBottom:4}} className="mono">{p.eta}</div>
                  <StatusBadge status={p.status} size="sm"/>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Activity timeline */}
      <Card padding={0}>
        <div style={{padding:'16px 20px', borderBottom:'1px solid var(--border-normal)'}}>
          <div style={{fontSize:15, fontWeight:600}}>Actividad reciente</div>
          <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:2}}>Últimas actualizaciones de estado</div>
        </div>
        <div style={{padding:'20px 24px', position:'relative'}}>
          <div style={{position:'absolute', top:32, bottom:32, left:37, width:1, background:'var(--border-normal)'}}/>
          {[
            { time:'09:42', text:'Entregado a Itziar Etxeberria', detail:'PKG-261042 · Tolosa', status:'delivered' },
            { time:'09:18', text:'Entregado a Jon Aranburu', detail:'BLK-261043 · Aduna', status:'delivered' },
            { time:'08:55', text:'Iniciaste la entrega', detail:'AGT-261044 · Elduaien', status:'in_transit' },
            { time:'08:25', text:'Admin asignó 8 paquetes nuevos', detail:'Ruta del 19 abril', status:'assigned' },
          ].map((a, i)=>(
            <div key={i} style={{display:'flex', alignItems:'flex-start', gap:16, padding:'10px 0', position:'relative'}}>
              <div style={{
                width:14, height:14, borderRadius:'50%', marginTop:4,
                background:STATUS[a.status].fg,
                boxShadow:`0 0 0 3px var(--bg-surface), 0 0 12px ${STATUS[a.status].fg}66`,
                flexShrink:0, zIndex:1,
              }}/>
              <div style={{flex:1}}>
                <div style={{fontSize:13, fontWeight:500}}>{a.text}</div>
                <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:2}}>{a.detail}</div>
              </div>
              <div className="mono" style={{fontSize:11, color:'var(--text-disabled)'}}>{a.time}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

window.DashboardScreen = DashboardScreen;
