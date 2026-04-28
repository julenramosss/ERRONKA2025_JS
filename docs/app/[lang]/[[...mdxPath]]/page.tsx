import React from 'react';
import { generateStaticParamsFor, importPage } from 'nextra/pages';
import { useMDXComponents } from '../../../mdx-components';

export const generateStaticParams = generateStaticParamsFor('mdxPath');

export async function generateMetadata(props: {
  params: Promise<{ lang: string; mdxPath: string[] }>;
}) {
  const params = await props.params;
  const { metadata } = await importPage(params.mdxPath ?? [], params.lang);
  return metadata;
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
