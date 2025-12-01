import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Error from '@/components/shared/Error';
import { Event } from '@app/types/learner/events'
import { useEventCategory, useEvents } from '@app/hooks/data/collaborate/useEvents';
import Heading from '@/components/heading';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/shadcn/popover';
import { Button } from '@/components/ui/ShadcnButton';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/shadcn/command';
import { cn } from '@/lib/utils';
import LoadingSection from '@/components/LoadingSection';
import { formatDate } from '@/utils/commonDateFormat';
import { Badge } from '@/components/ui/badge';

export default function EventsPage() {

  const [selectedGroup, setSelectedGroup] = React.useState<number | undefined>(undefined);
  const [open, setOpen] = React.useState(false);
  const { data: groups = [] } = useEventCategory();

  const navigate = useNavigate();

  const urlParams = useMemo(() => {
    if (!selectedGroup) return undefined;
    return { event_category_id: selectedGroup?.toString() };
  }, [selectedGroup]);

  const { data: events, isLoading, isError, error } = useEvents(urlParams ? new URLSearchParams(urlParams) : undefined);

  const handleCardClick = (eventItem: Event) => {
    navigate(`/event-activity/${eventItem.id}`, { state: { event: eventItem } });
  };

  if (isError) {
    return <Error error={error.message} />;
  }

  const statusClass = (eventItem) => {
    switch (eventItem.com_status?.program_status) {
      case 'Ongoing':
        return 'bg-green-500 text-white px-2 py-1 rounded-md text-xs absolute top-2 right-2';
      case 'Completed':
        return 'bg-red-500 text-white px-2 py-1 rounded-md text-xs absolute top-2 right-2';
      default:
        return 'bg-gray-500 text-white px-2 py-1 rounded-md text-xs absolute top-2 right-2';
    }
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-2'>
        <Heading title='Events' description='Participate in events to showcase your skills and win exciting prizes!' />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {selectedGroup ? groups.find((group) => group.id === selectedGroup)?.name : "Select Category..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>

          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search framework..." className="h-9" />
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {groups?.map((group) => (
                    <CommandItem
                      key={group.id}
                      value={group.name}
                      onSelect={() => {
                        setSelectedGroup(group.id);
                        setOpen(false);
                      }}
                    >
                      {group.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          selectedGroup === group.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <LoadingSection isLoading={isLoading} title="Loading Events..." />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events && events?.length > 0 &&
          events
            .slice() // create a copy before sorting (to avoid mutating state)
            .sort((a, b) => {
              const statusOrder = {
                ongoing: 1,
                completed: 2,
                upcoming: 3,
                cancelled: 4,
              };

              const aStatus = a.com_status?.program_status?.toLowerCase() || '';
              const bStatus = b.com_status?.program_status?.toLowerCase() || '';

              const aOrder = statusOrder[aStatus] || 99;
              const bOrder = statusOrder[bStatus] || 99;

              return aOrder - bOrder;
            })
            .map((eventItem, index) => (
              <div key={index} className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer
              ${new Date(eventItem.end_date) < new Date() ? '' : 'border border-primary dark:border-primary'}
                `} onClick={() => handleCardClick(eventItem)}>
                <div className="relative">
                  <img src={eventItem.image} alt="event" className="h-48 w-full object-cover" />
                  <Badge className={statusClass(eventItem)}>{eventItem.com_status?.program_status}</Badge>
                </div>
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 dark:bg-gray-900 bg-white opacity-90 w-full">
                  <div className="flex flex-col">
                    <h6 className={`font-bold text-sm ${new Date(eventItem.end_date) < new Date() ? 'text-gray-800 dark:text-white' : 'text-primary dark:text-darkPrimary'}`}> {eventItem.name}</h6>
                    <div className="flex items-center justify-start">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {formatDate(eventItem.start_date, 'DD/MM/YYYY')} - {formatDate(eventItem.end_date, 'DD/MM/YYYY')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-4"
                      dangerouslySetInnerHTML={{ __html: eventItem.description }}>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        {
          events && events?.length === 0 && (
            <p className="text-gray-500">No events found.</p>
          )
        }
      </div>
    </div>
  );
}
