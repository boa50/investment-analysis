import utils as qu

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