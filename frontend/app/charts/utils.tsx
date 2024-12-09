export const getTextWidth = (
    txt: string,
    fontSize = '1rem',
    fontWeight = '700'
) => {
    const text = document.createElement('span')
    document.body.appendChild(text)

    text.style.font = 'ui-sans-serif'
    text.style.fontSize = fontSize
    text.style.fontWeight = fontWeight
    text.style.height = 'auto'
    text.style.width = 'auto'
    text.style.position = 'absolute'
    text.style.whiteSpace = 'no-wrap'
    text.innerHTML = txt

    const width = Math.ceil(text.clientWidth)
    document.body.removeChild(text)

    return width
}

interface getLeftMarginProps {
    value: number
    defaultMargin?: number
    formatter?: (value: number) => string
    fontSize?: string
    fontWeight?: string
    tickTextSpacing?: number
}

export const getLeftMargin = ({
    value,
    defaultMargin,
    formatter,
    fontSize = '0.8rem',
    fontWeight = '500',
    tickTextSpacing = 0,
}: getLeftMarginProps) => {
    const maxText = formatter ? formatter(value) : value.toString()
    const textMargin =
        getTextWidth(maxText, fontSize, fontWeight) + tickTextSpacing

    if (defaultMargin === undefined) {
        return textMargin + 2
    } else {
        return textMargin > defaultMargin ? textMargin + 2 : defaultMargin
    }
}
