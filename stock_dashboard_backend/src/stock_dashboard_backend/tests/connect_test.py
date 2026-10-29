import asyncio
import json 
import websockets


async def test_client():
    uri = "ws://127.0.0.1:8000/ws/AAPPL"
    
    async with websockets.connect(uri) as ws:

        while True: 
            # Send text data
            await ws.ping()
        
            # Receive response data
            response = await ws.recv()
            response = json.loads(response)[0]
            if "msg" in response:
                if response["msg"] == "close": 
                    break 
            print("Server replied:", response)

asyncio.run(test_client())
