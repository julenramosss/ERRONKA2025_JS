"use client";

import { useRouter } from "next/navigation";
import { Icons } from "./components/Icons";
// import { Icons } from "@repo/frontend-app/app/components/icons";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <div className="w-full h-full flex items-center justify-center overflow-hidden bg-bg-dark px-6">
        {/* Ambient glow */}
        <div className="ambient-glow" />

        {/* Card */}
        <div className="relative z-10 text-center max-w-md flex items-center justify-center gap-6 flex-col">
          {/* 404 */}
          <div
            className="font-extrabold leading-none tracking-tighter mb-4 select-none"
            style={{
              fontSize: "clamp(8rem, 25vw, 14rem)",
              background:
                "linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #3d2960 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </div>

          {/* Title */}
          <h2 className="text-lg md:text-2xl font-bold text-text-primary mb-2">
            Esta página no existe
          </h2>

          {/* Description */}
          <p className="text-text-secondary mb-8">
            Parece que te has perdido en la ruta. Comprueba la URL o vuelve al
            inicio.
          </p>

          {/* Button */}
          <button
            onClick={() => router.push("/")}
            className="
            flex items-center justify-center gap-3 px-5 py-2 bg-accent hover:bg-accent-hover
            text-text-primary font-medium text-lg
            border border-border
            rounded-lg
            duration-150
            cursor-pointer group transition-all
          "
          >
            <Icons.ArrowLeft
              size={16}
              className="group-hover:-translate-x-2 transition-all"
            />
            Volver al inicio
          </button>
        </div>
      </div>
    </main>
  );
}
