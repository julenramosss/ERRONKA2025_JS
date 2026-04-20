// Historial + Configuración + Pantalla vacía

const HistoryScreen = ({ onOpenPkg }) => {
  const days = MOCK.MOCK_HISTORY_DAYS;
  const [query, setQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [collapsed, setCollapsed] = React.useState({});

  const filteredDays = days.map(d => ({
    ...d,
    items: d.items.filter(p => {
      if (filterStatus !== 'all' && p.status !== filterStatus) return false;
      if (query && !(p.recipient.toLowerCase().includes(query.toLowerCase()) ||
                     p.tracking.toLowerCase().includes(query.toLowerCase()))) return false;
      return true;
    })
  })).filter(d => d.items.length > 0);

  const total = days.reduce((a,d)=>a+d.items.length, 0);
  const delivered = days.reduce((a,d)=>a+d.items.filter(i=>i.status==='delivered').length, 0);
  const failed = days.reduce((a,d)=>a+d.items.filter(i=>i.status==='failed').length, 0);
  const rate = Math.round((delivered/total)*100);

  return (
    <div style={{display:'flex', flexDirection:'column', gap:20}}>
      <div>
        <h1 style={{fontSize:24, fontWeight:700, margin:'0 0 4px', letterSpacing:'-0.02em'}}>Historial</h1>
        <div style={{color:'var(--text-secondary)', fontSize:13}}>
          Tus entregas pasadas — del 1 al 19 de abril 2026
        </div>
      </div>

      <div style={{display:'flex', gap:12, flexWrap:'wrap', alignItems:'center'}}>
        <div style={{display:'flex', gap:8, padding:'0 14px', height:40,
          background:'var(--bg-surface)', border:'1px solid var(--border-normal)', borderRadius:8,
          alignItems:'center', color:'var(--text-secondary)', fontSize:13}}>
          <I.Calendar size={14}/>
          <span style={{color:'var(--text-primary)'}}>01 abr — 19 abr 2026</span>
          <I.ChevronDown size={14}/>
        </div>
        <div style={{flex:1, minWidth:200, maxWidth:320}}>
          <Input icon={<I.Search size={14}/>} placeholder="Buscar tracking o destinatario"
            value={query} onChange={e=>setQuery(e.target.value)}/>
        </div>
        <div style={{display:'flex', gap:6}}>
          {[['all','Todos'],['delivered','Entregados'],['failed','Fallidos']].map(([v,l])=>(
            <Chip key={v} active={filterStatus===v} onClick={()=>setFilterStatus(v)}>{l}</Chip>
          ))}
        </div>
      </div>

      <div style={{display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))'}}>
        <StatCard label="Paquetes en período" value={total} icon={<I.Package size={18}/>}
          color="var(--accent-light)" bg="var(--accent-subtle)"/>
        <StatCard label="Entregados" value={delivered} icon={<I.Check size={18} stroke={2.5}/>}
          color="var(--st-delivered-fg)" bg="var(--st-delivered-bg)"/>
        <StatCard label="Fallidos" value={failed} icon={<I.AlertCircle size={18}/>}
          color="var(--st-failed-fg)" bg="var(--st-failed-bg)"/>
        <StatCard label="Tasa de éxito" value={rate+'%'} icon={<I.TrendingUp size={18}/>}
          color="var(--accent-light)" bg="var(--accent-subtle)" delta="+3pp"/>
      </div>

      <Card padding={0}>
        <div style={{padding:'16px 20px', borderBottom:'1px solid var(--border-normal)',
          display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{fontSize:14, fontWeight:600}}>Entregas por día</div>
            <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:2}}>Últimos 14 días</div>
          </div>
          <div style={{display:'flex', gap:12, fontSize:11, color:'var(--text-secondary)'}}>
            <span style={{display:'flex', alignItems:'center', gap:6}}>
              <span style={{width:10, height:10, borderRadius:2, background:'var(--accent-primary)'}}/> Entregados
            </span>
            <span style={{display:'flex', alignItems:'center', gap:6}}>
              <span style={{width:10, height:10, borderRadius:2, background:'var(--st-failed-fg)'}}/> Fallidos
            </span>
          </div>
        </div>
        <div style={{padding:24}}>
          <BarChart/>
        </div>
      </Card>

      <Card padding={0}>
        <div style={{padding:'16px 20px', borderBottom:'1px solid var(--border-normal)',
          display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div style={{fontSize:14, fontWeight:600}}>Paquetes históricos</div>
          <span style={{fontSize:12, color:'var(--text-secondary)'}}>
            {filteredDays.reduce((a,d)=>a+d.items.length,0)} resultados
          </span>
        </div>
        {filteredDays.length === 0 ? (
          <EmptyState icon={<I.Package size={24}/>} title="Sin resultados"
            subtitle="Prueba con otra búsqueda o cambia el filtro de estado."/>
        ) : filteredDays.map((d, di)=>(
          <div key={di}>
            <button
              onClick={()=>setCollapsed(c=>({...c, [di]:!c[di]}))}
              style={{
                width:'100%', padding:'10px 20px', background:'var(--bg-elevated)',
                fontSize:11, fontWeight:600, color:'var(--text-secondary)',
                textTransform:'uppercase', letterSpacing:'0.05em',
                display:'flex', justifyContent:'space-between', alignItems:'center',
                borderTop: di>0 ? '1px solid var(--border-normal)':'none',
                borderBottom: '1px solid var(--border-normal)',
              }}>
              <span style={{display:'flex', alignItems:'center', gap:8}}>
                <I.ChevronDown size={12} style={{
                  transform: collapsed[di] ? 'rotate(-90deg)' : 'none',
                  transition:'transform 200ms', color:'var(--accent-light)',
                }}/>
                {d.date}
              </span>
              <span style={{color:'var(--text-disabled)', letterSpacing:'0.02em', textTransform:'none'}}>
                {d.items.length} paquetes · {d.items.filter(i=>i.status==='delivered').length} entregados
              </span>
            </button>
            {!collapsed[di] && d.items.map((p, i)=>(
              <div key={p.id}
                onClick={()=>onOpenPkg?.(p.id)}
                style={{
                  padding:'14px 20px', display:'flex', alignItems:'center', gap:14,
                  borderBottom: i<d.items.length-1 ? '1px solid var(--border-normal)':'none',
                  transition:'background 160ms', cursor:'pointer',
                }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(124,58,237,0.07)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <TrackingChip code={p.tracking}/>
                <Avatar name={p.recipient} size={28}/>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:13, fontWeight:600}}>{p.recipient}</div>
                  <div style={{fontSize:11, color:'var(--text-disabled)', marginTop:2}}>
                    {p.changes} cambios de estado
                  </div>
                </div>
                <StatusBadge status={p.status} size="sm"/>
                <div className="mono" style={{fontSize:12, color:'var(--text-secondary)', minWidth:50, textAlign:'right'}}>{p.time}</div>
                <I.ChevronRight size={14} style={{color:'var(--text-disabled)'}}/>
              </div>
            ))}
          </div>
        ))}
      </Card>
    </div>
  );
};

const BarChart = () => {
  const data = [
    [8,0],[12,1],[10,0],[6,1],[14,0],[9,0],[11,0],
    [13,0],[10,2],[8,0],[12,0],[11,1],[9,0],[8,0],
  ];
  const max = Math.max(...data.map(d=>d[0]+d[1]));
  const labels = ['6','7','8','9','10','11','12','13','14','15','16','17','18','19'];
  return (
    <div style={{display:'flex', alignItems:'flex-end', gap:8, height:160}}>
      {data.map(([d, f], i)=>(
        <div key={i} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6}}>
          <div style={{
            width:'100%', display:'flex', flexDirection:'column-reverse',
            height:'100%', borderRadius:6, overflow:'hidden',
          }}>
            <div style={{
              height:`${(d/max)*100}%`,
              background:'linear-gradient(to top, #7C3AED, #A78BFA)',
              borderRadius:'4px 4px 0 0',
              transition:'height 400ms',
            }}/>
            {f>0 && <div style={{
              height:`${(f/max)*100}%`,
              background:'var(--st-failed-fg)',
            }}/>}
          </div>
          <div style={{fontSize:10, color:'var(--text-disabled)'}} className="mono">{labels[i]}</div>
        </div>
      ))}
    </div>
  );
};

