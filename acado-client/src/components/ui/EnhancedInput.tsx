/**
 * Enhanced Input Component
 * 
 * Modern input with floating labels, validation states, and icons
 * Supports multiple variants and sizes
 */

import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { FiEye, FiEyeOff, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';

export interface EnhancedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  success?: boolean;
  variant?: 'outlined' | 'filled' | 'underlined';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  clearable?: boolean;
  onClear?: () => void;
  showPasswordToggle?: boolean;
  characterCount?: boolean;
  maxLength?: number;
}

const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
  (
    {
      className,
      label,
      helperText,
      error = false,
      errorMessage,
      success = false,
      variant = 'outlined',
      size = 'md',
      icon,
      iconPosition = 'left',
      clearable = false,
      onClear,
      showPasswordToggle = false,
      characterCount = false,
      maxLength,
      type = 'text',
      value,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState(value || '');

    const hasValue = (value || internalValue)?.toString().length > 0;
    const currentType = showPasswordToggle && showPassword ? 'text' : type;

    // Base styles
    const baseStyles = cn(
      'w-full transition-all duration-200',
      'focus:outline-none focus:ring-0',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'placeholder:text-gray-400 dark:placeholder:text-gray-500'
    );

    // Variant styles
    const variantStyles = {
      outlined: cn(
        'border-2 rounded-lg bg-white dark:bg-gray-900',
        error
          ? 'border-red-500 focus:border-red-600'
          : success
          ? 'border-green-500 focus:border-green-600'
          : 'border-gray-300 dark:border-gray-700 focus:border-primary-600 dark:focus:border-primary-500',
        'focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30'
      ),
      filled: cn(
        'border-0 border-b-2 rounded-t-lg',
        'bg-gray-100 dark:bg-gray-800',
        error
          ? 'border-red-500 focus:border-red-600'
          : success
          ? 'border-green-500 focus:border-green-600'
          : 'border-gray-300 dark:border-gray-600 focus:border-primary-600 dark:focus:border-primary-500',
        'focus:bg-gray-50 dark:focus:bg-gray-700/50'
      ),
      underlined: cn(
        'border-0 border-b-2 rounded-none bg-transparent',
        error
          ? 'border-red-500 focus:border-red-600'
          : success
          ? 'border-green-500 focus:border-green-600'
          : 'border-gray-300 dark:border-gray-600 focus:border-primary-600 dark:focus:border-primary-500'
      ),
    };

    // Size styles
    const sizeStyles = {
      sm: cn(
        'h-9 text-sm',
        icon ? (iconPosition === 'left' ? 'pl-9' : 'pr-9') : 'px-3',
        (clearable || showPasswordToggle) && 'pr-9'
      ),
      md: cn(
        'h-11 text-base',
        icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : 'px-4',
        (clearable || showPasswordToggle) && 'pr-10'
      ),
      lg: cn(
        'h-12 text-lg',
        icon ? (iconPosition === 'left' ? 'pl-12' : 'pr-12') : 'px-5',
        (clearable || showPasswordToggle) && 'pr-12'
      ),
    };

    // Label styles
    const labelStyles = cn(
      'absolute left-4 transition-all duration-200 pointer-events-none',
      'text-gray-600 dark:text-gray-400',
      (isFocused || hasValue)
        ? 'text-xs -top-2.5 bg-white dark:bg-gray-900 px-1'
        : size === 'sm'
        ? 'top-2 text-sm'
        : size === 'lg'
        ? 'top-3.5 text-base'
        : 'top-3 text-base',
      error && 'text-red-600',
      success && 'text-green-600',
      isFocused && !error && !success && 'text-primary-600 dark:text-primary-500'
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      props.onChange?.(e);
    };

    const handleClear = () => {
      setInternalValue('');
      onClear?.();
    };

    return (
      <div className="relative w-full">
        {/* Input Container */}
        <div className="relative">
          {/* Icon - Left */}
          {icon && iconPosition === 'left' && (
            <div className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400',
              size === 'sm' && 'text-sm',
              size === 'lg' && 'text-lg'
            )}>
              {icon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={currentType}
            value={value !== undefined ? value : internalValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            maxLength={maxLength}
            className={cn(
              baseStyles,
              variantStyles[variant],
              sizeStyles[size],
              'text-gray-900 dark:text-gray-100',
              className
            )}
            {...props}
          />

          {/* Floating Label */}
          {label && variant !== 'underlined' && (
            <label className={labelStyles}>
              {label}
            </label>
          )}

          {/* Icon - Right / Clear / Password Toggle / Status */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Success Icon */}
            {success && !error && (
              <FiCheck className="text-green-600 text-lg" />
            )}

            {/* Error Icon */}
            {error && (
              <FiAlertCircle className="text-red-600 text-lg" />
            )}

            {/* Clear Button */}
            {clearable && hasValue && !disabled && !error && !success && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <FiX className="text-lg" />
              </button>
            )}

            {/* Password Toggle */}
            {showPasswordToggle && type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
              </button>
            )}

            {/* Icon - Right */}
            {icon && iconPosition === 'right' && !clearable && !showPasswordToggle && (
              <div className="text-gray-500 dark:text-gray-400">
                {icon}
              </div>
            )}
          </div>
        </div>

        {/* Helper Text / Error Message / Character Count */}
        <div className="flex items-center justify-between mt-1.5 px-1">
          {/* Helper Text or Error Message */}
          {(helperText || errorMessage) && (
            <p className={cn(
              'text-xs',
              error ? 'text-red-600 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'
            )}>
              {error && errorMessage ? errorMessage : helperText}
            </p>
          )}

          {/* Character Count */}
          {characterCount && maxLength && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {(value || internalValue)?.toString().length || 0} / {maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

EnhancedInput.displayName = 'EnhancedInput';

export default EnhancedInput;

