interface PakLogoProps {
  size?: number;
  showText?: boolean;
}

export const PakLogo = ({ size = 28, showText = true }: PakLogoProps) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.25,
        background:
          'linear-gradient(135deg, #A78BFA 0%, #7C3AED 55%, #4C1D95 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(124,58,237,0.45)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <svg
        width={size * 0.56}
        height={size * 0.56}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
      <span
        style={{
          position: 'absolute',
          top: 3,
          right: 4,
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: '#F5F3FF',
          boxShadow: '0 0 6px #F5F3FF',
        }}
      />
    </div>
    {showText && (
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span
          style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}
        >
          pak<span style={{ color: 'var(--accent-light)' }}>AG</span>
        </span>
      </div>
    )}
  </div>
);
