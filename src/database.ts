import knex from "knex";
import { env } from "./env";

export const config = {
    client: "sqlite3",
    connection: {
        filename: env.DATABASE_URL,
    },
    useNullAsDefault: true,
    migrations: {
        extension: "ts",
        directory: "./db/migrations",
    },
};

export const db = knex(config);
