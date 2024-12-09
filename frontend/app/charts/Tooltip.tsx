import type { InteractionData } from './types'

interface Props {
    interactionData: InteractionData | null
    chartWidth: number
    tooltipWidth?: number
    margin?: number
    labelFontSize?: string
    contentFontSize?: string
}

export default function Tooltip({
    interactionData,
    chartWidth,
    tooltipWidth = 100,
    margin = 8,
    labelFontSize = '0.9rem',
    contentFontSize = '0.8rem',
}: Props) {
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
