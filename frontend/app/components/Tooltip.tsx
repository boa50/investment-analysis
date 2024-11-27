import { useState } from 'react'

interface Props {
    title?: string
    content: string
    footer?: string
    isSuperscript?: boolean
    children: React.ReactNode
}

export default function Tooltip({
    title,
    content,
    footer,
    isSuperscript = false,
    children,
}: Props) {
    const [show, setShow] = useState(false)
    const hasTitle = title !== undefined
    const hasFooter = footer !== undefined

    return (
        <div className={`relative ${isSuperscript ? '-top-0.5' : ''}`}>
            <div
                className="flex items-center"
                onMouseOver={() => setShow(true)}
                onFocus={() => setShow(true)}
                onMouseOut={() => setShow(false)}
                onBlur={() => setShow(false)}
            >
                {children}
                <div
                    className={`z-20 w-64 absolute transition duration-150 ease-in-out left-0 ml-8 shadow-lg bg-appBackgroundDark p-4 rounded ${show ? 'block' : 'hidden'}`}
                >
                    <TootlipPointer />
                    {hasTitle ? (
                        <p className="text-sm font-bold text-appTextStrongDark pb-1">
                            {title}
                        </p>
                    ) : null}
                    <p
                        className={`text-xs leading-4 text-appTextNormalDark ${hasFooter ? 'pb-2' : ''}`}
                    >
                        {content}
                    </p>
                    {hasFooter ? (
                        <p className="text-xs leading-4 text-appTextWeakDark">
                            {footer}
                        </p>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

function TootlipPointer() {
    return (
        <svg
            className="absolute left-0 -ml-2 bottom-0 top-0 h-full w-2 h-[7.25rem]"
            viewBox="0 0 9 16"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g
                    transform="translate(-874.000000, -1029.000000)"
                    fill="#2D3748"
                >
                    <g transform="translate(850.000000, 975.000000)">
                        <g transform="translate(24.000000, 0.000000)">
                            <polygon
                                transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) "
                                points="4.5 57.5 12.5 66.5 -3.5 66.5"
                            ></polygon>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    )
}
