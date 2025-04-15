const bcrypt = require("bcryptjs");

async function encriptarSenha() {
    const salt = await bcrypt.genSalt(10);
    const senhaEncriptada = await bcrypt.hash("123456", salt);
    console.log("Senha encriptada:", senhaEncriptada);
}

encriptarSenha();
