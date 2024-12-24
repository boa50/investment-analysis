interface Props {
    message?: string
    hideCondition?: boolean
    blurStrength?: 'weak' | 'normal' | 'strong'
    children: React.ReactNode
}

export const BlurredElement = ({
    message,
    hideCondition,
    blurStrength = 'normal',
    children,
}: Props) => {
    return !hideCondition ? (
        <div className="flex items-center justify-center text-center w-full h-full overflow-hidden">
            <span className="text-sm text-appTextNormal absolute z-50">
                {message}
            </span>
            <div
                className={`bg-white w-full h-full ${getBlurClass(blurStrength)}`}
            >
                {children}
            </div>
        </div>
    ) : (
        children
    )
}

const getBlurClass = (blurStrength: 'weak' | 'normal' | 'strong') => {
    switch (blurStrength) {
        case 'weak':
            return 'blur-sm'
        case 'normal':
            return 'blur-md'
        case 'strong':
            return 'blur-3xl'
        default:
            return 'blur-md'
    }
}
