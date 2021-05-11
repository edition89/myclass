const express = require('express');
const database = require('./database')
const app = express()

/* Models*/
const ls_t = require('./models/lesson_students');
const lt_t = require('./models/lesson_teachers');
const l_t = require('./models/lessons');
const s_t = require('./models/students');
const t_t = require('./models/teachers');

lt_t.Lesson_teachers.belongsTo(l_t.Lessons);
l_t.Lessons.hasMany(lt_t.Lesson_teachers, { foreignKey: 'lesson_id' });
lt_t.Lesson_teachers.belongsTo(t_t.Teachers, { foreignKey: 'teacher_id' });
t_t.Teachers.hasMany(lt_t.Lesson_teachers);

ls_t.Lesson_students.belongsTo(l_t.Lessons);
l_t.Lessons.hasMany(ls_t.Lesson_students, { foreignKey: 'lesson_id' });
ls_t.Lesson_students.belongsTo(s_t.Students, { foreignKey: 'student_id' });
s_t.Students.hasMany(ls_t.Lesson_students);
/* Models*/

(async () => {
  const lessons = await l_t.Lessons.findAll({
    attributes: ['id', 'date', 'title', 'status'],
    include: [{
      attributes: [],
      model: lt_t.Lesson_teachers,
      include: [{
        model: t_t.Teachers,
      }]
    },
    {
      attributes: ['visit'],
      model: ls_t.Lesson_students,
      include: [{
        model: s_t.Students,
      }]
    },
  ]

  });
  console.log("All users:", JSON.stringify(lessons, null, 2));
})();

app.set('view engine', 'ejs')

app.get('/', async function (req, res) {
  var data = [{
    ID: 1,
    date: new Date().toLocaleDateString("ru-RU"),
    title: 'Оранжевый',
    status: 1,
    visitCount: 3,
    students: [{
      id: 1,
      name: 'Ivan',
      visit: true,
    }],
    teachers: [{
      id: 1,
      name: 'Tanya'
    }]
  },
  ]
  res.render(__dirname + "/views/index.ejs", { data: data })
})

app.get('/lessons', function (req, res) {
  res.render(__dirname + "/views/lessons.ejs")
})

app.listen(3000)