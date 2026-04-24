import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s – pakAG Docs",
    default: "pakAG Docs",
  },
  description:
    "Documentación de pakAG — API backend, frontend app y arquitectura.",
};

const navbar = (
  <Navbar
    logo={
      <span style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
        pak<span style={{ color: "#a78bfa" }}>AG</span>{" "}
        <span style={{ fontWeight: 400, color: "#6b7280" }}>docs</span>
      </span>
    }
  />
);

const footer = (
  <Footer>
    MIT {new Date().getFullYear()} © pakAG — Tolosako banaketa zerbitzua
  </Footer>
);

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          footer={footer}
          docsRepositoryBase="https://github.com/your-org/pakAG"
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
