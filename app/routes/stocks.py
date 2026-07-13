from fastapi import APIRouter
import os
import requests
import time 

router = APIRouter()

@router.get("/search")
async def search(ticker: str):
    api_key = os.getenv("FINNHUB_API_KEY")
    params = {
        "symbol": ticker,
        "token": api_key,
    }
    url = "https://finnhub.io/api/v1/quote"
    profile_url = "https://finnhub.io/api/v1/stock/profile2"

    quote_response = requests.get(url, params=params)
    profile_response = requests.get(profile_url, params=params)

    quote_data = quote_response.json()
    profile_data = profile_response.json()

    return {
        "ticker": ticker.upper(),
        "company_name": profile_data.get("name"),
        "logo": profile_data.get("logo"),
        "price_change": quote_data.get("d"),
        "percent_change": round(quote_data.get("dp"), 2),
        "current_price": quote_data.get("c"),
        "day_high": quote_data.get("h"),
        "day_low": quote_data.get("l"),
        "open_price": quote_data.get("o"),
        "previous_close": quote_data.get("pc"),
    }

@router.get("/history")
async def history(ticker: str, 
                  timeframe: str ="1M"
                  ):
    
    api_key = os.getenv("FMP_API_KEY")
    print(api_key)

    to = int(time.time())
    from_time = to - (30 * 24 * 60 * 60)
    params = {
    "function": "TIME_SERIES_DAILY",
    "symbol": ticker,
    "apikey": api_key,
}

    url = f"https://financialmodelingprep.com/stable/historical-price-eod/full?symbol={ticker}&apikey={api_key}"

    quote_response = requests.get(url)

    quote_data = quote_response.json()
    print(quote_data)

    if not isinstance(quote_data, list):
       return {
                 "error": quote_data.get(
                     "Error Message", 
                     "Historical data is temporarily unavailable."
                     )
                 
    }

    if not quote_data:
       return quote_data
    
    if timeframe == "1D":
         quote_data = quote_data[:2]

    elif timeframe == "1W":
        quote_data = quote_data[:7]

    elif timeframe == "1M":
        quote_data = quote_data[:30]

    elif timeframe == "6M":
        quote_data = quote_data[:180]

    elif timeframe == "1Y":
         quote_data = quote_data[:365]
   
    
    
    labels = []
    prices = []
    for day in quote_data:
        labels.append(day['date'])
        prices.append(day['close'])

    print(quote_data)    
    print(labels)
    print(prices)
    print(timeframe)
    return {"labels": labels, "prices": prices}
