import type { SetStateAction, Dispatch } from 'react'

interface Props {
    isChecked?: boolean
    setIsChecked?: Dispatch<SetStateAction<boolean>>
    label?: string
}

export function ToggleButton({
    isChecked = false,
    setIsChecked = () => null,
    label,
}: Props) {
    return (
        <div className="flex flex-row space-x-2 items-center">
            <div className="relative inline-flex cursor-pointer items-center">
                <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={isChecked}
                    readOnly={true}
                />
                <div
                    role="checkbox"
                    tabIndex={0}
                    aria-checked={isChecked}
                    onClick={() => setIsChecked((isChecked) => !isChecked)}
                    onKeyDown={() => null}
                    className="peer h-5 w-9 rounded-full border bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-appAccent peer-checked:after:translate-x-full peer-checked:after:border-white"
                ></div>
            </div>
            {label ? (
                <div className="text-sm text-appTextNormal">{label}</div>
            ) : null}
        </div>
    )
}
