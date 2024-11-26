# Investment Analysis

Investment Analysis is a platform to help people invest more wisely with less effort.

## How the code is organised

The code is organised in 4 main folders:

#### data

- Contains code to execute the ETL processes
- Also have the current datasources in .csv files on the processed/data.zip file
- Developed using Python (pandas)

#### analysis

- Contains sample code to start analysing data without deploying the whole environment
- Developed using Python (pandas, matplotlib)

#### backend

- Consist of an API to read information from the datasource and make it available to the frontend application
- Developed using Python (FastAPI, pandas)

#### frontend

- The visual application to be executed on the browsers, offering an intuitive UI to be explored
- Developed using JavaScript (React, Remix, TanStack)

## How to start using

The first step is to make data available for analysis. So, it's mandatory to unzip the data.zip file located at the data/processed folder.

This could be done with any unzip application or executing the _unzip_data_ function located at the data/etl/compress_data.py file. All the files should be extracted directly to the processed folder, no sub-folders should be created.

After that, you could start analyzing data executing the functions contained at the analysis folder. For that you must have a python environment with all the dependencies (requirements.txt) installed. We recommend using Conda or Venv for this task.

However, if you'd like to deploy the application in its fullness, you should also have Node installed on your computer and install the dependencies of the _frontend_ project. This could be easily done by running the command `npm install` inside the _frontend_ folder.

To execute the app on you local enviroment, you must start the backend and fronted. The backend can be started executing the command `python main.py`, and the frontend with the command `npm run dev` (both commands on their respective folders).
