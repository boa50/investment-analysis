import { useState } from 'react'
import { Placeholder } from './ui'

interface Props {
    size?: 'normal' | 'small'
}

export default function StockImg({ size = 'normal' }: Props) {
    const [isLoaded, setIsLoaded] = useState(false)
    const width = size == 'normal' ? 'w-20' : 'w-12'

    return (
        <>
            {!isLoaded && (
                <Placeholder
                    type={size == 'normal' ? 'stockImg' : 'stockImgSmall'}
                />
            )}
            <img
                src="https://picsum.photos/seed/picsum/200"
                alt=""
                className={`rounded-full ${width} object-cover ${!isLoaded ? 'hidden' : 'block'}`}
                onLoad={() => setIsLoaded(true)}
            />
        </>
    )
}
