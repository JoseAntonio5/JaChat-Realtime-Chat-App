const chatForm = document.getElementById('chat-form');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users')
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

// get user and room from the url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

socket.emit('joinRoom', { username, room });

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// When a message is submitted
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.message.value;

    socket.emit('userChatMessage', msg);

    e.target.elements.message.value = '';
    e.target.elements.message.focus();
});

const outputMessage = (msgObj) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${msgObj.username} <span>${msgObj.time}</span></p>
    <p class="text">
        ${msgObj.msg}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

const outputRoomName = (room) => {
    roomName.innerHTML = room;
};

const outputUsers = (users) => {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
};