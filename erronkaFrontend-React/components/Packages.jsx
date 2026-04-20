// Mis Paquetes list + Package detail

const PackagesScreen = ({ onOpen, packages, onUpdateStatus }) => {
  const [filter, setFilter] = React.useState('all');
  const [query, setQuery] = React.useState('');
  const [view, setView] = React.useState('list');
  const [confirm, setConfirm] = React.useState(null);
  const [toast, setToast] = React.useState(null);

  const all = packages || MOCK.MOCK_PACKAGES;

  const doConfirm = () => {
    onUpdateStatus?.(confirm.pkg.id, confirm.to);
    setToast({ status: confirm.to, name: confirm.pkg.recipient });
    setConfirm(null);
    setTimeout(()=>setToast(null), 3000);
  };
  const counts = {
    all: all.length,
    assigned: all.filter(p=>p.status==='assigned').length,
    in_transit: all.filter(p=>p.status==='in_transit').length,
    delivered: all.filter(p=>p.status==='delivered').length,
    failed: all.filter(p=>p.status==='failed').length,
  };

  const filtered = all.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (query && !(p.recipient.toLowerCase().includes(query.toLowerCase()) ||
                   p.tracking.toLowerCase().includes(query.toLowerCase()))) return false;
    return true;
  });

  return (
    <div style={{display:'flex', flexDirection:'column', gap:20}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:16}}>
        <div>
          <h1 style={{fontSize:24, fontWeight:700, margin:'0 0 4px', letterSpacing:'-0.02em'}}>Mis paquetes</h1>
          <div style={{color:'var(--text-secondary)', fontSize:13}}>
            {all.length} paquetes asignados para el 19 abril
          </div>
        </div>
        <div style={{display:'flex', gap:10}}>
          <div style={{width:260}}>
            <Input
              icon={<I.Search size={16}/>}
              placeholder="Buscar destinatario o tracking"
              value={query} onChange={e=>setQuery(e.target.value)}
            />
          </div>
          <div style={{display:'flex', gap:2, padding:2, background:'var(--bg-surface)',
            border:'1px solid var(--border-normal)', borderRadius:8}} className="view-toggle">
            {[['list', <I.List size={16}/>], ['grid', <I.Grid size={16}/>]].map(([v, ic])=>(
              <button key={v} onClick={()=>setView(v)}
                style={{
                  width:36, height:36, borderRadius:6,
                  background: view===v ? 'var(--accent-subtle)' : 'transparent',
                  color: view===v ? 'var(--accent-light)' : 'var(--text-secondary)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>{ic}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
        <Chip active={filter==='all'} onClick={()=>setFilter('all')} count={counts.all}>Todos</Chip>
        <Chip active={filter==='assigned'} onClick={()=>setFilter('assigned')} count={counts.assigned}>Asignados</Chip>
        <Chip active={filter==='in_transit'} onClick={()=>setFilter('in_transit')} count={counts.in_transit}>En tránsito</Chip>
        <Chip active={filter==='delivered'} onClick={()=>setFilter('delivered')} count={counts.delivered}>Entregados</Chip>
        <Chip active={filter==='failed'} onClick={()=>setFilter('failed')} count={counts.failed}>Fallidos</Chip>
      </div>

      {filtered.length === 0 ? (
        <Card><EmptyState icon={<I.Package size={24}/>} title="Sin resultados" subtitle="Prueba con otra búsqueda o cambia el filtro de estado."/></Card>
      ) : view === 'list' ? (
        <Card padding={0} style={{overflow:'hidden'}}>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'var(--bg-elevated)', borderBottom:'1px solid var(--border-normal)'}}>
                {['Tracking','Destinatario','Dirección','Estado','ETA','Acciones'].map((h,i)=>(
                  <th key={i} style={{
                    textAlign:'left', padding:'12px 20px', fontSize:11, fontWeight:600,
                    color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.05em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i)=>(
                <tr key={p.id}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(124,58,237,0.06)'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  style={{borderBottom: i<filtered.length-1 ? '1px solid var(--border-normal)':'none', transition:'background 160ms'}}>
                  <td style={{padding:'12px 20px'}}><TrackingChip code={p.tracking}/></td>
                  <td style={{padding:'12px 20px'}}>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      <Avatar name={p.recipient} size={28}/>
                      <div>
                        <div style={{fontSize:13, fontWeight:600}}>{p.recipient}</div>
                        <div style={{fontSize:11, color:'var(--text-disabled)'}}>{p.weight}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:'12px 20px', fontSize:13, color:'var(--text-secondary)'}}>{p.address}</td>
                  <td style={{padding:'12px 20px'}}><StatusBadge status={p.status} size="sm"/></td>
                  <td style={{padding:'12px 20px'}} className="mono"><span style={{color:'var(--text-secondary)', fontSize:12}}>{p.eta}</span></td>
                  <td style={{padding:'12px 20px'}}>
                    <div style={{display:'flex', gap:6}}>
                      <Btn variant="soft" size="sm" onClick={()=>onOpen(p.id)}>Ver</Btn>
                      {p.status==='assigned' && <Btn variant="primary" size="sm" onClick={()=>setConfirm({pkg:p, to:'in_transit'})}>En tránsito</Btn>}
                      {p.status==='in_transit' && (
                        <>
                          <Btn variant="primary" size="sm" icon={<I.Check size={14}/>} onClick={()=>setConfirm({pkg:p, to:'delivered'})}>Entregar</Btn>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <div style={{display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))'}}>
          {filtered.map(p => (
            <Card key={p.id} style={{cursor:'pointer', transition:'all 180ms'}}
              onClick={()=>onOpen(p.id)}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--accent-primary)'; e.currentTarget.style.transform='translateY(-2px)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border-normal)'; e.currentTarget.style.transform='translateY(0)';}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14}}>
                <TrackingChip code={p.tracking}/>
                <StatusBadge status={p.status} size="sm"/>
              </div>
              <div style={{fontSize:15, fontWeight:600, marginBottom:4}}>{p.recipient}</div>
              <div style={{fontSize:13, color:'var(--text-secondary)', marginBottom:16, display:'flex', alignItems:'flex-start', gap:6}}>
                <I.MapPin size={14} style={{marginTop:2, flexShrink:0, color:'var(--text-disabled)'}}/>
                {p.address}
              </div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center',
                paddingTop:12, borderTop:'1px solid var(--border-normal)'}}>
                <div style={{fontSize:11, color:'var(--text-disabled)', display:'flex', alignItems:'center', gap:6}}>
                  <I.Clock size={12}/> ETA <span className="mono" style={{color:'var(--text-secondary)'}}>{p.eta}</span>
                </div>
                <span style={{fontSize:11, color:'var(--text-disabled)'}}>Parada #{p.stop}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fade-in" style={{
          position:'fixed', top:24, right:24, zIndex:200,
          background: toast.status==='delivered' ? 'var(--st-delivered-bg)' : 'var(--accent-subtle)',
          border:`1px solid ${toast.status==='delivered' ? 'var(--st-delivered-fg)' : 'var(--accent-primary)'}`,
          color: toast.status==='delivered' ? 'var(--st-delivered-fg)' : 'var(--accent-light)',
          padding:'12px 16px', borderRadius:10,
          display:'flex', alignItems:'center', gap:10, fontSize:13, fontWeight:500,
          boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
        }}>
          {toast.status==='delivered' ? <I.Check size={16} stroke={3}/> : <I.Truck size={16}/>}
          {toast.status==='delivered' ? `Entregado a ${toast.name}` : `Entrega iniciada · ${toast.name}`}
        </div>
      )}

      {confirm && (
        <Modal onClose={()=>setConfirm(null)}>
          <div style={{textAlign:'center', padding:8}}>
            <div style={{
              width:56, height:56, borderRadius:14, margin:'0 auto 16px',
              background: confirm.to==='delivered' ? 'var(--st-delivered-bg)' : 'var(--accent-subtle)',
              color: confirm.to==='delivered' ? 'var(--st-delivered-fg)' : 'var(--accent-light)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              {confirm.to==='delivered' ? <I.Check size={24} stroke={2.5}/> : <I.Truck size={24}/>}
            </div>
            <h3 style={{fontSize:18, fontWeight:700, margin:'0 0 4px'}}>
              {confirm.to==='delivered' ? 'Confirmar entrega' : 'Iniciar entrega'}
            </h3>
            <p style={{color:'var(--text-secondary)', fontSize:13, margin:'0 0 16px'}}>
              {confirm.to==='delivered'
                ? `¿Confirmas la entrega a ${confirm.pkg.recipient}?`
                : `Comienza la entrega a ${confirm.pkg.recipient}.`}
            </p>
            <div style={{
              background:'var(--bg-elevated)', borderRadius:8, padding:12,
              border:'1px solid var(--border-normal)', marginBottom:20, textAlign:'left',
            }}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
                <TrackingChip code={confirm.pkg.tracking}/>
                <span style={{fontSize:11, color:'var(--text-disabled)'}}>Parada #{confirm.pkg.stop}</span>
              </div>
              <div style={{fontSize:13}}>{confirm.pkg.address}</div>
            </div>
            {confirm.to==='delivered' && (
              <div style={{marginBottom:16, textAlign:'left'}}>
                <Label>Nota de entrega (opcional)</Label>
                <textarea placeholder="Ej: Entregado en buzón, firmado por familiar…"
                  style={{
                    width:'100%', padding:'10px 12px', borderRadius:8,
                    background:'var(--bg-elevated)', border:'1px solid var(--border-normal)',
                    color:'var(--text-primary)', fontSize:13, resize:'vertical', minHeight:72,
                    outline:'none', fontFamily:'inherit',
                  }}/>
              </div>
            )}
            <div style={{display:'flex', gap:10}}>
              <Btn variant="soft" fullWidth onClick={()=>setConfirm(null)}>Cancelar</Btn>
              <Btn variant="primary" fullWidth onClick={doConfirm}>Confirmar</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const Modal = ({ children, onClose }) => (
  <div style={{
    position:'fixed', inset:0, zIndex:100,
    background:'rgba(14,11,22,0.75)', backdropFilter:'blur(6px)',
    display:'flex', alignItems:'center', justifyContent:'center', padding:24,
  }} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} className="fade-up" style={{
      background:'var(--bg-surface)',
      border:'1px solid var(--border-normal)',
      borderRadius:16, padding:24, maxWidth:440, width:'100%',
      boxShadow:'0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px var(--accent-subtle)',
    }}>{children}</div>
  </div>
);

const PackageDetail = ({ id, onBack, packages, onUpdateStatus }) => {
  const [confirm, setConfirm] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const all = packages || MOCK.MOCK_PACKAGES;
  const pkg = all.find(p=>p.id===id) || all[2];

  const doAction = (to) => {
    onUpdateStatus?.(pkg.id, to);
    setConfirm(null);
    setToast(to);
    setTimeout(()=>setToast(null), 3000);
  };
  return (
    <div style={{display:'flex', flexDirection:'column', gap:20}}>
      <div style={{display:'flex', alignItems:'center', gap:12, fontSize:13, color:'var(--text-secondary)'}}>
        <button onClick={onBack} style={{color:'var(--text-secondary)', display:'inline-flex', alignItems:'center', gap:4}}>
          <I.ChevronLeft size={14}/> Mis paquetes
        </button>
        <I.ChevronRight size={12}/>
        <span className="mono" style={{color:'var(--accent-light)'}}>{pkg.tracking}</span>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:20}} className="detail-grid">
        <div style={{display:'flex', flexDirection:'column', gap:20}}>
          <Card padding={24}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, gap:16, flexWrap:'wrap'}}>
              <div>
                <div className="mono" style={{
                  fontSize:24, fontWeight:700, letterSpacing:'-0.01em',
                  color:'var(--accent-light)', marginBottom:8,
                }}>{pkg.tracking}</div>
                <StatusBadge status={pkg.status}/>
              </div>
              <div style={{display:'flex', gap:8}}>
                {pkg.status==='assigned' && <Btn variant="primary" icon={<I.Truck size={14}/>} onClick={()=>setConfirm('in_transit')}>Iniciar entrega</Btn>}
                {pkg.status==='in_transit' && (
                  <>
                    <Btn variant="destructive" size="sm" icon={<I.X size={14}/>} onClick={()=>setConfirm('failed')}>Marcar fallido</Btn>
                    <Btn variant="primary" icon={<I.Check size={14}/>} onClick={()=>setConfirm('delivered')}>Marcar entregado</Btn>
                  </>
                )}
              </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:16, marginTop:8}}>
              <DetailRow label="Destinatario" value={pkg.recipient} icon={<I.User size={14}/>}/>
              <DetailRow label="Email" value={pkg.email} icon={<I.Mail size={14}/>}/>
              <DetailRow label="Dirección" value={pkg.address} icon={<I.MapPin size={14}/>} span/>
              <DetailRow label="Peso" value={pkg.weight} icon={<I.Weight size={14}/>}/>
              <DetailRow label="Descripción" value={pkg.description} icon={<I.FileText size={14}/>}/>
              <DetailRow label="Repartidor" value="Mikel Arregi" icon={<I.Truck size={14}/>}/>
              <DetailRow label="Creado" value={pkg.createdAt} icon={<I.Calendar size={14}/>}/>
              <DetailRow label="ETA" value={pkg.eta} icon={<I.Clock size={14}/>}/>
            </div>
          </Card>

          <Card padding={0}>
            <div style={{padding:'16px 24px', borderBottom:'1px solid var(--border-normal)'}}>
              <div style={{fontSize:15, fontWeight:600}}>Historial de estados</div>
              <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:2}}>
                {pkg.history.length} cambios registrados
              </div>
            </div>
            <div style={{padding:'20px 28px', position:'relative'}}>
              <div style={{position:'absolute', top:28, bottom:28, left:41, width:1, background:'var(--border-normal)'}}/>
              {[...pkg.history].reverse().map((h, i)=>{
                const isLatest = i===0;
                return (
                  <div key={i} style={{display:'flex', alignItems:'flex-start', gap:16, padding:'12px 0', position:'relative'}}>
                    <div style={{
                      width:14, height:14, borderRadius:'50%', marginTop:4,
                      background: STATUS[h.status].fg,
                      boxShadow: isLatest
                        ? `0 0 0 4px var(--bg-surface), 0 0 0 6px ${STATUS[h.status].fg}33, 0 0 20px ${STATUS[h.status].fg}88`
                        : `0 0 0 3px var(--bg-surface)`,
                      zIndex:1, flexShrink:0,
                    }}/>
                    <div style={{flex:1}}>
                      <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:2}}>
                        <StatusBadge status={h.status} size="sm"/>
                        {isLatest && <span style={{fontSize:11, color:'var(--accent-light)'}}>Estado actual</span>}
                      </div>
                      <div style={{fontSize:12, color:'var(--text-secondary)'}}>Por {h.actor}</div>
                    </div>
                    <div className="mono" style={{fontSize:11, color:'var(--text-disabled)'}}>{h.time}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <Card padding={0} style={{overflow:'hidden', height:'fit-content'}}>
          <div style={{padding:'16px 20px', borderBottom:'1px solid var(--border-normal)'}}>
            <div style={{fontSize:14, fontWeight:600}}>Ubicación de entrega</div>
          </div>
          <div style={{padding:16}}>
            <MapCanvas
              points={[{lat:pkg.lat, lng:pkg.lng, status:pkg.status, stop:pkg.stop}]}
              height={280} compact showControls={false}
            />
          </div>
          <div style={{padding:'16px 20px', borderTop:'1px solid var(--border-normal)'}}>
            <div style={{fontSize:13, fontWeight:600, marginBottom:4}}>{pkg.address}</div>
            <div style={{fontSize:12, color:'var(--text-secondary)', marginBottom:12}}>
              Gipuzkoa, País Vasco · España
            </div>
            <Btn variant="secondary" fullWidth icon={<I.Navigation size={14}/>}>Abrir en Maps</Btn>
          </div>
        </Card>
      </div>
      <PackageDetailModals confirm={confirm} onClose={()=>setConfirm(null)} onConfirm={()=>doAction(confirm)} toast={toast} pkg={pkg}/>
    </div>
  );
};

const PackageDetailModals = ({ confirm, onClose, onConfirm, toast, pkg }) => (
  <>
    {toast && (
      <div className="fade-in" style={{
        position:'fixed', top:24, right:24, zIndex:200,
        background: toast==='delivered' ? 'var(--st-delivered-bg)' : toast==='failed' ? 'var(--st-failed-bg)' : 'var(--accent-subtle)',
        border:`1px solid ${toast==='delivered' ? 'var(--st-delivered-fg)' : toast==='failed' ? 'var(--st-failed-fg)' : 'var(--accent-primary)'}`,
        color: toast==='delivered' ? 'var(--st-delivered-fg)' : toast==='failed' ? 'var(--st-failed-fg)' : 'var(--accent-light)',
        padding:'12px 16px', borderRadius:10,
        display:'flex', alignItems:'center', gap:10, fontSize:13, fontWeight:500,
        boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
      }}>
        {toast==='delivered' ? <I.Check size={16} stroke={3}/> : toast==='failed' ? <I.AlertCircle size={16}/> : <I.Truck size={16}/>}
        {toast==='delivered' ? 'Entrega confirmada' : toast==='failed' ? 'Marcado como fallido' : 'Entrega iniciada'}
      </div>
    )}
    {confirm && (
      <Modal onClose={onClose}>
        <div style={{textAlign:'center', padding:8}}>
          <div style={{
            width:52, height:52, borderRadius:13, margin:'0 auto 14px',
            background: confirm==='delivered' ? 'var(--st-delivered-bg)' : confirm==='failed' ? 'var(--st-failed-bg)' : 'var(--accent-subtle)',
            color: confirm==='delivered' ? 'var(--st-delivered-fg)' : confirm==='failed' ? 'var(--st-failed-fg)' : 'var(--accent-light)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            {confirm==='delivered' ? <I.Check size={22} stroke={2.5}/> : confirm==='failed' ? <I.AlertCircle size={22}/> : <I.Truck size={22}/>}
          </div>
          <h3 style={{fontSize:17, fontWeight:700, margin:'0 0 6px'}}>
            {confirm==='delivered' ? 'Confirmar entrega' : confirm==='failed' ? 'Marcar como fallido' : 'Iniciar entrega'}
          </h3>
          <p style={{color:'var(--text-secondary)', fontSize:13, margin:'0 0 16px'}}>
            {confirm==='delivered' ? `Confirma la entrega a ${pkg?.recipient}` : confirm==='failed' ? 'El paquete no pudo ser entregado' : `Inicia la entrega a ${pkg?.recipient}`}
          </p>
          {(confirm==='delivered' || confirm==='failed') && (
            <div style={{marginBottom:14, textAlign:'left'}}>
              <Label>{confirm==='failed' ? 'Motivo del fallo' : 'Nota (opcional)'}</Label>
              <textarea placeholder={confirm==='failed' ? 'Ej: Destinatario ausente, sin buzón…' : 'Ej: Entregado en buzón…'}
                style={{width:'100%', padding:'10px 12px', borderRadius:8, background:'var(--bg-elevated)',
                  border:'1px solid var(--border-normal)', color:'var(--text-primary)', fontSize:13,
                  resize:'vertical', minHeight:64, outline:'none', fontFamily:'inherit'}}/>
            </div>
          )}
          <div style={{display:'flex', gap:10}}>
            <Btn variant="soft" fullWidth onClick={onClose}>Cancelar</Btn>
            <Btn variant={confirm==='failed'?'destructive':'primary'} fullWidth onClick={onConfirm}>Confirmar</Btn>
          </div>
        </div>
      </Modal>
    )}
  </>
);

const DetailRow = ({ label, value, icon, span }) => (
  <div style={{gridColumn: span ? 'span 2' : 'auto'}}>
    <div style={{fontSize:11, color:'var(--text-disabled)', textTransform:'uppercase', letterSpacing:'0.05em',
      marginBottom:6, fontWeight:500, display:'flex', alignItems:'center', gap:6}}>
      {icon} {label}
    </div>
    <div style={{fontSize:14, color:'var(--text-primary)', fontWeight:500}}>{value}</div>
  </div>
);

Object.assign(window, { PackagesScreen, PackageDetail, Modal });
