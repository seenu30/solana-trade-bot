import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<any> {
    while (retries > 0) {
        try {
            const response = await axios.get(url, {
                timeout: 5000
            });
            return response.data;
        } catch (error) {
            retries--;
            if (retries === 0) throw error;
            await sleep(RETRY_DELAY);
        }
    }
    return null;
}

export async function getTokenPrice(tokenAddress: string): Promise<number> {
    try {
        const data = await fetchWithRetry(
            `https://quote-api.jup.ag/v6/quote?inputMint=${tokenAddress}&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=1000000&slippageBps=50`
        );
        
        if (data?.outAmount && data?.inAmount) {
            const price = Number(data.outAmount) / Number(data.inAmount);
            console.log(`Price data for ${tokenAddress}:`, price);
            return price;
        }
        return 0;
    } catch (error) {
        console.error(`Error fetching price for ${tokenAddress}:`, error);
        return 0;
    }
}

export async function monitorTokenPrices(tokens: string[]) {
    setInterval(async () => {
        for (const token of tokens) {
            try {
                const price = await getTokenPrice(token);
                console.log(`Price check for ${token}:`, price > 0 ? `$${price}` : 'No price available');
            } catch (error) {
                console.error(`Error monitoring ${token}:`, error);
            }
        }
    }, 30000); // Every 30 seconds
}
