import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-brand text-brand-ink hover:bg-brand-hover",
  secondary: "border border-line bg-surface text-fg hover:border-muted/50 hover:bg-surface-2",
  ghost: "text-muted hover:bg-surface hover:text-fg",
} as const;

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: keyof typeof variants;
  children: ReactNode;
};

export function LinkButton({
  href,
  variant = "primary",
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-[background-color,border-color,color,transform] duration-200 active:translate-y-px",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
