from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Optional
import logging
import json
import asyncio
from datetime import datetime
from sqlalchemy.orm import Session

from .routes import hft
from .websocket.manager import manager
from .database import init_db, get_db
from .config import settings
from .api import websocket

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Dexlink Trading Backend",
    description="Backend API for Dexlink Social Trading Platform",
    version="1.0.0"
)

# Configure CORS with specific origins for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://dexlink.com",  # Replace with your production domain
        "https://app.dexlink.com",
        "http://localhost:3000",  # For development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(hft.router)
app.include_router(websocket.router)

# WebSocket endpoint for real-time updates
@app.websocket("/ws/{client_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    client_id: str,
    channels: Optional[List[str]] = None,
    db: Session = Depends(get_db)
):
    connection_id = await manager.connect(websocket, client_id, channels)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                await process_message(message, client_id, db)
            except json.JSONDecodeError:
                logger.error(f"Invalid JSON received from client {client_id}")
    except WebSocketDisconnect:
        await manager.disconnect(client_id, connection_id)
    except Exception as e:
        logger.error(f"WebSocket error for client {client_id}: {e}")
        await manager.disconnect(client_id, connection_id)

async def process_message(message: dict, client_id: str, db: Session):
    """Process incoming WebSocket messages"""
    try:
        message_type = message.get("type")
        if message_type == "subscribe":
            channels = message.get("channels", [])
            await manager.subscribe(client_id, channels)
            
        elif message_type == "unsubscribe":
            channels = message.get("channels", [])
            await manager.unsubscribe(client_id, channels)
            
        elif message_type == "trade":
            # Process trade request
            trade_data = message.get("data", {})
            # Add trade processing logic here
            
        elif message_type == "hft_command":
            # Process HFT bot command
            command = message.get("command")
            if command == "start":
                await hft.bot.start()
            elif command == "stop":
                await hft.bot.stop()
            
    except Exception as e:
        logger.error(f"Error processing message: {e}")
        await manager.broadcast(
            {
                "type": "error",
                "data": {"message": "Failed to process message"}
            },
            client_id=client_id
        )

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": app.version
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    # Initialize database
    init_db()
    logger.info("Database initialized")
    
    # Additional startup tasks
    if settings.ENVIRONMENT == "production":
        # Production-specific initialization
        pass

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    # Cleanup tasks
    await hft.bot.stop()
    logger.info("HFT bot stopped")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    ) 