import os 
import psycopg

from psycopg_pool import ConnectionPool 
from dotenv import load_dotenv
from typing import Optional

load_dotenv() 

class DBConnection: 
    def __init__(self): 
        url = os.getenv('DATABASE_URl')

        self.connectionPool = ConnectionPool(url)
    
    def get_conn_from_pool(self) -> psycopg.Connection: 
        return self.connectionPool.connection()

    def get_new_cursor(self, conn: psycopg.Connection) -> psycopg.ServerCursor: 
        return conn.cursor()



def insert_new_trades(
    self, cursor: psycopg.ServerCursor, conn: psycopg.Connection, data: dict) -> None: 
    
    cursor.execute(
        """
        INSERT INTO trades (
            timestamp, 
            condition_flags, 
            trade_price, 
            trade_size, 
            trade_status, 
            exchange_codes, 
            exchange
        ) VALUES (%s, %s, %s, %s, %s, %s, %s);
    """,
        (
            "2026-06-06 14:30:00.123456+00",  # timestamp (TIMESTAMPTZ)
            "@F",  # condition_flags (TEXT)
            185.50,  # trade_price (DOUBLE PRECISION)
            1000,  # trade_size (BIGINT)
            "REGULAR",  # trade_status (TEXT)
            "A",  # exchange_codes (TEXT)
            "NASDAQ",  # exchange (TEXT)
        ),
    )

    
def init_new_db(self, cursor: psycopg.ServerCursor) -> None: 
    print("Loading New Table....")

    # cursor.execute("CREATE EXTENSION IF NOT EXISTS timescaledb")
    cursor.execute("""CREATE TABLE IF NOT EXISTS trades 
        (
            timestamp TIMESTAMPTZ NOT NULL, 
            condition_flags TEXT,
            trade_price DOUBLE PRECISION NOT NULL, 
            trade_size BIGINT, 
            trade_status TEXT, 
            exchange_codes TEXT, 
            exchange TEXT 
        );
    """)
    
        
    
    