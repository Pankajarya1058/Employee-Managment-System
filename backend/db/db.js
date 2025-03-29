
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
console.log(DB_HOST)
console.log(DB_USER)
const initializeDatabase = async () => {
    try {
        // Create a temporary connection (without specifying DB_NAME)
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD
        });

        // Create the database if it doesn’t exist
        await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
        console.log(`✅ Database "${DB_NAME}" is ready`);

        await connection.end(); // Close the temporary connection
    } catch (error) {
        console.error('❌ Error initializing the database:', error);
    }
};

// Call database initialization before creating the pool
await initializeDatabase();

// Now create the connection pool with the database specified
const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME, 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
