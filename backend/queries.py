import os
import queries_utils as qu

def get_cd_cvm_by_ticker(ticker):
    sql = """
            SELECT CD_CVM 
            FROM {} 
            WHERE TICKERS LIKE '%{}%'
        """.format(qu.get_table_full_name('stocks-basic-info'), ticker.upper())
        
    cd_cvm = qu.execute_query(sql).iloc[0]["CD_CVM"]
        
    return cd_cvm

def get_all_from_table(table_name):
    sql = """
            SELECT * 
            FROM {}
        """.format(qu.get_table_full_name(table_name))
        
    df = qu.execute_query(sql)
        
    return df

def get_kpi_fundaments(ticker, kpi, columns=[], n_years=10, is_from_segment=False, group_segment_values=True):
    cd_cvm = get_cd_cvm_by_ticker(ticker)
    table_full_name = qu.get_table_full_name('stocks-fundaments')
    columns_sql = qu.get_sql_columns(columns)
    
    sql = f"""
            SELECT {columns_sql} 
            FROM {table_full_name}
            WHERE CD_CVM = '{cd_cvm}'
                AND KPI = '{kpi}'
                AND DT_YEAR >= (SELECT max(DT_YEAR) FROM {table_full_name}) - {n_years}
            ORDER BY DT_END
        """
        
    df = qu.execute_query(sql)
    
    return df

print(get_kpi_fundaments('BBAS3', 'ROE', columns=['DT_END', 'VALUE', 'VALUE_ROLLING_YEAR']))