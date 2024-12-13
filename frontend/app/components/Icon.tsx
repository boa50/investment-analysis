interface Props {
    size?: 3 | 5 | 6
    type: 'star' | 'arrowDown' | 'cross'
    filled?: 'full' | 'half' | 'none'
    colour?: string
}

const iconsData = {
    star: {
        viewBox: '0 0 24 24',
        path: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
        strokeWidth: '1',
    },
    arrowDown: {
        viewBox: '0 0 20 20',
        path: 'M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z',
        strokeWidth: '0',
    },
    cross: {
        viewBox: '0 0 24 24',
        path: 'M6.99486 7.00636C6.60433 7.39689 6.60433 8.03005 6.99486 8.42058L10.58 12.0057L6.99486 15.5909C6.60433 15.9814 6.60433 16.6146 6.99486 17.0051C7.38538 17.3956 8.01855 17.3956 8.40907 17.0051L11.9942 13.4199L15.5794 17.0051C15.9699 17.3956 16.6031 17.3956 16.9936 17.0051C17.3841 16.6146 17.3841 15.9814 16.9936 15.5909L13.4084 12.0057L16.9936 8.42059C17.3841 8.03007 17.3841 7.3969 16.9936 7.00638C16.603 6.61585 15.9699 6.61585 15.5794 7.00638L11.9942 10.5915L8.40907 7.00636C8.01855 6.61584 7.38538 6.61584 6.99486 7.00636Z',
        strokeWidth: '0',
    },
}

export default function Icon({
    size = 5,
    type,
    filled = 'full',
    colour = 'fill-current',
}: Props) {
    const gradientId = 'iconGradFill' + Math.random()

    const GradientFilling = () => (
        <defs>
            <linearGradient id={gradientId}>
                <stop offset="0%" stopColor="currentColor" />
                <stop offset="49%" stopColor="currentColor" />
                <stop offset="51%" stopColor="transparent" />
                <stop offset="100%" stopColor="transparent" />
            </linearGradient>
        </defs>
    )

    const { width, height } = getDimensions(size)

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={iconsData[type].viewBox}
            stroke="currentColor"
            className={`${width} ${height} ${colour}`}
        >
            {filled === 'half' ? <GradientFilling /> : null}
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={iconsData[type].strokeWidth}
                fill={
                    filled === 'full'
                        ? 'currentColor'
                        : filled === 'half'
                          ? `url(#${gradientId})`
                          : 'none'
                }
                d={iconsData[type].path}
            ></path>
        </svg>
    )
}

function getDimensions(size: number) {
    let width, height

    switch (size) {
        case 3:
            width = 'w-3'
            height = 'h-3'
            break
        case 5:
            width = 'w-5'
            height = 'h-5'
            break
        case 6:
            width = 'w-6'
            height = 'h-6'
            break

        default:
            width = 'w-5'
            height = 'h-5'
            break
    }

    return { width, height }
}
