import express from "express";
import { db, userSettings } from "./db";

const app = express();
app.use(express.json());

app.post("/set-tp", async (req, res) => {
    const { wallet_address, max_trade_amount, min_trade_amount } = req.body;
    await db.insert(userSettings).values({ 
        wallet_address, 
        max_trade_amount, 
        min_trade_amount 
    });
    res.json({ message: "Settings Updated Successfully!" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
