import os
import json 

from typing import Optional
from dotenv import load_dotenv
from pathlib import Path

path = Path("./src/stock_dashboard_backend/json_data").resolve()
load_dotenv(path / "websocket_link.env") 

class Credentials: 
    def __init__(self): 
        self.LINK = os.getenv("WS_LINK")
        self.FMP_SYMBOL_LINK = os.getenv("FMP_SYMBOLS_LINK")
        self.FMP_API_KEY = os.getenv("FMP_API_KEY")
        self.ALPACA_SUBSCRIPTION = None 
        self.ALPACA_KEYS = None 
        self.IS_TEST = False if os.getenv("IS_TEST") is None else True

        if dict_cred := self._handle_load_json_cred(path / "subscribe_alpaca.json"):
            self.ALPACA_SUBSCRIPTION = dict_cred
        if dict_cred := self._handle_load_json_cred(path / "alpaca_cred.json"):
            self.ALPACA_KEYS = dict_cred

    def _handle_load_json_cred(self, path: Path) -> Optional[str]: 
        try: 
            file = open(path)
            return json.dumps(
                json.load(file)
            ) 
        except json.JSONDecodeError as e: 
            print(f"JSON decoding error: {e}")
            return None 
        except FileNotFoundError as e: 
            print(f"File not found: {e}")
            return None
        
        return None 
    
    def get_is_test(self) -> bool: 
        return self.IS_TEST

    def get_fmp_api_key(self) -> str: 
        return self.FMP_API_KEY

    def get_fmp_symbols_link(self) -> str: 
        return self.FMP_SYMBOL_LINK

    def get_cred_aplaca(self) -> dict: 
        return self.ALPACA_KEYS 

    def get_ws_link(self) -> str: 
        return self.LINK
    
    def read_subscription_json(self) -> dict: 
        return self.ALPACA_SUBSCRIPTION


credentials = Credentials()