// ===============================================

const SettingsScreen = () => {
  const [tab, setTab] = React.useState('perfil');
  const tabs = [
    { value:'perfil', label:'Perfil', icon:<I.User size={14}/> },
    { value:'seguridad', label:'Seguridad', icon:<I.Shield size={14}/> },
    { value:'notificaciones', label:'Notificaciones', icon:<I.Bell size={14}/> },
    { value:'apariencia', label:'Apariencia', icon:<I.Moon size={14}/> },
  ];

  return (
    <div>
      <h1 style={{fontSize:24, fontWeight:700, margin:'0 0 4px', letterSpacing:'-0.02em'}}>Configuración</h1>
      <div style={{color:'var(--text-secondary)', fontSize:13, marginBottom:24}}>
        Ajustes de tu cuenta pakAG
      </div>

      <div style={{display:'grid', gridTemplateColumns:'220px 1fr', gap:24}} className="settings-grid">
        <div style={{display:'flex', flexDirection:'column', gap:2}}>
          {tabs.map(t=>(
            <button key={t.value} onClick={()=>setTab(t.value)}
              style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'10px 14px', borderRadius:8, fontSize:13, fontWeight:500,
                background: tab===t.value ? 'var(--accent-subtle)' : 'transparent',
                color: tab===t.value ? 'var(--accent-light)' : 'var(--text-secondary)',
                textAlign:'left', justifyContent:'flex-start',
                borderLeft: tab===t.value ? '2px solid var(--accent-primary)' : '2px solid transparent',
                transition:'all 160ms',
              }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:20}}>
          {tab==='perfil' && <ProfileSection/>}
          {tab==='seguridad' && <SecuritySection/>}
          {tab==='notificaciones' && <NotificationsSection/>}
          {tab==='apariencia' && <AppearanceSection/>}
        </div>
      </div>
    </div>
  );
};

