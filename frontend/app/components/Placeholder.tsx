interface Props {
    type: 'stars' | 'starsSmall' | 'stockSearch' | 'stockImg' | 'stockImgSmall'
}

export default function Placeholder({ type }: Props) {
    switch (type) {
        case 'stars':
            return (
                <div className="animate-pulse h-5 w-28 bg-slate-600 rounded col-span-2"></div>
            )
        case 'starsSmall':
            return (
                <div className="animate-pulse h-2 w-16 bg-slate-700 rounded col-span-2"></div>
            )
        case 'stockSearch':
            return <StockSearchPlaceholder />

        case 'stockImg':
            return (
                <div className="animate-pulse bg-slate-600 rounded-full w-20 object-cover aspect-square" />
            )

        case 'stockImgSmall':
            return (
                <div className="animate-pulse bg-slate-600 rounded-full w-12 object-cover aspect-square" />
            )

        default:
            return <></>
    }
}

function StockSearchPlaceholder() {
    return (
        <div className="flex justify-center py-6 w-[23rem]">
            <div className="animate-pulse flex space-x-4 mb-2">
                <div className="flex items-center">
                    <div className="rounded-full bg-slate-700 h-12 w-12"></div>
                </div>
                <div className="flex flex-col w-64 space-y-2">
                    <div className="grid grid-cols-8 gap-2 items-center">
                        <div className="h-3 bg-slate-700 rounded col-span-2"></div>
                        <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                    </div>
                    <div className="h-3 bg-slate-700 rounded"></div>
                    <div className="grid grid-cols-2 gap-2 items-center">
                        <div className="h-3 bg-slate-700 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
