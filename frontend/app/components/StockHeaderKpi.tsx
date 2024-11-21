interface Props {
    title: string
    value: string
}

export default function StockHeaderKpi({ title, value }: Props) {
    return (
        <div className="flex flex-row h-fit">
            <div className="bg-gray-100 w-0.5 rounded-lg"></div>
            <div className="flex flex-col justify-center py-1 ml-3">
                <span className="text-xl font-semibold text-gray-100">
                    {value}
                </span>
                <span className="text-md font-normal text-gray-300">
                    {title}
                </span>
            </div>
        </div>
    )
}
