const database = require('../database')

module.exports.Lesson_students = database.sequelize.define('lesson_students', {
    lesson_id: {
        type: database.DataTypes.INTEGER,
        references: {
            model: 'lessons',
            key: 'id',
            deferrable: database.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    student_id: {
        type: database.DataTypes.INTEGER,
        references: {
            model: 'students',
            key: 'id',
            deferrable: database.Deferrable.INITIALLY_IMMEDIATE

        },
    },
    visit: {
        type: database.DataTypes.BOOLEAN,
        defaultValue: 'false',
    },
});