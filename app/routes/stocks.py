from fastapi import APIRouter
import os
import requests


router = APIRouter()

@router.get("/search")
async def search(ticker: str):
    api_key = os.getenv("FINNHUB_API_KEY")
    params = {
        "symbol": ticker,
        "token": api_key
    }

    url = "https://finnhub.io/api/v1/quote"

    response = requests.get(url, params=params)

    data = response.json()
    return data