const hasFile = (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).send({
            msg: 'File to upload not found'
        });
    }

    // Esto es necesario porque es un middleware, sirve justamente para poder concatenarlos...
    next();
}

module.exports = {
    hasFile
}
