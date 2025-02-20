import { Connection, PublicKey } from "@solana/web3.js";
import dotenv from "dotenv";

dotenv.config();

const WALLET_ADDRESS = process.env.WALLET_ADDRESS!;
const SOLANA_RPC = process.env.SOLANA_RPC_URL!;

const connection = new Connection(SOLANA_RPC);

export async function fetchWalletTokens() {
    try {
        const walletPublicKey = new PublicKey(WALLET_ADDRESS);
        const tokens = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
            programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        });
        console.log(tokens);

        return tokens.value.map(item => ({
            address: item.account.data.parsed.info.mint,
            amount: item.account.data.parsed.info.tokenAmount.uiAmount
        }));
    } catch (error) {
        console.error("Error fetching wallet tokens:", error instanceof Error ? error.message : 'Unknown error');
        return [];
    }
}

export async function monitorWallet() {
    let previousTokens: string[] = [];

    setInterval(async () => {
        try {
            const tokens = await fetchWalletTokens();
            console.log(tokens);
            if (Array.isArray(tokens)) {
                const tokenAddresses = tokens.map(token => token.address);
                if (JSON.stringify(previousTokens) !== JSON.stringify(tokenAddresses)) {
                    console.log("New token detected:", tokenAddresses);
                    previousTokens = tokenAddresses;
                }
            }
        } catch (error) {
            console.error("Error monitoring wallet:", error instanceof Error ? error.message : 'Unknown error');
        }
    }, 30000);
}
