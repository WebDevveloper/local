const router = require('express').Router();
const auth   = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');
const { getOrders, newOrder, updateOrder, getAllOrders } = require('../controllers/ordersController');


router.use(auth);  // все заявки — только для авторизованных
// GET /api/orders/all-orders — только для админа
router.get('/admin-all-orders', requireAdmin, getAllOrders);


router.get('/all-orders', getOrders);
router.post('/new-order', newOrder);
router.post('/update-order', updateOrder);

module.exports = router;