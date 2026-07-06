from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app.routes.stocks import router

import os
from dotenv import load_dotenv

from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent.parent / ".env"
print(env_path)
print(load_dotenv(env_path))
print(os.getenv("FINNHUB_API_KEY"))

print(">>> LOADING MAIN.PY <<<")

app = FastAPI(title="StockPilot")
app.include_router(router)

# Static files (CSS, JavaScript, images)
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# HTML templates
templates = Jinja2Templates(directory="app/templates")


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
  return templates.TemplateResponse(
    request=request,
    name="index.html",
    context={"request": request},
)