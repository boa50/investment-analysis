interface Props {
    title: string
    value: string
    size?: 'big' | 'small'
    bgTheme?: 'dark' | 'light'
    valueFirst?: boolean
}

export default function KpiCard({
    title,
    value,
    size = 'small',
    bgTheme = 'light',
    valueFirst = false,
}: Props) {
    const delimiterColour =
        bgTheme === 'light' ? 'bg-appTextWeak' : 'bg-appTextWeakDark'
    const delimiterPadding = size === 'small' ? 'py-0.5' : 'py-1'
    const textContainerClass =
        'flex flex-col justify-center ml-3 ' + delimiterPadding

    const Title = () => (
        <Text size={size} bgTheme={bgTheme} value={title} type={'title'} />
    )
    const Value = () => (
        <Text size={size} bgTheme={bgTheme} value={value} type={'value'} />
    )

    return (
        <div className="flex flex-row h-fit">
            <div className={'w-0.5 rounded-lg ' + delimiterColour}></div>
            {valueFirst ? (
                <div className={textContainerClass}>
                    <Value />
                    <Title />
                </div>
            ) : (
                <div className={textContainerClass}>
                    <Title />
                    <Value />
                </div>
            )}
        </div>
    )
}

interface TextProps {
    size: 'big' | 'small'
    bgTheme: 'dark' | 'light'
    value: string
    type: 'title' | 'value'
}

function Text({ size, bgTheme, value, type }: TextProps) {
    let textSize, textColour, fontWeight

    if (type === 'title') {
        textColour =
            bgTheme === 'light' ? 'text-appTextWeak' : 'text-appTextWeakDark'
        textSize = size === 'small' ? 'text-sm' : 'text-base'
        fontWeight = 'font-normal'
    } else {
        textColour =
            bgTheme === 'light'
                ? 'text-appTextNormal'
                : 'text-appTextNormalDark'
        textSize = size === 'small' ? 'text-base' : 'text-xl'
        fontWeight = 'font-semibold'
    }

    return (
        <span className={`${textColour} ${textSize} ${fontWeight}`}>
            {value}
        </span>
    )
}
