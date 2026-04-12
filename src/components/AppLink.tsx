"use client";

import NextLink from "next/link";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";

type AppLinkProps = ComponentPropsWithoutRef<typeof NextLink> & {
  className?: string;
};

export const AppLink = forwardRef<ElementRef<typeof NextLink>, AppLinkProps>(
  function AppLink({ href, className, children, ...rest }, ref) {
    return (
      <NextLink ref={ref} href={href} className={className} {...rest}>
        {children}
      </NextLink>
    );
  },
);
