from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List, Optional, Set
import json
import logging
import asyncio
from datetime import datetime
from ..models.trade import Trade, Position, BotTrade
from ..database import get_db

logger = logging.getLogger(__name__)

class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, Dict[str, WebSocket]] = {}
        self.subscriptions: Dict[str, Set[str]] = {}
        self._lock = asyncio.Lock()
        
    async def connect(self, websocket: WebSocket, client_id: str, channels: List[str] = None):
        """Connect a client and subscribe to specified channels"""
        try:
            await websocket.accept()
            async with self._lock:
                if client_id not in self.active_connections:
                    self.active_connections[client_id] = {}
                    self.subscriptions[client_id] = set()
                
                # Generate unique connection ID
                connection_id = f"{client_id}_{datetime.utcnow().timestamp()}"
                self.active_connections[client_id][connection_id] = websocket
                
                # Subscribe to channels
                if channels:
                    self.subscriptions[client_id].update(channels)
                    
            logger.info(f"Client {client_id} connected. Connection ID: {connection_id}")
            return connection_id
            
        except Exception as e:
            logger.error(f"Error connecting client {client_id}: {e}")
            raise
            
    async def disconnect(self, client_id: str, connection_id: str):
        """Disconnect a client connection"""
        try:
            async with self._lock:
                if client_id in self.active_connections:
                    if connection_id in self.active_connections[client_id]:
                        del self.active_connections[client_id][connection_id]
                        
                    if not self.active_connections[client_id]:
                        del self.active_connections[client_id]
                        del self.subscriptions[client_id]
                        
            logger.info(f"Client {client_id} disconnected. Connection ID: {connection_id}")
            
        except Exception as e:
            logger.error(f"Error disconnecting client {client_id}: {e}")
            
    async def broadcast(self, message: dict, channel: str = None, client_id: Optional[str] = None):
        """Broadcast message to subscribed clients"""
        try:
            message["timestamp"] = datetime.utcnow().isoformat()
            
            async with self._lock:
                if client_id:
                    # Send to specific client
                    if client_id in self.active_connections:
                        if not channel or channel in self.subscriptions[client_id]:
                            for connection in self.active_connections[client_id].values():
                                try:
                                    await connection.send_json(message)
                                except Exception as e:
                                    logger.error(f"Error sending to client {client_id}: {e}")
                else:
                    # Broadcast to all subscribed clients
                    for cid, channels in self.subscriptions.items():
                        if not channel or channel in channels:
                            for connection in self.active_connections[cid].values():
                                try:
                                    await connection.send_json(message)
                                except Exception as e:
                                    logger.error(f"Error broadcasting to client {cid}: {e}")
                                    
        except Exception as e:
            logger.error(f"Error broadcasting message: {e}")
            
    async def subscribe(self, client_id: str, channels: List[str]):
        """Subscribe a client to channels"""
        async with self._lock:
            if client_id in self.subscriptions:
                self.subscriptions[client_id].update(channels)
                
    async def unsubscribe(self, client_id: str, channels: List[str]):
        """Unsubscribe a client from channels"""
        async with self._lock:
            if client_id in self.subscriptions:
                self.subscriptions[client_id].difference_update(channels)
                
    async def broadcast_trade_update(self, trade: Trade):
        """Broadcast trade update to subscribed clients"""
        message = {
            "type": "trade_update",
            "data": {
                "id": trade.id,
                "token_symbol": trade.token_symbol,
                "amount": trade.amount,
                "price": trade.price,
                "type": trade.type,
                "status": trade.status.value
            }
        }
        await self.broadcast(message, channel="trades")
        
    async def broadcast_bot_status(self, status: dict):
        """Broadcast bot status update to subscribed clients"""
        message = {
            "type": "bot_status",
            "data": status
        }
        await self.broadcast(message, channel="bot_status")
        
    async def broadcast_position_update(self, position: Position):
        """Broadcast position update to subscribed clients"""
        message = {
            "type": "position_update",
            "data": {
                "id": position.id,
                "token_symbol": position.token_symbol,
                "amount": position.amount,
                "entry_price": position.entry_price,
                "current_price": position.current_price,
                "pnl": position.pnl,
                "status": position.status.value
            }
        }
        await self.broadcast(message, channel="positions", client_id=str(position.user_id))

# Create global WebSocket manager instance
manager = WebSocketManager() 