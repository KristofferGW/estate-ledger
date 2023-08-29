const propertyOwnership = {};

function findOwner(user) {
    for (const owner in propertyOwnership) {
        if (propertyOwnership[owner].includes(user)) {
            return owner;
        }
    }
    return null;
}

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
    propertyOwnership,
    findOwner
}