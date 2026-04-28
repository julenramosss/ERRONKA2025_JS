export function GlowAmbient() {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 10% 90%, rgba(124,58,237,0.18) 0%, transparent 65%), ' +
            'radial-gradient(ellipse 50% 35% at 90% 5%, rgba(61,41,96,0.25) 0%, transparent 60%)',
        }}
      />
    </>
  );
}
