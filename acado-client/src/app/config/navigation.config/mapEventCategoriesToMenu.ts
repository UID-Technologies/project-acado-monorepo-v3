import {
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@app/config/constants/navigation.constant'
import type { NavigationTree } from '@app/types/navigation'
import { EventCategoryGroup } from '@app/types/collaborate/events'

const makeKeyFormName = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
}

export const mapEventCategoriesToMenu = (
    groups: EventCategoryGroup[]
): NavigationTree => {
    return {
        key: 'dynamicEvents',
        path: `/event-groups`,
        title: 'Events',
        translateKey: 'nav.dynamicEvents',
        icon: 'events',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: groups.map((group) => ({
            key: `event-category-${group.id}`,
            path: `/event-groups/${makeKeyFormName(group.name)}?id=${group.id}&name=${encodeURIComponent(group.name)}&description=${encodeURIComponent(group.event_cat_description)}`,
            title: group.name,
            translateKey: `nav.events`,
            icon: 'eventCategory',
            type: NAV_ITEM_TYPE_ITEM,
            authority: [],
            subMenu: [],
        })),
    }
}