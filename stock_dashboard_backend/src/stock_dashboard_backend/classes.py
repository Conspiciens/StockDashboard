from pydantic import BaseModel, Field 

class FmpQuery(BaseModel): 
    query: str 
    limit: str 
    exchange: str 
    apikey: str
    
