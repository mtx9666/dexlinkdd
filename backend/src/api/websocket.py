from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ..websocket.server import manager

router = APIRouter()

@router.websocket("/ws/analysis/{symbol}")
async def websocket_endpoint(websocket: WebSocket, symbol: str):
    await manager.connect(websocket, symbol)
    try:
        while True:
            # Keep the connection alive and handle any client messages
            data = await websocket.receive_text()
            # You can handle client messages here if needed
    except WebSocketDisconnect:
        manager.disconnect(websocket, symbol)
    except Exception as e:
        print(f"Error in websocket connection: {e}")
        manager.disconnect(websocket, symbol) 