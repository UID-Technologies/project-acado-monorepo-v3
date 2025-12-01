import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface TagInputProps {
  id: string;
  label?: React.ReactNode;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = 'Type a keyword and press Enter',
  description,
  required,
  disabled,
  className,
  inputClassName,
}) => {
  const [inputValue, setInputValue] = useState('');
  const tags = Array.isArray(value) ? value : [];

  const addTag = (tag: string) => {
    const sanitized = tag.trim().toLowerCase();
    if (!sanitized) {
      return;
    }
    const exists = tags.some((existing) => existing.toLowerCase() === sanitized);
    if (exists) {
      setInputValue('');
      return;
    }
    onChange([...tags, sanitized]);
    setInputValue('');
  };

  const removeTag = (index: number) => {
    const next = [...tags];
    next.splice(index, 1);
    onChange(next);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ',' || event.key === 'Tab') {
      if (event.key !== 'Tab') {
        event.preventDefault();
      }
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (event.key === 'Backspace' && !inputValue && tags.length) {
      event.preventDefault();
      removeTag(tags.length - 1);
    }
  };

  const handleBlur = () => {
    if (disabled) return;
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    event.preventDefault();
    const pasted = event.clipboardData.getData('text');
    const tokens = pasted
      .split(/[\s,;]+/)
      .map((token) => token.trim())
      .filter(Boolean);
    if (!tokens.length) return;
    const next = [...tags];
    tokens.forEach((token) => {
      const sanitized = token.toLowerCase();
      if (!next.some((existing) => existing.toLowerCase() === sanitized)) {
        next.push(sanitized);
      }
    });
    onChange(next);
    setInputValue('');
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={id}>
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <div
        className={cn(
          'flex min-h-[44px] flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary',
          disabled && 'opacity-60'
        )}
      >
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="group flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                className="rounded-full p-0.5 text-muted-foreground/70 transition-colors hover:text-foreground"
                onClick={() => removeTag(index)}
                aria-label={`Remove keyword ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </span>
        ))}
        {!disabled && (
          <input
            id={id}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onPaste={handlePaste}
            placeholder={tags.length ? '' : placeholder}
            className={cn(
              'flex-1 min-w-[120px] bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground',
              inputClassName
            )}
            autoComplete="off"
          />
        )}
      </div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  );
};


