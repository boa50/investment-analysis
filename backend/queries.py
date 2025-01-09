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

def get_segment_cds_cvm_by_ticker(ticker):
    sql = f"""
            SELECT CD_CVM 
            FROM {qu.get_table_full_name('stocks-basic-info')} 
            WHERE SEGMENT = (SELECT SEGMENT FROM {qu.get_table_full_name('stocks-basic-info')} WHERE TICKERS LIKE '%{ticker.upper()}%')
        """
        
    cds_cvm = qu.execute_query(sql)["CD_CVM"].tolist()
        
    return cds_cvm

def get_all_from_table(table_name):
    sql = """
            SELECT * 
            FROM {}
        """.format(qu.get_table_full_name(table_name))
        
    df = qu.execute_query(sql)
        
    return df

def get_kpi_fundaments(ticker, kpi, non_value_columns=[], n_years=10, is_from_segment=False, group_segment_values=True):
    if not is_from_segment:
        cds_cvm = f"('{get_cd_cvm_by_ticker(ticker)}')"
        columns = []
    else:
        cds_cvm = "('" + "','".join(get_segment_cds_cvm_by_ticker(ticker)) + "')"
        columns = ["CD_CVM"]
        
    table_full_name = qu.get_table_full_name('stocks-fundaments')
    
    columns.extend(non_value_columns)
    columns.append(mappings.kpi_fundament_value_column[kpi])
    columns_sql = qu.get_sql_columns(columns)
    
    sql = f"""
            SELECT {columns_sql} 
            FROM {table_full_name}
            WHERE CD_CVM IN {cds_cvm}
                AND KPI = '{kpi}'
                AND DT_YEAR >= (SELECT max(DT_YEAR) FROM {table_full_name}) - {n_years}
            ORDER BY DT_END
        """
        
    print(sql)
        
    # df = qu.execute_query(sql)
    
    # return df

print(get_kpi_fundaments('BBAS3', 'ROE', non_value_columns=['DT_END'], is_from_segment=True))

# print(get_segment_cds_cvm_by_ticker('BBAS3').tolist())