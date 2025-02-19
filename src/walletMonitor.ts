import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const WALLET_ADDRESS = process.env.WALLET_ADDRESS!;
const BIRD_API_KEY = process.env.BIRD_API_KEY!;

const MAX_RETRIES = 5;  // Increased from 3 to 5
const RETRY_DELAY = 5000;  // Increased from 2000 to 5000 ms

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWalletTokens() {
    let retries = MAX_RETRIES;
    
    while (retries > 0) {
        try {
            const response = await axios.get(
                `https://public-api.birdeye.so/v1/wallet/token_list?wallet=${WALLET_ADDRESS}`,
                {
                    headers: { "X-API-KEY": BIRD_API_KEY },
                    timeout: 10000  // 10 second timeout
                }
            );
            return response.data.items;
        } catch (error) {
            retries--;
            if (retries === 0) {
                console.error("Failed to fetch wallet tokens after all retries");
                return [];
            }
            console.log(error);
            console.log(`API call failed, retrying in ${RETRY_DELAY/1000} seconds... (${retries} attempts left)`);
            await sleep(RETRY_DELAY);
        }
    }
    return [];
}

export async function monitorWallet() {
    let previousTokens: string[] = [];

    setInterval(async () => {
        try {
            const tokens = await fetchWalletTokens();
            if (Array.isArray(tokens)) {
                const tokenAddresses = tokens.map((token: any) => token.address);
                if (JSON.stringify(previousTokens) !== JSON.stringify(tokenAddresses)) {
                    console.log("New token detected:", tokenAddresses);
                    previousTokens = tokenAddresses;
                }
            }
        } catch (error) {
            console.error("Error monitoring wallet:", error instanceof Error ? error.message : 'Unknown error');
        }
    }, 30000);  // Increased interval to 30 seconds
}
