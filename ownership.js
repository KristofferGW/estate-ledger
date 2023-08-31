const propertyOwnership = {};

function findOwner(user) {
    for (const owner in propertyOwnership) {
        if (propertyOwnership[owner].includes(user)) {
            return owner;
        }
    }
    return null;
}

function addToOwnership(user, property) {
    if (!propertyOwnership[user]) {
        propertyOwnership[user] = [property];
    } else {
        if (!propertyOwnership[user].includes(property)) {
            propertyOwnership[user].push(property);
        }
    }
}

module.exports = {
    addToOwnership,
    propertyOwnership,
    findOwner
}
