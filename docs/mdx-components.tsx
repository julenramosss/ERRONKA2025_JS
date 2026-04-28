import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';
import { isValidElement } from 'react';
import { CodeBlock } from './app/components/CodeBlock';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractText(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children))
    return (children as ReactNode[]).map(extractText).join('');
  if (isValidElement(children)) {
    const props = children.props as { children?: ReactNode };
    return extractText(props.children);
  }
  return '';
}

type HeadingProps = { children?: ReactNode };

function H2({ children }: HeadingProps) {
  const id = slugify(extractText(children));
  return <h2 id={id || undefined}>{children}</h2>;
}

function H3({ children }: HeadingProps) {
  const id = slugify(extractText(children));
  return <h3 id={id || undefined}>{children}</h3>;
}

function H4({ children }: HeadingProps) {
  const id = slugify(extractText(children));
  return <h4 id={id || undefined}>{children}</h4>;
}

function Wrapper({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export function useMDXComponents(): MDXComponents {
  return {
    wrapper: Wrapper,
    pre: CodeBlock,
    h2: H2,
    h3: H3,
    h4: H4,
  };
}
