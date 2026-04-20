// Main App — with shared packages state + full routing

const CRUMBS = {
  dashboard: ['pakAG', 'Dashboard'],
  paquetes: ['pakAG', 'Mis paquetes'],
  paquete: ['pakAG', 'Mis paquetes', 'Detalle'],
  ruta: ['pakAG', 'Mi ruta del día'],
  historial: ['pakAG', 'Historial'],
  'historial-pkg': ['pakAG', 'Historial', 'Detalle'],
  configuracion: ['pakAG', 'Configuración'],
  'admin-usuarios': ['pakAG', 'Administración', 'Usuarios'],
};

const App = () => {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "route": "dashboard",
    "role": "distributor",
    "collapsed": false,
    "accent": "#7C3AED"
  }/*EDITMODE-END*/;

  const saved = (() => {
    try { return JSON.parse(localStorage.getItem('pakag-state')||'null'); } catch { return null; }
  })();

  const [state, setState] = React.useState({ ...TWEAK_DEFAULTS, ...(saved||{}) });
  const [pkgId, setPkgId] = React.useState('pkg-3');
  const [histPkgId, setHistPkgId] = React.useState(null);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);

  // Shared live packages state — mutations propagate everywhere
  const [packages, setPackages] = React.useState(MOCK.MOCK_PACKAGES);

  const updatePkgStatus = (id, newStatus) => {
    setPackages(prev => prev.map(p => {
      if (p.id !== id) return p;
      const now = new Date().toLocaleTimeString('es-ES', {hour:'2-digit', minute:'2-digit'});
      return {
        ...p,
        status: newStatus,
        history: [
          ...p.history,
          { status: newStatus, actor: 'Mikel Arregi', time: `19 abr, ${now}` }
        ]
      };
    }));
  };

  React.useEffect(()=>{
    localStorage.setItem('pakag-state', JSON.stringify(state));
  }, [state]);

  React.useEffect(()=>{
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') setEditMode(true);
      if (e.data?.type === '__deactivate_edit_mode') setEditMode(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({type:'__edit_mode_available'}, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const update = (patch) => {
    setState(s => ({ ...s, ...patch }));
    window.parent.postMessage({type:'__edit_mode_set_keys', edits: patch}, '*');
  };

  const nav = (id, sub) => {
    if (id === 'paquete') { setPkgId(sub); update({route:'paquete'}); return; }
    if (id === 'historial-pkg') { setHistPkgId(sub); update({route:'historial-pkg'}); return; }
    update({ route: id });
  };

  const route = state.route;
  const isAdmin = state.role === 'admin';

  // Auth screens
  if (route === 'login' || route === 'login-error' || route === 'login-loading' || route === 'login-disabled') {
    return (
      <>
        <LoginScreen onSubmit={()=>update({route:'2fa'})}/>
        {editMode && <TweaksPanel state={state} onChange={update}/>}
      </>
    );
  }
  if (route === '2fa') {
    return (
      <>
        <TwoFAScreen onSubmit={()=>update({route:'dashboard'})} onBack={()=>update({route:'login'})}/>
        {editMode && <TweaksPanel state={state} onChange={update}/>}
      </>
    );
  }
  if (route === '404') return <><Error404 onBack={()=>update({route:'dashboard'})}/>{editMode && <TweaksPanel state={state} onChange={update}/>}</>;
  if (route === 'offline') return <><ErrorOffline onRetry={()=>update({route:'dashboard'})}/>{editMode && <TweaksPanel state={state} onChange={update}/>}</>;

  return (
    <div style={{display:'flex', minHeight:'100vh', background:'var(--bg-dark)'}}>
      <div className="desktop-only" style={{display:'flex'}}>
        <Sidebar
          active={['historial-pkg'].includes(route) ? 'historial' : route.startsWith('admin') ? route : route}
          onNav={nav}
          collapsed={state.collapsed}
          onToggle={()=>update({collapsed:!state.collapsed})}
          isAdmin={isAdmin}
        />
      </div>

      <div style={{flex:1, display:'flex', flexDirection:'column', minWidth:0}}>
        <TopBar crumbs={CRUMBS[route] || ['pakAG']} onNotifOpen={()=>setNotifOpen(true)}/>
        <main style={{flex:1, padding:'28px 32px 100px', maxWidth:'100%', minWidth:0, overflow:'auto'}}>
          {route === 'dashboard'     && <DashboardScreen onNav={nav} packages={packages}/>}
          {route === 'paquetes'      && <PackagesScreen onOpen={id=>nav('paquete', id)} packages={packages} onUpdateStatus={updatePkgStatus}/>}
          {route === 'paquete'       && <PackageDetail id={pkgId} onBack={()=>nav('paquetes')} packages={packages} onUpdateStatus={updatePkgStatus}/>}
          {route === 'ruta'          && <RouteScreen packages={packages} onUpdateStatus={updatePkgStatus}/>}
          {route === 'historial'     && <HistoryScreen onOpenPkg={id=>nav('historial-pkg', id)}/>}
          {route === 'historial-pkg' && <HistoryPackageDetail id={histPkgId} onBack={()=>nav('historial')}/>}
          {route === 'configuracion' && <SettingsScreen/>}
          {route === 'denied'        && <AccessDenied onBack={()=>nav('dashboard')}/>}
          {(route.startsWith('admin-') || route==='admin') && (
            isAdmin ? <AdminPlaceholder id={route}/> : <AccessDenied onBack={()=>nav('dashboard')}/>
          )}
        </main>
      </div>

      <div className="mobile-only">
        <BottomNav active={route} onNav={nav}/>
      </div>

      {notifOpen && <NotifPanel onClose={()=>setNotifOpen(false)}/>}
      {editMode && <TweaksPanel state={state} onChange={update}/>}
    </div>
  );
};

const AdminPlaceholder = ({ id }) => (
  <div>
    <div style={{display:'inline-flex', alignItems:'center', gap:8, padding:'4px 12px', borderRadius:9999,
      background:'var(--admin-bg)', color:'var(--admin-fg)', border:'1px solid var(--admin-fg)44',
      fontSize:11, fontWeight:700, letterSpacing:'0.05em', marginBottom:16}}>
      <span style={{width:6, height:6, borderRadius:'50%', background:'var(--admin-fg)'}}/>
      VISTA ADMIN
    </div>
    <h1 style={{fontSize:24, fontWeight:700, margin:'0 0 4px', letterSpacing:'-0.02em'}}>Gestión de usuarios</h1>
    <p style={{color:'var(--text-secondary)', fontSize:13, marginBottom:24}}>Repartidores activos en la flota de pakAG</p>
    <Card padding={0}>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr style={{background:'var(--bg-elevated)', borderBottom:'1px solid var(--border-normal)'}}>
            {['Usuario','Rol','Estado','Paquetes hoy','Tasa éxito','Acciones'].map((h,i)=>(
              <th key={i} style={{textAlign:'left', padding:'12px 20px', fontSize:11, fontWeight:600,
                color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.05em'}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { name:'Mikel Arregi', email:'mikel.arregi@pakag.com', role:'Repartidor', active:true, pkgs:8, rate:97 },
            { name:'Ane Garriz',   email:'ane.garriz@pakag.com',   role:'Admin',      active:true, pkgs:0, rate:'—' },
            { name:'Julen Otaegi', email:'julen.otaegi@pakag.com', role:'Repartidor', active:true, pkgs:6, rate:94 },
            { name:'Nerea Agirre', email:'nerea.agirre@pakag.com', role:'Repartidor', active:true, pkgs:10, rate:99 },
            { name:'Iñaki Beloki', email:'inaki.beloki@pakag.com', role:'Repartidor', active:false, pkgs:0, rate:89 },
          ].map((u, i) => (
            <tr key={i}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(124,58,237,0.06)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}
              style={{borderBottom: i<4 ? '1px solid var(--border-normal)':'none', transition:'background 160ms'}}>
              <td style={{padding:'14px 20px'}}>
                <div style={{display:'flex', alignItems:'center', gap:10}}>
                  <Avatar name={u.name} size={32}/>
                  <div>
                    <div style={{fontSize:13, fontWeight:600}}>{u.name}</div>
                    <div style={{fontSize:11, color:'var(--text-disabled)'}}>{u.email}</div>
                  </div>
                </div>
              </td>
              <td style={{padding:'14px 20px'}}>
                <span style={{
                  padding:'2px 10px', borderRadius:9999, fontSize:11, fontWeight:600,
                  ...(u.role==='Admin'
                    ? {background:'var(--admin-bg)', color:'var(--admin-fg)', border:'1px solid var(--admin-fg)44'}
                    : {background:'var(--accent-subtle)', color:'var(--accent-light)', border:'1px solid var(--accent-primary)'}),
                }}>{u.role.toUpperCase()}</span>
              </td>
              <td style={{padding:'14px 20px'}}>
                <StatusBadge status={u.active?'delivered':'failed'} size="sm"/>
              </td>
              <td style={{padding:'14px 20px', fontSize:13}} className="mono">{u.pkgs}</td>
              <td style={{padding:'14px 20px', fontSize:13}}>
                <span style={{color: typeof u.rate==='number' && u.rate>=95 ? 'var(--st-delivered-fg)' : 'var(--text-primary)'}}>
                  {typeof u.rate==='number' ? u.rate+'%' : u.rate}
                </span>
              </td>
              <td style={{padding:'14px 20px'}}>
                <Btn variant="soft" size="sm">Editar</Btn>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

window.App = App;
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
