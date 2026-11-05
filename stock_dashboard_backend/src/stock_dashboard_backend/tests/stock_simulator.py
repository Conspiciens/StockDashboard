import math
import time 

import numpy as np

from pathlib import Path

PRICE = 158.20 
DRIFT = 0.05
VOLATILITY = 0.00001

price = PRICE
START_TIME = time.time() 

PRICE_FOLLOWS = 160.03 

from fastapi import APIRouter, WebSocket, WebSocketDisconnect


def jitter_volatility() -> float:
    rng = np.random.default_rng() 
    return rng.normal(0, 0.001)

def simulate_price(price: float, volatility: float, time_sec: float): 
    time_sec = time_sec / 31536000
    # Geometric Brownian Motion (GBM) 
    # Gaussian Random Walk 
    dist = np.random.normal(0, 1)
    return price * np.exp((((DRIFT - (0.5 * (volatility ** 2)))) * time_sec) + (volatility * (dist * np.sqrt(time_sec))))

def retrieve_simulate_price() -> str: 
    global price 

    time_executed = time.time()
    seconds = time.time() - START_TIME

    print(f"Seconds: {seconds}")

    volatility = jitter_volatility() 
    price = float(simulate_price(price, volatility, seconds))

    # {
    #     "T": "q",
    #     "S": "AAPL",
    #     "bx": "V",
    #     "bp": 341.98,
    #     "bs": 40,
    #     "ax": "V",
    #     "ap": 342.03,
    #     "as": 40,
    #     "c": [
    #         "R"
    #     ],
    #     "z": "C",
    #     "t": "2026-10-15T19:42:26.247469184Z"
    # }

    return f'''[{{
        "T": "q", 
        "S": "AAPL", 
        "bx": "V", 
        "bp": {price}, 
        "bs": 40, 
        "ax": "V",
        "ap": {price + 1.02},  
        "as": 40, 
        "c": [
            "R"
        ], 
        "z": "C",
        "t": {time_executed}
    }}]'''


