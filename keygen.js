const crypto = require("node:crypto");

// 1. Gera o par de chaves RSA 2048 bits
const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki", // Formato padrão que gera o header -----BEGIN PUBLIC KEY-----
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8", // Formato padrão que gera o header -----BEGIN PRIVATE KEY-----
    format: "pem",
  },
});

// 2. Converte para Base64 removendo quebras de linha (comportamento seguro para .env)
const privateKeyBase64 = Buffer.from(privateKey).toString("base64");
const publicKeyBase64 = Buffer.from(publicKey).toString("base64");

// 3. Exibe no console prontinho para copiar
console.log("\nCopie as linhas abaixo para o seu arquivo .env:\n");
console.log(`JWT_PRIVATE_KEY="${privateKeyBase64}"`);
console.log(`JWT_PUBLIC_KEY="${publicKeyBase64}"`);
console.log("\n");
