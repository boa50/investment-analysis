from utils import load_files, clear_table, get_cd_cvm_load, get_years_load

cd_cvm_load = get_cd_cvm_load()
years_load = get_years_load()

files_load = [
    "itr_cia_aberta_DRE_ind_",
    "dfp_cia_aberta_DRE_ind_",
]

df = load_files(years_load, files_load)
df = clear_table(df, cd_cvm_load)

print(
    df[df["DS_CONTA"].str.contains("resultado antes")]
    .groupby(["CD_CONTA", "DS_CONTA"])
    .count()
    .reset_index()
)

kpis = [
    "resultado antes do resultado financeiro e dos tributos",
    "resultado antes dos tributos sobre o lucro",
    "resultado antes tributação/participações",
]
df = df[df["DS_CONTA"].isin(kpis)]
print(df)
df.to_csv("data/raw/_reference-table-ebit.csv", index=False)