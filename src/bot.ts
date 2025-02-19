import { monitorWallet } from "./walletMonitor";
import { monitorTokenPrices, getTokenPrice } from "./priceMonitor";
import { sellToken } from "./tradeExecutor";
import { db, userSettings } from "./db";

async function main() {
    console.log("Starting Solana Trading Bot...");

    monitorWallet();

    const settings = await db.select().from(userSettings);
    
    // For now, we'll monitor the wallet address itself since we don't have token addresses
    const walletAddresses = settings.map((s) => s.wallet_address);
    
    monitorTokenPrices(walletAddresses);

    setInterval(async () => {
        for (const { wallet_address, max_trade_amount } of settings) {
            const priceString = await getTokenPrice(wallet_address);
            const price = Number(priceString);

            if (!isNaN(price) && price >= Number(max_trade_amount)) {
                console.log(`Selling ${wallet_address} at $${price}`);
                await sellToken(wallet_address, 100);
            }
        }
    }, 5000);
}

main();
