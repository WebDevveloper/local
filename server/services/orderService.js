const { pool } = require('../config/db');

async function selectAllOrders() {
  const [rows] = await pool.query(
    `SELECT 
       o.id,
       u.FIO       AS fio,
       u.phone_number,
       u.email,
       s.name      AS service,
       o.custom_service,
       o.order_date,
       o.order_time,
       o.status,
       o.reason
     FROM orders o
     JOIN users    u ON o.user_id    = u.id
     JOIN services s ON o.service_id = s.id
     ORDER BY o.id DESC`
  );
  return rows;
}

async function selectOrders(userId) {
  const [rows] = await pool.query(
    `SELECT o.id, s.name AS service, o.adress, o.order_date, o.order_time, o.status, o.reason
     FROM orders o
     JOIN services s ON o.service_id = s.id
     WHERE o.user_id = ?`,
    [userId]
  );
  return rows;
}

async function getNewOrder({ user_id, service_id, custom_service, order_date, order_time, adress, phone_number, status }) {
  const [result] = await pool.query(
    `INSERT INTO orders
       (user_id, service_id, custom_service, order_date, order_time, adress, phone_number, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'новая заявка')`,
    [user_id, service_id, custom_service, order_date, order_time, adress, phone_number, status]
  );
  return {
    id: result.insertId,
    user_id,
    service_id,
    custom_service,
    adress,
    order_date,
    order_time,
    status: 'новая заявка'
  };
}

async function updateOrder({ id, status, reason }) {
  await pool.query(
    `UPDATE orders SET status = ?, reason = ? WHERE id = ?`,
    [status, reason, id]
  );
  return { id, status, reason };
}

module.exports = { selectOrders, getNewOrder, updateOrder, selectAllOrders };
