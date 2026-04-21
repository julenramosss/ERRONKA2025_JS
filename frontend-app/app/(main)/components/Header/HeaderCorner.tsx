export function HeaderCorner() {
  return (
    <div className="hidden md:block absolute bottom-0 left-0 translate-y-full w-4 h-4">
      <span className="absolute top-0 left-0 w-full h-full bg-border" />
      <span className="absolute bottom-0 right-0 w-full h-full bg-bg-dark rounded-tl-full border-t border-border" />
    </div>
  );
}
