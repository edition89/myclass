const database = require('../database')

module.exports.Lesson_students = database.sequelize.define('lesson_students', {
    lesson_id: {
        type: database.DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: './lessons',
            key: 'lesson_students_lesson_id_fkey',
            deferrable: database.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    student_id: {
        type: database.DataTypes.INTEGER,
        references: {
            model: './students',
            key: 'lesson_students_student_id_fkey',
            deferrable: database.Deferrable.INITIALLY_IMMEDIATE

        },
    },
    visit: {
        type: database.DataTypes.BOOLEAN,
        defaultValue: 'false',
    }
},
{
    timestamps: false
});