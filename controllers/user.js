const { response, request } = require('express');

const userGet = (req = request, res = response) => {
    const { id, name='<undef>', limit } = req.query;

    res.json({
        msg: "get api - controlador",
        id,
        name,
        limit
    });
}

const userPost = (req, res = response) => {
    const { name, age } = req.body;

    res.json({
        msg: "post api - controlador",
        name,
        age
    });
}

const userPut = (req, res = response) => {
    const id = req.params.id;

    res.json({
        msg: "put api - controlador",
        id
    });
}

const userPatch = (req, res = response) => {
    res.json({
        msg: "patch api - controlador"
    });
}

const userDelete = (req, res = response) => {
    res.json({
        msg: "delete api - controlador"
    });
}

module.exports = {
    userGet,
    userPost,
    userPut,
    userPatch,
    userDelete
}