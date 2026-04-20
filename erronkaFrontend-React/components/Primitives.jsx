// Design system primitives for pakAG

const Btn = ({ children, variant = 'primary', size = 'md', loading, disabled, icon, iconRight, fullWidth, onClick, ...rest }) => {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontWeight: 600, borderRadius: 8, transition: 'all 180ms ease-out',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : undefined,
    whiteSpace: 'nowrap',
  };
  const sizes = {
    sm: { height: 32, padding: '0 12px', fontSize: 13 },
    md: { height: 40, padding: '0 16px', fontSize: 14 },
    lg: { height: 48, padding: '0 20px', fontSize: 15 },
  };
  const variants = {
    primary: {
      background: disabled ? 'var(--accent-subtle)' : 'var(--accent-primary)',
      color: 'var(--text-primary)',
      boxShadow: disabled ? 'none' : '0 4px 14px rgba(124,58,237,0.35)',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--accent-light)',
      border: '1px solid var(--accent-primary)',
    },
    ghost: { background: 'transparent', color: 'var(--accent-light)' },
    destructive: {
      background: '#DC2626', color: 'white',
      boxShadow: '0 4px 14px rgba(220,38,38,0.3)',
    },
    soft: {
      background: 'var(--bg-elevated)', color: 'var(--text-primary)',
      border: '1px solid var(--border-normal)',
    },
  };
  return (
    <button
      style={{ ...base, ...sizes[size], ...variants[variant] }}
      className="focus-ring pak-btn"
      onMouseEnter={(e)=>{
        if (disabled||loading) return;
        if (variant==='primary') e.currentTarget.style.background='var(--accent-hover)';
        if (variant==='secondary') e.currentTarget.style.background='rgba(124,58,237,0.1)';
        if (variant==='ghost') e.currentTarget.style.background='rgba(124,58,237,0.08)';
        if (variant==='soft') e.currentTarget.style.background='var(--bg-surface)';
      }}
      onMouseLeave={(e)=>{
        if (variant==='primary') e.currentTarget.style.background=disabled?'var(--accent-subtle)':'var(--accent-primary)';
        if (variant==='secondary') e.currentTarget.style.background='transparent';
        if (variant==='ghost') e.currentTarget.style.background='transparent';
        if (variant==='soft') e.currentTarget.style.background='var(--bg-elevated)';
      }}
      onClick={disabled||loading?undefined:onClick}
      disabled={disabled}
      {...rest}
    >
      {loading ? <I.Loader size={16}/> : icon}
      {children}
      {iconRight}
    </button>
  );
};

const Input = ({ icon, suffix, error, type='text', ...rest }) => {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:10,
      background:'var(--bg-elevated)',
      border:`1px solid ${error ? 'var(--st-failed-fg)' : focus ? 'var(--accent-primary)' : 'var(--border-normal)'}`,
      borderRadius: 8, height: 44, padding: '0 14px',
      boxShadow: focus ? '0 0 0 3px rgba(124,58,237,0.2)' : 'none',
      transition: 'all 180ms ease-out',
    }}>
      {icon && <span style={{color:'var(--text-secondary)', display:'flex'}}>{icon}</span>}
      <input
        type={type}
        onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
        style={{
          flex:1, background:'transparent', border:'none', outline:'none',
          color:'var(--text-primary)', fontSize:14, height:'100%',
        }}
        {...rest}
      />
      {suffix}
    </div>
  );
};

const Label = ({ children, ...rest }) => (
  <label style={{
    display:'block', fontSize:13, fontWeight:500, color:'var(--text-secondary)',
    marginBottom:8, letterSpacing:'0.01em',
  }} {...rest}>{children}</label>
);

