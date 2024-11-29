import Tooltip from './Tooltip'

interface Props {
    title: string
    value: string
    size?: 'big' | 'small'
    bgTheme?: 'dark' | 'light'
    valueFirst?: boolean
    titleExplained?: string
    description?: string
    calculation?: string
}

export default function KpiCard({
    title,
    value,
    size = 'small',
    bgTheme = 'light',
    valueFirst = false,
    titleExplained,
    description,
    calculation,
}: Props) {
    const delimiterColour =
        bgTheme === 'light' ? 'bg-appTextWeak' : 'bg-appTextWeakDark'
    const delimiterPadding = size === 'small' ? 'py-0.5' : 'py-1'
    const textContainerClass =
        'flex flex-col justify-center ml-3 ' + delimiterPadding

    const Title = () => (
        <Text
            size={size}
            bgTheme={bgTheme}
            value={title}
            type={'title'}
            titleExplained={titleExplained}
            description={description}
            calculation={calculation}
        />
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
    titleExplained?: string
    description?: string
    calculation?: string
}

function Text({
    size,
    bgTheme,
    value,
    type,
    titleExplained,
    description,
    calculation,
}: TextProps) {
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
        <div className="flex flex-row">
            <span className={`${textColour} ${textSize} ${fontWeight}`}>
                {value}
            </span>
            {description !== undefined ? (
                <Tooltip
                    title={titleExplained}
                    content={description}
                    footer={
                        calculation !== undefined
                            ? `Cálculo: ${calculation}`
                            : undefined
                    }
                >
                    <span
                        className={`pl-1 cursor-pointer text-xs ${textColour}`}
                    >
                        &#x1F6C8;
                    </span>
                </Tooltip>
            ) : null}
        </div>
    )
}
