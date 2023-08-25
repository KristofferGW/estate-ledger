const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const Block = require('./block');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const estateLedger = new Blockchain();

app.get('/blocks', (req, res) => {
    res.json(estateLedger.chain);
});

app.post('./mine', (req, res) => {
    const data = req.body.data;
    const newBlock = new Block(estateLedger.getLatestBlock().index + 1, new Date(), data);
    estateLedger.mineBlock(newBlock);
    res.json(newBlock);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});