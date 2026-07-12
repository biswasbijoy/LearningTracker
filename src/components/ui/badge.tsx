import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900",
        secondary:
          "border-transparent bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-50",
        destructive:
          "border-transparent bg-red-500 text-neutral-50 shadow hover:bg-red-600",
        outline: "text-neutral-950 dark:text-neutral-50",
        notStarted:
          "border-transparent bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300",
        inProgress:
          "border-transparent bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
        completed:
          "border-transparent bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
        blocked:
          "border-transparent bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
