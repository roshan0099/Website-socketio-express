const express = require('express')
const app = express()
const router = require("./pages/page")
const socket = require('socket.io')
const PORT = process.env.PORT || 8080
const http = require('http')

const server = http.createServer(app)

const io = socket(server)

//creating a route for the static files
app.use(express.static(__dirname + "/public"))

//route for the html files
app.set('view engine','ejs')

//path that has all the files
// //passing the io variable for 
// //being able to access it from the other route like a middleware

app.use("/",router({io : io}))


server.listen(PORT,() => console.log("listening"))