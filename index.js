const express = require('express')
const paginate = require('express-paginate');
const bodyParser = require('body-parser')
const database = require('./database')
const app = express()
const Op = database.Op

app.use(paginate.middleware(10, 50));
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

app.get('/', async function (req, res, next) {
  let students = await ls_t.Lesson_students.findAll({
    attributes: ['lesson_id', 'visit'],
    include: s_t.Students,
    order: [
      ['lesson_id', 'ASC'],
    ]
  });
  let lessons = await l_t.Lessons.findAndCountAll({
    attributes: ['id', 'date', 'title', 'status'],
    order: [
      ['id', 'ASC'],
    ],
    where: {status: 1},
    include:{
      attributes: ['lesson_id'],
      model: lt_t.Lesson_teachers,
      include: {
        model: t_t.Teachers,
      },
      order: [
        ['lesson_id', 'ASC'],
      ],
      required: true,
      right: true
    },
    limit: 5,
    offset: 0,
  });
  let count = lessons.count - 1
  lessons = JSON.parse(JSON.stringify(lessons.rows, null, 2))
  students = JSON.parse(JSON.stringify(students, null, 2))

  for (l of lessons) {
    l.students = []
    l.visitCount = 0
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
  res.render(__dirname + "/views/index.ejs", { data: lessons, condition: {}, current: 1, pages: Math.ceil(count / 5)})
})

app.post('/', urlencodedParser, async function (req, res, next) {
  if (!req.body) return res.sendStatus(400)
  let condition = JSON.parse(JSON.stringify(req.body))
  if (condition.status == undefined) condition.status = 0
  let where_data = { status: +condition.status }
  let where_id_teacher = { id: { [Op.ne]: null } }
  if(condition.dt_from != '' && condition.dt_to != '') where_data.date = { [Op.and]: [{ [Op.gte]: condition.dt_from }, { [Op.lte]: condition.dt_to }] }
  else if(condition.dt_from != '') where_data.date = {[Op.gt]: condition.dt_from}
  else if(condition.dt_to != '') where_data.date = {[Op.lte]: condition.dt_to}
  if (condition.id_teacher) where_id_teacher = { id: condition.id_teacher }

  let students = await ls_t.Lesson_students.findAll({
    attributes: ['lesson_id', 'visit'],
    include: s_t.Students,
    order: [
      ['lesson_id', 'ASC'],
    ]
  });
  let lessons = await l_t.Lessons.findAndCountAll({
    attributes: ['id', 'date', 'title', 'status'],
    order: [
      ['id', 'ASC'],
    ],
    where: where_data,
    include:{
      attributes: ['lesson_id'],
      model: lt_t.Lesson_teachers,
      include: {
        model: t_t.Teachers,
        where: where_id_teacher,
      },
      duplicating: false,
      order: [
        ['lesson_id', 'ASC'],
      ],
      required: true,
    },
    limit: +condition.page_count,
    offset: (condition.page - 1) * condition.page_count,
  });

  let count = lessons.count - 1
  lessons = JSON.parse(JSON.stringify(lessons.rows, null, 2))
  students = JSON.parse(JSON.stringify(students, null, 2))
  
  console.log(condition)
  console.log(count)
  console.log(lessons.length)
  for (l of lessons) {
    l.students = []
    l.visitCount = 0
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
  if (condition.student_from != '')
    lessons = lessons.filter(lesson => lesson.visitCount >= condition.student_from);
  if (condition.student_to != '')
    lessons = lessons.filter(lesson => lesson.visitCount <= condition.student_to);
  res.render(__dirname + "/views/index.ejs", { data: lessons, condition: {}, current: condition.page, pages: Math.ceil(count / condition.page_count)})
})

app.get('/lessons', async function (req, res) {
  let teachers = await t_t.Teachers.findAll({
    order: [
      ['id', 'ASC'],
    ]
  });
  teachers = JSON.parse(JSON.stringify(teachers, null, 2))
  res.render(__dirname + "/views/lessons.ejs", {teachers: teachers})
})

app.post('/lessons', urlencodedParser, async function (req, res) {
  if (!req.body) return res.sendStatus(400)
  let condition = JSON.parse(JSON.stringify(req.body))
  console.log(condition)
  let teachers = await t_t.Teachers.findAll({
    order: [
      ['id', 'ASC'],
    ]
  });
  teachers = JSON.parse(JSON.stringify(teachers, null, 2))
  res.render(__dirname + "/views/lessons.ejs", {teachers: teachers})
})

app.listen(3000)