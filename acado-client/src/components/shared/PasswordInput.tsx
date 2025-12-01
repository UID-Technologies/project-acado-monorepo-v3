// import { useState, forwardRef } from 'react'
// import { Input, InputProps } from '@/components/ui/Input'
// import { HiOutlineEyeOff, HiOutlineEye } from 'react-icons/hi'
// import type { MouseEvent } from 'react'

// interface PasswordInputProps extends InputProps {
//     onVisibleChange?: (visible: boolean) => void
// }

// const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
//     (props, ref) => {
//         const { onVisibleChange, ...rest } = props

//         const [pwInputType, setPwInputType] = useState('password')

//         const onPasswordVisibleClick = (e: MouseEvent<HTMLSpanElement>) => {
//             e.preventDefault()
//             const nextValue = pwInputType === 'password' ? 'text' : 'password'
//             setPwInputType(nextValue)
//             onVisibleChange?.(nextValue === 'text')
//         }

//         return (
//             <Input
//                 {...rest}
//                 ref={ref}
//                 type={pwInputType}
//                 suffix={
//                     <span
//                         className="cursor-pointer select-none text-xl"
//                         role="button"
//                         onClick={onPasswordVisibleClick}
//                     >
//                         {pwInputType === 'password' ? (
//                             <HiOutlineEyeOff />
//                         ) : (
//                             <HiOutlineEye />
//                         )}
//                     </span>
//                 }
//             />
//         )
//     },
// )

// PasswordInput.displayName = 'PasswordInput'

// export default PasswordInput
import { useState, forwardRef, useRef, useEffect } from 'react'
import { Input, InputProps } from '@/components/ui/Input'
import { HiOutlineEyeOff, HiOutlineEye } from 'react-icons/hi'
import type { MouseEvent } from 'react'

interface PasswordInputProps extends InputProps {
    onVisibleChange?: (visible: boolean) => void
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    (props, ref) => {
        const { onVisibleChange, ...rest } = props

        const [pwInputType, setPwInputType] = useState('password')
        const inputRef = useRef<HTMLInputElement>(null)

        // Disable copy and paste functionality
        useEffect(() => {
            const handleCopy = (e: ClipboardEvent) => {
                e.preventDefault()
            }
            const handlePaste = (e: ClipboardEvent) => {
                e.preventDefault()
            }

            const currentInput = inputRef.current
            if (currentInput) {
                currentInput.addEventListener('copy', handleCopy)
                currentInput.addEventListener('paste', handlePaste)
            }

            return () => {
                if (currentInput) {
                    currentInput.removeEventListener('copy', handleCopy)
                    currentInput.removeEventListener('paste', handlePaste)
                }
            }
        }, [])

        const onPasswordVisibleClick = (e: MouseEvent<HTMLSpanElement>) => {
            e.preventDefault()
            const nextValue = pwInputType === 'password' ? 'text' : 'password'
            setPwInputType(nextValue)
            onVisibleChange?.(nextValue === 'text')
        }

        return (
            <Input
                {...rest}
                ref={(el) => {
                    inputRef.current = el as HTMLInputElement // Type casting here
                    if (typeof ref === 'function') ref(el as HTMLInputElement)
                    else if (ref) ref.current = el as HTMLInputElement
                }}
                type={pwInputType}
                suffix={
                    <span
                        className="cursor-pointer select-none text-xl"
                        role="button"
                        onClick={onPasswordVisibleClick}
                    >
                        {pwInputType === 'password' ? (
                            <HiOutlineEyeOff />
                        ) : (
                            <HiOutlineEye />
                        )}
                    </span>
                }
            />
        )
    },
)

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput

