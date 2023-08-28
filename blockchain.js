const Block = require('./block');
const {removeFromOwnership, addToOwnership} = require('./ownership');

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, '24/8/2023', 'Genesis Block', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    mineBlock(newBlock) {
        while (newBlock.hash.substring(0, 4) !== '0000') {
            newBlock.nonce++;
            newBlock.hash = newBlock.calculateHash();
            console.log(`Mining... Nonce: ${newBlock.nonce}, Hash: ${newBlock.hash}`);
        }

        pendingList.forEach(transaction => {
            const { sender, property } = transaction;

            const owner = findOwner(user);

            if (owner) {
                addToOwnership(owner, property);
            }
        });

        console.log(`Block mined: ${newBlock.hash}`);
        this.chain.push(newBlock);

    }
}

module.exports = Blockchain;