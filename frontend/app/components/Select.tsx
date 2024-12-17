export default function Select() {
    return (
        <div className="flex flex-col w-fit h-36">
            <div className="relative">
                <Input />
                <div className="absolute shadow top-full z-40 w-full left-0 rounded max-h-20 overflow-y-auto">
                    <div className="flex flex-col w-full">
                        <Item />
                        <Item />
                        <Item />
                    </div>
                </div>
            </div>
        </div>
    )
}

function Input() {
    return (
        <div className="w-60">
            <div className="my-2 bg-white p-1 flex border border-gray-200 rounded">
                <div className="flex flex-auto flex-wrap"></div>
                <input
                    value=""
                    className="p-1 px-2 appearance-none outline-none w-full text-gray-800 placeholder:text-gray-400"
                    placeholder="Ações"
                />
                <div>
                    <button className="cursor-pointer w-6 h-full flex items-center text-gray-400 outline-none focus:outline-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-x w-4 h-4"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div className="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200">
                    <button className="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-chevron-up w-4 h-4"
                        >
                            <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

function Item() {
    return (
        <div className="cursor-pointer w-full border-gray-100 border-b hover:bg-teal-100">
            <div className="flex w-full items-center p-2 pl-2 border-transparent bg-white border-l-2 relative hover:bg-teal-600 hover:text-teal-100 border-teal-600">
                <div className="w-full items-center flex">
                    <div className="mx-2 leading-6">Item Name</div>
                </div>
            </div>
        </div>
    )
}
