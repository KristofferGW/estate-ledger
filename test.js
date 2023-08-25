const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const Block = require('./block');
const network = require('./network');
const controller = require('./controller');

const app = express();
const port = process.argv[2];

app.use(bodyParser.json());

const estateLedger = new Blockchain();

app.get('/blocks', controller.getBlocks);
app.post('/mine', controller.mineBlock);
app.post('/addProperty', controller.addProperty);
app.post('/receiveBlock', controller.receiveBlock);

app.listen(port, () => {
    console.log(`Node is running on port ${port}`);
});

if (port === 3000) {
    const block1 = new Block(1, Date.now(), {sender: 'Taba', receiver: 'Krippa', propertyId: 'La Torre'}, estateLedger.getLatestBlock().hash);
    const block2 = new Block(1, Date.now(), {sender: 'Krippa', receiver: 'Taba', propertyId: 'La Torre'}, estateLedger.getLatestBlock().hash);

    const nodeUrl1 = 'http://localhost:3001';
    network.sendBlockUpdate(nodeUrl1, block1)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.error(error);
        });

    const nodeUrl2 = 'http://localhost:3001';
    network.sendBlockUpdate(nodeUrl2, block2)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.error(error);
        });
}

