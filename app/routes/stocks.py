from urllib import response

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
    profile_url = "https://finnhub.io/api/v1/stock/profile2"

    quote_response = requests.get(url, params=params)

    print("Status:", quote_response.status_code)
    print("Body:", quote_response.text)
   
    quote_data = quote_response.json()
    print(quote_data)
    profile_response = requests.get(
    profile_url,
    params=params
)

    profile_data = profile_response.json()

    return {
        "ticker": ticker.upper(),
        "company_name": profile_data.get("name"),
        "logo": profile_data.get("logo"),
        "price_change":  quote_data.get("d"),
         "percent_change": round(quote_data.get("dp"), 2),
        "current_price": quote_data.get("c"),
        "day_high": quote_data.get("h"),
        "day_low": quote_data.get("l"),
        "open_price": quote_data.get("o"),
        "previous_close": quote_data.get("pc")
        
    }