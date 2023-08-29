const Block = require('./block');
const {removeFromOwnership, addToOwnership} = require('./ownership');
let pendingList = [];

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

    // addBlock(newBlock, transactions) {
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     newBlock.transactions = transactions;
    //     newBlock.hash = newBlock.calculateHash();
    //     this.chain.push(newBlock);
    // }

    mineBlock(newBlock) {
        while (newBlock.hash.substring(0, 2) !== '00') {
            newBlock.nonce++;
            newBlock.hash = newBlock.calculateHash();
            console.log(`Mining... Nonce: ${newBlock.nonce}, Hash: ${newBlock.hash}`);
        }

        newBlock.transactions = pendingList;
        pendingList = [];

        console.log(`Block mined: ${newBlock.hash}`);
        this.chain.push(newBlock);

    }
}

module.exports = {Blockchain, pendingList};