const database = require('../database')

module.exports.Students = database.sequelize.define('students', {
    id: {
        type: database.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    name: database.DataTypes.STRING(10)
},
    {
        timestamps: false
    });