import Icon from './Icon'

interface Props {
    rating: number
    size?: 'normal' | 'small'
}

export default function RatingStars({ rating, size = 'normal' }: Props) {
    const ratingZeroToFive = rating / 20
    const totalStars = 5
    const starSize = size === 'normal' ? 5 : 3

    const ratingRounded = Math.round(ratingZeroToFive * 2) / 2
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
    size: 3 | 5
    filled: 'full' | 'half' | 'none'
}

function Star({ size, filled }: StarProps) {
    return (
        <Icon
            type="star"
            size={size}
            filled={filled}
            colour="text-yellow-500"
        />
    )
}
