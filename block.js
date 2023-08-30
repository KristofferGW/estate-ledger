const crypto = require('crypto');
const {getPreviousBlock} = require('./blockchain');

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

    isValid() {
        const calculatedHash = this.calculateHash();
        if (calculatedHash !== this.hash) {
            return false;
        }

        if (this.index > 0) {
            const previousBlock = this.getPreviousBlock();
            if (previousBlock.hash !== this.previousHash) {
                return false;
            }
        }

        return true;
    }
}

module.exports = Block;