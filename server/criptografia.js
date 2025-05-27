const crypto = require("crypto");

function gerarChave() {
  return crypto.randomBytes(32);
}

function gerarIV() {
  return crypto.randomBytes(16);
}

// Criptografa texto plano usando AES-256-CBC
function criptografar(texto, chave) {
  const iv = gerarIV();
  const cipher = crypto.createCipheriv("aes-256-cbc", chave, iv);
  const conteudo = Buffer.concat([
    cipher.update(texto, "utf8"),
    cipher.final(),
  ]);
  return {
    iv: iv.toString("hex"),
    chave: chave.toString("hex"),
    conteudo: conteudo.toString("hex"),
  };
}

// Descriptografa uma mensagem criptografada
function descriptografar({ conteudo, chave, iv }) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(chave, "hex"),
    Buffer.from(iv, "hex")
  );
  const decifrado = Buffer.concat([
    decipher.update(Buffer.from(conteudo, "hex")),
    decipher.final(),
  ]);
  return decifrado.toString("utf8");
}

module.exports = {
  gerarChave,
  criptografar,
  descriptografar,
};
