const TxBuilder = require('./lib/transaction_builder')
const API = require('./lib/api')
const Crypto = require('./lib/crypto')
const { uint8ArrayToHex} = require('./lib/utils')
const { randomBytes } = require("crypto")

module.exports = {
    
    /**
     * Create a new TransactionBuilder instance to forge transaction
     * @param {String} type Transaction type ("identity", "keychain", "transfer", "hosting", "code_proposal", "code_approval", "nft")
     */
    newTransactionBuilder: function (type) {
        return new TxBuilder(type)
    },

    /**
     * Send the transaction to a node
     * @param {Object} tx Transaction to send
     * @param {String} endpoint Node endpoint
     */
    sendTransaction: function(tx, endpoint) {
        return API.sendTx(tx, endpoint)
    },

    /**
     * Derive a keypair
     * @param {String} seed TransactionChain seed
     * @param {Integer} index Number of transaction in the chain
     * @param {String} curve  Elliptic curve to use ("ed25519", "P256", "secp256k1")
     */
    deriveKeyPair(seed, index, curve = "P256") {
        const { privateKey, publicKey}  = Crypto.deriveKeyPair(seed, index, curve)
        return {
            privateKey: uint8ArrayToHex(privateKey),
            publicKey: uint8ArrayToHex(publicKey)
        }
    },

    /**
     * Derive an address
     * @param {String} seed TransactionChain seed
     * @param {Integer} index Number of transaction in the chain
     * @param {String} curve  Elliptic curve to use ("ed25519", "P256", "secp256k1")
     * @param {String} hashAlgo  Hash algorithm ("sha256", "sha512", "sha3-256", "sha3-512", "blake2b")
     */
    deriveAddress(seed, index, curve = "P256", hashAlgo = "sha256") {
        const { publicKey } = Crypto.deriveKeyPair(seed, index, curve)
        return uint8ArrayToHex(Crypto.hash(publicKey, hashAlgo))
    },

    /**
     * Encrypt a data for a given public key using ECIES algorithm
     * @param {String | Uint8Array} data Data to encrypt
     * @param {String | Uint8Array} publicKey Public key for the shared secret encryption
     */
    ecEncrypt: function (data, publicKey) {
        const ciphertext = Crypto.ecEncrypt(data, publicKey)
        return uint8ArrayToHex(ciphertext)
    },

    /**
     * Encrypt a data for a given public key using AES algorithm
     * @param {String | Uint8Array} data Data to encrypt
     * @param {String | Uint8Array} key Symmetric key
     */
    aesEncrypt: function (data, key) {
        const ciphertext = Crypto.aesEncrypt(data, key)
        return uint8ArrayToHex(ciphertext)
    },

    /**
     * Retrieve the index of transaction in a specific chain. (aka. the number of transaction on the chain)
     * @param {String} address Transaction address
     * @param {String} endpoint Node endpoint
     */
    getTransactionIndex: function (address, endpoint) {
        return API.getTransactionIndex(address, endpoint)
    },

    /**
     * Generate a random secret key of 32 bytes
     */
    randomSecretKey: function() {
        return new Uint8Array(randomBytes(32))
    },

    /**
     * Retrieve the storage nonce public key to encrypt data towards nodes
     * @param {String} endpoint Node endpoint
     */
    getStorageNoncePublicKey: function (endpoint) {
        return API.getStorageNoncePublicKey(endpoint)
    }
}
