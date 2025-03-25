// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';
// dotenv.config();

// const connectToDatabase = async () => {
//     try {
//         // Connect without specifying a database first, just to create it
//         const connection = await mysql.createConnection({
//             host: process.env.DB_HOST,
//             user: process.env.DB_USER,
//             password: process.env.DB_PASSWORD
//         });

//         // Create the database if it doesn't exist
//         await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
//         console.log(`Database "${process.env.DB_NAME}" is ready`);

//         // Now connect to the actual database
//         const dbConnection = await mysql.createConnection({
//             host: process.env.DB_HOST,
//             user: process.env.DB_USER,
//             password: process.env.DB_PASSWORD,
//             database: process.env.DB_NAME
//         });

//         console.log('Connected to MySQL database');
//         return dbConnection;
//     } catch (error) {
//         console.error('Error connecting to the database:', error);
//     }
// };

// export default connectToDatabase;

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Limit the number of connections
    queueLimit: 0
});

const initializeDatabase = async () => {
    try {
        const connection = await pool.getConnection();

        // Create the database if it doesn't exist
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`Database "${process.env.DB_NAME}" is ready`);

        connection.release(); // Always release the connection back to the pool
    } catch (error) {
        console.error('Error initializing the database:', error);
    }
};

await initializeDatabase();
export default pool;


