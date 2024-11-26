interface Props {
    children: React.ReactNode
    extraClasses?: string
}

export default function PageHeaderContainer({
    children,
    extraClasses = '',
}: Props) {
    return (
        <header className="mb-4">
            <div className="bg-appBackgroundDark w-full border border-appBackgroundDark shadow-md p-4 h-28 flex items-center">
                <div className={'container ' + extraClasses}>{children}</div>
            </div>
        </header>
    )
}
