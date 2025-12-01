// src/components/ui/state-select.tsx
import * as React from 'react';
import { useStates } from '@/hooks/useStates';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StateSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  required?: boolean;
  countryName?: string | null; // The selected country name
}

/**
 * Reusable State/Province Select component
 * Dynamically loads states based on the selected country
 */
export const StateSelect: React.FC<StateSelectProps> = ({
  value,
  onValueChange,
  placeholder = 'Select state/province',
  disabled = false,
  className,
  id,
  required = false,
  countryName,
}) => {
  const { states, hasStates } = useStates(countryName);

  // If no country is selected or country has no states, show disabled select
  const isDisabled = disabled || !countryName || !hasStates;

  // If country changed, clear the state value
  React.useEffect(() => {
    if (!countryName || !hasStates) {
      if (value) {
        onValueChange('');
      }
    }
  }, [countryName, hasStates, value, onValueChange]);

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={isDisabled}
      required={required}
    >
      <SelectTrigger className={className} id={id}>
        <SelectValue placeholder={placeholder}>
          {!countryName
            ? 'Please select a country first'
            : !hasStates
            ? 'No states available for this country'
            : value || placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {hasStates && states.length > 0 ? (
          states.map((state) => (
            <SelectItem key={state.name} value={state.name}>
              {state.name}
            </SelectItem>
          ))
        ) : (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            {!countryName ? 'Select a country first' : 'No states available'}
          </div>
        )}
      </SelectContent>
    </Select>
  );
};

