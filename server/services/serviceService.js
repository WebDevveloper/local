const { pool } = require('../config/db');

async function selectServices() {
  const [rows] = await pool.query(
    'SELECT id, name FROM services'
  );
  return rows;
}

async function addService({name}) {
  const [result] = await pool.query(
    'INSERT INTO services (name) VALUE (?)',
    [name]
  )
  return { id: result.insertId, name};
}

async function editService({id, name}) {
  await pool.query(
    'UPDATE services SET name = ? WHERE id = ?',
    [name, id]
  )
  return {id, name}
}

async function deleteService({id}) {
  await pool.query(
    'DELETE FROM services WHERE id = ?',
    [id]
  )
}
module.exports = { selectServices, addService, editService, deleteService };
