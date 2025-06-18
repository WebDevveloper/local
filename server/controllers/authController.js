const jwt = require('jsonwebtoken');
const userService = require('../services/userService')

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

async function registration(req, res, next) {
    const { FIO, email, phone_number, login, pass } = req.body;
    if (!FIO || !email || !phone_number || !login || !pass){
        const err = new Error('Все поля должны быть заполнены');
        err.status = 400;
        throw err;
    };

    const existing = await userService.checkIfExist(login);
    if(existing){
        const err = new Error('Такой пользователь уже зарегистрирован');
        err.status = 409;
        throw err;
    }

    const user = await userService.addUsers({ FIO, email, phone_number, login, pass });
    res.status(201).json({ id: user.id, FIO: user.FIO, email: user.email, phone_number: user.phone_number, 
                            login: user.login, pass: user.pass});
}

async function login(req, res, next) {
    const { login, pass } = req.body;
    if (!login || !pass){
        const err = new Error('Все поля должны быть заполнены');
        err.status = 400;
        throw err;
    };

    const user = await userService.checkIfExist(login);
    if(!user){
        const err = new Error('Пользователя не существует');
        err.status = 409;
        throw err;
    }

    const payload = { id: user.id, FIO: user.FIO, phone_number: user.phone_number, email: user.email, 
                            login: user.login, pass: user.pass, role: user.role
                    };
    const accessToken = jwt.sign(payload, ACCESS_SECRET, {expiresIn: '60m'});
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, {expiresIn: '7d'});
    res.json({accessToken, refreshToken})
}

module.exports = { registration, login }