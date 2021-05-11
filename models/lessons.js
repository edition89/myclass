const database = require('../database')

module.exports.Lessons = database.sequelize.define('lessons', {
    id: {
        type: database.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    date: {
        type: database.DataTypes.DATE,
        allowNull: false,
    },
    title: database.DataTypes.STRING(100),
    status: {
        type: database.DataTypes.INTEGER,
        defaultValue: 0,
    }
},
    {
        timestamps: false
    });