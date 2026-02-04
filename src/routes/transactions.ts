import type { FastifyInstance } from "fastify";
import crypto from "node:crypto";
import { z } from "zod";
import { db } from "../database";

import { checkSessionIdExists } from "../middlewares/checkSessionIdExists";

export async function transactionRoutes(app: FastifyInstance) {
    app.get(
        "/",
        { preHandler: [checkSessionIdExists] },
        async (request, reply) => {
            const sessionId = request.cookies.sessionId as string;

            const transactions = await db("transactions")
                .where("session_id", sessionId)
                .select()
                .returning("*");

            return reply.status(200).send({ transactions });
        },
    );

    app.get(
        "/:id",
        { preHandler: [checkSessionIdExists] },
        async (request, reply) => {
            const getTransactionParamsSchema = z.object({
                id: z.uuid(),
            });

            const { id } = getTransactionParamsSchema.parse(request.params);

            const { sessionId } = request.cookies;

            const transaction = await db("transactions")
                .where("id", id)
                .andWhere("session_id", sessionId)
                .first();

            return reply.status(200).send({ transaction });
        },
    );

    app.post("/", async (request, reply) => {
        const createdTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(["credit", "debit"]),
        });

        const { title, amount, type } = createdTransactionBodySchema.parse(
            request.body,
        );

        let sessionId = request.cookies.sessionId;

        if (!sessionId) {
            sessionId = crypto.randomUUID();

            reply.cookie("sessionId", sessionId, {
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 7 dias
            });
        }

        await db("transactions").insert({
            id: crypto.randomUUID(),
            title,
            amount: type === "credit" ? amount : amount * -1,
            session_id: sessionId,
        });

        return reply.status(201).send();
    });

    app.get(
        "/summary",
        { preHandler: [checkSessionIdExists] },
        async (request, reply) => {
            const { sessionId } = request.cookies;

            const summary = await db("transactions")
                .where("session_id", sessionId)
                .sum("amount", { as: "amount" })
                .first();

            return reply.status(200).send({ summary });
        },
    );
}
