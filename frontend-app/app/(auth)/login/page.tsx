import { PakLogo } from "../../components/PackLogo";
import { GlowAmbient } from "./components/GlowAmbient";
import { LoginForm } from "./components/LoginForm";
import { RightPanel } from "./components/RightPanel";

// Login, 2FA, Error pages — with interactive state switcher

export default function LoginPage() {
  return (
    <main
      className="grid grid-cols-1 lg:grid-cols-2 h-screen"
      style={{ background: "var(--bg-darkest)" }}
    >
      <div className="relative flex w-full items-center justify-between px-6 flex-col p-10 overflow-hidden">
        <GlowAmbient />

        {/* LOGO */}
        <div className="relative z-10 w-full">
          <PakLogo size={35} showText={true} />
        </div>

        {/* LOGIN CONTAINER */}
        <div className="relative z-10 flex flex-col gap-10 transform -translate-y-1/10">
          <div className="max-w-100">
            {/* LOGIN HEADER */}
            <div className="flex items-left justify-center text-left flex-col mb-4">
              <h2 className="text-text-secondary text-md font-semibold mb-2">
                · ONGI ETORRI
              </h2>
              <h1 className="text-white font-bold text-3xl mb-4">Saioa hasi</h1>
              <p className="text-text-secondary">
                Paketeriak jarraitzeko eta kudeatzeko plataforma. Sartu zure
                kontura eta hasi paketeak kudeatzen!
              </p>
            </div>

            {/* LOGIN FORM */}
            <LoginForm />
          </div>
        </div>
        <div>
          <p className="relative z-10 text-text-secondary">
            pakAG © 2026 — Elduaien / Aduna · v2.4.1
          </p>
        </div>
      </div>
      <div className="hidden lg:block relative h-full overflow-hidden border-l border-accent-subtle">
        <RightPanel />
      </div>
    </main>
  );
}