const SectionCard = ({ title, subtitle, children, footer }) => (
  <Card padding={0}>
    <div style={{padding:'20px 24px', borderBottom:'1px solid var(--border-normal)'}}>
      <div style={{fontSize:15, fontWeight:600}}>{title}</div>
      {subtitle && <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:4}}>{subtitle}</div>}
    </div>
    <div style={{padding:24}}>{children}</div>
    {footer && <div style={{padding:'16px 24px', borderTop:'1px solid var(--border-normal)',
      background:'var(--bg-elevated)', borderRadius:'0 0 12px 12px',
      display:'flex', justifyContent:'flex-end', gap:10}}>{footer}</div>}
  </Card>
);

const ProfileSection = () => (
  <SectionCard title="Perfil" subtitle="Cómo te ven dentro de pakAG"
    footer={<Btn variant="primary">Guardar cambios</Btn>}>
    <div style={{display:'flex', gap:20, alignItems:'center', marginBottom:24,
      paddingBottom:20, borderBottom:'1px solid var(--border-normal)'}}>
      <div style={{position:'relative'}}>
        <Avatar name="Mikel Arregi" size={72}/>
        <button style={{
          position:'absolute', bottom:-4, right:-4,
          width:28, height:28, borderRadius:'50%',
          background:'var(--accent-primary)', color:'white',
          display:'flex', alignItems:'center', justifyContent:'center',
          border:'2px solid var(--bg-surface)',
        }}><I.Camera size={13}/></button>
      </div>
      <div>
        <div style={{fontSize:16, fontWeight:600}}>Mikel Arregi</div>
        <div style={{fontSize:13, color:'var(--text-secondary)', marginBottom:8}}>mikel.arregi@pakag.com</div>
        <div style={{display:'flex', gap:8}}>
          <span style={{
            padding:'2px 10px', borderRadius:9999, fontSize:11, fontWeight:600,
            background:'var(--accent-subtle)', color:'var(--accent-light)',
            border:'1px solid var(--accent-primary)',
          }}>REPARTIDOR</span>
          <span style={{
            padding:'2px 10px', borderRadius:9999, fontSize:11, fontWeight:600,
            background:'var(--st-delivered-bg)', color:'var(--st-delivered-fg)',
            border:'1px solid var(--st-delivered-fg)33',
            display:'inline-flex', alignItems:'center', gap:4,
          }}>
            <span style={{width:6, height:6, borderRadius:'50%', background:'var(--st-delivered-fg)'}}/>
            Activo
          </span>
        </div>
      </div>
    </div>
    <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:16}}>
      <div><Label>Nombre completo</Label><Input value="Mikel Arregi" onChange={()=>{}}/></div>
      <div><Label>Email</Label><Input icon={<I.Mail size={14}/>} value="mikel.arregi@pakag.com" onChange={()=>{}}/></div>
      <div><Label>Teléfono</Label><Input value="+34 688 00 12 34" onChange={()=>{}}/></div>
      <div><Label>Cuenta creada</Label><Input value="15 marzo 2024" disabled/></div>
    </div>
  </SectionCard>
);

