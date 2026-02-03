import fastfy from "fastify";
import { env } from "./env";
import { db } from "./database";

const app = fastfy();

app.get("/hello", async () => {
    const transaction = await db("transactions")
        .where("amount", "<", 10000)
        .select("*")
        .returning("*");

    return transaction;
});

app.listen({ port: Number(env.PORT) }).then(() => {
    console.log("Server is running on http://localhost:3000");
});
