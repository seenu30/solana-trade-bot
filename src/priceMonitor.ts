import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BIRD_API_KEY = process.env.BIRD_API_KEY!;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000;

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<any> {
    while (retries > 0) {
        try {
            const response = await axios.get(url, {
                headers: { "X-API-KEY": BIRD_API_KEY },
                timeout: 10000
            });
            return response.data.data;
        } catch (error) {
            retries--;
            if (retries === 0) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                console.error("API call failed after all retries:", errorMessage);
                return null;
            }
            console.log(`API call failed, retrying in ${RETRY_DELAY/1000} seconds... (${retries} attempts left)`);
            await sleep(RETRY_DELAY);
        }
    }
    return null;
}

export async function getTokenPrice(tokenAddress: string): Promise<number> {
    try {
        const data = await fetchWithRetry(`https://public-api.birdeye.so/defi/price?address=${tokenAddress}`);
        return data?.price || 0;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error fetching price for ${tokenAddress}:`, errorMessage);
        return 0;
    }
}

export async function monitorTokenPrices(tokens: string[]) {
    setInterval(async () => {
        for (const token of tokens) {
            const price = await getTokenPrice(token);
            if (price > 0) {
                console.log(`Price of ${token}: $${price}`);
            }
        }
    }, 30000);  // Increased to 30 seconds
}
