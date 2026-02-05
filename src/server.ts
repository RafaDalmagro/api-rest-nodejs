import { app } from "./app";
import { env } from "./env/index";

app.listen({ port: Number(env.PORT) }).then(() => {
    console.log(`Server is running on ${env.PORT} port`);
});
