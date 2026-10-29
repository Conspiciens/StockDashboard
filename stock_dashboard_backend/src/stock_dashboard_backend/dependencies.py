from typing import Annotated 
from fastapi import Header, HTTPException 

import re

def sanitize_input_to_alphanumeric(string: str): 
    return re.sub(r'[^a-zA-Z0-9]', '', string)


# We want to get a queue to handle the data processing 