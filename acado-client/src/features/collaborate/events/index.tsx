import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Error from '@/components/shared/Error';
import { Event } from '@app/types/collaborate/events'
import { useEventCategory, useEvents } from '@app/hooks/data/collaborate/useEvents';
import Heading from '@/components/heading';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/shadcn/popover';
import { Button } from '@/components/ui/ShadcnButton';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/shadcn/command';
import { cn } from '@/lib/utils';
import LoadingSection from '@/components/LoadingSection';
import { formatDate } from '@/utils/commonDateFormat';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/shadcn/input';
import { stripHtmlTags } from '@/utils/stripHtmlTags';

export default function EventsPage() {

    const [selectedGroup, setSelectedGroup] = React.useState<number | undefined>(undefined);
    const [searchQuery, setSearchQuery] = React.useState<string>('');
    const [open, setOpen] = React.useState(false);
    const { data: groups = [] } = useEventCategory();

    const navigate = useNavigate();

    const urlParams = useMemo(() => {
        if (!selectedGroup) return undefined;
        return { event_category_id: selectedGroup?.toString() };
    }, [selectedGroup]);

    const { data: events = [], isLoading, isError, error } = useEvents(urlParams ? new URLSearchParams(urlParams) : undefined);

    // Filter events by search query (title and description)
    const filteredEvents = useMemo(() => {
        if (!searchQuery.trim()) return events;

        const query = searchQuery.toLowerCase();
        return events.filter((event) => {
            const title = event.name?.toLowerCase() || '';
            const description = event.description?.toLowerCase().replace(/<[^>]*>/g, '') || ''; // Strip HTML tags
            return title.includes(query) || description.includes(query);
        });
    }, [events, searchQuery]);

    const handleCardClick = (eventItem: Event) => {
        navigate(`/event-activity/${eventItem.id}`, { state: { event: eventItem } });
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedGroup(undefined);
    };

    if (isError) {
        return <Error error={error.message} />;
    }

    const statusClass = (eventItem: Event) => {
        switch (eventItem?.com_status?.program_status) {
            case 'Ongoing':
                return 'bg-green-500 text-white px-2 py-1 rounded-md text-xs absolute top-2 right-2';
            case 'Completed':
                return 'bg-red-500 text-white px-2 py-1 rounded-md text-xs absolute top-2 right-2';
            default:
                return 'bg-gray-500 text-white px-2 py-1 rounded-md text-xs absolute top-2 right-2';
        }
    }

    return (
        <div className="pb-6">
            {/* Header Section - Mobile Responsive */}
            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3'>
                <Heading title='Events' description='Participate in events to showcase your skills and win exciting prizes!' className='mb-4' />
            </div>
            {/* Search and Filter Section - Mobile Responsive */}
            <div className="mb-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search events by title or description..."
                            value={searchQuery}
                            className="pl-10 pr-10 w-full"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setSearchQuery('')}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Category Filter */}
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full sm:w-[200px] justify-between"
                            >
                                {selectedGroup ? groups.find((group) => group.id === selectedGroup)?.name : "Select Category..."}
                                <ChevronsUpDown className="opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="Search category..." className="h-9" />
                                <CommandList>
                                    <CommandEmpty>No category found.</CommandEmpty>
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

                    {/* Clear Filters Button */}
                    {(searchQuery || selectedGroup) && (
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>

                {/* Active Filters Display */}
                {(searchQuery || selectedGroup) && (
                    <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600 dark:text-gray-400">
                        <span>Active filters:</span>
                        {searchQuery && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Search: &quot;{searchQuery}&quot;
                                <button className="ml-1 hover:text-gray-800" onClick={() => setSearchQuery('')}>
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        )}
                        {selectedGroup && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                                Category: {groups.find((g) => g.id === selectedGroup)?.name}
                                <button className="ml-1 hover:text-gray-800" onClick={() => setSelectedGroup(undefined)}>
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        )}
                    </div>
                )}
            </div>

            {/* Results Count */}
            {!isLoading && filteredEvents && filteredEvents.length > 0 && (
                <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                    Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
                </div>
            )}

            {/* Loading State */}
            <LoadingSection isLoading={isLoading} title="Loading Events..." />

            {/* Events Grid - Mobile Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredEvents && filteredEvents?.length > 0 &&
                    filteredEvents
                        .slice() // create a copy before sorting (to avoid mutating state)
                        .sort((a, b) => {
                            const statusOrder: Record<string, number> = {
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
                            <div key={index} className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105
              ${new Date(eventItem.end_date) < new Date() ? '' : 'border border-primary dark:border-primary'}
                `} onClick={() => handleCardClick(eventItem)}>
                                <div className="relative">
                                    <img src={eventItem.image} alt="event" className="h-48 w-full object-cover" />
                                    <Badge className={statusClass(eventItem)}>{eventItem.com_status?.program_status}</Badge>
                                </div>
                                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 dark:bg-gray-900 bg-white opacity-90 w-full">
                                    <div className="flex flex-col">
                                        <h6 className={`font-bold text-sm line-clamp-2 ${new Date(eventItem.end_date) < new Date() ? 'text-gray-800 dark:text-white' : 'text-primary dark:text-darkPrimary'}`}>
                                            {eventItem.name}
                                        </h6>
                                        <div className="flex items-center justify-start mt-1">
                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                {formatDate(eventItem.start_date, 'DD/MM/YYYY')} - {formatDate(eventItem.end_date, 'DD/MM/YYYY')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                                            {
                                                stripHtmlTags(eventItem.description)
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                {
                    filteredEvents && filteredEvents?.length === 0 && !isLoading && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">No events found.</p>
                            {(searchQuery || selectedGroup) && (
                                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                                    Try adjusting your filters or search query.
                                </p>
                            )}
                        </div>
                    )
                }
            </div>
        </div>
    );
}
