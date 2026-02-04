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

    test("if an user can get a specific transaction", async () => {
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

        const transactionId = listTransactionsResponse.body.transactions[0].id;

        const getTransactionResponse = await request(app.server)
            .get(`/transactions/${transactionId}`)
            .set("Cookie", cookie)
            .expect(200);

        expect(getTransactionResponse.body.transaction).toEqual(
            expect.objectContaining({ title: "New transaction", amount: 5000 }),
        );
    });

    test("if an user can get the summary", async () => {
        const createTransactionResponse = await request(app.server)
            .post("/transactions")
            .send({
                title: "Credit transaction",
                amount: 5000,
                type: "credit",
            });

        const cookie = createTransactionResponse.get("Set-Cookie");

        if (!cookie) {
            throw new Error("No Set-Cookie header found");
        }

        await request(app.server)
            .post("/transactions")
            .set("Cookie", cookie)
            .send({
                title: "Debit transaction",
                amount: 2000,
                type: "debit",
            });

        const summaryResponse = await request(app.server)
            .get("/transactions/summary")
            .set("Cookie", cookie)
            .expect(200);

        expect(summaryResponse.body.summary).toEqual({
            amount: 3000,
        });
    });
});
