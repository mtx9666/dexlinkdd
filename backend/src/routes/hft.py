from fastapi import APIRouter, HTTPException, Depends, WebSocket
from typing import List, Dict, Optional
from pydantic import BaseModel
from datetime import datetime
from ..hft.bot import HFTBot
from ..models.trade import BotTrade, Trade
from sqlalchemy.orm import Session
from ..database import get_db
import logging

router = APIRouter(prefix="/api/v1/hft", tags=["HFT Bot"])
logger = logging.getLogger(__name__)

class BotSettings(BaseModel):
    max_positions: int = 5
    risk_per_trade: float = 1.5
    min_spread: float = 0.05
    max_slippage: float = 0.1

class BotStatus(BaseModel):
    is_running: bool
    total_trades: int
    success_rate: float
    active_positions: int
    last_update: datetime

@router.post("/start")
async def start_bot(settings: Optional[BotSettings] = None, db: Session = Depends(get_db)):
    try:
        if settings:
            bot.update_settings(settings.dict())
        await bot.start()
        return {"status": "Bot started successfully"}
    except Exception as e:
        logger.error(f"Failed to start bot: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stop")
async def stop_bot():
    try:
        await bot.stop()
        return {"status": "Bot stopped successfully"}
    except Exception as e:
        logger.error(f"Failed to stop bot: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status", response_model=BotStatus)
async def get_bot_status(db: Session = Depends(get_db)):
    try:
        total_trades = db.query(BotTrade).count()
        successful_trades = db.query(BotTrade).filter(BotTrade.success == True).count()
        success_rate = (successful_trades / total_trades * 100) if total_trades > 0 else 0
        
        return {
            "is_running": bot.is_running,
            "total_trades": total_trades,
            "success_rate": success_rate,
            "active_positions": len(bot.active_positions),
            "last_update": datetime.utcnow()
        }
    except Exception as e:
        logger.error(f"Failed to get bot status: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trades")
async def get_bot_trades(
    limit: int = 10,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    try:
        trades = db.query(BotTrade).order_by(BotTrade.created_at.desc())\
            .offset(offset).limit(limit).all()
        return trades
    except Exception as e:
        logger.error(f"Failed to get bot trades: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/settings")
async def get_bot_settings():
    return bot.settings

@router.put("/settings")
async def update_bot_settings(settings: BotSettings):
    try:
        bot.update_settings(settings.dict())
        return {"status": "Settings updated successfully"}
    except Exception as e:
        logger.error(f"Failed to update settings: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Initialize bot instance
from ..config import settings
bot = HFTBot(
    web3_provider=settings.WEB3_PROVIDER_URL,
    private_key=settings.HFT_BOT_PRIVATE_KEY
) 