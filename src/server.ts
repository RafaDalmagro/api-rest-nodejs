import fastfy from "fastify";
import { db } from "./database";

const app = fastfy();

app.get("/hello", async () => {
    const test = await db("sqlite_schema").select("*").first();

    return test;
});

app.listen({ port: 3000 }).then(() => {
    console.log("Server is running on http://localhost:3000");
});
