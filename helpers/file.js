const path = require('path');

const { v4: uuidv4 } = require('uuid');

const uploadFile = (files, allowedExtensions, folder='') => {
    return new Promise((resolve, reject) => {
        const { file } = files;

        const nombreCortado = file.name.split('.');
        const extension     = nombreCortado[nombreCortado.length - 1].toLowerCase();

        // Validar la extension...
        if (!allowedExtensions.includes(extension)) {
            return reject(`File extension [${ extension}] no es permitida. Extensiones permitidas: [${ allowedExtensions }]`);
        }

        const temp_file_name = uuidv4() + '.' + extension;
        uploadPath = path.join(__dirname, '../uploads/', folder, temp_file_name);

        file.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(temp_file_name);
        });
    });
}

module.exports = {
    uploadFile
}