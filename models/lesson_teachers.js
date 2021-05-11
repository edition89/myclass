const database = require('../database')

module.exports.Lesson_teachers = database.sequelize.define('lesson_teachers', {
    lesson_id: {
        type: database.DataTypes.INTEGER,
        references: {
            model: 'lessons',
            key: 'id',
            deferrable: database.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    teacher_id: {
        type: database.DataTypes.INTEGER,
        references: {
            model: 'teachers',
            key: 'id',
            deferrable: database.Deferrable.INITIALLY_IMMEDIATE

        },
    },
});