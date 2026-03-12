import app from "./app.js";
import { pool } from "./db/db.js";

const PORT = process.env.PORT||3000;

async function start(){
    try {
        await pool.query("select 1");
        console.log("DB connection successful");

        app.listen(PORT,() => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("DB connection failed");
        console.error(err);
    }
}

start();