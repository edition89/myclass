const database = require('../database')

module.exports.Students = database.sequelize.define('students', {
    id: {
        type: database.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    title: database.DataTypes.STRING(10),
});