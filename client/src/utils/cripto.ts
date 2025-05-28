import CryptoJS from 'crypto-js';

export function gerarChaveAES() {
  const chave = CryptoJS.lib.WordArray.random(16);
  const iv = CryptoJS.lib.WordArray.random(16);
  return { chave, iv };
}

export function criptografarAES(texto: string, chave: any, iv: any) {
  const encrypted = CryptoJS.AES.encrypt(texto, chave, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
}

export function descriptografarAES({
  content,
  chave,
  iv,
}: {
  content: string;
  chave: string;
  iv: string;
}) {
  const key = CryptoJS.enc.Hex.parse(chave);
  const ivBytes = CryptoJS.enc.Hex.parse(iv);
  const encrypted = CryptoJS.enc.Hex.parse(content);
  const ciphertext = CryptoJS.lib.CipherParams.create({ ciphertext: encrypted });

  const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
    iv: ivBytes,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}
