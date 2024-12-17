interface Props {
    width: number
    height: number
    children: React.ReactNode
}

export default function BaseChart({ width, height, children }: Props) {
    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMinYMid meet"
        >
            {children}
        </svg>
    )
}
