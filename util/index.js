'use strict'
const bcrypt = require('bcrypt');


async function gerarHashSenha(senha) {
    const saltRounds = 10; // Define o número de rounds de salt
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(senha, salt);
}

async function verificarSenha(senha, senhaHash) {
    return await bcrypt.compare(senha, senhaHash);
}
module.exports = { gerarHashSenha, verificarSenha }