const crypto = require('crypto');
const Blockchain = require('./blockchain');

// const estateLedger = new Blockchain();

class Block {
    constructor(index, timestamp, transactions, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(this.index + this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce)
            .digest('hex')
            
    }

    isValid(previousBlock) {
        const calculatedHash = this.calculateHash();
        if (calculatedHash !== this.hash) {
            return false;
        }

        if (this.index > 0 && previousBlock) {
            if (previousBlock.hash !== this.previousHash) {
                return false;
            }
        }

        return true;
    }
}

module.exports = Block;