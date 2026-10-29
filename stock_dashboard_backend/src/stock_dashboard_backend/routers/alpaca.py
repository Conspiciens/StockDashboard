from fastapi import APIRouter, WebSocket
from websockets.exceptions import ConnectionClosedOK, ConnectionClosedError

from ..websocket_manager import api_connection_manager, manager


router = APIRouter() 

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

async def send_data_to_frontend(frontend_websocket: WebSocket, dummy_json_data: TextIO):
    try: 
        api_websocket = await manager.request_subscription(api_connection_manager)
        if api_websocket is None: 
            raise Exception("Error occured")

        while True: 
            # Iterate through json and send every obj
            stock_data = await api_websocket.recv()
            print(f"Stock data: {stock_data}")

            data = json.loads(stock_data)
            for obj in data: 
                await frontend_websocket.send_text(obj)

            await asyncio.sleep(0.01)

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
    dummy_json_data = open(path / "live_trades_dummy_data_2.json", "rb")

    consumer_task = asyncio.create_task(check_if_terminate(frontend_websocket))
    producer_task = asyncio.create_task(send_data_to_frontend(frontend_websocket, dummy_json_data))

    done, pending = await asyncio.wait(
        [consumer_task, producer_task], 
        return_when=asyncio.FIRST_COMPLETED
    )
    print("Finish first task")

    for task in pending: 
        task.cancel() 

# @router.websocket("/ws/{tick_symbol}")
# async def connect_to_live_data(frontend_websocket: WebSocket, tick_symbol: str): 
#     await manager.connect(frontend_websocket)
# 
#     try: 
#         api_websocket = await manager.request_subscription(api_connection_manager)
#         if api_websocket is None: 
#             raise Exception("Error occured")
# 
#         while True: 
#             stock_data = await api_websocket.recv()
#             print(f"Stock data: {stock_data}")
# 
#             data = json.loads(stock_data)
#             for obj in data: 
#                 await frontend_websocket.send_text(obj)
# 
#     except ConnectionClosedOK as e: 
#         print(f"Connection closed: {e}") 
#         await frontend_websocket.send_text("[{\"msg\":\"close\"}]")
#     except ConnectionClosedError as e: 
#         print(f"Connection closed due to error: {e}")
#         await frontend_websocket.send_text("[{\"msg\":\"close\"}]")
#     except Exception as e: 
#         print(f"Error: {e}")
#         await frontend_websocket.send_text("[{\"msg\":\"close\"}]")
