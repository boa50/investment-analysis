export default function CenteredInfo({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex grow items-center justify-center">{children}</div>
    )
}
