import fastfy from "fastify";
import crypto from "node:crypto";

import { db } from "./database";

const app = fastfy();

app.get("/hello", async () => {
    const transaction = await db("transactions")
        .where("amount", "<", 10000)
        .select("*")
        .returning("*");

    return transaction;
});

app.listen({ port: 3000 }).then(() => {
    console.log("Server is running on http://localhost:3000");
});
