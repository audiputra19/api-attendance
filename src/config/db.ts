import mysql from 'mysql2/promise'

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: 'nimda',
    password: process.env.DB_PASS,
    database: 'payroll_new'
});

connection.getConnection()
.then(() => {
    console.log('Database connected successfully');
})
.catch(err => {
    console.log('Datebase connection failed', err);
});

export default connection;