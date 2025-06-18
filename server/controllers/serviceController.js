const servicesService = require('../services/serviceService');

async function getServices(req, res) {
  try {
    const services = await servicesService.selectServices();
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка получения списка услуг' });
  }
}

async function addService(req, res) {
  try{
    const { name } = req.body;
    const book = await servicesService.addService({name});
    res.status(201).json(book);
  } catch(err){
    console.log('Ошибка добавления', err);
  }
}

async function editService(req, res) {
  try{
    const { id, name } = req.body;
    const update = await servicesService.editService({id, name});
    res.status(201).json(update);
  } catch(err){
    console.log('Ошибка изменения', err);
  }
}

async function deleteService(req, res) {
  try{
    const { id } = req.body;
    await servicesService.deleteService({id});
    res.status(201).json({id});
  } catch(err){
    console.log('Ошибка удаления', err);
  }
}

module.exports = { getServices, addService, editService, deleteService };