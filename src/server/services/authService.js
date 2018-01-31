const Sequelize = require('sequelize');

const TOKEN_VALIDITY = 45;

var AuthService = function () {
    this.dbConnection = null;

    this.setDbConnection = function (dbConnection) {
        this.dbConnection = dbConnection;
    }

    this.getTokenValidityEnd = function (startOfValidity) {
        let endOfValidity = new Date(startOfValidity.getTime());
        endOfValidity.setMinutes(endOfValidity.getMinutes() - TOKEN_VALIDITY);
        return endOfValidity;
    }

    this.doAuth = function (userData) {
        const endDate = new Date();
        const startDate = this.getTokenValidityEnd(endDate);

        return this.dbConnection.getModel(this.dbConnection.MODEL_AUTH).findOrCreate({
            'where': {
                'userId': userData['id'],
                'changedAt': {
                    [Sequelize.Op.between]: [startDate, endDate]
                }
            },
            'defaults': {
                'token': endDate.getTime(),
                'userId': userData['id']
            }
        }).spread((tokenData, created) => {
            console.log('---- token data');
            console.log(tokenData.dataValues);
            console.log('------------------');
            return {
                ...tokenData.dataValues
            }
        })
    }

    this.doLogout = function (userData, token) {
        console.log(userData);
        console.log(token);
        return this.dbConnection.getModel(this.dbConnection.MODEL_AUTH).destroy({
            'where': {
                'userId': userData['id'],
                'token': token
            }
        }).then((affectedRows) => {
            console.log('---- '+affectedRows)
            return (affectedRows === 1);
        });
    }
}

module.exports = new AuthService();