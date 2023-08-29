const propertyOwnership = [];

function findOwner(user) {
    for (const owner of propertyOwnership) {
        if (owner.name === user) {
            return owner;
        }
    }
    return null;
}

function removeFromOwnership(user, property) {
    let owner = findOwner(user);
    if (owner) {
        const index = owner.properties.indexOf(property);
        if (index !== -1) {
            owner.properties.splice(index, 1);
        }
    }
}

function addToOwnership(user, property) {
    let owner = findOwner(user);
    if (!owner) {
        owner = { name: user, properties: [] };
        propertyOwnership.push(owner);
    }

    owner.properties.push(property);
    console.log('PO', propertyOwnership);
}

module.exports = {
    removeFromOwnership,
    addToOwnership,
    propertyOwnership,
    findOwner
}
