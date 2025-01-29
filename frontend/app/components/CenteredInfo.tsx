export default function CenteredInfo({
    isIncludeFullHeight = false,
    children,
}: {
    isIncludeFullHeight?: boolean
    children: React.ReactNode
}) {
    let componentClass = 'flex grow items-center justify-center'

    if (isIncludeFullHeight) {
        componentClass += ' h-full'
    }

    return <div className={componentClass}>{children}</div>
}
