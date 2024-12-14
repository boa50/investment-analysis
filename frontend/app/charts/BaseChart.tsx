interface Props {
    width: number
    height: number
    children: React.ReactNode
}

export default function BaseChart({ width, height, children }: Props) {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <svg
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="xMinYMid meet"
            >
                {children}
            </svg>
        </div>
    )
}