const Checkbox = ({ checked, onChange, label, id }) => (
  <label htmlFor={id} style={{display:'inline-flex', alignItems:'center', gap:10, cursor:'pointer', userSelect:'none'}}>
    <input id={id} type="checkbox" checked={checked} onChange={onChange} style={{display:'none'}}/>
    <span style={{
      width:18, height:18, borderRadius:4,
      background: checked ? 'var(--accent-primary)' : 'var(--bg-elevated)',
      border: `1.5px solid ${checked ? 'var(--accent-primary)':'var(--border-normal)'}`,
      display:'flex', alignItems:'center', justifyContent:'center',
      transition:'all 160ms ease-out',
    }}>
      {checked && <I.Check size={12} stroke={3}/>}
    </span>
    {label && <span style={{fontSize:13, color:'var(--text-primary)'}}>{label}</span>}
  </label>
);

const Toggle = ({ checked, onChange }) => (
  <button
    role="switch" aria-checked={checked}
    onClick={()=>onChange?.(!checked)}
    className="focus-ring"
    style={{
      width:42, height:24, borderRadius:9999,
      background: checked ? 'var(--accent-primary)' : 'var(--border-normal)',
      padding:2, position:'relative', transition:'all 180ms ease-out',
    }}>
    <span style={{
      display:'block', width:20, height:20, borderRadius:'50%',
      background:'white', transform:`translateX(${checked?18:0}px)`,
      transition:'transform 180ms cubic-bezier(.2,.7,.2,1)',
      boxShadow:'0 1px 3px rgba(0,0,0,0.3)',
    }}/>
  </button>
);

const STATUS = {
  pending:    { label:'Pendiente', fg:'var(--st-pending-fg)',   bg:'var(--st-pending-bg)' },
  assigned:   { label:'Asignado',  fg:'var(--st-assigned-fg)',  bg:'var(--st-assigned-bg)' },
  in_transit: { label:'En tránsito', fg:'var(--st-transit-fg)', bg:'var(--st-transit-bg)' },
  delivered:  { label:'Entregado', fg:'var(--st-delivered-fg)', bg:'var(--st-delivered-bg)' },
  failed:     { label:'Fallido',   fg:'var(--st-failed-fg)',    bg:'var(--st-failed-bg)' },
};

const StatusBadge = ({ status, size='md' }) => {
  const s = STATUS[status] || STATUS.pending;
  const sizes = {
    sm: { padding:'2px 8px', fontSize: 11 },
    md: { padding:'4px 10px', fontSize: 12 },
  };
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      color: s.fg, background: s.bg,
      borderRadius: 9999, fontWeight: 600,
      border: `1px solid ${s.fg}33`,
      ...sizes[size],
    }}>
      <span style={{width:6, height:6, borderRadius:'50%', background:s.fg}}/>
      {s.label}
    </span>
  );
};

const TrackingChip = ({ code }) => {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      onClick={()=>{ navigator.clipboard?.writeText(code); setCopied(true); setTimeout(()=>setCopied(false),1200); }}
      className="mono"
      style={{
        display:'inline-flex', alignItems:'center', gap:8,
        padding:'4px 10px', borderRadius:6,
        background:'var(--bg-elevated)',
        border:'1px solid var(--border-normal)',
        color:'var(--accent-light)',
        fontSize:12, letterSpacing:'0.02em',
      }}>
      {code}
      {copied ? <I.Check size={12} stroke={3}/> : <I.Copy size={12}/>}
    </button>
  );
};

const Avatar = ({ name='', size=32, src }) => {
  const initials = name.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase();
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%',
      background:'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)',
      display:'flex', alignItems:'center', justifyContent:'center',
      color:'white', fontWeight:600, fontSize: size*0.4,
      flexShrink:0, overflow:'hidden', border: size>40?'2px solid var(--bg-surface)':'none',
    }}>
      {src ? <img src={src} alt={name} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : initials}
    </div>
  );
};

const Card = ({ children, padding=20, style, ...rest }) => (
  <div style={{
    background:'var(--bg-surface)',
    border:'1px solid var(--border-normal)',
    borderRadius: 12,
    padding,
    boxShadow:'var(--sh-sm)',
    ...style,
  }} {...rest}>{children}</div>
);

