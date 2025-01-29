from dotenv import load_dotenv
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
import google.auth
import os
import json
import company
import measure

load_dotenv()

credentials = google.auth.default(
    scopes=["https://www.googleapis.com/auth/cloud-platform"],
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS").split(" "),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/livetest")
def livetest():
    return {"message": "Server Running!"}


@app.get("/api/companies")
def get_companies():
    df = company.get_companies()
    return Response(df.to_json(orient="records"), media_type="application/json")


@app.get("/api/companiesAndSegments")
def get_companies_and_segments():
    df = company.get_companies_and_segments()
    return Response(df.to_json(orient="records"), media_type="application/json")


@app.get("/api/company")
def get_company(ticker: str):
    df = company.get_company(ticker=ticker)
    return Response(df.to_json(orient="records"), media_type="application/json")


@app.get("/api/searchCompanies")
def search_companies(text: str):
    df = company.search_companies(text=text)
    return Response(df.to_json(orient="records"), media_type="application/json")


@app.get("/api/historicalValues")
def get_historical_values(ticker: str, kpi: str):
    df = measure.get_historical_values(ticker=ticker, kpi=kpi)
    return Response(df.to_json(orient="records"), media_type="application/json")


@app.get("/api/stockRatings")
def get_stock_ratings(ticker: str):
    df = measure.get_stock_ratings(ticker=ticker)
    df = df.astype(
        {
            "value": float,
            "debt": float,
            "efficiency": float,
            "growth": float,
            "overall": float,
        }
    )

    return Response(
        json.dumps(df.to_dict(orient="records")[0]), media_type="application/json"
    )


@app.get("/api/hasStockData")
def has_stock_data(ticker: str):
    res = company.has_stock_data(ticker=ticker)
    return Response(json.dumps(res), media_type="application/json")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
