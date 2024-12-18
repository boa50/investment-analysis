import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
    return [
        { title: 'Investment Analysis' },
        { name: 'description', content: 'Index page' },
    ]
}

export default function Index() {
    return (
        <div className="flex grow items-center justify-center">
            <div className="flex flex-col items-center gap-16">
                <nav className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
                    <p className="leading-6 text-gray-700 dark:text-gray-200">
                        Menu
                    </p>
                </nav>
                <header className="flex flex-col items-center gap-9">
                    <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Investment Analysis
                    </h1>
                </header>
            </div>
        </div>
    )
}
