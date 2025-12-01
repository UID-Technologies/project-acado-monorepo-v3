import LayoutBase from '@/components//template/LayoutBase'
import { LAYOUT_COLLAPSIBLE_SIDE } from '@app/config/constants/theme.constant'
import type { CommonProps } from '@app/types/common'



const Blank = ({ children }: CommonProps) => {

  return (
    <LayoutBase
      type={LAYOUT_COLLAPSIBLE_SIDE}
      className="app-layout-collapsible-side flex flex-auto flex-col"
    >
      <div className="flex flex-auto min-w-0">
        <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
          <div className="h-full flex flex-auto flex-col">
            {children}
          </div>
        </div>
      </div>
    </LayoutBase>
  )
}

export default Blank