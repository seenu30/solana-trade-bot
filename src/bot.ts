import { monitorWallet } from "./walletMonitor";
import { monitorTokenPrices, getTokenPrice } from "./priceMonitor";
import { sellToken } from "./tradeExecutor";
import { db, userSettings } from "./db";
import { fetchWalletTokens } from "./walletMonitor";

async function main() {
    console.log("Starting Solana Trading Bot...");

    // Log database settings
    const settings = await db.select().from(userSettings);
    console.log("Loaded settings from database:", settings);
    
    monitorWallet();

    const walletAddresses = settings.map((s) => s.wallet_address);
    console.log("Monitoring addresses:", walletAddresses);
    
    monitorTokenPrices(walletAddresses);

    setInterval(async () => {
        for (const { wallet_address, max_trade_amount, auto_sell } of settings) {
            const tokens = await fetchWalletTokens(); // Fetch tokens for the specific wallet
            for (const token of tokens) {
                const price = await getTokenPrice(token.address);
                console.log(`Current price for ${token.address}: $${price}`);

                if (auto_sell && !isNaN(price) && price >= Number(max_trade_amount)) {
                    console.log(`🚨 Price alert! ${token.address} at $${price} >= $${max_trade_amount}`);
                    await sellToken(token.address, token.amount); // Sell the token
                }
            }
        }
    }, 5000);
}

main();
