import type { InteractionData } from '../types'

interface Props {
    interactionData: InteractionData | null
    chartWidth: number
    tooltipWidth: number
    margin: number
    labelFontSize: string
    contentFontSize: string
}

export default function Display({
    interactionData,
    chartWidth,
    tooltipWidth,
    margin,
    labelFontSize,
    contentFontSize,
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
                    transition: 'all 0.1s ease',
                    left:
                        interactionData.xPos <= chartWidth / 2
                            ? interactionData.xPos + margin
                            : interactionData.xPos - tooltipWidth - margin,
                    top: interactionData.yPos,
                }}
            >
                {interactionData.label.length > 0 ? (
                    <div style={{ fontWeight: 700, fontSize: labelFontSize }}>
                        {interactionData.label}
                    </div>
                ) : null}
                {interactionData.content.length > 0 ? (
                    <div
                        style={{ fontSize: contentFontSize }}
                        dangerouslySetInnerHTML={{
                            __html: interactionData.content,
                        }}
                    />
                ) : null}
            </div>
        </foreignObject>
    )
}
