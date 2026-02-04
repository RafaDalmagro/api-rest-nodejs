import type { FastifyInstance } from "fastify";
import crypto from "node:crypto";
import { z } from "zod";
import { db } from "../database";

export async function transactionRoutes(app: FastifyInstance) {
    app.get("/", async (request, reply) => {
        const transactions = await db("transactions").select().returning("*");

        return reply.status(200).send({ transactions });
    });

    app.get("/:id", async (request, reply) => {
        const getTransactionParamsSchema = z.object({
            id: z.uuid(),
        });

        const { id } = getTransactionParamsSchema.parse(request.params);

        const transaction = await db("transactions")
            .where({ id })
            .select()
            .first()
            .returning("*");

        return reply.status(200).send({ transaction });
    });

    app.post("/", async (request, reply) => {
        const createdTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(["credit", "debit"]),
        });

        const { title, amount, type } = createdTransactionBodySchema.parse(
            request.body,
        );

        await db("transactions").insert({
            id: crypto.randomUUID(),
            title,
            amount: type === "credit" ? amount : amount * -1,
        });

        return reply.status(201).send();
    });

    app.get("/summary", async (request, reply) => {
        const summary = await db("transactions")
            .sum("amount", { as: "amount" })
            .first()
            .returning("*");

        return reply.status(200).send({ summary });
    });
}
