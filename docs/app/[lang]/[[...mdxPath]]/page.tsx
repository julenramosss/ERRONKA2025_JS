import React from 'react';
import type { Metadata } from 'next';
import { generateStaticParamsFor, importPage } from 'nextra/pages';
import { useMDXComponents } from '../../../mdx-components';
import {
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  buildCanonical,
  buildAlternates,
} from '../../lib/seo';

export const generateStaticParams = generateStaticParamsFor('mdxPath');

export async function generateMetadata(props: {
  params: Promise<{ lang: string; mdxPath: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const { lang, mdxPath = [] } = params;

  // Nextra reads frontmatter title / description when present.
  // Falls back to the first # heading as title if no frontmatter is set.
  const nextraMetadata = await importPage(mdxPath, lang)
    .then((r) => r.metadata as Record<string, unknown>)
    .catch(() => ({} as Record<string, unknown>));

  const title = (nextraMetadata?.title as string | undefined) ?? 'PakAG Engineering Docs';
  const description =
    (nextraMetadata?.description as string | undefined) ?? DEFAULT_DESCRIPTION;

  // /en/backend → '/backend', root → ''
  const pagePath = mdxPath.length ? `/${mdxPath.join('/')}` : '';
  const canonical = buildCanonical(lang, pagePath);

  return {
    // Spread Nextra's metadata first so frontmatter fields are preserved
    ...nextraMetadata,
    // Canonical URL — prevents duplicate-content penalties for i18n variants
    alternates: {
      canonical,
      languages: buildAlternates(pagePath),
    },
    openGraph: {
      type: 'article',
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
      locale: lang,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

const Wrapper = useMDXComponents()
  .wrapper as React.ComponentType<React.PropsWithChildren>;

export default async function Page(props: {
  params: Promise<{ lang: string; mdxPath: string[] }>;
}) {
  const params = await props.params;
  const result = await importPage(params.mdxPath ?? [], params.lang);
  const { default: MDXContent, ...rest } = result;
  return (
    <Wrapper {...rest}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
}

