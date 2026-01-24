"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";

type AppLinkProps = ComponentProps<typeof NextLink> & {
  className?: string;
};

export function AppLink({ href, className, children, ...rest }: AppLinkProps) {
  return (
    <NextLink href={href} className={className} {...rest}>
      {children}
    </NextLink>
  );
}
