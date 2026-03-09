import pkg from "pg";

const { Pool } = pkg;

if(!process.env.DATABASE_URL){
    console.log("DB URL not defined");
}

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

