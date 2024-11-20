export const getStocks = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/companies')
    return await response.json()
}
