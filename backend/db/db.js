// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';
// dotenv.config();

// // Create a connection pool
// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     waitForConnections: true,
//     connectionLimit: 10, // Limit the number of connections
//     queueLimit: 0
// });

// const initializeDatabase = async () => {
//     try {
//         const connection = await pool.getConnection();

//         // Create the database if it doesn't exist
//         await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
//         console.log(`Database "${process.env.DB_NAME}" is ready`);

//         connection.release(); // Always release the connection back to the pool
//     } catch (error) {
//         console.error('Error initializing the database:', error);
//     }
// };

// await initializeDatabase();
// export default pool;

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

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
    database: DB_NAME, // Now the DB is guaranteed to exist
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;


