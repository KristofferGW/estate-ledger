const Block = require('./block');
const {addToOwnership, findOwner} = require('./ownership');

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.pendingList = [];
    }

    createGenesisBlock() {
        return new Block(0, '24/8/2023', 'Genesis Block', null);
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    mineBlock(newBlock) {
        const previousBlock = this.getLatestBlock();

        if (!newBlock.isHashValid(previousBlock)) {
            return;
        }

        while (newBlock.hash.substring(0, 2) !== '00') {
            newBlock.nonce++;
            newBlock.hash = newBlock.calculateHash();
        }
    
        newBlock.transactions = [...this.pendingList];
    
        this.pendingList.forEach(transaction => {
            const { user, property } = transaction;
    
            const owner = findOwner(user);
    
            if (owner) {
                addToOwnership(owner, property);
            } else {
                addToOwnership(user, property);
            }
        });
    
        this.pendingList = [];
        this.chain.push(newBlock);
    }

    isValidChain(chain) {
        for (let i = 1; i < chain.length; i++) {
            const currentBlock = new Block(chain[i]);
            const currentHash = currentBlock.calculateHash();
            const previousBlock = chain[i - 1];

            if (currentBlock.hash !== currentHash) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }

    getChain() {
        return this.chain;
    }
}

module.exports = {Blockchain};