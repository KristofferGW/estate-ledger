let {Blockchain, pendingList} = require('./blockchain');
const Block = require('./block');
const propertyOwnership = require('./ownership');

let estateLedger = new Blockchain();

function isValidChain(chain) {
    for (let i = 1; i < chain.length; i++) {
        const currentBlock = chain[i];
        const previousBlock = chain[i - 1];

        if (currentBlock.previousHash !== previousBlock.hash) {
            return false;
        }
    }

    return true;
}

function receiveChain(req, res) {
    const receivedChain = req.body.chain;
    const currentChain = estateLedger.getChain();

    if (receivedChain && receivedChain.length > currentChain.length && isValidChain(receivedChain)) {
        estateLedger.chain = receivedChain;
        res.json({message: 'Chain replaced with longer chain'});
    } else {
        res.status(400).json({message: 'Invalid or shorter chain received'});
    }
}

function getBlocks(req, res) {
    const blocksWithTransactions = estateLedger.chain.map(block => ({
        index: block.index,
        timestamp: block.timestamp,
        transactions: block.transactions,
        previousHash: block.previousHash,
        nonce: block.nonce,
        hash: block.hash,
    }));

    res.json(blocksWithTransactions);
}

function getOtherNodes(currentNodePort) {
    const otherNodes = [];

    if (currentNodePort === 3000) {
        otherNodes.push('http://localhost:3001', 'http://localhost:3002');
    } else if (currentNodePort === 3001) {
        otherNodes.push('http://localhost:3000', 'http://localhost:3002');
    } else if (currentNodePort === 3002) {
        otherNodes.push('http://localhost:3000', 'http://localhost:3001');
    }

    return otherNodes;
}


function mineBlock(req, res, currentNodePort) {
    const blockchainCopy = estateLedger.getChain();
    const latestBlock = estateLedger.getLatestBlock();

    if (estateLedger.pendingList.length === 0) {
        return res.status(400).json({message: 'There are no transactions to mine, fren.'});
    }

    const newBlock = new Block(latestBlock.index +1, new Date(), [], latestBlock.hash);
    estateLedger.mineBlock(newBlock);

    const otherNodes = getOtherNodes(currentNodePort);

    if (currentNodePort === '3000') {
        otherNodes.push('http://localhost:3001', 'http://localhost:3002');
    } else if (currentNodePort === '3001') {
        otherNodes.push('http://localhost:3000', 'http://localhost:3002');
    } else if (currentNodePort === '3002') {
        otherNodes.push('http://localhost:3000', 'http://localhost:3001');
    }

    setTimeout(() => {
        const promises = otherNodes.map(node => {
            return fetch(`${node}/receiveChain`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({chain: blockchainCopy}),
            })
                .then(response => response.json())
                .catch(error => {
                    console.log(`Error sending chain to node ${node}: ${error.message}`);
                });
        });

        Promise.all(promises)
            .then(responses => {
                console.log(responses);
                pendingList = [];
                res.json(newBlock);
            })
            .catch(error => {
                console.log('Error', error.message);
                res.status(500).json({error: 'Error sending block to nodes'});
            })
    }, 1000);
    
}

function addProperty(req, res) {
    const property = req.body.property;
    const user = req.body.user;

    const transaction = { user, property };

    estateLedger.pendingList.push(transaction);

    res.json({message: 'Property added to pending list'});
}

module.exports = {
    getBlocks,
    mineBlock,
    addProperty,
    receiveChain,
};