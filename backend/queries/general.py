import queries.utils as qu

def get_cd_cvm_by_ticker(ticker):
    sql = f"""
            SELECT CD_CVM 
            FROM {qu.get_table_full_name('stocks-basic-info')} 
            WHERE TICKERS LIKE '%{ticker.upper()}%'
        """
        
    cd_cvm = qu.execute_query(sql).iloc[0]["CD_CVM"]
        
    return cd_cvm

def get_basic_info(cd_cvm='', ticker='', columns=[]):
    sql_columns = qu.get_sql_columns(columns)
    
    if len(ticker) > 0 and len(cd_cvm) == 0:
        cd_cvm = get_cd_cvm_by_ticker(ticker)
    
    if len(cd_cvm) > 0:
        where_clause = f"WHERE CD_CVM = '{cd_cvm}'"
    else:
        where_clause = ""
    
    sql = f"""
            SELECT {sql_columns} 
            FROM {qu.get_table_full_name('stocks-basic-info')} 
            {where_clause}
        """
        
    return qu.execute_query(sql)

def get_right_prices(ticker=''):
    sql_columns = qu.get_sql_columns(["BAZIN"])
    
    if len(ticker) > 0:
        where_clause = f"WHERE TICKER = '{ticker}'"
    else:
        where_clause = ""
    
    sql = f"""
            SELECT {sql_columns} 
            FROM {qu.get_table_full_name('stocks-right-prices')} 
            {where_clause}
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

def get_companies_by_text(text):
    sql = f"""
            SELECT NAME, TICKERS, SEGMENT 
            FROM {qu.get_table_full_name('stocks-basic-info')}
            WHERE TICKERS LIKE UPPER('%{text}%')
                OR UPPER(REGEXP_REPLACE(NORMALIZE(NAME, NFD), r"\pM", '')) LIKE UPPER('%{text}%')
    
        """
        
    return qu.execute_query(sql)