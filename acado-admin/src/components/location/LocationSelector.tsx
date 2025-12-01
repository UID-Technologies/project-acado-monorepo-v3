// src/components/location/LocationSelector.tsx
import * as React from 'react';
import { ChevronsUpDown, Check, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { locationsApi } from '@/api/locations.api';
import { cn } from '@/lib/utils';

type LocationValue = {
  country: string;
  state: string;
  city: string;
};

interface LocationSelectorProps {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
  disabled?: boolean;
  required?: boolean;
  includeCity?: boolean;
  className?: string;
  labels?: {
    country?: string;
    state?: string;
    city?: string;
  };
}

interface ComboBoxProps {
  label: string;
  placeholder: string;
  items: string[];
  value: string;
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  onSelect: (value: string) => void;
}

const LocationCombobox: React.FC<ComboBoxProps> = ({
  label,
  placeholder,
  items,
  value,
  disabled,
  loading,
  emptyMessage,
  onSelect,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'w-full justify-between rounded-md border bg-background px-3 py-2 text-left text-sm font-normal shadow-sm transition hover:border-foreground/30',
              !value && 'text-muted-foreground',
              disabled && 'cursor-not-allowed opacity-70'
            )}
          >
            <span className="truncate max-w-[220px]">{value || placeholder}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[300px]" align="start">
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}…`} />
            <CommandList>
              <CommandEmpty>
                {loading ? 'Loading…' : emptyMessage ?? `No ${label.toLowerCase()} found.`}
              </CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item}
                    value={item}
                    onSelect={(currentValue) => {
                      onSelect(currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check className={cn('mr-2 h-4 w-4', value === item ? 'opacity-100' : 'opacity-0')} />
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const initialValue: LocationValue = {
  country: '',
  state: '',
  city: '',
};

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onChange,
  disabled,
  includeCity = true,
  className,
  labels = {
    country: 'Country',
    state: 'State / Province',
    city: 'City',
  },
}) => {
  const { toast } = useToast();
  const [countries, setCountries] = React.useState<string[]>([]);
  const [states, setStates] = React.useState<string[]>([]);
  const [cities, setCities] = React.useState<string[]>([]);

  const [countriesLoading, setCountriesLoading] = React.useState(false);
  const [statesLoading, setStatesLoading] = React.useState(false);
  const [citiesLoading, setCitiesLoading] = React.useState(false);

  const locationValue = value ?? initialValue;

  React.useEffect(() => {
    let active = true;
    setCountriesLoading(true);
    locationsApi
      .getCountries()
      .then((data) => {
        if (active) {
          setCountries(data);
        }
      })
      .catch((error) => {
        console.error('Failed to load countries', error);
        toast({
          title: 'Failed to load countries',
          description: 'Please refresh the page or try again later.',
          variant: 'destructive',
        });
      })
      .finally(() => {
        if (active) setCountriesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [toast]);

  React.useEffect(() => {
    if (!locationValue.country) {
      setStates([]);
      setCities([]);
      return;
    }

    let active = true;
    setStatesLoading(true);
    locationsApi
      .getStates(locationValue.country)
      .then((data) => {
        if (!active) return;
        setStates(data);
        // If current state is not in the new set, clear it
        if (locationValue.state && !data.includes(locationValue.state)) {
          onChange({ ...locationValue, state: '', city: '' });
        }
      })
      .catch((error) => {
        console.error('Failed to load states', error);
        toast({
          title: 'Failed to load states',
          description: 'Unable to fetch states for the selected country.',
          variant: 'destructive',
        });
        setStates([]);
        onChange({ ...locationValue, state: '', city: '' });
      })
      .finally(() => {
        if (active) setStatesLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationValue.country]);

  React.useEffect(() => {
    if (!includeCity) {
      setCities([]);
      return;
    }

    if (!locationValue.country || !locationValue.state) {
      setCities([]);
      return;
    }

    let active = true;
    setCitiesLoading(true);
    locationsApi
      .getCities(locationValue.country, locationValue.state)
      .then((data) => {
        if (!active) return;
        setCities(data);
        if (locationValue.city && !data.includes(locationValue.city)) {
          onChange({ ...locationValue, city: '' });
        }
      })
      .catch((error) => {
        console.error('Failed to load cities', error);
        toast({
          title: 'Failed to load cities',
          description: 'Unable to fetch cities for the selected state.',
          variant: 'destructive',
        });
        setCities([]);
        onChange({ ...locationValue, city: '' });
      })
      .finally(() => {
        if (active) setCitiesLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationValue.country, locationValue.state, includeCity]);

  const handleCountrySelect = (country: string) => {
    onChange({
      country,
      state: '',
      city: '',
    });
  };

  const handleStateSelect = (state: string) => {
    onChange({
      ...locationValue,
      state,
      city: '',
    });
  };

  const handleCitySelect = (city: string) => {
    onChange({
      ...locationValue,
      city,
    });
  };

  return (
    <div className={cn('space-y-4 rounded-lg border bg-card p-4 shadow-sm', className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>Set the geographic location for this university.</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <LocationCombobox
          label={labels.country ?? 'Country'}
          placeholder="Select country"
          items={countries}
          value={locationValue.country}
          onSelect={handleCountrySelect}
          disabled={disabled}
          loading={countriesLoading}
          emptyMessage="No countries available."
        />
        <LocationCombobox
          label={labels.state ?? 'State / Province'}
          placeholder={locationValue.country ? 'Select state' : 'Select a country first'}
          items={states}
          value={locationValue.state}
          onSelect={handleStateSelect}
          disabled={disabled || !locationValue.country || states.length === 0}
          loading={statesLoading}
          emptyMessage={
            !locationValue.country
              ? 'Select a country first.'
              : 'No states found for the selected country.'
          }
        />
        {includeCity && (
          <LocationCombobox
            label={labels.city ?? 'City'}
            placeholder={
              locationValue.state
                ? 'Select city'
                : locationValue.country
                ? 'Select a state first'
                : 'Select a country first'
            }
            items={cities}
            value={locationValue.city}
            onSelect={handleCitySelect}
            disabled={
              disabled ||
              !locationValue.country ||
              !locationValue.state ||
              cities.length === 0
            }
            loading={citiesLoading}
            emptyMessage={
              !locationValue.state
                ? 'Select a state first.'
                : 'No cities found for the selected state.'
            }
          />
        )}
      </div>

      {(locationValue.country || locationValue.state || locationValue.city) && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Selected:</span>
          {locationValue.country && <Badge variant="secondary">{locationValue.country}</Badge>}
          {locationValue.state && <Badge variant="secondary">{locationValue.state}</Badge>}
          {includeCity && locationValue.city && (
            <Badge variant="secondary">{locationValue.city}</Badge>
          )}
        </div>
      )}
    </div>
  );
};

export type LocationSelectorValue = LocationValue;


