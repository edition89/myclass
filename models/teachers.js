const database = require('../database')

module.exports.Teachers = database.sequelize.define('teachers', {
    id: {
        type: database.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    title: database.DataTypes.STRING(10),
});