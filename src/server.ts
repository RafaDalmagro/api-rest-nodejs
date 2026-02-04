import fastfy from "fastify";
import cookie from "@fastify/cookie";

import { env } from "./env";
import { transactionRoutes } from "./routes/transactions";

const app = fastfy();

app.register(cookie);

app.register(transactionRoutes, {
    prefix: "transactions",
});

app.listen({ port: Number(env.PORT) }).then(() => {
    console.log("Server is running on http://localhost:3000");
});
