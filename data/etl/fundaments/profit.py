from utils import get_dre_kpi_info


def load_profit(df_dre, df_reference_table):
    return get_dre_kpi_info("PROFIT", df_dre, df_reference_table)
