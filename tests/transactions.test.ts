import { afterAll, beforeAll, test } from "vitest";
import { app } from "../src/app";
import request from "supertest";
import { describe } from "vitest";

describe("Transactions routes", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    test("if an user can create a new transaction", async () => {
        await request(app.server)
            .post("/transactions")
            .send({
                title: "New transaction",
                amount: 5000,
                type: "credit",
            })
            .expect(201);
    });
});
