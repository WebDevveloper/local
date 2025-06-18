const router = require('express').Router();
const { getServices, addService, editService, deleteService } = require('../controllers/serviceController');

router.get('/get-service', getServices);
router.post('/add-service', addService);
router.post('/edit-service', editService);
router.post('/dell-service', deleteService);


module.exports = router;
