const express = require("express")
const router = express.Router()

router.use(express.urlencoded({extended : false}))

//default home page
function kool(socket){
var name

router.get("/", (req,res) => {

	res.render("home")
})

//main page that has the canvas
router.post("/main",(req,res) => {
	// socket = req.soc.io
	//checking the password
	if(req.body.pass === "surreal")
	{
		name = req.body.name
		res.render("index")
	}

	//if false redirecting to the home page
	else
		res.redirect("/")

})

//constructor to store users info
function user_info_schema(id,name){
	this.name = name
	this.id = id

	return({id : this.id, name : this.name})
}

user_info = []

//establishing the connection and sending the details
var count = 1
socket.io.on("connection",(sock) => {

	console.log("we got a connection")
	user_info.push(user_info_schema(sock.id,name))

	sock.emit("message",count,name)
	sock.broadcast.emit("welcome",`${name} has joined `)
	count++

	console.log(user_info)
	sock.on("cord",(x,y) => {
			sock.broadcast.emit("xAndy",x,y)
	})

	sock.on("msg",(msg) => {
		console.log(sock.id)
		var name_user
		user_info.forEach(elm =>{
			if(elm.id === String(sock.id))
				name_user = elm.name
		}) 
		console.log(name_user)
		socket.io.emit("chat",name_user,msg)

	})
	sock.on("disconnect",() => {

		//while disconnecting removing the same user
		//by mappin their id throught the whole list
		count--
		sock.broadcast.emit("diss",`${name} has left `)
		for(i in user_info){
			if(user_info[i]['id'] === String(sock.id)){
				user_info.splice(i,1)
			}
		}
		
	})

})


	return router	
}
module.exports = kool
