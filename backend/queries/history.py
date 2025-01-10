import backend.queries.utils as qu
import backend.queries.general as general

def get_tickers(ticker, is_from_segment, group_segment_values):
    columns = []
    
    if not is_from_segment:
        tickers = f"('{ticker}')"
    else:
        tickers = "('" + "','".join(general.get_segment_tickers_by_ticker(ticker)) + "')"
        
        if not group_segment_values:
            columns.append("TICKER")
            
    return tickers, columns

def get_kpi(ticker, kpi, non_value_columns=["DATE"], n_years=10, is_from_segment=False, group_segment_values=True):
    tickers, columns = get_tickers(ticker, is_from_segment, group_segment_values)
            
    if is_from_segment and group_segment_values:
        value_column = f"AVG({kpi}) AS VALUE"
        group_by_clause = f"GROUP BY {qu.get_sql_columns(non_value_columns)}"
    else:
        value_column = f"{kpi} AS VALUE"
        group_by_clause = ""
        
    table_full_name = qu.get_table_full_name('stocks-history')
    
    columns.extend(non_value_columns)
    columns.append(value_column)
    columns_sql = qu.get_sql_columns(columns)
    
    sql = f"""
            SELECT {columns_sql} 
            FROM {table_full_name}
            WHERE TICKER IN {tickers}
                AND DATE >= DATE_SUB((SELECT max(DATE) FROM {table_full_name}), INTERVAL {n_years} YEAR)
            {group_by_clause}
            ORDER BY DATE
        """
    
    return qu.execute_query(sql)

def get_latest_values(ticker, is_from_segment=False, group_segment_values=True):
    tickers, columns = get_tickers(ticker, is_from_segment, group_segment_values)
    
    kpis = ["PRICE", "PRICE_PROFIT", "DIVIDEND_YIELD", "DIVIDEND_PAYOUT", "PRICE_EQUITY"]
            
    if is_from_segment and group_segment_values:
        for kpi in kpis:
            columns.append(f"AVG({kpi}) AS {kpi}")
    else:
        columns.extend(kpis)
        
    table_full_name = qu.get_table_full_name('stocks-history')
    
    columns_sql = qu.get_sql_columns(columns)
    
    sql = f"""
            SELECT {columns_sql} 
            FROM {table_full_name}
            WHERE TICKER IN {tickers}
                AND DATE >= (SELECT max(DATE) FROM {table_full_name})
        """
    
    return qu.execute_query(sql)