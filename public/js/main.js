const chatForm = document.getElementById("chat-form")
const charMessage = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix : true
})

const formattedRoom = room.toLowerCase()



const socket = io()

socket.emit('joinRoom',{username,formattedRoom})

socket.on('roomUser',({room,users}) => {
    outputRoomName(room)
    outputUsers(users)
})

socket.on('message', message =>{
    console.log(message)
    outputMessage(message)
    charMessage.scrollTop = charMessage.scrollHeight
})


chatForm.addEventListener('submit',e =>{
    e.preventDefault()
    const msg = e.target.elements.msg.value

    socket.emit('charMessage', msg)
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()

})

function outputMessage(message){
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meata">${message.username}<span>${message.time}</span></p>
    <p class="text">${message.text}</p>`
    document.querySelector('.chat-messages').appendChild(div)
}


function outputRoomName(room){
    roomName.innerText = room

}


function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}`

}


document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });


