const express = require('express');
const sequelize = require('./database')
const app = express()

/* Models*/
const ls_t = require('./models/lesson_students');
const lt_t = require('./models/lesson_teachers');
const l_t = require('./models/lessons');
const s_t = require('./models/students');
const t_t = require('./models/teachers');
/* Models*/
(async () => {
  console.log(await l_t.Lessons.findAll({ attributes: ['id', 'date', 'title', 'status'] }))
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