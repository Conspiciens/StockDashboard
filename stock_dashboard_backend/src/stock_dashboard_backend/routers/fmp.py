from fastapi import APIRouter 

from ..classes import FmpQuery 
from ..credentials import credentials
from ..requests_api import request_link

router = APIRouter()

# FMP requests are handled in this file

@router.get("/tick_symbols/{tick_symbol}")
def get_symbols(tick_symbol: str): 
    # Probably will want to allow for different exchanges in the future 
    EXCHANGE = "NASDAQ" 
    LIMIT = 10
    
    link = credentials.get_fmp_symbols_link() 
    api_key = credentials.get_fmp_api_key()

    query = FmpQuery(
        tick_symbol, 
        LIMIT, 
        EXCHANGE, 
        api_key
    )

    response = request_link(link, query.dump())
    
    return response.text
