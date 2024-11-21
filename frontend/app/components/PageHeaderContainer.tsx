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
            <div className="bg-gray-800 w-full border border-gray-800 shadow-md p-4 h-28 flex items-center">
                <div className={'container ' + extraClasses}>{children}</div>
            </div>
        </header>
    )
}
