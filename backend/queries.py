import queries_utils as qu
import mappings

def get_cd_cvm_by_ticker(ticker):
    sql = f"""
            SELECT CD_CVM 
            FROM {qu.get_table_full_name('stocks-basic-info')} 
            WHERE TICKERS LIKE '%{ticker.upper()}%'
        """
        
    cd_cvm = qu.execute_query(sql).iloc[0]["CD_CVM"]
        
    return cd_cvm

def get_basic_info(columns=[]):
    sql_columns = qu.get_sql_columns(columns)
    sql = f"""
            SELECT {sql_columns} 
            FROM {qu.get_table_full_name('stocks-basic-info')} 
        """
        
    return qu.execute_query(sql)

def get_segment_info_by_ticker(ticker, column):
    sql = f"""
            SELECT {column} 
            FROM {qu.get_table_full_name('stocks-basic-info')} 
            WHERE SEGMENT = (SELECT SEGMENT FROM {qu.get_table_full_name('stocks-basic-info')} WHERE TICKERS LIKE '%{ticker.upper()}%')
        """
        
    return qu.execute_query(sql)[column].tolist()

def get_segment_cds_cvm_by_ticker(ticker):
    return get_segment_info_by_ticker(ticker, "CD_CVM")

def get_segment_tickers_by_ticker(ticker):
    tickers_tmp = get_segment_info_by_ticker(ticker, "TICKERS")
    tickers = [ticker for tks in tickers_tmp for ticker in tks.split(';')]
    
    return tickers

def get_all_from_table(table_name):
    sql = """
            SELECT * 
            FROM {}
        """.format(qu.get_table_full_name(table_name))
        
    return qu.execute_query(sql)

def get_kpi_fundaments(ticker, kpi, non_value_columns=["DT_END"], n_years=10, is_from_segment=False, group_segment_values=True):
    columns = []
    
    if not is_from_segment:
        cds_cvm = f"('{get_cd_cvm_by_ticker(ticker)}')"
    else:
        cds_cvm = "('" + "','".join(get_segment_cds_cvm_by_ticker(ticker)) + "')"
        
        if not group_segment_values:
            columns.append("CD_CVM")
            
    if is_from_segment and group_segment_values:
        value_column = f"AVG({mappings.kpi_fundament_value_column[kpi]}) AS VALUE"
        group_by_clause = f"GROUP BY {qu.get_sql_columns(non_value_columns)}"
    else:
        value_column = f"{mappings.kpi_fundament_value_column[kpi]} AS VALUE"
        group_by_clause = ""
        
    table_full_name = qu.get_table_full_name('stocks-fundaments')
    
    columns.extend(non_value_columns)
    columns.append(value_column)
    columns_sql = qu.get_sql_columns(columns)
    
    sql = f"""
            SELECT {columns_sql} 
            FROM {table_full_name}
            WHERE CD_CVM IN {cds_cvm}
                AND KPI = '{kpi}'
                AND DT_YEAR >= (SELECT max(DT_YEAR) FROM {table_full_name}) - {n_years}
            {group_by_clause}
            ORDER BY DT_END
        """
        
    return qu.execute_query(sql)

def get_kpi_history(ticker, kpi, non_value_columns=["DATE"], n_years=10, is_from_segment=False, group_segment_values=True):
    columns = []
    
    if not is_from_segment:
        tickers = f"('{ticker}')"
    else:
        tickers = "('" + "','".join(get_segment_tickers_by_ticker(ticker)) + "')"
        
        if not group_segment_values:
            columns.append("TICKER")
            
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