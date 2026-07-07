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
    print(data)
    return {
        "ticker": ticker.upper(),
        "price_change":  data.get("d"),
         "percent_change": round(data.get("dp"), 2),
        "current_price": data.get("c"),
        "day_high": data.get("h"),
        "day_low": data.get("l"),
        "open_price": data.get("o"),
        "previous_close": data.get("pc")
    }