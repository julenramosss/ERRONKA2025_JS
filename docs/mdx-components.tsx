import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";
import { CodeBlock } from "./app/components/CodeBlock";

function Wrapper({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export function useMDXComponents(): MDXComponents {
  return {
    wrapper: Wrapper,
    pre: CodeBlock,
  };
}
