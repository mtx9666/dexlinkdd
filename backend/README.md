# Dexlink Trading Backend

Backend service for the Dexlink Social Trading Platform, built with FastAPI and Python.

## Features

- Real-time WebSocket communication
- HFT bot for automated trading
- Trade execution and monitoring
- Position management
- Real-time market data processing
- User authentication and authorization
- Trade history and analytics

## Prerequisites

- Python 3.9+
- PostgreSQL
- Redis
- Node.js and npm (for development)

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Set up the database:
   ```bash
   # Start PostgreSQL service
   # Create database named 'dexlink'
   ```

5. Start Redis:
   ```bash
   # Start Redis service
   ```

## Running the Application

1. Development mode:
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```

2. Production mode:
   ```bash
   uvicorn src.main:app --host 0.0.0.0 --port 8000
   ```

## API Documentation

Once the server is running, access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## WebSocket Endpoints

- `/ws/{client_id}`: Main WebSocket endpoint for real-time updates
  - Supports trade execution
  - Real-time market data
  - HFT bot status updates

## HFT Bot Configuration

The HFT bot can be configured through environment variables or the API:

- `MAX_POSITIONS`: Maximum number of concurrent positions
- `RISK_PER_TRADE`: Maximum risk percentage per trade
- `MIN_SPREAD`: Minimum spread required for trade execution
- `MAX_SLIPPAGE`: Maximum allowed slippage

## Development

1. Install development dependencies:
   ```bash
   pip install -r requirements-dev.txt
   ```

2. Run tests:
   ```bash
   pytest
   ```

3. Format code:
   ```bash
   black src tests
   isort src tests
   ```

## Project Structure

```
backend/
├── src/
│   ├── main.py           # FastAPI application
│   ├── hft/              # HFT bot implementation
│   ├── models/           # Database models
│   ├── schemas/          # Pydantic schemas
│   ├── routes/           # API routes
│   └── utils/            # Utility functions
├── tests/                # Test files
├── config/               # Configuration files
├── requirements.txt      # Production dependencies
└── README.md            # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License 