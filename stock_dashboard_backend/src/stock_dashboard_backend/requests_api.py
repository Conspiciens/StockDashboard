import requests


def request_link(link: str, query: dict = None, headers: dict = None): 
    try:
        response = requests.get(link, params=query, headers=headers)
        print(response.url)
        return response 
    except Exception as e: 
        print(f"Exception Occured: {e}")

    