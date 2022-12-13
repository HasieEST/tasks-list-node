const express = require('express')
const app = express()

const path = require('path')
// Initialize rendering engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Static file usage - CSS, JS, Images
app.use(express.static(path.join(__dirname, 'public')))

// use file system - read and write files
const fs = require('fs')

app.get('/', (req, res) => {
    fs.readFile('./tasks.json', 'UTF-8', (err, jsonString) => {
        if (err) {
            console.log('Error reading file: ', err)
            return
        }
        try {
            const tasks = JSON.parse(jsonString)
            // options template var, server variable (same names)
            res.render('index', {tasksRender: tasks})
        } catch (err) {
            console.log('Error parsing file: ', err)
            return
        }
    })
})
app.get('/delete-task/:taskId', (req, res) => {
    let deletedTaskID = parseInt(req.params.taskId)
    fs.readFile('./tasks.json', 'UTF-8', (err, jsonString) => {

        if (err) {
            console.log('Error:', err)
            return
        }
        try {
            const tasks = JSON.parse(jsonString)
            tasks.forEach((task, index) => {
                if (task.id === deletedTaskID) {
                    tasks.splice(index, 1)
                }
            })
            fs.writeFile('./tasks.json', JSON.stringify(tasks, null, 2), 'UTF-8', (err) => {
                console.log('Error: ', err)
            })
            res.redirect('/')
        } catch (err) {
            console.log('Error', err)
        }
    })
})


app.listen(3001)