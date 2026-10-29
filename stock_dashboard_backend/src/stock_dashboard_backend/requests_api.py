import requests


def request_link(link: str, query: dict): 
    try:
        response = requests.get(link, params=query)
        print(response.url)
        return response 
    except Exception as e: 
        print(f"Exception Occured: {e}")

    