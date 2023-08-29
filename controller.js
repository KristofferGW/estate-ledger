let {Blockchain, pendingList} = require('./blockchain')
const Block = require('./block');
const propertyOwnership = require('./ownership');

const estateLedger = new Blockchain();

function getBlocks(req, res) {
    const blocksWithTransactions = estateLedger.chain.map(block => ({
        index: block.index,
        timestamp: block.timestamp,
        transactions: block.transactions,
        previousHash: block.previousHash,
        nonce: block.nonce,
        hash: block.hash,
        pendingList: pendingList
    }));

    res.json(blocksWithTransactions);
}

function mineBlock(req, res) {
    // const data = req.body.data;
    // const newBlock = new Block(estateLedger.getLatestBlock().index + 1, new Date(), data);
    const newBlock = new Block(estateLedger.getLatestBlock().index + 1, new Date(), pendingList);
    estateLedger.mineBlock(newBlock);
    pendingList = [];
    res.json(newBlock);
}

function receiveBlock(req, res) {
    const newBlock = req.body.newBlock;
    estateLedger.addBlock(newBlock);
    res.json({message: 'Block received and added to the chain.'});
}

function addProperty(req, res) {
    const property = req.body.property;
    const user = req.body.user;

    const transaction = { user, property };

    pendingList.push(transaction);

    res.json({message: 'Property added to pending list'});
}

function sendProperty(req, res) {
    const sender = req.body.sender;
    const recipient = req.body.recipient;
    const property = req.body.property;

    if (!isPropertyOwner(sender, property)) {
        return res.status(400).json({error: 'Sender is not the owner of the property'});
    }

    const transaction = {sender, recipient, property};
    pendingList.push(transaction);

    res.json({message: 'Transaction added to pending list.'});
}

function isPropertyOwner(sender, property) {
    if (propertyOwnership[sender] && propertyOwnership[sender].includes(property)) {
        return true;
    }
    return false;
}

module.exports = {
    getBlocks,
    mineBlock,
    addProperty,
    receiveBlock,
    sendProperty,
};