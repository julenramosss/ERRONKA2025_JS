import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import "./pakag-theme.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getDictionary } from "./i18n";

const dict = getDictionary("en");

export const metadata: Metadata = {
  title: {
    template: "%s · PakAG Docs",
    default: dict.metadata.siteTitle,
  },
  description: dict.metadata.siteDescription,
};

const navbar = (
  <Navbar
    logo={
      <span className="pakag-logo">
        <span className="pakag-logo__brand">Pak</span>
        <span className="pakag-logo__accent">AG</span>
        <span className="pakag-logo__docs">{dict.brand.docsLabel}</span>
      </span>
    }
  />
);

const footer = <Footer>PakAG © {new Date().getFullYear()} · Internal engineering handbook</Footer>;

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head color={{ hue: 262, saturation: 77, lightness: 57 }}>
        <meta name="theme-color" content="#7c3aed" />
      </Head>
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          footer={footer}
          docsRepositoryBase="https://github.com/sergiotolosa04/ERRONKA_2025/tree/main/docs"
          sidebar={{ defaultMenuCollapseLevel: 1, autoCollapse: true }}
          toc={{ backToTop: true, title: dict.common.onThisPage }}
          editLink={dict.common.editThisPage}
          feedback={{ content: null }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
