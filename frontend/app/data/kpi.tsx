import { formatNum } from '../components/utils'
import type { Company } from '../types/stocks'

type Kpis =
    | 'marketCap'
    | 'price'
    | 'bazinPrice'
    | 'pl'
    | 'pvp'
    | 'dividendYield'
    | 'dividendPayout'
    | 'equity'
    | 'netRevenue'
    | 'profit'
    | 'ebit'
    | 'debt'
    | 'netDebt'
    | 'netMargin'
    | 'roe'
    | 'netDebtByEbit'
    | 'netDebtByEquity'
    | 'cagr5YearsProfit'
    | 'cagr5YearsRevenue'

interface ReturnProps {
    title: string
    value: string
    titleExplained?: string
    description?: string
    calculation?: string
}

export const getKpiInfo = (tickerData: Company, key: Kpis): ReturnProps => {
    switch (key) {
        case 'marketCap':
            return {
                title: 'Valor de Mercado',
                value: formatNum(tickerData.marketCap, 'currency'),
                description:
                    'É usado como uma estimativa do tamanho e valor da empresa',
                calculation:
                    'Preço da Ação x Número Total de Ações em Circulação',
            }
        case 'price':
            return {
                title: 'Preço',
                value: formatNum(tickerData.price, 'currencyDecimal'),
            }
        case 'bazinPrice':
            return {
                title: 'Preço Bazin',
                value: formatNum(tickerData.bazinPrice, 'currencyDecimal'),
                description:
                    'Utilização do método Bazin para cálculo de preço justo de uma ação',
                calculation:
                    '(Dividendos dos últimos 3 anos / 3 anos) / 6% (Dividend Yield desejado)',
            }
        case 'pl':
            return {
                title: 'P/L',
                value: formatNum(tickerData.pl, 'decimal'),
                titleExplained: 'Preço / Lucro',
                description:
                    'Indicador utilizado para avaliar se uma ação está cara ou barata em relação ao lucro que a empresa gera. Representa o número de anos que levaria para recuperar o investimento em uma ação, assumindo que o lucro por ação permaneça constante e seja distribuído integralmente como dividendos',
                calculation: 'Preço da Ação / Lucro por Ação (LPA)',
            }
        case 'pvp':
            return {
                title: 'P/VP',
                value: formatNum(tickerData.pvp, 'decimal'),
                titleExplained: 'Preço / Valor Patrimonial',
                description:
                    'Indicador utilizado para avaliar se uma ação está cara ou barata em relação ao valor contábil da empresa. Ele relaciona o preço de uma ação com o seu valor patrimonial por ação (VP), fornecendo uma métrica de avaliação relativa',
                calculation: 'Preço da Ação / Valor Patrimonial por Ação (VPA)',
            }
        case 'dividendYield':
            return {
                title: 'Dividend Yield',
                value: formatNum(tickerData.dividendYield, 'percent'),
                description:
                    'Indica quanto uma empresa paga em dividendos a seus acionistas em relação ao preço atual da ação. Esse indicador é especialmente útil para investidores que buscam renda passiva',
                calculation:
                    '(Dividendos Anuais por Ação / Preço Atual da Ação) x 100',
            }
        case 'dividendPayout':
            return {
                title: 'Dividend Payout',
                value: formatNum(tickerData.dividendPayout, 'percent'),
                description:
                    'Métrica que indica a proporção do lucro líquido de uma empresa que é distribuída aos acionistas na forma de dividendos. Ele reflete a política de dividendos da empresa e ajuda investidores a avaliar o quanto do lucro gerado está sendo compartilhado com os acionistas e quanto está sendo reinvestido na própria empresa',
                calculation: '(Dividendos por Ação / Lucro por Ação) x 100',
            }
        case 'equity':
            return {
                title: 'Patrimônio',
                value: formatNum(tickerData.equity, 'currency'),
                description:
                    'Representa a diferença entre os ativos e os passivos da empresa. Ele reflete o valor contábil que pertence aos acionistas após o pagamento de todas as obrigações. É um indicador importante para avaliar a saúde financeira e o valor intrínseco de uma empresa',
                calculation: 'Ativos Totais - Passivos Totais',
            }
        case 'netRevenue':
            return {
                title: 'Receitas',
                value: formatNum(tickerData.netRevenue, 'currency'),
                description:
                    'Representa o valor total obtido com as vendas de seus produtos ou serviços em um determinado período, geralmente um trimestre ou ano. Esse é um dos principais indicadores financeiros que mostram o desempenho da empresa, sendo uma métrica básica para avaliar sua capacidade de gerar dinheiro com suas operações principais',
            }
        case 'profit':
            return {
                title: 'Lucro Líquido',
                value: formatNum(tickerData.profit, 'currency'),
                description:
                    'Representa o ganho financeiro que a empresa obteve em um determinado período, geralmente trimestral ou anual, após subtrair todas as despesas (custos de operação, impostos, juros, etc.) de sua receita total',
                calculation:
                    'Receita Total - Custos de Venda - Despesas Operacionais - Impostos',
            }
        case 'ebit':
            return {
                title: 'EBIT',
                value: formatNum(tickerData.ebit, 'currency'),
                titleExplained: 'Lucros Antes de Juros e Impostos',
                description:
                    'Medida financeira usada para avaliar a rentabilidade operacional de uma empresa, ou seja, o lucro que a empresa gera apenas com suas operações principais, sem levar em conta os efeitos de financiamentos (juros) e impostos',
                calculation:
                    'Receita Total - Custos de Venda - Despesas Operacionais',
            }
        case 'debt':
            return {
                title: 'Dívida Bruta',
                value: formatNum(tickerData.debt, 'currency'),
                description:
                    'Representa o total de obrigações financeiras que a empresa possui, ou seja, o montante que ela deve a credores em empréstimos e financiamentos, sem considerar os descontos de caixa ou outros ativos líquidos que podem ser usados para abater essa dívida. É uma métrica importante para avaliar a estrutura de capital da empresa e seu nível de endividamento',
                calculation:
                    'Passivos Financeiros de Curto Prazo + Passivos Financeiros de Longo Prazo',
            }
        case 'netDebt':
            return {
                title: 'Dívida Líquida',
                value: formatNum(tickerData.netDebt, 'currency'),
                description:
                    'representa o quanto a empresa deve, considerando suas obrigações financeiras e o caixa disponível',
                calculation: 'Dívida Bruta - Caixa e Equivalentes de Caixa',
            }
        case 'netMargin':
            return {
                title: 'Margem Líquida',
                value: formatNum(tickerData.netMargin, 'percent'),
                description:
                    'Mede a eficiência de uma empresa em transformar sua receita total em lucro líquido. Em outras palavras, mostra qual é a porcentagem do faturamento que sobra como lucro após a dedução de todos os custos, despesas, impostos e outros encargos',
                calculation: '(Lucro Líquido / Receita Líquida) x 100',
            }
        case 'roe':
            return {
                title: 'RoE',
                value: formatNum(tickerData.roe, 'percent'),
                titleExplained: 'Retorno sobre o Patrimônio Líquido',
                description:
                    'É um indicador utilizado para medir a rentabilidade de uma empresa em relação ao capital investido pelos seus acionistas. Ele mostra o quanto a empresa está gerando de lucro para cada real investido pelos acionistas',
                calculation: '(Lucro Líquido / Patrimônio Líquido) x 100',
            }
        case 'netDebtByEbit':
            return {
                title: 'Dívida Líquida / EBIT',
                value: formatNum(tickerData.netDebtByEbit, 'decimal'),
                description:
                    'Métrica usada para avaliar a capacidade de uma empresa de pagar suas dívidas com os lucros operacionais gerados antes de impostos e juros. Ele é muito usado por analistas e investidores para medir o risco financeiro de uma empresa e sua alavancagem',
            }
        case 'netDebtByEquity':
            return {
                title: 'Dívida Líquida / PL',
                value: formatNum(tickerData.netDebtByEquity, 'decimal'),
                titleExplained: 'Dívida Líquida / Patrimônio Líquido',
                description:
                    'Mede o nível de endividamento de uma empresa em relação ao seu patrimônio líquido, indicando o grau de alavancagem financeira da companhia. É um importante parâmetro de análise para investidores, pois permite avaliar a saúde financeira da empresa e sua capacidade de sustentar dívidas com os recursos próprios',
            }
        case 'cagr5YearsProfit':
            return {
                title: 'CAGR Lucros - 5 anos',
                value: formatNum(tickerData.cagr5YearsProfit, 'percent'),
                titleExplained: 'Taxa Composta de Crescimento Anual dos Lucros',
                description:
                    'Indicador que mede a taxa média de crescimento anual dos lucros de uma empresa ao longo de um período específico, considerando o efeito da composição. Ele fornece uma visão mais precisa do crescimento médio, mesmo quando os lucros variam de ano para ano',
                calculation:
                    '(Lucro Final / Lucro Inicial) ^ (1 / número_de_anos) - 1',
            }
        case 'cagr5YearsRevenue':
            return {
                title: 'CAGR Receitas - 5 anos',
                value: formatNum(tickerData.cagr5YearsRevenue, 'percent'),
                titleExplained:
                    'Taxa Composta de Crescimento Anual das Receitas',
                description:
                    'Indicador que mede a taxa média de crescimento anual das receitas de uma empresa ao longo de um período específico, considerando o efeito da composição. Ele fornece uma visão mais precisa do crescimento médio, mesmo quando as receitas variam de ano para ano',
                calculation:
                    '(Receita Final / Receita Inicial) ^ (1 / número_de_anos) - 1',
            }
        default:
            return {
                title: '-',
                value: '-',
            }
    }
}
