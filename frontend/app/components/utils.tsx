export const formatDecimal = (num: number): string => num.toFixed(2)
export const formatCurrency = (num: number): string => (new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", notation: 'compact' })).format(num)
export const formatPercent = (num: number): string => formatDecimal(num * 100) + '%'