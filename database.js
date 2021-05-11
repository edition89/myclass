const { Sequelize, Model, DataTypes, Deferrable } = require('sequelize');

const sequelize = new Sequelize('postgres', 'dimon', '1234321', {
    host: '194.87.214.55',
    dialect: 'postgres'
});

module.exports = {
    sequelize: sequelize,
    DataTypes: DataTypes,
    Deferrable: Deferrable,
}