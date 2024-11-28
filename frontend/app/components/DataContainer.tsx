import { useState, useEffect } from 'react'

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
        <div className="container">
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
                            <svg
                                className="w-5 h-5 fill-current"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
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
        </div>
    )
}
