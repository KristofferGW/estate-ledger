const axios = require('axios');

async function sendBlockUpdate(nodeUrl, newBlock) {
    try {
        const response = await axios.post(`${nodeUrl}/receiveBlock`, {newBlock});
        return response.data;
    } catch (error) {
        throw new Error(`Error sending block update to node at ${nodeUrl}: ${error.message}`);
    }
}

module.exports = {
    sendBlockUpdate,
}