import math
import time 

import numpy as np

PRICE = 158.20 
DRIFT = 0.05
VOLATILITY = 0.00001

PRICE_FOLLOWS = 160.03 

path = Path("./").resolve()

router = APIRouter() 

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pathlib import Path

def send_message(): 
    nano_timestamp = time.time_ns() 

def jitter_volatility() -> float:
    rng = np.random.default_rng() 
    return rng.normal(0, 0.001)

def simulate_price(price: float, volatility: float, time_sec: float): 
    time_sec = time_sec / 31536000
    # Geometric Brownian Motion (GBM) 
    # Gaussian Random Walk 
    dist = np.random.normal(0, 1)
    return price * np.exp((((DRIFT - (0.5 * (volatility ** 2)))) * time_sec) + (volatility * (dist * np.sqrt(time_sec))))

def send_simulate_price(): 
    time_sec = 1
    price = PRICE

    while time_sec < 3000: 
        volatility = jitter_volatility() 
        price = simulate_price(price, volatility, time_sec)
        print(f"Price: {price}\n")
        time_sec += 1 
        time.sleep(0.01)


