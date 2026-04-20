// Main App shell: Sidebar + TopBar + Router

const NAV_ITEMS = [
  { id:'dashboard', label:'Dashboard', icon:<I.Home size={18}/> },
  { id:'paquetes', label:'Mis paquetes', icon:<I.Package size={18}/>, badge:8 },
  { id:'ruta', label:'Mi ruta', icon:<I.Route size={18}/> },
  { id:'historial', label:'Historial', icon:<I.History size={18}/> },
  { id:'configuracion', label:'Configuración', icon:<I.Settings size={18}/> },
];

const ADMIN_ITEMS = [
  { id:'admin-dashboard', label:'Dashboard global', icon:<I.Gauge size={18}/> },
  { id:'admin-paquetes', label:'Todos los paquetes', icon:<I.Box size={18}/> },
  { id:'admin-usuarios', label:'Usuarios', icon:<I.Users size={18}/> },
  { id:'admin-rutas', label:'Rutas', icon:<I.Route size={18}/> },
];

const Sidebar = ({ active, onNav, collapsed, onToggle, isAdmin }) => {
  const W = collapsed ? 68 : 240;
  return (
    <aside style={{
      width: W, minWidth: W, background:'var(--bg-surface)',
      borderRight:'1px solid var(--border-normal)',
      display:'flex', flexDirection:'column',
      transition:'width 220ms cubic-bezier(.2,.7,.2,1)',
      position:'relative',
    }}>
      <div style={{
        padding: collapsed ? '20px 14px' : '20px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        borderBottom:'1px solid var(--border-normal)',
        minHeight:64,
      }}>
        {collapsed ? <PakLogo size={28} showText={false}/> : <PakLogo size={28}/>}
        {!collapsed && (
          <button onClick={onToggle} className="focus-ring"
            style={{width:28, height:28, borderRadius:6, color:'var(--text-secondary)',
              display:'flex', alignItems:'center', justifyContent:'center'}}>
            <I.PanelLeft size={15}/>
          </button>
        )}
      </div>

      <nav style={{flex:1, padding:12, display:'flex', flexDirection:'column', gap:2, overflow:'auto'}}>
        {!collapsed && <div style={{fontSize:10, fontWeight:600, color:'var(--text-disabled)',
          textTransform:'uppercase', letterSpacing:'0.08em', padding:'10px 12px 6px'}}>
          Distribuidor
        </div>}
        {NAV_ITEMS.map(item => (
          <NavButton key={item.id} item={item} active={active===item.id} collapsed={collapsed}
            onClick={()=>onNav(item.id)}/>
        ))}

        {isAdmin && (
          <>
            {!collapsed && <div style={{fontSize:10, fontWeight:600, color:'var(--admin-fg)',
              textTransform:'uppercase', letterSpacing:'0.08em', padding:'20px 12px 6px',
              display:'flex', alignItems:'center', gap:6}}>
              <span style={{width:4, height:4, borderRadius:'50%', background:'var(--admin-fg)'}}/>
              Administración
            </div>}
            {collapsed && <div style={{height:1, background:'var(--border-normal)', margin:'12px 8px'}}/>}
            {ADMIN_ITEMS.map(item => (
              <NavButton key={item.id} item={{...item, admin:true}} active={active===item.id} collapsed={collapsed}
                onClick={()=>onNav(item.id)}/>
            ))}
          </>
        )}
      </nav>

      <div style={{
        padding: collapsed ? 10 : 12,
        borderTop:'1px solid var(--border-normal)',
      }}>
        <div style={{
          padding: collapsed ? 8 : 10, borderRadius:10,
          background:'var(--bg-elevated)',
          display:'flex', alignItems:'center', gap:10,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          <Avatar name="Mikel Arregi" size={36}/>
          {!collapsed && (
            <>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:13, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>Mikel Arregi</div>
                <div style={{display:'flex', alignItems:'center', gap:4, marginTop:2}}>
                  {isAdmin ? (
                    <span style={{fontSize:9, fontWeight:700, padding:'1px 6px', borderRadius:4,
                      background:'var(--admin-bg)', color:'var(--admin-fg)',
                      border:'1px solid var(--admin-fg)44', letterSpacing:'0.05em'}}>ADMIN</span>
                  ) : (
                    <span style={{fontSize:9, fontWeight:700, padding:'1px 6px', borderRadius:4,
                      background:'var(--accent-subtle)', color:'var(--accent-light)',
                      border:'1px solid var(--accent-primary)', letterSpacing:'0.05em'}}>REPARTIDOR</span>
                  )}
                </div>
              </div>
              <button className="focus-ring" style={{
                width:28, height:28, borderRadius:6, color:'var(--text-secondary)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }} title="Cerrar sesión"><I.LogOut size={14}/></button>
            </>
          )}
        </div>
        {collapsed && (
          <button onClick={onToggle} style={{
            width:'100%', marginTop:8, height:32, borderRadius:6,
            color:'var(--text-secondary)', display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <I.ChevronRight size={14}/>
          </button>
        )}
      </div>
    </aside>
  );
};

const NavButton = ({ item, active, collapsed, onClick }) => {
  const color = item.admin ? 'var(--admin-fg)' : 'var(--accent-light)';
  return (
    <button onClick={onClick} title={collapsed ? item.label : undefined}
      style={{
        display:'flex', alignItems:'center', gap:12,
        padding: collapsed ? '10px 14px' : '10px 12px',
        borderRadius:8, fontSize:13, fontWeight:500,
        background: active ? (item.admin ? 'var(--admin-bg)' : 'var(--accent-subtle)') : 'transparent',
        color: active ? color : 'var(--text-secondary)',
        borderLeft: active && !collapsed ? `2px solid ${item.admin?'var(--admin-fg)':'var(--accent-primary)'}` : '2px solid transparent',
        position:'relative', justifyContent: collapsed ? 'center' : 'flex-start',
        transition:'all 160ms',
      }}
      onMouseEnter={e=>{if(!active) e.currentTarget.style.background='var(--bg-elevated)';}}
      onMouseLeave={e=>{if(!active) e.currentTarget.style.background='transparent';}}>
      <span style={{display:'flex', color: active ? color : 'var(--text-secondary)'}}>{item.icon}</span>
      {!collapsed && <span style={{flex:1, textAlign:'left'}}>{item.label}</span>}
      {!collapsed && item.badge && (
        <span style={{
          fontSize:10, padding:'2px 7px', borderRadius:9999, fontWeight:700,
          background: active ? 'var(--accent-primary)' : 'var(--bg-elevated)',
          color: active ? 'white' : 'var(--text-secondary)',
        }}>{item.badge}</span>
      )}
    </button>
  );
};

const TopBar = ({ crumbs, onNotifOpen, notifCount=2 }) => (
  <header style={{
    height:64, padding:'0 28px',
    borderBottom:'1px solid var(--border-normal)',
    background:'rgba(26,22,38,0.85)', backdropFilter:'blur(16px)',
    display:'flex', alignItems:'center', justifyContent:'space-between',
    position:'sticky', top:0, zIndex:20,
  }}>
    <div style={{display:'flex', alignItems:'center', gap:8, fontSize:13}}>
      {crumbs.map((c, i) => (
        <React.Fragment key={i}>
          <span style={{color: i===crumbs.length-1 ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: i===crumbs.length-1 ? 600 : 400}}>{c}</span>
          {i<crumbs.length-1 && <I.ChevronRight size={12} style={{color:'var(--text-disabled)'}}/>}
        </React.Fragment>
      ))}
    </div>
    <div style={{display:'flex', alignItems:'center', gap:10}}>
      <div style={{width:280}}>
        <Input icon={<I.Search size={14}/>} placeholder="Buscar paquete o destinatario…"/>
      </div>
      <button className="focus-ring" style={{
        width:40, height:40, borderRadius:8, color:'var(--text-secondary)',
        display:'flex', alignItems:'center', justifyContent:'center',
        background:'var(--bg-surface)', border:'1px solid var(--border-normal)',
        position:'relative',
      }} onClick={onNotifOpen}>
        <I.Bell size={16}/>
        {notifCount>0 && <span style={{
          position:'absolute', top:8, right:8, width:8, height:8,
          borderRadius:'50%', background:'var(--accent-primary)',
          boxShadow:'0 0 0 2px var(--bg-surface)',
        }}/>}
      </button>
      <Avatar name="Mikel Arregi" size={36}/>
    </div>
  </header>
);

const BottomNav = ({ active, onNav }) => (
  <div style={{
    position:'fixed', bottom:0, left:0, right:0, zIndex:30,
    height:68, background:'rgba(26,22,38,0.96)', backdropFilter:'blur(20px)',
    borderTop:'1px solid var(--border-normal)',
    display:'flex', alignItems:'stretch', justifyContent:'space-around',
    padding:'6px 0',
  }}>
    {NAV_ITEMS.slice(0,5).map(item => {
      const act = active===item.id;
      return (
        <button key={item.id} onClick={()=>onNav(item.id)}
          style={{
            flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3,
            color: act ? 'var(--accent-light)' : 'var(--text-secondary)',
            position:'relative',
          }}>
          {act && <span style={{position:'absolute', top:0, width:24, height:3, background:'var(--accent-primary)',
            borderRadius:'0 0 4px 4px'}}/>}
          {item.icon}
          <span style={{fontSize:10, fontWeight:500}}>{item.label.split(' ')[0]}</span>
        </button>
      );
    })}
  </div>
);

// Notifications panel
const NotifPanel = ({ onClose }) => (
  <div style={{position:'fixed', inset:0, zIndex:90}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} className="fade-in" style={{
      position:'absolute', top:68, right:20, width:360,
      background:'var(--bg-surface)', borderRadius:12,
      border:'1px solid var(--border-normal)',
      boxShadow:'0 20px 60px rgba(0,0,0,0.6)',
      overflow:'hidden',
    }}>
      <div style={{padding:'14px 16px', borderBottom:'1px solid var(--border-normal)',
        display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{fontSize:14, fontWeight:600}}>Notificaciones</div>
        <button style={{fontSize:12, color:'var(--accent-light)'}}>Marcar todas</button>
      </div>
      {[
        { t:'Nuevo paquete asignado', d:'Ane te asignó AGT-261049 · Zizurkil', time:'hace 5 min', status:'assigned' },
        { t:'Ruta optimizada', d:'La ruta del 19 abr se ha reoptimizado', time:'hace 22 min', status:'in_transit' },
        { t:'Entrega confirmada', d:'PKG-261042 marcado como entregado', time:'hace 1 h', status:'delivered' },
      ].map((n, i)=>(
        <div key={i} style={{padding:'14px 16px', borderTop: i>0?'1px solid var(--border-normal)':'none',
          display:'flex', gap:12, cursor:'pointer'}}>
          <span style={{width:8, height:8, borderRadius:'50%', background:STATUS[n.status].fg, marginTop:6, flexShrink:0}}/>
          <div style={{flex:1}}>
            <div style={{fontSize:13, fontWeight:600, marginBottom:2}}>{n.t}</div>
            <div style={{fontSize:12, color:'var(--text-secondary)', marginBottom:4}}>{n.d}</div>
            <div style={{fontSize:11, color:'var(--text-disabled)'}}>{n.time}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Tweaks Panel
const TweaksPanel = ({ state, onChange }) => (
  <div style={{
    position:'fixed', bottom:24, right:24, width:300, zIndex:60,
    background:'rgba(35,29,53,0.96)', backdropFilter:'blur(16px)',
    border:'1px solid var(--accent-primary)', borderRadius:14,
    boxShadow:'0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px var(--accent-subtle)',
    overflow:'hidden',
  }}>
    <div style={{padding:'12px 14px', borderBottom:'1px solid var(--border-normal)',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      background:'linear-gradient(90deg, rgba(124,58,237,0.15), transparent)'}}>
      <div style={{display:'flex', alignItems:'center', gap:8}}>
        <I.Lightbulb size={14} style={{color:'var(--accent-light)'}}/>
        <span style={{fontSize:12, fontWeight:700, letterSpacing:'0.05em'}}>TWEAKS</span>
      </div>
      <span style={{fontSize:10, color:'var(--text-disabled)'}}>pakAG preview</span>
    </div>
    <div style={{padding:14, display:'flex', flexDirection:'column', gap:14}}>
      <TweakRow label="Vista como">
        <div style={{display:'flex', gap:4, padding:2, background:'var(--bg-elevated)',
          borderRadius:6, border:'1px solid var(--border-normal)'}}>
          {['distributor','admin'].map(v=>(
            <button key={v} onClick={()=>onChange({role:v})}
              style={{padding:'4px 10px', fontSize:11, fontWeight:600, borderRadius:4,
                background: state.role===v ? 'var(--accent-subtle)':'transparent',
                color: state.role===v ? 'var(--accent-light)':'var(--text-secondary)',
                textTransform:'uppercase', letterSpacing:'0.05em'}}>{v==='admin'?'Admin':'Repartidor'}</button>
          ))}
        </div>
      </TweakRow>
      <TweakRow label="Sidebar">
        <Toggle checked={!state.collapsed} onChange={v=>onChange({collapsed:!v})}/>
      </TweakRow>
      <TweakRow label="Pantalla">
        <select value={state.route} onChange={e=>onChange({route:e.target.value})}
          style={{padding:'4px 8px', fontSize:11, background:'var(--bg-elevated)',
            border:'1px solid var(--border-normal)', borderRadius:6, color:'var(--text-primary)'}}>
          <option value="login">Login</option>
          <option value="login-error">Login · Error</option>
          <option value="login-loading">Login · Cargando</option>
          <option value="2fa">2FA</option>
          <option value="dashboard">Dashboard</option>
          <option value="paquetes">Mis paquetes</option>
          <option value="paquete">Detalle paquete</option>
          <option value="ruta">Mi ruta</option>
          <option value="historial">Historial</option>
          <option value="configuracion">Configuración</option>
          <option value="404">Error 404</option>
          <option value="offline">Sin conexión</option>
          <option value="denied">Acceso denegado</option>
        </select>
      </TweakRow>
      <TweakRow label="Acento">
        <div style={{display:'flex', gap:6}}>
          {[['#7C3AED','morado'],['#3B82F6','azul'],['#10B981','verde'],['#F59E0B','ámbar']].map(([c,n])=>(
            <button key={c} onClick={()=>{
              document.documentElement.style.setProperty('--accent-primary', c);
              const dim = c + '88';
              document.documentElement.style.setProperty('--accent-light', c==='#7C3AED'?'#A78BFA':c);
              onChange({accent:c});
            }}
              title={n}
              style={{width:22, height:22, borderRadius:'50%',
                background:c, border: state.accent===c ? '2px solid white' : '2px solid transparent',
                boxShadow: state.accent===c ? `0 0 0 2px ${c}` : 'none'}}/>
          ))}
        </div>
      </TweakRow>
    </div>
  </div>
);

const TweakRow = ({ label, children }) => (
  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12}}>
    <span style={{fontSize:11, color:'var(--text-secondary)', fontWeight:500}}>{label}</span>
    {children}
  </div>
);

Object.assign(window, { Sidebar, TopBar, BottomNav, NotifPanel, TweaksPanel, NAV_ITEMS });
