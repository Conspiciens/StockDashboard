import json 

from fastapi import APIRouter 
from pathlib import Path

from ..requests_api import request_link
from ..credentials import credentials
from ..classes import FmpQuery 

router = APIRouter() 

path = Path("./src/stock_dashboard_backend/json_data").resolve()

# FMP dummy responses are handled in this file
@router.get("/tick_symbols/{tick_symbol}")
def get_symbols(tick_symbol: str): 
    # Probably will want to allow for different exchanges in the future 
    EXCHANGE = "NASDAQ" 
    LIMIT = 10
    
    link = credentials.get_fmp_symbols_link() 
    api_key = credentials.get_fmp_api_key()

    # query = FmpQuery(
    #     tick_symbol, 
    #     LIMIT, 
    #     EXCHANGE, 
    #     api_key
    # )

    # It should additionally send other 
    # errors that may occur 

    dummy_fmp_json = open(path / "dummy_json_fmp_search.json")
    return json.load(dummy_fmp_json)


