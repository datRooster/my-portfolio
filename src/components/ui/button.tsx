import { cn } from '@/lib/utils';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  asChild?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
    
    const variants = {
      default: 'bg-amber-400 text-gray-950 hover:bg-amber-300',
      outline: 'border border-gray-700 text-gray-100 bg-transparent hover:bg-gray-800',
      ghost: 'text-gray-100 hover:bg-gray-800',
      secondary: 'bg-gray-800 text-gray-100 hover:bg-gray-700'
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm',
      default: 'h-10 py-2 px-4',
      lg: 'h-11 px-8'
    };

    if (asChild && React.isValidElement(props.children)) {
      const child = props.children as React.ReactElement<any>;
      return React.cloneElement(child, {
        ...child.props,
        className: cn(baseClasses, variants[variant], sizes[size], className, child.props?.className),
      });
    }

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
