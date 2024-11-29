export default function Footer() {
    return (
        <footer className="bg-appBackgroundDark">
            <div className="px-6 py-8 mx-auto">
                <div className="container flex flex-col items-center text-center">
                    <a href="/">
                        <img className="w-auto h-14" src="/logo.webp" alt="" />
                    </a>

                    <p className="text-sm mx-auto mt-4 text-appTextWeakDark">
                        O Lazy Investor não tem a intenção de recomendar ou
                        sugerir a compra de ativos. Nosso site é exclusivamente
                        informativo e educativo, fornecendo dados provenientes
                        de fontes públicas, como B3, CVM e RI das empresas. Por
                        isso, não nos responsabilizamos por decisões de
                        investimento tomadas com base nas informações
                        disponíveis em nossa plataforma.
                    </p>
                </div>

                <hr className="my-10 border-gray-700" />

                <div className="container flex flex-col items-center sm:flex-row sm:justify-between">
                    <p className="text-sm text-appTextWeakDark">
                        © Copyright 2024. Todos os direitos reservados.
                    </p>

                    <div className="flex mt-3 -mx-2 sm:mt-0">
                        <a
                            href="mailto:lazyinvestor@gmail.com"
                            className="mx-2 text-sm text-appTextWeakDark transition-colors duration-300 hover:text-appTextNormalDark"
                            aria-label="Contato"
                        >
                            Contato
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
