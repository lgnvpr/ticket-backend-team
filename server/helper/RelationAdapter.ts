function sequelizeRelations(relations = [], modelInstance, sequelize) {
    return relations.map((relation) => {
        const model = relation.model(sequelize, relation.options);
        switch (relation.type) {
            case 'hasOne': {
                modelInstance.hasOne(model, relation.relationOptions);
                break;
            }
            case 'hasMany': {
                modelInstance.hasMany(model, relation.relationOptions);
                break;
            }
            case 'belongsTo': {
                modelInstance.belongsTo(model, relation.relationOptions);
                model.hasMany(modelInstance);
                break;
            }
            case 'belongsToMany': {
                modelInstance.belongsToMany(model, relation.relationOptions);
                break;
            }
            default: {
                break;
            }
        }
        return model;
    });
}

module.exports = sequelizeRelations;
