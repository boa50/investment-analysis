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

export type Datapoint = { x: number | Date; y: number }

export type Dataset = Datapoint[]
