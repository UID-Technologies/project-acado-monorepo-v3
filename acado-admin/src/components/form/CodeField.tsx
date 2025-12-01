import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CheckCircle2, FileText, Sparkles } from 'lucide-react';
import React from 'react';

interface CodeFieldProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (next: string) => void;
  onGenerate: () => void;
  className?: string;
}

export const CodeField: React.FC<CodeFieldProps> = ({
  id,
  label,
  value,
  placeholder = 'Generate a code',
  onChange,
  onGenerate,
  className,
}) => {
  const hasValue = value.trim().length > 0;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        <Button type="button" variant="link" size="sm" className="h-auto px-0 text-primary" onClick={onGenerate}>
          <Sparkles className="mr-1 h-3.5 w-3.5" />
          Generate code
        </Button>
      </div>
      <div
        className={cn(
          'flex items-center gap-3 rounded-md border px-3 py-2 transition-colors',
          hasValue ? 'border-primary/60 bg-primary/10 text-foreground' : 'border-input bg-background focus-within:border-primary'
        )}
      >
        <FileText className={cn('h-4 w-4', hasValue ? 'text-primary' : 'text-muted-foreground')} />
        <input
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-foreground outline-none focus:outline-none"
        />
        {hasValue && <CheckCircle2 className="h-4 w-4 text-primary" />}
      </div>
    </div>
  );
};


