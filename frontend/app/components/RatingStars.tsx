interface Props {
    rating: number
    size?: 'normal' | 'small'
}

export default function RatingStars({ rating, size = 'normal' }: Props) {
    const totalStars = 5
    const starSize = size === 'normal' ? 5 : 3

    const ratingRounded = Math.round(rating * 2) / 2
    const hasHalf = ratingRounded % 1 != 0
    const ratingFull = Math.floor(ratingRounded)

    return (
        <div className="flex">
            {[...Array(totalStars).keys()].map((d, i) =>
                d < ratingFull ? (
                    <Star key={i} size={starSize} filled="full" />
                ) : d === ratingFull && hasHalf ? (
                    <Star key={i} size={starSize} filled="half" />
                ) : (
                    <Star key={i} size={starSize} filled="none" />
                )
            )}
        </div>
    )
}

interface StarProps {
    size: number
    filled: 'full' | 'half' | 'none'
}

function Star({ size, filled }: StarProps) {
    const GradientFilling = () => (
        <defs>
            <linearGradient id="gradStar">
                <stop offset="0%" stopColor="currentColor" />
                <stop offset="49%" stopColor="currentColor" />
                <stop offset="51%" stopColor="transparent" />
                <stop offset="100%" stopColor="transparent" />
            </linearGradient>
        </defs>
    )

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={`h-${size} w-${size} text-yellow-500`}
        >
            {filled === 'half' ? <GradientFilling /> : null}
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                fill={
                    filled === 'full'
                        ? 'currentColor'
                        : filled === 'half'
                          ? 'url(#gradStar)'
                          : 'none'
                }
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            ></path>
        </svg>
    )
}
