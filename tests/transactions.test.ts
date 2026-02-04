import { execSync } from "node:child_process";
import {
    afterAll,
    beforeAll,
    beforeEach,
    expect,
    test,
    describe,
} from "vitest";
import { app } from "../src/app";
import request from "supertest";
import { afterEach } from "node:test";

describe("Transactions routes", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(async () => {
        execSync("npm run knex -- migrate:rollback --all");
        execSync("npm run knex -- migrate:latest");
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

    test("if an user can list all transactions", async () => {
        const createTransactionResponse = await request(app.server)
            .post("/transactions")
            .send({
                title: "New transaction",
                amount: 5000,
                type: "credit",
            });

        const cookie = createTransactionResponse.get("Set-Cookie");

        if (!cookie) {
            throw new Error("No Set-Cookie header found");
        }

        const listTransactionsResponse = await request(app.server)
            .get("/transactions")
            .set("Cookie", cookie)
            .expect(200);

        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({ title: "New transaction", amount: 5000 }),
        ]);
    });
});
