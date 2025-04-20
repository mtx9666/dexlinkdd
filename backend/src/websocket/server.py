import asyncio
import json
import logging
from typing import Dict, Set
from fastapi import WebSocket
from ..models.trade import MarketAnalysis

logger = logging.getLogger(__name__)

class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        self.analysis_tasks: Dict[str, asyncio.Task] = {}

    async def connect(self, websocket: WebSocket, symbol: str):
        await websocket.accept()
        if symbol not in self.active_connections:
            self.active_connections[symbol] = set()
        self.active_connections[symbol].add(websocket)
        
        # Start analysis task if not already running
        if symbol not in self.analysis_tasks:
            self.analysis_tasks[symbol] = asyncio.create_task(
                self._generate_analysis(symbol)
            )

    def disconnect(self, websocket: WebSocket, symbol: str):
        if symbol in self.active_connections:
            self.active_connections[symbol].remove(websocket)
            if not self.active_connections[symbol]:
                del self.active_connections[symbol]
                # Cancel analysis task
                if symbol in self.analysis_tasks:
                    self.analysis_tasks[symbol].cancel()
                    del self.analysis_tasks[symbol]

    async def _generate_analysis(self, symbol: str):
        """Generate mock market analysis data periodically"""
        while True:
            try:
                # Generate mock analysis data
                analysis = {
                    "sentiment": {
                        "score": 75,
                        "trend": "bullish",
                        "confidence": 85
                    },
                    "technical": {
                        "rsi": 65,
                        "macd": 2.5,
                        "ma": 1850,
                        "volume": "HIGH"
                    },
                    "wyckoff": {
                        "phase": "markup",
                        "progress": 65,
                        "description": "Market showing strong momentum with increasing volume",
                        "keyLevels": {
                            "support": 1800,
                            "resistance": 1900
                        }
                    },
                    "fibonacci": {
                        "levels": [
                            {"name": "0.236", "value": 1880, "type": "resistance"},
                            {"name": "0.382", "value": 1860, "type": "resistance"},
                            {"name": "0.5", "value": 1840, "type": "resistance"},
                            {"name": "0.618", "value": 1820, "type": "support"},
                            {"name": "0.786", "value": 1800, "type": "support"}
                        ],
                        "currentPrice": 1850
                    }
                }

                # Broadcast to all connected clients for this symbol
                if symbol in self.active_connections:
                    message = {
                        "type": "analysis",
                        "symbol": symbol,
                        "analysis": analysis
                    }
                    await self._broadcast(symbol, message)

                await asyncio.sleep(5)  # Update every 5 seconds
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error generating analysis for {symbol}: {e}")
                await asyncio.sleep(5)

    async def _broadcast(self, symbol: str, message: dict):
        """Broadcast message to all connected clients for a symbol"""
        if symbol in self.active_connections:
            disconnected = set()
            for connection in self.active_connections[symbol]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Error broadcasting to client: {e}")
                    disconnected.add(connection)
            
            # Clean up disconnected clients
            for connection in disconnected:
                self.disconnect(connection, symbol)

# Global WebSocket manager instance
manager = WebSocketManager() 