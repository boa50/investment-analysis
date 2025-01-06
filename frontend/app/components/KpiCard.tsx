import { getKpiInfo } from '../data/kpi'
import Tooltip from './Tooltip'
import { Icon } from './ui'

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
                    <div
                        className={`pl-1 cursor-pointer ${textColour}`}
                    >
                        <Icon type='info' size={4} filled='none' />
                    </div>
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
            <Icon type='chart' filled='none' size={4} />
        </button>
    )
}
