import pandas_gbq as pdgbq
import os

### For testing purposes
os.environ["DATA_SOURCE"] = "database"
os.environ["DB_PROJECT_ID"] = "lazy-investor-db"
os.environ["DB_DATASET_ID"] = "app_dataset"

project_id = os.environ.get("DB_PROJECT_ID")
dataset_id = os.environ.get("DB_DATASET_ID")

def get_table_full_name(table_name):
    return "`{}.{}.{}`".format(
        project_id,
        dataset_id,
        table_name
        )
    
def execute_query(sql):
    return pdgbq.read_gbq(sql, project_id=project_id)

def get_sql_columns(columns):
    if len(columns) == 0:
        return '*'
    else:
        return ','.join(columns)