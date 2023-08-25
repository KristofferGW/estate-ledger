const Block = require('./block');
const Blockchain = require('./blockchain');

const estateLedger = new Blockchain();

estateLedger.mineBlock(new Block(1, '02/01/2023', {property: 'Svartgarn 3'}));
estateLedger.mineBlock(new Block(2, '03/01/2023', {property: 'Hägersten 10'}));

console.log(JSON.stringify(estateLedger, null, 2));