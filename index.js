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
                if(err != null) console.log('Error: ', err)
            })
            res.redirect('/')
        } catch (err) {
            if (err != null) console.log('Error', err)
        }
    })
})

// process form post method data
app.use(express.json())
app.use(express.urlencoded({extended: true}))



app.post('/', (req, res) => {
    fs.readFile('./tasks.json', 'UTF-8', (err, jsonString) => {
        if (err) {
            console.log('Error:', err)
            return
        }
        try {
            const tasks = JSON.parse(jsonString)
            let index
            if(tasks.length ===0){
                index = 0
            }else{
                index = tasks[tasks.length-1].id +1
            }
            const newTask = {
                'id': index,
                'task': req.body.task
            }
            console.log(newTask)
            tasks.push(newTask)
            fs.writeFile('./tasks.json', JSON.stringify(tasks, null, 2), 'UTF-8', (err) => {
                console.log('Error: ', err)
            })
            res.redirect('/')
        } catch (err) {
            if (err != null) console.log('Error', err)
        }
    })
})

app.get('/clearAll/', (req, res) => {
    fs.writeFile('./tasks.json', JSON.stringify([]), (err)=>{
        if(err != null) console.log('Error', err)
    })
    res.redirect('/')
})

app.listen(3001)