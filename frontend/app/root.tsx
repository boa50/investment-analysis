import React from 'react'
import { json } from '@remix-run/node'
import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    isRouteErrorResponse,
    useRouteError,
    useLoaderData,
    Link,
} from '@remix-run/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { LinksFunction } from '@remix-run/node'
import Header from './components/Header'
import Footer from './components/Footer'

import './tailwind.css'

export const links: LinksFunction = () => [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
    },
    {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
    },
]

export async function loader() {
    return json({
        ENV: {
            DATABASE_URL: process.env.DATABASE_URL,
            IMAGE_SERVER_URL: process.env.IMAGE_SERVER_URL,
        },
    })
}

declare global {
    interface Window {
        ENV: { DATABASE_URL: string; IMAGE_SERVER_URL: string }
    }
}

export function Layout({ children }: { children: React.ReactNode }) {
    const data = useLoaderData<typeof loader>()

    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
                    }}
                />
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    )
}

export default function App() {
    const [queryClient] = React.useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // With SSR, we usually want to set some default staleTime
                        // above 0 to avoid refetching immediately on the client
                        staleTime: 60 * 1000,
                    },
                },
            })
    )
    return (
        <QueryClientProvider client={queryClient}>
            <Header />
            <Outlet />
            <Footer />
        </QueryClientProvider>
    )
}

export function ErrorBoundary() {
    const error = useRouteError()

    return (
        <html lang="en">
            <head>
                <title>Oops!</title>
                <Meta />
                <Links />
            </head>
            <body className="p-4">
                <h1>
                    {isRouteErrorResponse(error)
                        ? `Erro: ${error.status} -  ${error.statusText}`
                        : error instanceof Error
                          ? error.message
                          : 'Erro Desconhecido'}
                </h1>
                <Link
                    to="/"
                    className="underline hover:text-appAccent cursor-pointer"
                >
                    Voltar à Página Inicial
                </Link>
                <Scripts />
            </body>
        </html>
    )
}
