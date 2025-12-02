/**
 * Section Component
 * 
 * Semantic section wrapper with consistent spacing and styling
 * Provides visual separation between page sections
 */

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import Container from './Container';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'white' | 'gray' | 'primary' | 'gradient' | 'transparent';
  container?: boolean;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      spacing = 'md',
      background = 'transparent',
      container = true,
      containerSize = 'xl',
      children,
      ...props
    },
    ref
  ) => {
    // Spacing styles
    const spacingStyles = {
      none: 'py-0',
      sm: 'py-8 sm:py-10',
      md: 'py-12 sm:py-16',
      lg: 'py-16 sm:py-20',
      xl: 'py-20 sm:py-24',
    };

    // Background styles
    const backgroundStyles = {
      white: 'bg-white dark:bg-gray-900',
      gray: 'bg-gray-50 dark:bg-gray-800',
      primary: 'bg-primary-600 dark:bg-primary-700 text-white',
      gradient: 'bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 text-white',
      transparent: 'bg-transparent',
    };

    const content = container ? (
      <Container size={containerSize}>{children}</Container>
    ) : (
      children
    );

    return (
      <section
        ref={ref}
        className={cn(
          spacingStyles[spacing],
          backgroundStyles[background],
          className
        )}
        {...props}
      >
        {content}
      </section>
    );
  }
);

Section.displayName = 'Section';

export default Section;

