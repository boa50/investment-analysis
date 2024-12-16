export type Margin = {
    left: number
    right: number
    top: number
    bottom: number
}

export type InteractionData = {
    xPos: number
    yPos: number
    label: string
    content: string
}

export type LineDatapoint = { x: number | Date; y: number }

export type LineDataset = LineDatapoint[]

export type RadarGridAxisConfig = {
    name: string
    max: number
}

export type RadarGridType = 'circle' | 'straight'

export type RadarDatapoint = {
    [variable: string]: number
}

export type RadarDataCoordinates = [number, number][]

export type RadarVariableMinMaxValues = {
    [variable: string]: [number, number]
}
