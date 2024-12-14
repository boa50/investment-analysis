import * as d3 from 'd3'
import { useState } from 'react'
import { getHoveredDataPoint } from './utils'

import type { LineDataset, InteractionData, Margin } from './types'
import type { ScaleLinear, ScaleTime } from 'd3'

interface Props {
    chartWidth: number
    chartHeight: number
    margin: Margin
    data: LineDataset
    xScale: ScaleLinear<number, number> | ScaleTime<number, number>
    yScale: ScaleLinear<number, number>
    yFormatter?: (value: number) => string
    lineColour?: string
    circleColour?: string
    tooltipWidth?: number
    displayMargin?: number
    labelFontSize?: string
    contentFontSize?: string
    isQuarterDateFormat?: boolean
}

export default function Tooltip({
    chartWidth,
    chartHeight,
    margin,
    data,
    xScale,
    yScale,
    yFormatter,
    lineColour = 'currentColor',
    circleColour = 'currentColor',
    tooltipWidth = 100,
    displayMargin = 8,
    labelFontSize = '0.9rem',
    contentFontSize = '0.8rem',
    isQuarterDateFormat = false,
}: Props) {
    const [interactionData, setInteractiondata] =
        useState<InteractionData | null>(null)

    return (
        <>
            <TooltipHighlight
                width={chartWidth}
                height={chartHeight}
                margin={margin}
                data={data}
                xScale={xScale}
                yScale={yScale}
                setInteractiondata={setInteractiondata}
                yFormatter={yFormatter}
                lineColour={lineColour}
                circleColour={circleColour}
                isQuarterDateFormat={isQuarterDateFormat}
            />
            <TooltipDisplay
                interactionData={interactionData}
                chartWidth={chartWidth}
                tooltipWidth={tooltipWidth}
                margin={displayMargin}
                labelFontSize={labelFontSize}
                contentFontSize={contentFontSize}
            />
        </>
    )
}

interface TooltipDisplayProps {
    interactionData: InteractionData | null
    chartWidth: number
    tooltipWidth: number
    margin: number
    labelFontSize: string
    contentFontSize: string
}

function TooltipDisplay({
    interactionData,
    chartWidth,
    tooltipWidth,
    margin,
    labelFontSize,
    contentFontSize,
}: TooltipDisplayProps) {
    if (!interactionData) return null

    return (
        <foreignObject
            style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: '4px',
                    color: 'white',
                    padding: '6px',
                    transform: 'translateY(-50%)',
                    width: tooltipWidth,
                    transition: 'all 0.1s ease',
                    left:
                        interactionData.xPos <= chartWidth / 2
                            ? interactionData.xPos + margin
                            : interactionData.xPos - tooltipWidth - margin,
                    top: interactionData.yPos,
                }}
            >
                <div style={{ fontWeight: 700, fontSize: labelFontSize }}>
                    {interactionData.label}
                </div>
                <div
                    style={{ fontSize: contentFontSize }}
                    dangerouslySetInnerHTML={{
                        __html: interactionData.content,
                    }}
                />
            </div>
        </foreignObject>
    )
}

interface TooltipHighlightProps {
    width: number
    height: number
    margin: Margin
    data: LineDataset
    xScale: ScaleLinear<number, number> | ScaleTime<number, number>
    yScale: ScaleLinear<number, number>
    setInteractiondata: React.Dispatch<
        React.SetStateAction<InteractionData | null>
    >
    yFormatter: ((value: number) => string) | undefined
    lineColour: string
    circleColour: string
    isQuarterDateFormat: boolean
}

function TooltipHighlight({
    width,
    height,
    margin,
    data,
    xScale,
    yScale,
    setInteractiondata,
    yFormatter,
    lineColour,
    circleColour,
    isQuarterDateFormat,
}: TooltipHighlightProps) {
    const [highlightedPoint, setHighlightedPoint] = useState<number | null>(
        null
    )

    return (
        <>
            <rect
                x={margin.left}
                y={0}
                height={height - margin.bottom}
                width={width - margin.left - margin.right}
                fill="transparent"
                onMouseMove={(event) => {
                    const [dataPoint, idx] = getHoveredDataPoint(
                        event,
                        data,
                        xScale
                    )

                    if (idx !== highlightedPoint) {
                        setHighlightedPoint(idx)

                        setInteractiondata({
                            xPos: xScale(dataPoint.x),
                            yPos: yScale(dataPoint.y),
                            label:
                                yFormatter !== undefined
                                    ? yFormatter(dataPoint.y)
                                    : '',
                            content:
                                dataPoint.x instanceof Date
                                    ? d3.timeFormat(
                                          isQuarterDateFormat
                                              ? 'Trim %q %Y'
                                              : '%d/%m/%Y'
                                      )(dataPoint.x)
                                    : dataPoint.x.toLocaleString(),
                        })
                    }
                }}
                onMouseLeave={(event) => {
                    const isOutOfBounds =
                        d3.pointer(event)[0] + 1 > width - margin.right ||
                        d3.pointer(event)[0] - 1 < margin.left ||
                        d3.pointer(event)[1] > height - margin.bottom ||
                        d3.pointer(event)[1] < margin.top

                    if (isOutOfBounds && highlightedPoint !== null) {
                        setHighlightedPoint(null)
                        setInteractiondata(null)
                    }
                }}
            />
            {data.map((d, i) => {
                return (
                    <g
                        key={`tooltip-${i}`}
                        style={{
                            display: highlightedPoint === i ? 'block' : 'none',
                        }}
                    >
                        <line
                            x1={xScale(d.x)}
                            x2={xScale(d.x)}
                            y1={0}
                            y2={height - margin.bottom}
                            stroke={lineColour}
                            strokeWidth={1}
                            strokeDasharray={'7, 5'}
                        />
                        <circle
                            cx={xScale(d.x)}
                            cy={yScale(d.y)}
                            r={3}
                            stroke={circleColour}
                            strokeWidth={1}
                            fill="white"
                        />
                    </g>
                )
            })}
        </>
    )
}