const Tabs = ({ tabs, active, onChange }) => (
  <div style={{display:'inline-flex', gap:4, padding:4, background:'var(--bg-surface)',
    borderRadius: 10, border: '1px solid var(--border-normal)'}}>
    {tabs.map(t => (
      <button key={t.value}
        onClick={()=>onChange(t.value)}
        style={{
          padding:'6px 14px', borderRadius:6, fontSize:13, fontWeight:500,
          color: active===t.value ? 'var(--text-primary)' : 'var(--text-secondary)',
          background: active===t.value ? 'var(--accent-subtle)' : 'transparent',
          transition:'all 160ms',
        }}>{t.label}</button>
    ))}
  </div>
);

const Chip = ({ active, onClick, children, count }) => (
  <button onClick={onClick} style={{
    display:'inline-flex', alignItems:'center', gap:8,
    padding:'6px 12px', borderRadius:9999,
    fontSize:13, fontWeight:500,
    background: active ? 'var(--accent-subtle)' : 'var(--bg-surface)',
    color: active ? 'var(--accent-light)' : 'var(--text-secondary)',
    border: `1px solid ${active ? 'var(--accent-primary)' : 'var(--border-normal)'}`,
    transition:'all 160ms',
  }}>
    {children}
    {count!=null && (
      <span style={{
        background: active?'var(--accent-primary)':'var(--bg-elevated)',
        color: active?'white':'var(--text-secondary)',
        padding:'1px 7px', borderRadius:9999, fontSize:11, fontWeight:600,
      }}>{count}</span>
    )}
  </button>
);

const PakLogo = ({ size = 28, showText = true }) => (
  <div style={{display:'flex', alignItems:'center', gap:10}}>
    <div style={{
      width:size, height:size, borderRadius: size*0.25,
      background:'linear-gradient(135deg, #A78BFA 0%, #7C3AED 55%, #4C1D95 100%)',
      display:'flex', alignItems:'center', justifyContent:'center',
      boxShadow:'0 4px 14px rgba(124,58,237,0.45)',
      position:'relative', overflow:'hidden',
    }}>
      <svg width={size*0.56} height={size*0.56} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
        <path d="m3.3 7 8.7 5 8.7-5"/>
        <path d="M12 22V12"/>
      </svg>
      <span style={{position:'absolute', top:3, right:4, width:5, height:5, borderRadius:'50%', background:'#F5F3FF', boxShadow:'0 0 6px #F5F3FF'}}/>
    </div>
    {showText && (
      <div style={{display:'flex', flexDirection:'column', lineHeight:1}}>
        <span style={{fontWeight:700, fontSize:16, letterSpacing:'-0.02em'}}>
          pak<span style={{color:'var(--accent-light)'}}>AG</span>
        </span>
      </div>
    )}
  </div>
);

const EmptyState = ({ icon, title, subtitle, cta }) => (
  <div style={{
    display:'flex', flexDirection:'column', alignItems:'center',
    padding:'48px 24px', textAlign:'center', gap: 12,
  }}>
    <div style={{
      width:64, height:64, borderRadius:16,
      background:'var(--bg-elevated)',
      border:'1px solid var(--border-normal)',
      display:'flex', alignItems:'center', justifyContent:'center',
      color:'var(--accent-light)', marginBottom:8,
    }}>{icon}</div>
    <h3 style={{margin:0, fontSize:16, fontWeight:600}}>{title}</h3>
    {subtitle && <p style={{margin:0, color:'var(--text-secondary)', fontSize:13, maxWidth:320}}>{subtitle}</p>}
    {cta}
  </div>
);

const Progress = ({ value, color='var(--accent-primary)', height=6 }) => (
  <div style={{background:'var(--bg-elevated)', height, borderRadius:9999, overflow:'hidden'}}>
    <div style={{width:`${value}%`, height:'100%', background:color, borderRadius:9999, transition:'width 240ms'}}/>
  </div>
);

Object.assign(window, {
  Btn, Input, Label, Checkbox, Toggle, StatusBadge, TrackingChip,
  Avatar, Card, Tabs, Chip, PakLogo, EmptyState, Progress, STATUS,
});
