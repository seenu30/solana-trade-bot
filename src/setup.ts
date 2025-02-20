import { createTestToken } from "./tradeExecutor";

async function setup() {
    console.log("Creating test token...");
    const tokenAddress = await createTestToken();
    if (tokenAddress) {
        console.log("Test token created successfully!");
        console.log("Token address:", tokenAddress);
        console.log("Add this token address to your database for monitoring.");
    }
}

setup(); 