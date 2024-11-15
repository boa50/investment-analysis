from fastapi import FastAPI, Response
import measures

app = FastAPI()


@app.get("/api/livetest")
def livetest():
    return {"message": "Server Running!"}


@app.get("/api/companies")
def get_companies():
    df = measures.get_companies()
    return Response(df.to_json(orient="records"), media_type="application/json")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
