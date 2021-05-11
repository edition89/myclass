const database = require('../database')

module.exports.Lesson_teachers = database.sequelize.define('lesson_teachers', {
    lesson_id: {
        type: database.DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: './lessons',
            key: 'lesson_teachers_lesson_id_fkey',
            deferrable: database.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    teacher_id: {
        type: database.DataTypes.INTEGER,
        references: {
            model: './teachers',
            key: 'lesson_teachers_teacher_id_fkey',
            deferrable: database.Deferrable.INITIALLY_IMMEDIATE

        },
    }
},
    {
        timestamps: false
    });