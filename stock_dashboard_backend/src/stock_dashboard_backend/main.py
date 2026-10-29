#
# 
#   API's -> FastAPI -> Frontend
#            - Give sensitive information to frontend 
#            - 
# 
import os 

from fastapi import Depends, FastAPI 
from fastapi.middleware.cors import CORSMiddleware

from .credentials import credentials


if credentials.get_is_test(): 
    from .tests import alpaca_dummy, fmp_dummy
else: 
    from .routers import alpaca, fmp 

app = FastAPI()

origins = []
if credentials.get_is_test(): 
    print("Appending localhost....")
    origins.append("http://localhost:5173")

app.add_middleware(
    CORSMiddleware, 
    allow_origins=origins, 
)

if credentials.get_is_test():
    print("Running tests functions")
    app.include_router(alpaca_dummy.router)
    app.include_router(fmp_dummy.router)
else: 
    app.include_router(alpaca.router)
    app.include_router(fmp.router)


