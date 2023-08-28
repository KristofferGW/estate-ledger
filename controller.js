const Blockchain = require('./blockchain')
const Block = require('./block');
const propertyOwnership = require('./ownership');

const estateLedger = new Blockchain();
const pendingList = [];

function getBlocks(req, res) {
    res.json(estateLedger.chain);
}

function mineBlock(req, res) {
    const data = req.body.data;
    const newBlock = new Block(estateLedger.getLatestBlock().index + 1, new Date(), transactions);
    estateLedger.mineBlock(newBlock);
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