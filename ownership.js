const propertyOwnership = {
    'user1': ['property1', 'property2'],
    'user2': ['property3'],
};

function removeFromOwnership(user, property) {
    if (propertyOwnership[user]) {
        const index = propertyOwnership[user].indexOf(property);
        if (index !== -1) {
            propertyOwnership[user].splice(index, 1);
        }
    }
}

function addToOwnership(user, property) {
    if (!propertyOwnership[user]) {
        propertyOwnership[user].push(property);
    } else {
        console.log('Already owner of property');
    }
    
}

module.exports = {
    removeFromOwnership,
    addToOwnership,
}