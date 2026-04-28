import { Header } from './components/Header/Header';
import { AsideMenu } from './components/AsideMenu/AsideMenu';
import { SessionKeepAlive } from '../components/SessionKeepAlive';
import { PreferencesSync } from '../components/PreferencesSync';
import { TutorialProvider } from '../providers/TutorialProvider';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TutorialProvider>
      <main className="flex flex-row min-h-screen">
        <PreferencesSync />
        <SessionKeepAlive />
        <AsideMenu />
        <div className="flex flex-1 flex-col">
          <Header />
          <div className="flex-1">{children}</div>
          <footer className="w-full flex items-center justify-center py-5 text-text-secondary text-sm">
            pakAG © 2026 — Elduaien / Aduna · v2.4.1
          </footer>
        </div>
      </main>
    </TutorialProvider>
  );
}
