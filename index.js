const express = require('express')
const app = express()

app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  var data = { 
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
    teachers:[{
      id: 1,
      name: 'Tanya'
    }]
  }
  res.render(__dirname + "/views/index.ejs", data)
})

app.listen(3000)