const Sequelize = require('sequelize');

var connection = (function () {
    const sequelize = new Sequelize('mysql://root:qazwsx@localhost:3306/jorj_training');
    sequelize.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });

    const MODEL_USER = 'users';
    const MODEL_AUTH = 'tokens';

    const modelList = {};

    function getUserModel() {
        if(!modelList[MODEL_USER]) {
            modelList[MODEL_USER] = sequelize.define('users',
            {
                'id': { 'primaryKey': true, 'type': Sequelize.INTEGER, 'autoIncrement': true, 'unique': true },
                'username': { 'type': Sequelize.STRING(256), allowNull: false },
                'email': { 'type': Sequelize.STRING(256), allowNull: false },
                'description': { 'type': Sequelize.STRING(500), allowNull: true },
                'password': { 'type': Sequelize.STRING(256), allowNull: false },
                'avatarUrl': { 'type': Sequelize.STRING(500), allowNull: true },
                'age': { 'type': Sequelize.INTEGER, allowNull: true },
                'currentProject': { 'type': Sequelize.STRING(500), allowNull: true },
                'agency': { 'type': Sequelize.ENUM('Brasov', 'Iasi', 'Cluj', 'Bucharest', 'Chisinau'), allowNull: true }
            }, {
                // don't add the timestamp attributes (updatedAt, createdAt)
                timestamps: false,
                // don't delete database entries but set the newly added attribute deletedAt to the current date (when deletion was done). paranoid will only work if timestamps are enabled
                paranoid: false,
                // don't use camelcase for automatically added attributes but underscore style so updatedAt will be updated_at
                underscored: false,
                // disable the modification of table names; By default, sequelize will automatically transform all passed model names (first parameter of define) into plural. if you don't want that, set the following
                freezeTableName: true,
                // define the table's name
                tableName: 'users',
                // Enable optimistic locking.  When enabled, sequelize will add a version count attribute to the model and throw an OptimisticLockingError error when stale instances are saved. Set to true or a string with the attribute name you want to use to enable.
                version: false
            });
        }
        return modelList[MODEL_USER];
    }
    function getAuthModel() {
        if(!modelList[MODEL_AUTH]) {
            modelList[MODEL_AUTH] = sequelize.define('tokens',
            {
                'id': { 'primaryKey': true, 'type': Sequelize.INTEGER, 'autoIncrement': true, 'unique': true },
                'token': { 'type': Sequelize.STRING(50), 'unique': true },
                'userId': {
                    'type': Sequelize.INTEGER,
                    'allowNull': false,
                    'references': {
                        model: getUserModel(),
                        'key': 'id'
                    }
                },
            }, {
                timestamps: true,
                updatedAt: 'changedAt',
                // don't delete database entries but set the newly added attribute deletedAt to the current date (when deletion was done). paranoid will only work if timestamps are enabled
                paranoid: false,
                // don't use camelcase for automatically added attributes but underscore style so updatedAt will be updated_at
                underscored: false,
                // disable the modification of table names; By default, sequelize will automatically transform all passed model names (first parameter of define) into plural. if you don't want that, set the following
                freezeTableName: true,
                // define the table's name
                tableName: 'tokens',
                // Enable optimistic locking.  When enabled, sequelize will add a version count attribute to the model and throw an OptimisticLockingError error when stale instances are saved. Set to true or a string with the attribute name you want to use to enable.
                version: false
            });
        }
        return modelList[MODEL_AUTH];
    }

    return {
        MODEL_USER,
        MODEL_AUTH,

        getModel: function (modelType) {
            switch (modelType) {
                case MODEL_USER: {
                    return getUserModel();
                }
                case MODEL_AUTH: {
                    return getAuthModel();
                }
                default: {
                    return null;
                }
            }
        }
    }
})();

module.exports = connection;