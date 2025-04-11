
import React from 'react';
import { cn } from '@/lib/utils';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  leftIcon?: React.ReactNode;
}

const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ children, variant = 'primary', size = 'default', className, leftIcon, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative rounded-full transition-all duration-300 flex items-center justify-center overflow-hidden",
          {
            "px-6 py-2.5 text-base": size === 'default',
            "px-4 py-2 text-sm": size === 'sm',
            "px-8 py-3 text-lg": size === 'lg',
          },
          "bg-gradient-to-r from-[#53ffe9]/60 via-[#53ffe9]/20 to-black",
          "border-r-1 border-t-1 border-b-1 border-[#282828]",
          "border-l-0 rounded-l-full rounded-r-full",
          className
        )}
        {...props}
      >
        <span className="relative flex items-center gap-2">
          {leftIcon && <span className="text-[#0070F3]">{leftIcon}</span>}
          {variant === 'primary' ? (
            <>
              <span className="font-semibold text-[#0070F3]">{children}</span>
            </>
          ) : (
            <span className="text-gray-300 font-normal">{children}</span>
          )}
        </span>
      </button>
    );
  }
);

GlowButton.displayName = 'GlowButton';

export default GlowButton;