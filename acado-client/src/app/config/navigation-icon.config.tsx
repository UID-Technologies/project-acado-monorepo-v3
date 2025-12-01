import {
    PiHouseLineDuotone,
    PiArrowsInDuotone,
    PiBookOpenUserDuotone,
    PiBookBookmarkDuotone,
    PiAcornDuotone,
    PiBagSimpleDuotone,
} from 'react-icons/pi'

import { MdCastForEducation ,MdSettingsApplications, } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { JSX } from 'react';
import { TicketCheck } from 'lucide-react';
import { BsPeople } from 'react-icons/bs';


export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <PiHouseLineDuotone />,
    dashboard: <PiHouseLineDuotone />,
    Learning: <PiBookOpenUserDuotone />,
    singleMenu: <PiAcornDuotone />,
    collapseMenu: <PiArrowsInDuotone />,
    groupSingleMenu: <PiBookOpenUserDuotone />,
    groupCollapseMenu: <PiBookBookmarkDuotone />,
    groupMenu: <PiBagSimpleDuotone />,
    learningMenu: <MdCastForEducation />,
    applicationMenu: <MdSettingsApplications />,
    calenderMenu:<SlCalender />,
    events: <TicketCheck />,
    community: <BsPeople />
}

export default navigationIcon
