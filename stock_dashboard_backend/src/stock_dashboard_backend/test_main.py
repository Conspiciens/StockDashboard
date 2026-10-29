from fastapi.test_client import TestClient 

from .main import app

client = TestClient(app)

def test_read_main(): 
    pass 