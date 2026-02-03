import knex from "knex";

export const config = {
    client: "sqlite3",
    connection: {
        filename: "./db/database.db",
    },
    useNullAsDefault: true,
    migrations: {
        extension: "ts",
        directory: "./db/migrations",
    },
};

export const db = knex(config);
