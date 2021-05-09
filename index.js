const express = require('express')
const app = express()

app.set('view engine', 'ejs')

app.get('/', function (req, res) {
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
  {
    ID: 1,
    date: new Date().toLocaleDateString("ru-RU"),
    title: 'Зеленый',
    status: 0,
    visitCount: 42,
    students: [
      {
        id: 2,
        name: 'Светлана',
        visit: true,
      },
      {
        id: 3,
        name: 'Тамара',
        visit: false,
      }
    ],
    teachers: [{
      id: 1,
      name: 'Tanya'
    }]
  },
  {
    ID: 1,
    date: new Date().toLocaleDateString("ru-RU"),
    title: 'Зеленый',
    status: 1,
    visitCount: 42,
    students: [{
      id: 2,
      name: 'Светлана',
      visit: true,
    }],
    teachers: [
      {
        id: 1,
        name: 'Tanya'
      },
      {
        id: 2,
        name: 'Vika'
      }
    ]
  },
  {
    ID: 1,
    date: new Date().toLocaleDateString("ru-RU"),
    title: 'Зеленый',
    status: 0,
    visitCount: 42,
    students: [{
      id: 2,
      name: 'Светлана',
      visit: true,
    }],
    teachers: [{
      id: 1,
      name: 'Tanya'
    }]
  },
  {
    ID: 1,
    date: new Date().toLocaleDateString("ru-RU"),
    title: 'Зеленый',
    status: 0,
    visitCount: 42,
    students: [{
      id: 2,
      name: 'Светлана',
      visit: true,
    }],
    teachers: [{
      id: 1,
      name: 'Tanya'
    }]
  },
  ]
  res.render(__dirname + "/views/index.ejs", {data: data})
})

app.listen(3000)