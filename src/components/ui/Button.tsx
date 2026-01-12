import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils'; // Assuming you have this util

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:pointer-events-none disabled:opacity-50",
                    {
                        'bg-white text-black hover:bg-gray-200': variant === 'primary',
                        'border border-white/20 bg-transparent hover:bg-white/10 text-white': variant === 'outline',
                        'hover:bg-white/10 text-white': variant === 'ghost',
                        'h-8 px-3 text-xs': size === 'sm',
                        'h-10 px-8 py-2': size === 'md',
                        'h-12 px-10 text-lg': size === 'lg',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
