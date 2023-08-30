const Block = require('./block');
const {removeFromOwnership, addToOwnership, findOwner, propertyOwnership} = require('./ownership');

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

    // mineBlock(newBlock) {
    //     while (newBlock.hash.substring(0, 2) !== '00') {
    //         newBlock.nonce++;
    //         newBlock.hash = newBlock.calculateHash();
    //         console.log(`Mining... Nonce: ${newBlock.nonce}, Hash: ${newBlock.hash}`);
    //     }

    //     newBlock.transactions = pendingList;
    //     pendingList = [];

    //     console.log(`Block mined: ${newBlock.hash}`);
    //     this.chain.push(newBlock);

    // }

    mineBlock(newBlock) {
        const previousBlock = this.getLatestBlock();

        if (!newBlock.isHashValid(previousBlock)) {
            console.log('Block not valid');
            return;
        }

        while (newBlock.hash.substring(0, 2) !== '00') {
            newBlock.nonce++;
            newBlock.hash = newBlock.calculateHash();
            console.log('Mining... Nonce: ${newBlock.nonce}, Hash: ${newBlock.hash}');
        }
    
        newBlock.transactions = [...this.pendingList];
    
        this.pendingList.forEach(transaction => {
            const { user, property } = transaction;
    
            const owner = findOwner(user);
    
            if (owner) {
                addToOwnership(owner, property);
            } else {
                addToOwnership(user, property); // Lägg till fastigheten för användaren
            }
        });
    
        this.pendingList = [];
    
        console.log(`Block mined: ${newBlock.hash}`);
        console.log('property ownership', propertyOwnership);
        this.chain.push(newBlock);
    }
    
}

module.exports = {Blockchain};