from sqlalchemy import Column, Integer, String, Float, DateTime, Enum, ForeignKey, JSON
from .base import Base, TimestampMixin
import enum

class TradeStatus(enum.Enum):
    PENDING = "pending"
    EXECUTED = "executed"
    FAILED = "failed"
    CANCELLED = "cancelled"

class PositionStatus(enum.Enum):
    OPEN = "open"
    CLOSED = "closed"
    LIQUIDATED = "liquidated"

class Trade(Base, TimestampMixin):
    __tablename__ = "trades"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, nullable=False, index=True)
    token_symbol = Column(String, nullable=False, index=True)
    token_address = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    price = Column(Float, nullable=False)
    type = Column(String, nullable=False)  # buy/sell
    status = Column(Enum(TradeStatus), nullable=False, default=TradeStatus.PENDING)
    tx_hash = Column(String, unique=True)
    gas_price = Column(Float)
    gas_used = Column(Integer)
    error = Column(String)
    metadata = Column(JSON)

class Position(Base, TimestampMixin):
    __tablename__ = "positions"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, nullable=False, index=True)
    token_symbol = Column(String, nullable=False, index=True)
    token_address = Column(String, nullable=False)
    entry_price = Column(Float, nullable=False)
    current_price = Column(Float)
    amount = Column(Float, nullable=False)
    leverage = Column(Float, default=1.0)
    pnl = Column(Float, default=0.0)
    status = Column(Enum(PositionStatus), nullable=False, default=PositionStatus.OPEN)
    stop_loss = Column(Float)
    take_profit = Column(Float)
    liquidation_price = Column(Float)
    metadata = Column(JSON)

class BotTrade(Base, TimestampMixin):
    __tablename__ = "bot_trades"

    id = Column(Integer, primary_key=True)
    bot_id = Column(String, nullable=False, index=True)
    trade_id = Column(Integer, ForeignKey('trades.id'))
    strategy = Column(String, nullable=False)
    trigger_condition = Column(JSON)
    profit_target = Column(Float)
    stop_loss = Column(Float)
    execution_time = Column(Float)  # in milliseconds
    success = Column(bool, default=False)
    error = Column(String)
    metadata = Column(JSON) 