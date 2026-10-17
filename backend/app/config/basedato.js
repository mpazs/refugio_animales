import pkg from 'pg';
const { Pool } = pkg; 

import dotenv from 'dotenv';
dotenv.config;

const pool = new Pool({
    host: process.env.BD_HOST,
    user : process.env.BD_USER,
    password : process.env.BD_PASSWORD,
    database : process.env.BD_NAME,
    port : process.env.BD_PORT,
});

pool.on('connect' , () => {
    console.log ('base de datos conectada correctamente');
});

export { pool};