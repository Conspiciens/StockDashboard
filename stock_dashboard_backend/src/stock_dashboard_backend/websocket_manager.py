import json
import websockets.typing

from typing import Optional
from websockets.asyncio.client import connect, ClientConnection

from .credentials import credentials, Credentials

# 
# 
#   Note: ApiConnection Manager uses the websocket library to manage 
#   what's being sent 
# 
class ApiConnectionManager: 
    def __init__(self): 
        self.outgoing_api_connections: list = [] 
    
    async def connect(self, link: str, subscribe_data: str, keys: str) -> Optional[ClientConnection]: 
        api_websocket = await connect(link)

        await api_websocket.send(keys)
        response = json.loads(
           await api_websocket.recv() 
        )

        print(response)

        if not self._is_succesful_websocket(response): 
            return None 

        await api_websocket.send(subscribe_data)
        response = json.loads(
            await api_websocket.recv()
        )

        print(response)
        if not self._is_succesful_websocket(response): 
            return None 

        self.outgoing_api_connections.append(api_websocket)
        return api_websocket
    
    def _is_succesful_websocket(self, response: dict) -> bool:
        if "msg" in response[0]: 
            match response[0]["msg"]: 
                case "success" | "authenticated" | "connected": 
                    return True 
        return False
    
    async def disconnect(self, websocket): 
        self.outgoing_api_connections.remove(websocket)

#
#   Note: The connection manager uses the FastAPI Websocket,
#   since there's already a connection made 
# 
class ConnectionManager: 
    def __init__(self): 
        self.active_connections: list = []

    async def connect(self, websocket): 
        await websocket.accept() 
        self.active_connections.append(websocket)
    
    async def disconnect(self, websocket): 
        self.active_connections.remove(websocket)
    
    async def send_pong(self, websocket): 
        await websocket.pong()

    async def request_subscription(
        self, 
        outgoing_websocket: ApiConnectionManager, 
    ): 
        ''' 
            When requesting a subscription, we need to ensure that the message, 
            which I have in mind is probably a JWT & stock ticker symbol. Check if valid, and if so make connection 
            to the API

            @params: 
                message: { "JWT": xxxxxxxxxxxx, "StockSymbol": AAPL }
        ''' 
        credentials = Credentials()  
        # If statement to check if the stock symbol is valid 
        # await websocket.send(message)
        link = credentials.get_ws_link() 
        json_subscribe_data = credentials.read_subscription_json() 
        keys = credentials.get_cred_aplaca()

        return await outgoing_websocket.connect(link, json_subscribe_data, keys)
    


api_connection_manager = ApiConnectionManager() 
manager = ConnectionManager()