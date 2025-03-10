# Solana Trading Bot

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
    WALLET_ADDRESS=your_wallet_address
    SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
    PRIVATE_KEY=your_private_key
    DATABASE_URL=your_database_url
   ```

4. Initialize the database:
   ```bash
   ts-node init.ts
   ```

5. Start the server:
   ```bash
   pm2 start bot.ts --name "solana-trading-bot"
   ```

Usage

1. Set trading parameters:
   ```bash
   curl -X POST http://localhost:5000/set-tp \
       -H "Content-Type: application/json" \
       -d '{"wallet_address": "your_wallet_address", "max_trade_amount": 10, "min_trade_amount": 1, "auto_sell": true}'
   ```

2. Get trading parameters:
   ```bash
   curl http://localhost:5000/settings
   ```

3. Delete all trading parameters:
   ```bash
   curl -X DELETE http://localhost:5000/settings
   ```          

