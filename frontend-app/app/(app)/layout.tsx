import { Header } from "./components/Header/Header";
import { AsideMenu } from "./components/Menu/AsideMenu";
import { SessionKeepAlive } from "../components/SessionKeepAlive";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-row min-h-screen">
      <SessionKeepAlive />
      <AsideMenu />
      <div className="flex flex-1 flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <footer className="w-full flex items-center justify-center py-2 text-text-secondary text-sm">
          pakAG © 2026 — Elduaien / Aduna · v2.4.1
        </footer>
      </div>
    </main>
  );
}
