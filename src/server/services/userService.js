var UserService = function () {
    this.dbConnection = null;

    this.setDbConnection = function (dbConnection) {
        this.dbConnection = dbConnection;
    }

    this.getUser = function (userName, password) {
        return this.dbConnection.getModel(this.dbConnection.MODEL_USER).findOne({
            'where': {
                'username': userName,
                'password': password
            }
        }).then((userData) => {
            if (!userData) {
                return null;
            }
            return {
                ...userData.dataValues
            }
        })
    }

    this.getUserById = function (userId) {
        return this.dbConnection.getModel(this.dbConnection.MODEL_USER).findById(userId)
            .then((userData) => {
                if (!userData) {
                    return null;
                }
                return {
                    ...userData.dataValues
                }
            })
    }
}

module.exports = new UserService();