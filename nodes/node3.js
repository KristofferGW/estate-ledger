const express = require('express');
const bodyParser = require('body-parser');
const controller = require('../controller');


const app = express();
const port = 3002;

// const estateLedger = new Blockchain();

app.use(bodyParser.json());

app.get('/blocks', controller.getBlocks);
app.post('/mine', controller.mineBlock);
app.post('/addProperty', controller.addProperty);
app.post('/receiveBlock', controller.receiveBlock);
app.post('/sendProperty', controller.sendProperty);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});