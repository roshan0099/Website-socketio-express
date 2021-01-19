window.addEventListener('beforeunload',(e) => {
	window.setTimeout(() =>{

		window.location.href = "/"
		return "uo sure"
	},0)
	return "you sure"
})

//getting the main body
var main = document.getElementById('main')

//sticky icon directing back to home
var sticky = document.getElementById('sticky_icon')

sticky.addEventListener('click',() => {
	window.location.href = '/'
})



//getting the canvas
var canvas = document.getElementById('canvas')
canvas.width = window.innerWidth


//declaring what we wanna draw on it
var ctx = canvas.getContext('2d')


//flag to trigger the mouse down and up thing
var flag = false
//get the canvas details
var rect;

//socket to pass the info about co ordinates to the other client
var socket = io();

//to get the individual user name

var user_name
var total_users = 0

var chat = document.getElementById("chat")

//total number of users
var no_users = document.createElement('div')
no_users.setAttribute('class', 'no_users')
chat.appendChild(no_users)


socket.on("message",(count,name) => {
	user_name = name
	console.log(user_name)
	total_users = count
	no_users.innerHTML = `Total users : ${total_users}`
	console.log(total_users)
	display_name.innerHTML = `Hey ${user_name} !`
})

//display logged in person name
var display_name = document.getElementsByClassName('title')[0]
var home_directing = document.createElement('div')
home_directing.innerHTML = "Go home ?" 
display_name.appendChild(home_directing)


//to display the number of memeber and also the newly joined ones
var count_of_user = document.createElement('div')
var new_member = document.createElement("div")
chat.appendChild(new_member)

socket.on("welcome",(msg) => {
	console.log(msg)
	total_users++
	console.log(total_users)
	no_users.innerHTML = `total users : ${total_users}`
	
	new_member.innerHTML = msg
	
})


//disconnect message and also to reduce the number 
//of total users

socket.on("diss",(msg) => {
	total_users --
	no_users.innerHTML = `total users : ${total_users}`
	
	new_member.innerHTML = msg
	
})


//space to enter the text user wanna send

var  chat_type = document.getElementById("chat_type")

//text_filed/typing message area
var chat_field = document.createElement('input')
chat_field.setAttribute('type','text')
chat_field.setAttribute('placeholder','Type your message....')
chat_field.setAttribute('class','type_field')
chat_type.appendChild(chat_field)


//send button
var send_button = document.createElement('button')
send_button.innerHTML = "SEND"
send_button.setAttribute("class","button_press")
chat_type.appendChild(send_button)

//event listener to emit the msg to the server 

//when pressed enter
chat_field.addEventListener("keyup",(e) => {

	if(e.keyCode === 13)
	{
	e.preventDefault()
	console.log(user_name)
	socket.emit("msg",chat_field.value)
	chat_field.value = ''
}
})

//when pressed the send button

send_button.addEventListener("click",() => {

	console.log(user_name)
	socket.emit("msg",chat_field.value)
	chat_field.value = ''

})


//getting all the message of different users in the stream
var chat_text = document.getElementById('chat_text')
chat_text.width = canvas.width + 400

socket.on("chat",(name,msg) => {

	var chat_display = document.createElement('div')
	chat_display.style.paddingLeft = '5px'
	chat_display.style.paddingTop = '5px';
	chat_display.setAttribute('class','messages')
	chat_display.width = chat.width
	//checking if the page is of a particular user
	//so to print "me" for that user and for the rest users name
	if(name === user_name){
		chat_display.innerHTML = "me : "+ msg
	}
	
	else{
		chat_display.style.borderBottom = '1px solid black'
		chat_display.style.borderRight = '1px solid black'
		chat_display.style.backgroundColor = "rgb(0,0,0,0.16)"
		chat_display.innerHTML = `${name} : `+ msg
	}
	chat_text.appendChild(chat_display)

})

// function to delete the old message
// one by one after certain period
setInterval(() => {
	var message = document.getElementsByClassName('messages')
	if(message.length > 0)
	{
		console.log(message)
		message[0].remove()
	}	
}, 20000)




//trigger the mouse event and fetching the area details of canvas to the variable rect 
canvas.addEventListener("mousedown",(e) => {
	flag = true
	rect = canvas.getBoundingClientRect()
} )



//mouse move event listener that helps us to draw on the canvas in the direction the mouse moves
canvas.addEventListener("mousemove", (e) => {

	if(flag === true)
	{

		//co ordinates
		var axisX = 0
		var axisY = 0
		//calculations to get the exact co ordinates inside the canvas even after we expand the size of the window
		var scaleX = canvas.width/rect.width
		var scaleY = canvas.height/rect.height
				
		axisX = parseInt(e.clientX - rect.left)*scaleX
		axisY = parseInt(e.clientY - rect.top)*scaleY
		
		//draw the dectangle
		ctx.fillRect(axisX,axisY,5,5)

		socket.emit("cord",axisX,axisY)
	}	
})

//for phones

canvas.addEventListener("touchmove", (e) => {
	flag = true
	if(flag === true)
	{
		console.log("jamess")

		rect = canvas.getBoundingClientRect()
		//co ordinates
		var axisX = 0
		var axisY = 0
		//calculations to get the exact co ordinates inside the canvas even after we expand the size of the window
		var scaleX = canvas.width/rect.width
		var scaleY = canvas.height/rect.height
				
		axisX = parseInt(e.touches[0].clientX - rect.left)*scaleX
		axisY = parseInt(e.touches[0].clientY - rect.top)*scaleY
		
		//draw the dectangle
		ctx.fillRect(axisX,axisY,5,5)

		socket.emit("cord",axisX,axisY)
	}	
})

//event listener to stop the draw and turn the flag to false
canvas.addEventListener("mouseup", () => {
	flag = false
})

socket.on("xAndy",(x,y) => {

	ctx.fillRect(x,y,5,5)
})