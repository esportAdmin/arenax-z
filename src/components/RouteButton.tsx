"use client";

import type { ReactNode } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useAppNavigate, type NavigateOptions } from "@/hooks/useAppNavigate";

type RouteButtonProps = Omit<ButtonProps, "onClick"> & {
  href: string;
  navigateOptions?: NavigateOptions;
  children: ReactNode;
};

export function RouteButton({
  href,
  navigateOptions,
  children,
  type = "button",
  ...props
}: RouteButtonProps) {
  const navigate = useAppNavigate();

  return (
    <Button
      {...props}
      type={type}
      onClick={() => navigate(href, navigateOptions)}
    >
      {children}
    </Button>
  );
}
