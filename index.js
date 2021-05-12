const express = require('express')
const bodyParser = require('body-parser')
const database = require('./database')
const app = express()
const Op = database.Op


var urlencodedParser = bodyParser.urlencoded({ extended: false })

/* Models*/
const ls_t = require('./models/lesson_students')
const lt_t = require('./models/lesson_teachers')
const l_t = require('./models/lessons')
const s_t = require('./models/students')
const t_t = require('./models/teachers')

lt_t.Lesson_teachers.belongsTo(l_t.Lessons)
l_t.Lessons.hasMany(lt_t.Lesson_teachers, { foreignKey: 'lesson_id' })
lt_t.Lesson_teachers.belongsTo(t_t.Teachers, { foreignKey: 'teacher_id' })
t_t.Teachers.hasMany(lt_t.Lesson_teachers)

ls_t.Lesson_students.belongsTo(l_t.Lessons)
l_t.Lessons.hasMany(ls_t.Lesson_students, { foreignKey: 'lesson_id' })
ls_t.Lesson_students.belongsTo(s_t.Students, { foreignKey: 'student_id' })
s_t.Students.hasMany(ls_t.Lesson_students)
/* Models*/

app.set('view engine', 'ejs')

app.get('/', async function (req, res) {
  let teachers = await lt_t.Lesson_teachers.findAll({
    attributes: ['lesson_id'],
    include: t_t.Teachers,
    order: [
      ['lesson_id', 'ASC'],
    ]
  });
  let students = await ls_t.Lesson_students.findAll({
    attributes: ['lesson_id', 'visit'],
    include: s_t.Students,
    order: [
      ['lesson_id', 'ASC'],
    ]
  });
  let lessons = await l_t.Lessons.findAll({
    attributes: ['id', 'date', 'title', 'status'],
    order: [
      ['id', 'ASC'],
    ]
  });

  lessons = JSON.parse(JSON.stringify(lessons, null, 2))
  teachers = JSON.parse(JSON.stringify(teachers, null, 2))
  students = JSON.parse(JSON.stringify(students, null, 2))

  for (l of lessons) {
    l.teachers = []
    l.students = []
    l.visitCount = 0
    for (let t of teachers) {
      if (l['id'] < t['lesson_id']) break
      else if (l['id'] == t['lesson_id']) l.teachers.push(t)
    }
    for (let s of students) {
      if (l['id'] < s['lesson_id']) {
        break
      }
      else if (l['id'] == s['lesson_id']) {
        l.students.push(s)
      }
      if (l['id'] == s['lesson_id'] && s['visit']) l.visitCount++
    }
  }
  res.render(__dirname + "/views/index.ejs", { data: lessons })
})

app.post('/', urlencodedParser, async function (req, res) {
  if (!req.body) return res.sendStatus(400)
  let condition = req.body
  if (condition.dt_from && condition.dt_to) var where_date = { date: { [Op.and]: [{ [Op.gte]: condition.dt_from }, { [Op.lte]: condition.dt_to }] } }
  if (condition.id_teacher) var where_id_teacher = { id: condition.id_teacher }
  if (condition.status) var where_status = {status: condition.status }

  let teachers = await lt_t.Lesson_teachers.findAll({
    attributes: ['lesson_id'],
    include: {
      model: t_t.Teachers,
      where: where_id_teacher
    },
    order: [
      ['lesson_id', 'ASC'],
    ],
  });
  let students = await ls_t.Lesson_students.findAll({
    attributes: ['lesson_id', 'visit'],
    include: s_t.Students,
    order: [
      ['lesson_id', 'ASC'],
    ]
  });
  let lessons = await l_t.Lessons.findAll({
    attributes: ['id', 'date', 'title', 'status'],
    order: [
      ['id', 'ASC'],
    ],
    where: where_date, where_status
  });

  lessons = JSON.parse(JSON.stringify(lessons, null, 2))
  teachers = JSON.parse(JSON.stringify(teachers, null, 2))
  students = JSON.parse(JSON.stringify(students, null, 2))

  for (l of lessons) {
    l.teachers = []
    l.students = []
    l.visitCount = 0
    for (let t of teachers) {
      if (l['id'] < t['lesson_id']) break
      else if (l['id'] == t['lesson_id']) l.teachers.push(t)
    }
    for (let s of students) {
      if (l['id'] < s['lesson_id']) {
        break
      }
      else if (l['id'] == s['lesson_id']) {
        l.students.push(s)
      }
      if (l['id'] == s['lesson_id'] && s['visit']) l.visitCount++
    }
  }
  lessons = lessons.filter(lesson => lesson.visitCount >= condition.student_from && lesson.visitCount <= condition.student_to);
  res.render(__dirname + "/views/index.ejs", { data: lessons })
})

app.get('/lessons', function (req, res) {
  res.render(__dirname + "/views/lessons.ejs")
})

app.listen(3000)