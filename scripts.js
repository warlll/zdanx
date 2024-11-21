document.addEventListener('DOMContentLoaded', () => {
    // متغيرات اللعبة
    const startGameButton = document.getElementById('startGameButton');
    const redDot = document.getElementById('redDot');
    const gameArea = document.getElementById('gameArea');
    let score = 0;
    let gameInterval;

    startGameButton.addEventListener('click', startGame);

    redDot.addEventListener('click', () => {
        score++;
        document.getElementById('score').textContent = score;
        moveRedDot();
    });

    function startGame() {
        score = 0;
        document.getElementById('score').textContent = score;
        moveRedDot();
        redDot.style.display = 'block';
        gameInterval = setInterval(moveRedDot, 1000);
    }

    function moveRedDot() {
        const maxX = gameArea.clientWidth - redDot.clientWidth;
        const maxY = gameArea.clientHeight - redDot.clientHeight;
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);
        redDot.style.left = `${randomX}px`;
        redDot.style.top = `${randomY}px`;
    }

    // متغيرات الرسائل
    const form = document.getElementById('messageForm');
    const usernameInput = document.getElementById('username');
    const messageInput = document.getElementById('message');
    const messagesContainer = document.getElementById('messagesContainer');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const message = messageInput.value.trim();
        if (username === '' || message === '') return;

        const messageData = {
            username,
            message,
            id: Date.now()
        };

        addMessageToLocalStorage(messageData);

        usernameInput.value = '';
        messageInput.value = '';
        alert('تم إرسال الرسالة بنجاح!');
    });

    function addMessageToLocalStorage(message) {
        let messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.push(message);
        localStorage.setItem('messages', JSON.stringify(messages));
    }

    // تحميل الرسائل من LocalStorage عند تحميل الصفحة
    function loadMessages() {
        let messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages.forEach(message => addMessageToDOM(message));
    }

    // إضافة رسالة إلى DOM
    function addMessageToDOM(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.setAttribute('data-id', message.id);
        messageDiv.innerHTML = `
            <span><strong>${message.username}:</strong> ${message.message}</span>
            <button>حذف</button>
        `;
        messagesContainer.appendChild(messageDiv);
    }

    // حذف رسالة من DOM و LocalStorage
    function deleteMessageFromDOM(messageId) {
        const messageDiv = document.querySelector(`.message[data-id='${messageId}']`);
        if (messageDiv) messagesContainer.removeChild(messageDiv);
    }

    function deleteMessageFromLocalStorage(messageId) {
        let messages = JSON.parse(localStorage.getItem('messages')) || [];
        messages = messages.filter(message => message.id != messageId);
        localStorage.setItem('messages', JSON.stringify(messages));
    }

    // تحميل الرسائل عند بدء الصفحة
    if (messagesContainer) {
        loadMessages();
        messagesContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const messageId = e.target.parentElement.getAttribute('data-id');
                deleteMessageFromDOM(messageId);
                deleteMessageFromLocalStorage(messageId);
            }
        });
    }
});
