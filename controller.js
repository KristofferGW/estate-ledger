let {Blockchain, pendingList} = require('./blockchain');
const Block = require('./block');
const propertyOwnership = require('./ownership');
const axios = require('axios');

let estateLedger = new Blockchain();

function isValidChain(chain) {
    // console.log("chain från isValidChain", chain);
    for (let i = 1; i < chain.length; i++) {
        // const currentBlock = chain[i];
        const currentBlock = chain[i];
        const previousBlock = chain[i - 1];

        // if (currentBlock.hash !== currentBlock.calculateHash()) {
        //     return false;
        // }

        if (currentBlock.previousHash !== previousBlock.hash) {
            return false;
        }
    }

    return true;
}

function receiveChain(req, res) {
    const receivedChain = req.body.chain;
    console.log("receivedChain från funktion", receivedChain);
    const currentChain = estateLedger.getChain();
    console.log("currentChain från funktion", currentChain);

    if (receivedChain && receivedChain.length > currentChain.length && isValidChain(receivedChain)) {
        // estateLedger.replaceChain(receivedChain);
        estateLedger = new Blockchain(receivedChain);
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
        // pendingList: pendingList
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

function sendChainToOtherNodes(chain) {
    const otherNodes = getOtherNodes();

    otherNodes.forEach(node => {
        axios.post(`${node}/receiveChain`, {chain})
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(`Error sending chain to node ${node}: ${error.message}`);
            });
    });
}

function mineBlock(req, res, currentNodePort) {
    // const data = req.body.data;
    // const newBlock = new Block(estateLedger.getLatestBlock().index + 1, new Date(), data);
    const blockchainCopy = estateLedger.getChain();
    // sendChainToOtherNodes(blockchainCopy);
    const latestBlock = estateLedger.getLatestBlock();
    const newBlock = new Block(latestBlock.index +1, new Date(), [], latestBlock.hash);
    estateLedger.mineBlock(newBlock);

    // const currentNodePort = req.app.get('port');
    console.log('Current node port', currentNodePort);

    const otherNodes = getOtherNodes(currentNodePort);

    if (currentNodePort === '3000') {
        otherNodes.push('http://localhost:3001', 'http://localhost:3002');
    } else if (currentNodePort === '3001') {
        otherNodes.push('http://localhost:3000', 'http://localhost:3002');
    } else if (currentNodePort === '3002') {
        otherNodes.push('http://localhost:3000', 'http://localhost:3001');
    }

    console.log('Other nodes', otherNodes);

    setTimeout(() => {
        // console.log('Sending new block', newBlock);

        const promises = otherNodes.map(node => {
            console.log('Node from otherNodes i promises', node);
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
    receiveChain,
    sendProperty,
};