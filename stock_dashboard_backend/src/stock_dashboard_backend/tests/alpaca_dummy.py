import asyncio
import time
import json
import ijson 

from typing import TextIO
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pathlib import Path 
from websockets.exceptions import ConnectionClosedOK, ConnectionClosedError

from ..credentials import credentials
from .stock_simulator import retrieve_simulate_price
from ..websocket_manager import api_connection_manager, manager

router = APIRouter() 
path = Path() 

REST_LIMIT = 5000

# Alpaca requests are handled in this file 
async def check_if_terminate(frontend_websocket: WebSocket): 
    print("Checking for termination")
    try: 
        while True: 
            print("Awaiting")
            message = await frontend_websocket.receive_text()
            print(message)

            js_message = json.loads(message)
            print(js_message)
            if "msg" in js_message:
                if js_message["msg"] == "closing":  
                    print("closing")
                    break
            asyncio.sleep(1)

    except WebSocketDisconnect as e:
        print("Disconnected due to websocket")
    except Exception as e: 
        print(e)
    
async def send_data_to_frontend(frontend_websocket: WebSocket):
    
    try: 
        while True: 
           # Iterate through json and send every obj
            data = retrieve_simulate_price()
            formatted_data = json.loads(data)

            print(f"formatted data: {formatted_data}")

            for obj in formatted_data: 
                await frontend_websocket.send_text(json.dumps(obj))
                await asyncio.sleep(1)

    # Handles the Cancelled Error by task.cancel() 
    except asyncio.CancelledError as e: 
        print(f"Cancelling task consumer task!")
    except ConnectionClosedOK as e: 
        print(f"Connection closed: {e}") 
    except ConnectionClosedError as e: 
        print(f"Connection closed due to error: {e}")
    except WebSocketDisconnect as e: 
        print(f"Connection closed: {e}") 
    except Exception as e: 
        print(f"Error: {e}")


@router.websocket("/ws/{tick_symbol}")
async def connect_to_live_data(frontend_websocket: WebSocket, tick_symbol: str): 
    await manager.connect(frontend_websocket)

    consumer_task = asyncio.create_task(check_if_terminate(frontend_websocket))
    producer_task = asyncio.create_task(send_data_to_frontend(frontend_websocket))

    done, pending = await asyncio.wait(
        [consumer_task, producer_task], 
        return_when=asyncio.FIRST_COMPLETED
    )
    print("Finish first task")

    for task in pending: 
        task.cancel() 

@router.get("/latest_trades/{tick_symbol}")
async def fetch_latest_trades(tick_symbol: str): 
    secrets = json.loads(credentials.get_cred_aplaca())

    link = credentials.get_alpaca_request_link() 
    link = link.replace("{symbol}", tick_symbol)

    query = {
        "accept": "application/json", 
        "APACA-API-KEY-ID": secrets["key"],
        "APACA-API-SECRET-KEY": secrets["secret"]
    }
    
    dummy_latest_trades = open(path / "rest_trades_dummy_data.json")
    return json.load(dummy_latest_trades)["trades"]