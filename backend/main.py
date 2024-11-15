from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
import measures

origins = [
    "http://localhost:8000",
    "http://localhost:5173",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
