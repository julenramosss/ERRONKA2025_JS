import { redirect } from 'next/navigation';

// Redirect root-level paths to the default locale.
// The proxy.ts middleware handles this for most cases;
// this is a fallback for static/direct access.
export default async function Page(props: {
  params: Promise<{ mdxPath?: string[] }>;
}) {
  const { mdxPath } = await props.params;
  const path = mdxPath?.length ? `/${mdxPath.join('/')}` : '';
  redirect(`/en${path}`);
}
