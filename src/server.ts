import fastfy from "fastify";

const app = fastfy();

app.get("/hello", () => {
    return { greeting: "Hello, World!" };
});

app.listen({ port: 3000 }).then(() => {
    console.log("Server is running on http://localhost:3000");
});
