import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Jupiter } from "@jup-ag/core";
import dotenv from "dotenv";
import bs58 from "bs58";
import JSBI from "jsbi";  // ✅ Import JSBI

dotenv.config();

const SOLANA_RPC = process.env.SOLANA_RPC_URL!;
const connection = new Connection(SOLANA_RPC);
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const wallet = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));

// Helper function to create a test token
export async function createTestToken() {
    try {
        const token = await Token.createMint(
            connection,
            wallet,
            wallet.publicKey,
            wallet.publicKey,
            9,
            TOKEN_PROGRAM_ID
        );

        const tokenAccount = await token.createAccount(wallet.publicKey);
        await token.mintTo(tokenAccount, wallet, [], 1000_000_000_000);

        console.log("Minted 1000 tokens to:", tokenAccount.toBase58());
        return token.publicKey.toBase58();
    } catch (error) {
        console.error("Error creating test token:", error);
        return null;
    }
}

// ✅ Fixed amount conversion using JSBI
export async function sellToken(tokenAddress: string, amount: number) {
    try {
        const jupiter = await Jupiter.load({
            connection,
            cluster: 'mainnet-beta',
            user: wallet
        });

        const routes = await jupiter.computeRoutes({
            inputMint: new PublicKey(tokenAddress),
            outputMint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), // USDC
            amount: JSBI.BigInt(amount * 10 ** 6),
            slippageBps: 50
        });

        if (!routes.routesInfos?.length) {
            console.error('No route found for token:', tokenAddress);
            return false;
        }

        const { execute } = await jupiter.exchange({
            routeInfo: routes.routesInfos[0]
        });

        const result = await execute();
        console.log('Trade executed:', result);
        return true;
    } catch (error) {
        console.error("Sell Order Failed:", error instanceof Error ? error.message : 'Unknown error');
        return false;
    }
}