const SecuritySection = () => {
  const [pwd, setPwd] = React.useState('');
  const strength = Math.min(pwd.length * 12, 100);
  const color = strength < 40 ? 'var(--st-failed-fg)' : strength < 70 ? 'var(--st-pending-fg)' : 'var(--st-delivered-fg)';
  return (
    <>
      <SectionCard title="Cambiar contraseña" subtitle="Usa al menos 10 caracteres con números y símbolos"
        footer={<Btn variant="primary">Actualizar contraseña</Btn>}>
        <div style={{display:'flex', flexDirection:'column', gap:16, maxWidth:440}}>
          <div><Label>Contraseña actual</Label><Input type="password" icon={<I.Lock size={14}/>} placeholder="••••••••••" onChange={()=>{}}/></div>
          <div>
            <Label>Nueva contraseña</Label>
            <Input type="password" icon={<I.KeyRound size={14}/>} value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="Nueva contraseña"/>
            {pwd && (
              <div style={{marginTop:10}}>
                <Progress value={strength} color={color}/>
                <div style={{fontSize:11, marginTop:6, color}}>
                  {strength < 40 ? 'Débil' : strength < 70 ? 'Aceptable' : 'Fuerte'}
                </div>
              </div>
            )}
          </div>
          <div><Label>Confirmar nueva contraseña</Label><Input type="password" icon={<I.KeyRound size={14}/>} placeholder="Repite la contraseña" onChange={()=>{}}/></div>
        </div>
      </SectionCard>

      <SectionCard title="Autenticación en dos pasos" subtitle="Protege tu cuenta con una capa extra de seguridad">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:20}}>
          <div>
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:8}}>
              <span style={{fontSize:14, fontWeight:600}}>2FA por email</span>
              <span style={{
                padding:'2px 10px', borderRadius:9999, fontSize:11, fontWeight:600,
                background:'var(--st-delivered-bg)', color:'var(--st-delivered-fg)',
                border:'1px solid var(--st-delivered-fg)33',
              }}>Activado</span>
            </div>
            <div style={{fontSize:13, color:'var(--text-secondary)'}}>
              Activado el 22 febrero 2026 · Código enviado a ma***@pakag.com
            </div>
          </div>
          <Toggle checked onChange={()=>{}}/>
        </div>
      </SectionCard>

      <SectionCard title="Sesiones activas" subtitle="Dispositivos donde has iniciado sesión"
        footer={<Btn variant="destructive" size="sm">Cerrar todas las demás sesiones</Btn>}>
        {[
          { device:'iPhone 15 · Safari', loc:'Tolosa, ES · 88.17.x.x', last:'Ahora', current:true, ic:<I.Smartphone size={16}/> },
          { device:'MacBook Pro · Chrome', loc:'Aduna, ES · 88.17.x.x', last:'hace 2h', ic:<I.Monitor size={16}/> },
          { device:'Pixel 8 · Chrome Mobile', loc:'San Sebastián, ES · 82.03.x.x', last:'hace 3 días', ic:<I.Smartphone size={16}/> },
        ].map((s, i) => (
          <div key={i} style={{
            display:'flex', alignItems:'center', gap:14,
            padding:'14px 0',
            borderTop: i>0 ? '1px solid var(--border-normal)' : 'none',
          }}>
            <div style={{
              width:36, height:36, borderRadius:8,
              background:'var(--bg-elevated)', color:'var(--accent-light)',
              display:'flex', alignItems:'center', justifyContent:'center',
              border:'1px solid var(--border-normal)',
            }}>{s.ic}</div>
            <div style={{flex:1}}>
              <div style={{display:'flex', alignItems:'center', gap:8}}>
                <span style={{fontSize:13, fontWeight:600}}>{s.device}</span>
                {s.current && <span style={{fontSize:10, padding:'1px 7px', borderRadius:9999,
                  background:'var(--accent-subtle)', color:'var(--accent-light)',
                  border:'1px solid var(--accent-primary)', fontWeight:600}}>ACTUAL</span>}
              </div>
              <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:2}}>{s.loc}</div>
            </div>
            <div style={{fontSize:11, color:'var(--text-disabled)', minWidth:70, textAlign:'right'}}>{s.last}</div>
            {!s.current && <Btn variant="ghost" size="sm">Cerrar</Btn>}
          </div>
        ))}
      </SectionCard>
    </>
  );
};

