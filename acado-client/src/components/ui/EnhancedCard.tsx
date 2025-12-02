/**
 * Enhanced Card Component
 * 
 * Modern card component with multiple variants, hover effects, and states
 * Supports glassmorphism, elevation, and interactive modes
 */

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'flat' | 'bordered' | 'glass';
  hover?: 'lift' | 'glow' | 'scale' | 'none';
  interactive?: boolean;
  loading?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const EnhancedCard = forwardRef<HTMLDivElement, EnhancedCardProps>(
  (
    {
      className,
      variant = 'elevated',
      hover = 'lift',
      interactive = false,
      loading = false,
      padding = 'md',
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = cn(
      'rounded-xl transition-all duration-300',
      'relative overflow-hidden',
      interactive && 'cursor-pointer',
      loading && 'pointer-events-none opacity-60'
    );

    // Variant styles
    const variantStyles = {
      elevated: cn(
        'bg-white dark:bg-gray-900',
        'shadow-soft-md',
        'border border-gray-100 dark:border-gray-800'
      ),
      flat: cn(
        'bg-white dark:bg-gray-900',
        'border border-gray-200 dark:border-gray-800'
      ),
      bordered: cn(
        'bg-transparent',
        'border-2 border-gray-200 dark:border-gray-700'
      ),
      glass: cn(
        'bg-white/80 dark:bg-gray-900/80',
        'backdrop-blur-lg backdrop-saturate-150',
        'border border-white/20 dark:border-gray-700/20',
        'shadow-soft-lg'
      ),
    };

    // Hover styles
    const hoverStyles = {
      lift: cn(
        'hover:-translate-y-1 hover:shadow-soft-xl',
        interactive && 'hover:border-primary-200 dark:hover:border-primary-800'
      ),
      glow: cn(
        'hover:shadow-glow',
        interactive && 'hover:border-primary-300 dark:hover:border-primary-700'
      ),
      scale: cn(
        'hover:scale-[1.02]',
        interactive && 'hover:shadow-soft-lg'
      ),
      none: '',
    };

    // Padding styles
    const paddingStyles = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4 sm:p-6',
      lg: 'p-6 sm:p-8',
      xl: 'p-8 sm:p-10',
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          hover !== 'none' && hoverStyles[hover],
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        )}
        {children}
      </div>
    );
  }
);

EnhancedCard.displayName = 'EnhancedCard';

// Card sub-components
export const EnhancedCardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 mb-4', className)}
      {...props}
    />
  )
);
EnhancedCardHeader.displayName = 'EnhancedCardHeader';

export const EnhancedCardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-xl sm:text-2xl font-semibold leading-tight tracking-tight text-gray-900 dark:text-gray-100', className)}
      {...props}
    />
  )
);
EnhancedCardTitle.displayName = 'EnhancedCardTitle';

export const EnhancedCardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-gray-600 dark:text-gray-400 leading-relaxed', className)}
      {...props}
    />
  )
);
EnhancedCardDescription.displayName = 'EnhancedCardDescription';

export const EnhancedCardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-gray-700 dark:text-gray-300', className)}
      {...props}
    />
  )
);
EnhancedCardContent.displayName = 'EnhancedCardContent';

export const EnhancedCardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-800', className)}
      {...props}
    />
  )
);
EnhancedCardFooter.displayName = 'EnhancedCardFooter';

export const EnhancedCardMedia = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { aspectRatio?: 'video' | 'square' | 'portrait' }>(
  ({ className, aspectRatio = 'video', children, ...props }, ref) => {
    const aspectStyles = {
      video: 'aspect-video',
      square: 'aspect-square',
      portrait: 'aspect-[3/4]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-lg mb-4',
          aspectStyles[aspectRatio],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
EnhancedCardMedia.displayName = 'EnhancedCardMedia';

export const EnhancedCardBadge = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement> & { variant?: 'primary' | 'success' | 'warning' | 'danger' }>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300',
      success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
      danger: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);
EnhancedCardBadge.displayName = 'EnhancedCardBadge';

export default EnhancedCard;

