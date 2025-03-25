import connectToDatabase from './db/db.js';
import createUsersTable from './models/User.js';

const createTable = async () => {
    const connection = await connectToDatabase();
    try {
        await connection.execute(createUsersTable);
        console.log('Users table created successfully');
    } catch (error) {
        console.error('Error creating users table:', error);
    } finally {
        connection.end();
    }
};

createTable();
