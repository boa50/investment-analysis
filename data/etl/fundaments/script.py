import pandas as pd
from data.etl.utils import (
    load_files,
    prepare_dataframe,
)
from profit import load_profit, load_cagr_profit_5_years
from earnings import load_ebit
from equity import load_equity
from roe import load_roe
from debt import load_total_debt, load_net_debt, load_net_debt_by_ebit

year_initial = 2011
year_final = 2024
years_load = list(range(year_initial, year_final + 1))

try:
    df_fundaments = pd.read_csv("data/processed/stocks-fundaments.csv")
except FileNotFoundError:
    df_fundaments = pd.DataFrame(
        columns=[
            "CD_CVM",
            "DT_INI_EXERC",
            "DT_FIM_EXERC",
            "KPI",
            "VL_CONTA",
            "EXERC_YEAR",
            "VL_CONTA_ROLLING_YEAR",
        ]
    )

### Getting only companies available on basic info file
df_basic_info = pd.read_csv("data/processed/stocks-basic-info.csv")
cd_cvm_load = list(
    set(df_basic_info["CD_CVM"].values).difference(df_fundaments["CD_CVM"].values)
)

print("Loading fundaments from {}".format(cd_cvm_load))

### Getting the KPIs reference table
df_reference_table = pd.read_csv("data/processed/reference-table.csv")


### KPIs from DRE files
df_dre = load_files(years_load, files_types_load=["DRE"])
df_dre = prepare_dataframe(df_dre, cd_cvm_load)

df_profit = load_profit(df_dre, df_reference_table)
df_ebit = load_ebit(df_dre, df_reference_table)
df_cagr_profit_5_years = load_cagr_profit_5_years(df_profit)

# Removed the load of the ebitda because each company show the results differently
# and not all of them have values in the DRE files
# A better alternative would be to scrap data directly from the RIs
# df_ebitda = load_ebitda(df_dre, df_ebit, df_reference_table)

del df_dre

### KPIs from BPP files
df_bpp = load_files(years_load, files_types_load=["BPP"])
df_bpp["DT_INI_EXERC"] = "1900-01-01"
df_bpp = prepare_dataframe(df_bpp, cd_cvm_load)

df_equity = load_equity(df_bpp, df_reference_table)
df_total_debt = load_total_debt(df_bpp, df_reference_table)

del df_bpp

## KPIs from BPA files
df_bpa = load_files(years_load, files_types_load=["BPA"])
df_bpa["DT_INI_EXERC"] = "1900-01-01"
df_bpa = prepare_dataframe(df_bpa, cd_cvm_load)

df_net_debt = load_net_debt(df_bpa, df_total_debt, df_reference_table)

del df_bpa


### Consolidate the final file
df_roe = load_roe(df_profit, df_equity)
# df_net_debt_by_ebitda = load_net_debt_by_ebitda(df_net_debt, df_ebitda)
df_net_debt_by_ebit = load_net_debt_by_ebit(df_net_debt, df_ebit)

df_fundaments = pd.concat(
    [
        df_fundaments,
        df_profit,
        df_equity,
        df_roe,
        df_ebit,
        # df_ebitda,
        df_total_debt,
        df_net_debt,
        # df_net_debt_by_ebitda,
        df_net_debt_by_ebit,
        df_cagr_profit_5_years,
    ]
)

print(df_fundaments)

df_fundaments = df_fundaments.sort_values(
    by=[
        "KPI",
        "CD_CVM",
        "DT_FIM_EXERC",
    ]
)

df_fundaments = df_fundaments.dropna(subset=["VL_CONTA"])

print()
print("DF FUNDAMENTS")
print(df_fundaments.head())
print(df_fundaments.tail())
print()

df_fundaments.to_csv("data/processed/stocks-fundaments.csv", index=False)
