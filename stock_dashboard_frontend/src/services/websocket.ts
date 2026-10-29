import React, { Component, useContext, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import type { Quote } from '../types/type';

/* 
    https://websocket.org/guides/frameworks/react/
*/ 

export default function initWebSocket(
    symbol: string | undefined, 
    setDataPoints: any
) {
    console.log(`ws: ${symbol}`)
    const websocket = useRef<WebSocket | null>(null); 
    let message = useRef<any[]>([]);

    const handleOnPageHide = () => {
        if (websocket.current == null) return; 
        websocket.current.close();
    };

    useEffect(() => {

        try {
            websocket.current = new WebSocket(`ws://127.0.0.1:8000/ws/${symbol}`);
        } catch (error) {
            console.log("Error occured during creation"); 
        }

        if (websocket.current == null) 
            return; 

        websocket.current.onopen = () => {
            console.log("Opening Socket")
        } 

        websocket.current.onmessage = (event: MessageEvent) => {
            console.log("data...");
            const data = JSON.parse(event.data) as Quote;

            const price = data.bp;
            const timestamp = data.t;

            setDataPoints([timestamp, price]);
        }

        websocket.current.onerror = (event) => {
            console.error("Error Occured: ", event);
        }

        websocket.current.onclose = (event) => {
            console.log(`Code: ${event.code}`);
            console.log(`Reason: ${event.reason}`);
            console.log("Closing Socket");;
        }

        /* 
            Pagehide is perferred over beforeunload, as pagehide can add the page 
            to the bfcache. 
        */ 
        window.addEventListener("pagehide", handleOnPageHide);

        return () => {
            console.log("Wrapping up in use effect");

            window.removeEventListener("pagehide", handleOnPageHide);
            if (websocket.current) {
                websocket.current.close(1000); 
                websocket.current = null; 
            }
        }
    }, [symbol])


    return { message }

}