const NotificationsSection = () => {
  const [n, setN] = React.useState({ state:true, assign:true, reminder:true });
  return (
    <SectionCard title="Notificaciones" subtitle="Decide qué avisos quieres recibir">
      {[
        { k:'state', label:'Cambios de estado de paquete', desc:'Cuando un paquete cambia de estado en tu flota' },
        { k:'assign', label:'Asignación de paquete nuevo', desc:'Cuando un administrador te asigna paquetes' },
        { k:'reminder', label:'Recordatorio de ruta del día', desc:'Cada mañana antes de empezar la jornada' },
      ].map((item, i)=>(
        <div key={i} style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'16px 0', gap:20,
          borderTop: i>0 ? '1px solid var(--border-normal)' : 'none',
        }}>
          <div>
            <div style={{fontSize:14, fontWeight:500, marginBottom:4}}>{item.label}</div>
            <div style={{fontSize:12, color:'var(--text-secondary)'}}>{item.desc}</div>
          </div>
          <Toggle checked={n[item.k]} onChange={v=>setN({...n, [item.k]:v})}/>
        </div>
      ))}
      {n.reminder && (
        <div style={{marginTop:20, paddingTop:20, borderTop:'1px solid var(--border-normal)', maxWidth:260}}>
          <Label>Hora del recordatorio</Label>
          <Input icon={<I.Clock size={14}/>} value="07:30" onChange={()=>{}}/>
        </div>
      )}
    </SectionCard>
  );
};

