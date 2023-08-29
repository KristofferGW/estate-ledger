const express = require('express');
const bodyParser = require('body-parser');
const controller = require('./controller');
const Block = require('./block');
const network = require('./network');


const app = express();
const port = 3000;

app.use(bodyParser.json());

// const estateLedger = new Blockchain();

app.get('/blocks', controller.getBlocks);
app.post('/mine', controller.mineBlock);
app.post('/addProperty', controller.addProperty);
app.post('/receiveBlock', controller.receiveBlock);
app.post('/sendProperty', controller.sendProperty);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});