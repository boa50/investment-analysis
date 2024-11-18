export default function Header() {
    return (
        <div className="bg-gray-50 w-full sticky top-0 left-0 right-0 z-10 shadow-md">
            <div className="relative container mx-auto flex justify-between py-2">

                <div className="flex items-center">
                    <a className="cursor-pointer" href="/">
                        <h3 className="text-2xl font-medium text-blue-500">
                            <img className="h-10 object-cover"
                                src="../public/favicon.ico" alt="App Logo" />
                        </h3>
                    </a>
                </div>


                <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 flex items-center">
                    <nav className="items-center hidden space-x-8 lg:flex">
                        <a className="flex text-gray-600 hover:text-blue-500
                    cursor-pointer transition-colors duration-300" href="/">
                            Home
                        </a>

                        <a className="flex text-gray-600 
                    cursor-pointer transition-colors duration-300
                    font-semibold text-blue-600" href="stocks_list">
                            Stocks List
                        </a>
                    </nav>
                </div>


                <div className="flex items-center space-x-5">

                    <div
                        className="flex items-center px-3.5 py-2 text-gray-400 group hover:ring-1 hover:ring-gray-300 focus-within:!ring-2 ring-inset focus-within:!ring-teal-500 rounded-md">
                        <svg className="mr-2 h-5 w-5 stroke-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z">
                            </path>
                        </svg>
                        <input
                            className="block w-full appearance-none bg-transparent text-base text-gray-700 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
                            placeholder="Find anything..."
                            aria-label="Search components"
                            id="headlessui-combobox-input-:r5n:"
                            role="combobox"
                            type="text"
                            aria-controls=""
                            aria-expanded="false"
                            aria-autocomplete="list"
                            value=""
                            style={{ caretColor: "rgb(107, 114, 128)" }}
                        />
                    </div>
                </div>
            </div>
        </div >
    )
}