const AppearanceSection = () => {
  const [theme, setTheme] = React.useState('dark');
  const [lang, setLang] = React.useState('es');
  const [density, setDensity] = React.useState('normal');
  return (
    <>
      <SectionCard title="Tema" subtitle="Elige la apariencia de la interfaz">
        <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:12, maxWidth:480}}>
          {[
            { v:'dark', icon:<I.Moon size={16}/>, label:'Oscuro', desc:'Recomendado, por defecto', active:true },
            { v:'light', icon:<I.Sun size={16}/>, label:'Claro', desc:'Próximamente', disabled:true },
          ].map(t => (
            <button key={t.v}
              disabled={t.disabled}
              onClick={()=>!t.disabled && setTheme(t.v)}
              style={{
                padding:16, borderRadius:10, textAlign:'left',
                background: theme===t.v ? 'rgba(124,58,237,0.1)' : 'var(--bg-elevated)',
                border:`1.5px solid ${theme===t.v ? 'var(--accent-primary)':'var(--border-normal)'}`,
                opacity: t.disabled ? 0.5 : 1,
                display:'flex', flexDirection:'column', alignItems:'flex-start', gap:8,
              }}>
              <div style={{display:'flex', alignItems:'center', gap:8, fontSize:14, fontWeight:600}}>
                {t.icon} {t.label}
              </div>
              <div style={{fontSize:11, color:'var(--text-secondary)'}}>{t.desc}</div>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Idioma" subtitle="Idioma de la interfaz">
        <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
          {[['es','Español'], ['eu','Euskera'], ['en','English']].map(([v,l])=>(
            <button key={v} onClick={()=>setLang(v)}
              style={{
                padding:'10px 18px', borderRadius:9999, fontSize:13, fontWeight:500,
                background: lang===v ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
                color: lang===v ? 'var(--accent-light)' : 'var(--text-secondary)',
                border:`1px solid ${lang===v ? 'var(--accent-primary)':'var(--border-normal)'}`,
                display:'inline-flex', alignItems:'center', gap:8,
              }}>
              <I.Languages size={13}/> {l}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Densidad de información" subtitle="Cuánta información caber en pantalla">
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10, maxWidth:560}}>
          {[['compact','Compacto','Más por menos'],['normal','Normal','Equilibrado'],['comfortable','Cómodo','Más aire']].map(([v,l,d])=>(
            <button key={v} onClick={()=>setDensity(v)}
              style={{
                padding:16, borderRadius:10, textAlign:'center',
                background: density===v ? 'rgba(124,58,237,0.1)' : 'var(--bg-elevated)',
                border:`1.5px solid ${density===v ? 'var(--accent-primary)':'var(--border-normal)'}`,
              }}>
              <div style={{fontSize:13, fontWeight:600, marginBottom:4}}>{l}</div>
              <div style={{fontSize:11, color:'var(--text-secondary)'}}>{d}</div>
            </button>
          ))}
        </div>
      </SectionCard>
    </>
  );
};

// ====== History Package Detail ======
const HISTORY_EXTENDED = {
  h1: { tracking:'PKG-261032', recipient:'Laura Urreta', email:'laura.urreta@mail.com', address:'Kale Nagusia 45, Villabona', weight:'1.2 kg', description:'Caja cartón pequeña', status:'delivered', date:'18 abr 2026', createdAt:'18 abr 2026, 07:45', eta:'17:30',
    history:[
      {status:'pending',    actor:'Sistema',         time:'18 abr, 07:45'},
      {status:'assigned',   actor:'Admin · Ane',     time:'18 abr, 08:10'},
      {status:'in_transit', actor:'Mikel Arregi',    time:'18 abr, 09:02'},
      {status:'delivered',  actor:'Mikel Arregi',    time:'18 abr, 17:42'},
    ]},
  h2: { tracking:'BLK-261033', recipient:'Joseba Iñarra', email:'joseba.inarra@mail.com', address:'Errekalde 8, Aduna', weight:'0.8 kg', description:'Sobre acolchado', status:'delivered', date:'18 abr 2026', createdAt:'18 abr 2026, 07:45', eta:'16:00',
    history:[
      {status:'pending',    actor:'Sistema',         time:'18 abr, 07:45'},
      {status:'assigned',   actor:'Admin · Ane',     time:'18 abr, 08:10'},
      {status:'in_transit', actor:'Mikel Arregi',    time:'18 abr, 09:15'},
      {status:'delivered',  actor:'Mikel Arregi',    time:'18 abr, 16:15'},
    ]},
  h3: { tracking:'AGT-261034', recipient:'Oihana Perez', email:'oihana.perez@mail.com', address:'Iturrialde 3, Zizurkil', weight:'2.4 kg', description:'Producto frágil — electrónica', status:'failed', date:'18 abr 2026', createdAt:'18 abr 2026, 07:45', eta:'15:00',
    history:[
      {status:'pending',    actor:'Sistema',         time:'18 abr, 07:45'},
      {status:'assigned',   actor:'Admin · Ane',     time:'18 abr, 08:10'},
      {status:'in_transit', actor:'Mikel Arregi',    time:'18 abr, 09:30'},
      {status:'failed',     actor:'Mikel Arregi',    time:'18 abr, 15:03', note:'Destinatario ausente. Sin buzón disponible.'},
    ]},
};

const HistoryPackageDetail = ({ id, onBack }) => {
  const allItems = MOCK.MOCK_HISTORY_DAYS.flatMap(d=>d.items);
  const item = allItems.find(p=>p.id===id);
  const ext = HISTORY_EXTENDED[id] || (item ? {
    tracking: item.tracking, recipient: item.recipient,
    email: item.recipient.toLowerCase().replace(' ','.') + '@mail.com',
    address: 'Calle Mayor 12, Tolosa', weight:'1.0 kg', description:'Paquete estándar',
    status: item.status, date: MOCK.MOCK_HISTORY_DAYS.find(d=>d.items.includes(item))?.date,
    createdAt: MOCK.MOCK_HISTORY_DAYS.find(d=>d.items.includes(item))?.date + ', 08:00',
    eta: item.time,
    history:[
      {status:'pending',    actor:'Sistema',      time:'08:00'},
      {status:'assigned',   actor:'Admin · Ane',  time:'08:20'},
      {status:'in_transit', actor:'Mikel Arregi', time:'09:10'},
      {status:item.status,  actor:'Mikel Arregi', time:item.time},
    ],
  } : null);

  if (!ext) return <div style={{padding:40, textAlign:'center', color:'var(--text-secondary)'}}>Paquete no encontrado.</div>;

  return (
    <div style={{display:'flex', flexDirection:'column', gap:20}} className="fade-up">
      {/* Breadcrumb */}
      <div style={{display:'flex', alignItems:'center', gap:8, fontSize:13, color:'var(--text-secondary)'}}>
        <button onClick={onBack} style={{color:'var(--text-secondary)', display:'inline-flex', alignItems:'center', gap:4}}>
          <I.ChevronLeft size={14}/> Historial
        </button>
        <I.ChevronRight size={12}/>
        <span className="mono" style={{color:'var(--accent-light)'}}>{ext.tracking}</span>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:20}} className="detail-grid">
        <div style={{display:'flex', flexDirection:'column', gap:20}}>
          <Card padding={24}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, gap:12, flexWrap:'wrap'}}>
              <div>
                <div className="mono" style={{fontSize:24, fontWeight:700, color:'var(--accent-light)', marginBottom:8}}>
                  {ext.tracking}
                </div>
                <StatusBadge status={ext.status}/>
              </div>
              <div style={{
                padding:'8px 14px', borderRadius:8,
                background:'var(--bg-elevated)', border:'1px solid var(--border-normal)',
                fontSize:12, color:'var(--text-secondary)',
                display:'flex', alignItems:'center', gap:6,
              }}>
                <I.History size={13}/> Entrega archivada · {ext.date}
              </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16}}>
              <DetailRow label="Destinatario" value={ext.recipient} icon={<I.User size={14}/>}/>
              <DetailRow label="Email" value={ext.email} icon={<I.Mail size={14}/>}/>
              <DetailRow label="Dirección" value={ext.address} icon={<I.MapPin size={14}/>} span/>
              <DetailRow label="Peso" value={ext.weight} icon={<I.Weight size={14}/>}/>
              <DetailRow label="Descripción" value={ext.description} icon={<I.FileText size={14}/>}/>
              <DetailRow label="Creado" value={ext.createdAt} icon={<I.Calendar size={14}/>}/>
              <DetailRow label="ETA" value={ext.eta} icon={<I.Clock size={14}/>}/>
              <DetailRow label="Repartidor" value="Mikel Arregi" icon={<I.Truck size={14}/>}/>
            </div>
          </Card>

          {/* Timeline */}
          <Card padding={0}>
            <div style={{padding:'16px 24px', borderBottom:'1px solid var(--border-normal)'}}>
              <div style={{fontSize:15, fontWeight:600}}>Historial de estados</div>
              <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:2}}>
                {ext.history.length} cambios registrados
              </div>
            </div>
            <div style={{padding:'20px 28px', position:'relative'}}>
              <div style={{position:'absolute', top:28, bottom:28, left:41, width:1, background:'var(--border-normal)'}}/>
              {[...ext.history].reverse().map((h,i)=>{
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
                        {isLatest && <span style={{fontSize:11, color:'var(--accent-light)'}}>Estado final</span>}
                      </div>
                      <div style={{fontSize:12, color:'var(--text-secondary)'}}>Por {h.actor}</div>
                      {h.note && (
                        <div style={{
                          marginTop:8, padding:'8px 12px', borderRadius:6,
                          background:'var(--st-failed-bg)', border:'1px solid rgba(239,68,68,0.2)',
                          fontSize:12, color:'var(--st-failed-fg)', fontStyle:'italic',
                          display:'flex', alignItems:'flex-start', gap:6,
                        }}>
                          <I.AlertCircle size={13} style={{flexShrink:0, marginTop:1}}/>
                          {h.note}
                        </div>
                      )}
                    </div>
                    <div className="mono" style={{fontSize:11, color:'var(--text-disabled)'}}>{h.time}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Map + actions */}
        <div style={{display:'flex', flexDirection:'column', gap:20}}>
          <Card padding={0} style={{overflow:'hidden'}}>
            <div style={{padding:'16px 20px', borderBottom:'1px solid var(--border-normal)'}}>
              <div style={{fontSize:14, fontWeight:600}}>Ubicación de entrega</div>
            </div>
            <div style={{padding:16}}>
              <MapCanvas
                points={[{lat:43.155, lng:-2.065, status:ext.status, stop:1}]}
                height={260} compact showControls={false}
              />
            </div>
            <div style={{padding:'16px 20px', borderTop:'1px solid var(--border-normal)'}}>
              <div style={{fontSize:13, fontWeight:600, marginBottom:4}}>{ext.address}</div>
              <div style={{fontSize:12, color:'var(--text-secondary)', marginBottom:12}}>
                Gipuzkoa, País Vasco
              </div>
              <Btn variant="secondary" fullWidth icon={<I.Navigation size={14}/>}>Abrir en Maps</Btn>
            </div>
          </Card>

          <Card padding={20}>
            <div style={{fontSize:13, fontWeight:600, marginBottom:14}}>Resumen de la entrega</div>
            <div style={{display:'flex', flexDirection:'column', gap:10}}>
              {[
                { label:'Duración total', value:'8h 57min', icon:<I.Clock size={13}/> },
                { label:'Intentos de entrega', value: ext.status==='failed' ? '1 (fallido)' : '1', icon:<I.Truck size={13}/> },
                { label:'Cambios de estado', value: ext.history.length, icon:<I.RefreshCw size={13}/> },
              ].map((row,i)=>(
                <div key={i} style={{
                  display:'flex', justifyContent:'space-between', alignItems:'center',
                  padding:'10px 0',
                  borderTop: i>0 ? '1px solid var(--border-normal)' : 'none',
                }}>
                  <div style={{display:'flex', alignItems:'center', gap:8, fontSize:12, color:'var(--text-secondary)'}}>
                    {row.icon} {row.label}
                  </div>
                  <span style={{fontSize:13, fontWeight:600}}>{row.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { HistoryScreen, HistoryPackageDetail, SettingsScreen });
