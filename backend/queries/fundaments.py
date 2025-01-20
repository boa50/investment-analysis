import queries.utils as qu
import queries.general as general
import mappings as mappings


def get_cds_cvm(ticker, is_from_segment, group_segment_values):
    if len(ticker) == 0:
        return [], ["CD_CVM"]

    columns = []

    if not is_from_segment:
        cds_cvm = f"('{general.get_cd_cvm_by_ticker(ticker)}')"
    else:
        cds_cvm = (
            "('" + "','".join(general.get_segment_cds_cvm_by_ticker(ticker)) + "')"
        )

        if not group_segment_values:
            columns.append("CD_CVM")

    return cds_cvm, columns


def get_cds_cvm_filter(cds_cvm):
    if len(cds_cvm) > 0:
        return f"AND CD_CVM IN {cds_cvm}"
    else:
        return ""


def get_kpi(
    kpi,
    ticker="",
    non_value_columns=["DT_END"],
    n_years=10,
    is_from_segment=False,
    group_segment_values=True,
):
    cds_cvm, columns = get_cds_cvm(ticker, is_from_segment, group_segment_values)

    cds_cvm_filter = get_cds_cvm_filter(cds_cvm)

    if is_from_segment and group_segment_values:
        value_column = f"AVG({mappings.kpi_fundament_value_column[kpi]}) AS VALUE"
        group_by_clause = f"GROUP BY {qu.get_sql_columns(non_value_columns)}"
    else:
        value_column = f"{mappings.kpi_fundament_value_column[kpi]} AS VALUE"
        group_by_clause = ""

    table_full_name = qu.get_table_full_name("stocks-fundaments")

    columns.extend(non_value_columns)
    columns.append(value_column)
    columns_sql = qu.get_sql_columns(columns)

    sql = f"""
            SELECT {columns_sql} 
            FROM {table_full_name}
            WHERE DT_YEAR >= (SELECT max(DT_YEAR) FROM {table_full_name}) - {n_years}
                AND KPI = '{kpi}'
                {cds_cvm_filter}
            {group_by_clause}
            ORDER BY DT_END
        """

    df = qu.execute_query(sql)

    df = df.rename(columns={"DT_END": "DATE"})

    return df


def get_latest_values(
    ticker="", kpis=[], is_from_segment=False, group_segment_values=True
):
    cds_cvm, columns = get_cds_cvm(ticker, is_from_segment, group_segment_values)
    columns.append("KPI")

    cds_cvm_filter = get_cds_cvm_filter(cds_cvm)

    if len(kpis) > 0:
        kpis_filter = "AND KPI IN ('" + "','".join(kpis) + "')"
    else:
        kpis_filter = ""

    if is_from_segment and group_segment_values:
        columns.append("AVG(VALUE) AS VALUE")
        columns.append("AVG(VALUE_ROLLING_YEAR) AS VALUE_ROLLING_YEAR")
        group_by_clause = "GROUP BY KPI"
    else:
        columns.append("VALUE")
        columns.append("VALUE_ROLLING_YEAR")
        group_by_clause = ""

    table_full_name = qu.get_table_full_name("stocks-fundaments")

    columns_sql = qu.get_sql_columns(columns)

    sql = f"""
            SELECT {columns_sql} 
            FROM {table_full_name}
            WHERE DT_END >= (SELECT max(DT_END) FROM {table_full_name})
                {kpis_filter}
                {cds_cvm_filter}
            {group_by_clause}
        """

    return qu.execute_query(sql)
