import express from "express";
import { db, userSettings } from "./db";
import { eq } from "drizzle-orm";

const app = express();
app.use(express.json());

app.post("/set-tp", async (req, res) => {
    const { wallet_address, max_trade_amount, min_trade_amount, auto_sell } = req.body;
    
    await db.delete(userSettings)
        .where(eq(userSettings.wallet_address, wallet_address));
    
    await db.insert(userSettings).values({ 
        wallet_address, 
        max_trade_amount, 
        min_trade_amount,
        auto_sell // Save auto sell setting
    });
    res.json({ message: "Settings Updated Successfully!" });
});

app.get("/settings", async (req, res) => {
    const settings = await db.select().from(userSettings);
    res.json(settings);
});

app.delete("/settings", async (req, res) => {
    await db.delete(userSettings);
    res.json({ message: "All settings deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
