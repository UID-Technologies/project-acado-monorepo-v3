/**
 * Enhanced Button Component
 * 
 * Modern, professional button with multiple variants, sizes, and states
 * Includes loading states, icons, and smooth animations
 */

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

export interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'gradient' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: boolean;
  asChild?: boolean;
}

const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      rounded = 'lg',
      shadow = true,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2',
      'font-medium transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'active:scale-[0.98]',
      fullWidth && 'w-full'
    );

    // Variant styles
    const variantStyles = {
      primary: cn(
        'bg-primary-600 text-white',
        'hover:bg-primary-700 hover:shadow-lg',
        'focus-visible:ring-primary-500',
        shadow && 'shadow-soft-md',
        'dark:bg-primary-500 dark:hover:bg-primary-600'
      ),
      secondary: cn(
        'bg-gray-100 text-gray-900',
        'hover:bg-gray-200 hover:shadow-md',
        'focus-visible:ring-gray-500',
        'dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700'
      ),
      outline: cn(
        'border-2 border-primary-600 text-primary-600 bg-transparent',
        'hover:bg-primary-50 hover:shadow-md',
        'focus-visible:ring-primary-500',
        'dark:border-primary-500 dark:text-primary-500 dark:hover:bg-primary-950'
      ),
      ghost: cn(
        'text-gray-700 bg-transparent',
        'hover:bg-gray-100 hover:text-gray-900',
        'focus-visible:ring-gray-500',
        'dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
      ),
      link: cn(
        'text-primary-600 underline-offset-4',
        'hover:underline hover:text-primary-700',
        'focus-visible:ring-primary-500',
        'dark:text-primary-500 dark:hover:text-primary-400'
      ),
      gradient: cn(
        'bg-gradient-to-r from-primary-600 to-primary-800 text-white',
        'hover:from-primary-700 hover:to-primary-900 hover:shadow-glow',
        'focus-visible:ring-primary-500',
        shadow && 'shadow-soft-lg'
      ),
      danger: cn(
        'bg-red-600 text-white',
        'hover:bg-red-700 hover:shadow-lg',
        'focus-visible:ring-red-500',
        shadow && 'shadow-soft-md',
        'dark:bg-red-500 dark:hover:bg-red-600'
      ),
      success: cn(
        'bg-green-600 text-white',
        'hover:bg-green-700 hover:shadow-lg',
        'focus-visible:ring-green-500',
        shadow && 'shadow-soft-md',
        'dark:bg-green-500 dark:hover:bg-green-600'
      ),
    };

    // Size styles
    const sizeStyles = {
      xs: 'h-7 px-2.5 text-xs',
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-11 px-6 text-base',
      xl: 'h-12 px-8 text-lg',
    };

    // Rounded styles
    const roundedStyles = {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          roundedStyles[rounded],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Spinner size={size === 'xs' || size === 'sm' ? 'xs' : 'sm'} />
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <span className="inline-flex items-center">{icon}</span>
        )}
        
        {children}
        
        {!loading && icon && iconPosition === 'right' && (
          <span className="inline-flex items-center">{icon}</span>
        )}
      </button>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';

export default EnhancedButton;

