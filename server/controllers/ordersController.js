const orderService = require('../services/orderService');

async function getAllOrders(req, res){
  const orders = await orderService.selectAllOrders();
  res.json(orders);
}

async function getOrders(req, res) {
  const userId = req.user.id;
  const orders = await orderService.selectOrders(userId);
  res.json(orders);
}

async function newOrder(req, res) {
  const userId = req.user.id;
  const { service_id, custom_service, order_date, order_time, adress, phone_number, status } = req.body;
  const order = await orderService.getNewOrder({
    user_id: userId,
    service_id,
    custom_service, 
    order_date, 
    order_time, 
    adress, 
    phone_number, 
    status
  });
  res.status(201).json({
    id: order.id,
    service_id: order.service_id,
    custom_service: order.custom_service,
    order_date: order.order_date,
    order_time: order.order_time,
    adress: order.adress,
    phone_number: order.phone_number, 
    status: order.status
  });
}

async function updateOrder(req, res) {
  const { id, status, reason } = req.body;
  const updated = await orderService.updateOrder({ id, status, reason });
  res.json(updated);
}

module.exports = { getOrders, newOrder, updateOrder, getAllOrders };