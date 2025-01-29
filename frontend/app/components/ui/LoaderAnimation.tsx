export const LoaderAnimation = () => {
    return (
        <div className="flex justify-center p-4 *:bg-appBackgroundDark *:w-4 *:h-4 *:my-1 *:mx-2 *:rounded-full *:opacity-100">
            <div className="animate-[bouncingLoader_1s_infinite_100ms]"></div>
            <div className="animate-[bouncingLoader_1s_infinite_200ms]"></div>
            <div className="animate-[bouncingLoader_1s_infinite_300ms]"></div>
        </div>
    )
}
