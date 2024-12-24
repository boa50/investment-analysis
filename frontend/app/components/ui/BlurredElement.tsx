interface Props {
    message?: string
    hideCondition?: boolean
    children: React.ReactNode
}

export const BlurredElement = ({ message, hideCondition, children }: Props) => {
    return !hideCondition ? (
        <div className="flex items-center justify-center text-center w-full h-full overflow-hidden">
            <span className="text-sm text-appTextNormal absolute z-50">
                {message}
            </span>
            <div className="bg-white w-full h-full blur-md">{children}</div>
        </div>
    ) : (
        children
    )
}
