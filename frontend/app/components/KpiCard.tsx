import { getKpiInfo } from '../data/kpi'
import Tooltip from './Tooltip'

import type { Kpi, Company } from '../types'

interface Props {
    kpi: Kpi
    tickerData: Company
    size?: 'big' | 'small'
    bgTheme?: 'dark' | 'light'
    valueFirst?: boolean
    showChartIcon?: boolean
    showKpiDescription?: boolean
    openChartContainer?: () => void
}

export default function KpiCard({
    kpi,
    tickerData,
    size = 'small',
    bgTheme = 'light',
    valueFirst = false,
    showChartIcon = true,
    showKpiDescription = true,
    openChartContainer = () => {},
}: Props) {
    const delimiterColour =
        bgTheme === 'light' ? 'bg-appTextWeak' : 'bg-appTextWeakDark'
    const delimiterPadding = size === 'small' ? 'py-0.5' : 'py-1'
    const textContainerClass =
        'flex flex-col justify-center ml-3 ' + delimiterPadding

    const { title, valueFormat, titleExplained, description, calculation } =
        getKpiInfo(kpi)

    const value = valueFormat(tickerData[kpi])

    const Title = () => (
        <Text
            size={size}
            bgTheme={bgTheme}
            value={title}
            type={'title'}
            titleExplained={titleExplained}
            description={showKpiDescription ? description : undefined}
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
            <div className="grow"></div>
            {showChartIcon && value !== '-' ? (
                <ChartIcon openChartContainer={openChartContainer} />
            ) : null}
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

function ChartIcon({ openChartContainer }: { openChartContainer: () => void }) {
    return (
        <button
            className="self-end justify-self-end mb-1.5 mr-2"
            onClick={openChartContainer}
        >
            <svg
                className="w-4 h-4 text-appTextNormal"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M21 21H6.2C5.07989 21 4.51984 21 4.09202 20.782C3.71569 20.5903 3.40973 20.2843 3.21799 19.908C3 19.4802 3 18.9201 3 17.8V3M7 15L12 9L16 13L21 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    )
}
