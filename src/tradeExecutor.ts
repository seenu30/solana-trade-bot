import { Connection, PublicKey } from "@solana/web3.js";
import { createJupiterApiClient } from "@jup-ag/api";
import dotenv from "dotenv";

dotenv.config();

const SOLANA_RPC = process.env.SOLANA_RPC_URL!;
const connection = new Connection(SOLANA_RPC);

// Initialize Jupiter API client
const jupiterQuoteApi = createJupiterApiClient();

export async function sellToken(tokenAddress: string, amount: number) {
    try {
        const quote = await jupiterQuoteApi.quoteGet({
            inputMint: tokenAddress,
            outputMint: "So11111111111111111111111111111111111111112", // SOL
            amount: amount * 10 ** 6, // Convert to lamports
            slippageBps: 100, // 1% slippage
        });

        if (quote) {
            console.log("Quote received:", quote);
            // Implement swap logic here using quote
        } else {
            console.error("No quote available for trade");
        }
    } catch (error) {
        console.error("Sell Order Failed:", error);
    }
}
