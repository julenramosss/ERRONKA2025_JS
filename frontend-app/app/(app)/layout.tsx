import { AsideMenu } from "./components/menu/AsideMenu";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-row min-h-screen">
      <AsideMenu />
      <div className="flex flex-1 flex-col">
        <div className="flex-1">{children}</div>
        <footer className="w-full flex items-center justify-center py-2 text-text-secondary text-sm">
          pakAG © 2026 — Elduaien / Aduna · v2.4.1
        </footer>
      </div>
    </main>
  );
}
