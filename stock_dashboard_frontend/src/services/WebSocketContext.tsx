import React, {
    createContext, 
    useContext, 
    useEffect, 
    useRef, 
    useState, 
} from 'react'; 
import type { Quote } from '../types/type';


interface WebSocketContextValue {
    isConnected: boolean, 
    // sendMessage: (payload: unknown) => void, 
    subscribe: (handler: (payload: unknown) => void) => () => void, 
    lastError: Error | null
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null); 


export function WebSocketProvider(
    symbol: string, 
    children: any, 
) : React.ReactElement {
    const [isConnected, setIsConnected] = useState<boolean>(false); 
    const [lastError, setLastError] = useState<Error | null>(null); 
    const [message, setMessage] = useState<(string | number)[]>([]);

    const socketRef = useRef<WebSocket | null>(null); 
    const subscribeRef = useRef<Set<(payload: unknown) => void>>(
        new Set() 
    ); 


    const subscribe = (handler: (payload: unknown) => void) => {
        subscribeRef.current.add(handler); 

        return () => {
            return subscribeRef.current.delete(handler);
        }
    } 

    const dispatch = (message: (string | number)[]) => {
        subscribeRef.current?.forEach(handler => {
            handler(message);  
        });
    }


    useEffect(() => { 
        try {
            socketRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/${symbol}`);
        } catch (error) {
            console.log("Error occured during creation"); 
        }

        if (socketRef.current == null) 
            return; 

        socketRef.current.onopen = () => {
            console.log("Opening Socket"); 
        } 


        socketRef.current.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data) as Quote;

            const price = data.bp;
            const timestamp = data.t;

            dispatch([timestamp, price]);
        } 

        socketRef.current.onerror = (event) => {
            console.error("Error Occured: ", event);
        }

        socketRef.current.onclose = (event) => {
            console.log(`Code: ${event.code}`);
            console.log(`Reason: ${event.reason}`);
            console.log("Closing Socket");;
        }

        
    })

    const value: WebSocketContextValue = {
        isConnected, 
        subscribe, 
        lastError,
    }; 


    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    )

}

export function useWebSocketContext() : WebSocketContextValue {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("Context failed to create"); 
    }

    return context; 
}

export function useWebSocketSubscription(handler: (payload: unknown) => void) {
    const { subscribe } = useWebSocketContext();

    useEffect(() => {
        return subscribe(handler); 
    }, [handler, subscribe]);
}
