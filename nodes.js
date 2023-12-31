const express = require('express');
const bodyParser = require('body-parser');
const controller = require('./controller');

const app = express();
const port = process.argv[2] || 3000;

app.set('port', port);

app.use(bodyParser.json());

app.get('/blocks', controller.getBlocks);

app.post('/mine', (req, res) => {
    const currentNodePort = req.app.get('port');
    controller.mineBlock(req, res, currentNodePort);
})

app.post('/addProperty', controller.addProperty);

app.post('/receiveChain', (req, res) => {
    const chain = req.body.chain;
    controller.receiveChain(req, res, chain);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});