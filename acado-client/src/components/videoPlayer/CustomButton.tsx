import { ButtonHTMLAttributes, ReactNode } from 'react'

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'ghost'
  size?: 'icon'
}

export function CustomButton({ 
  children, 
  variant = 'ghost',
  size = 'icon',
  className = '',
  ...props 
}: CustomButtonProps) {
  return (
    <button
      {...props}
      className={`
        inline-flex items-center justify-center
        rounded-md
        transition-colors
        focus-visible:outline-none 
        focus-visible:ring-2
        focus-visible:ring-white
        disabled:pointer-events-none
        disabled:opacity-50
        ${variant === 'ghost' ? 'hover:bg-white/20' : ''}
        ${size === 'icon' ? 'h-10 w-10' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  )
}

