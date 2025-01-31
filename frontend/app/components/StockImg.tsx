import { useState } from 'react'
import { Placeholder } from './ui'

interface Props {
    ticker: string
    size?: 'normal' | 'small'
}

export default function StockImg({ ticker, size = 'normal' }: Props) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [imgUrl, setImgUrl] = useState(
        `${window.ENV.IMAGE_SERVER_URL}${ticker.substring(0, 4)}.webp`
    )
    const width = size == 'normal' ? 'w-20' : 'w-12'

    return (
        <>
            {!isLoaded && (
                <Placeholder
                    type={size == 'normal' ? 'stockImg' : 'stockImgSmall'}
                />
            )}
            <img
                src={imgUrl}
                alt=""
                className={`rounded-full ${width} object-cover ${!isLoaded ? 'hidden' : 'block'}`}
                onError={() => setImgUrl('/default-stock-logo.webp')}
                onLoad={() => setIsLoaded(true)}
            />
        </>
    )
}
