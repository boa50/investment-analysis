import { useState, useEffect } from 'react'
import Icon from './Icon'

interface Props {
    title: string
    childrenHeight?: string
    children: React.ReactNode
}

export default function DataContainer({
    title,
    childrenHeight = '30',
    children,
}: Props) {
    const [isOpened, setIsOpened] = useState(true)
    const [overflow, setOverflow] = useState('overflow-hidden')

    useEffect(() => {
        let changeOverflow = setTimeout(() => {}, 700)
        isOpened
            ? (changeOverflow = setTimeout(() => {
                  setOverflow('overflow-hidden hover:overflow-visible')
              }, 700))
            : setOverflow('overflow-hidden')

        return () => clearTimeout(changeOverflow)
    }, [isOpened])

    const handleToggle = () => {
        setIsOpened(!isOpened)
    }

    return (
        <>
            <div className="flex flex-col h-full p-6 rounded-2xl bg-white shadow shadow-grey-950/5">
                <div
                    role="button"
                    tabIndex={0}
                    className="w-full text-left cursor-pointer"
                    onClick={handleToggle}
                    onKeyDown={handleToggle}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-appTextStrong font-semibold text-xl">
                            {title}
                        </span>
                        <span
                            className={`transition-transform duration-500 transform fill-current ${isOpened ? '-rotate-180' : 'rotate-0'}`}
                        >
                            <Icon type="arrowDown" />
                        </span>
                    </div>
                </div>

                <div
                    className={`relative ${overflow} transition-all ease-in-out duration-700`}
                    style={{
                        maxHeight: isOpened ? `${childrenHeight}rem` : '0',
                    }}
                >
                    <div className="mt-4"></div>
                    {children}
                </div>
            </div>
        </>
    )
}
