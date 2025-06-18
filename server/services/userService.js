const bcrypt = require('bcrypt');
const { pool } = require('../config/db');

async function addUsers({ FIO, email, phone_number, login, pass }) {
    const hashedPassword = await bcrypt.hash(pass, 12);
    const [result] = await pool.query(
        'INSERT INTO users (FIO, email, phone_number, login, pass) VALUES (?, ?, ?, ?, ?)',
        [FIO, email, phone_number, login, hashedPassword]
    );
    return { id: result.insertId, FIO, email, phone_number, login };
};

async function checkIfExist(login) {
    const [rows] = await pool.query(
       `SELECT id, FIO, phone_number, email, login, pass, role
        FROM users
        WHERE login = ?`,
        [login]
    );
    return rows[0] || null;
};

module.exports =  { addUsers, checkIfExist }