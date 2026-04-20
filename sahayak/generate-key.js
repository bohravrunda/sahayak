const forge = require('node-forge');

const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });

const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);
const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);

console.log("PUBLIC KEY:\n", publicKey);
console.log("PRIVATE KEY:\n", privateKey);