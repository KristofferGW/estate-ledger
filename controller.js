const Blockchain = require('./blockchain')
const Block = require('./block');

const estateLedger = new Blockchain();

function getBlocks(req, res) {
    res.json(estateLedger.chain);
}

function mineBlock(req, res) {
    const data = req.body.data;
    const newBlock = new Block(estateLedger.getLatestBlock().index + 1, new Date(), data);
    estateLedger.mineBlock(newBlock);
    res.json(newBlock);
}

function receiveBlock(req, res) {
    const newBlock = req.body.newBlock;
    estateLedger.addBlock(newBlock);
    res.json({message: 'Block received and added to the chain.'});
}

function addProperty(req, res) {
    const data = req.body.data;
    const newBlock = new Block(estateLedger.getLatestBlock().index + 1, new Date(), data);
    estateLedger.mineBlock(newBlock);
    res.json(newBlock);
}

module.exports = {
    getBlocks,
    mineBlock,
    addProperty,
    receiveBlock,
};