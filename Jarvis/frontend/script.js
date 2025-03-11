document.addEventListener('DOMContentLoaded', function() {
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    function addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        
        const paragraph = document.createElement('p');
        paragraph.textContent = message;
        
        messageDiv.appendChild(paragraph);
        chatBox.appendChild(messageDiv);
        
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function sendMessage(message) {
        try {
            const typingDiv = document.createElement('div');
            typingDiv.classList.add('message', 'bot', 'typing');
            typingDiv.innerHTML = '<p>Digitando...</p>';
            chatBox.appendChild(typingDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
            
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            chatBox.removeChild(typingDiv);
            
            if (!response.ok) {
                throw new Error('Erro na resposta da API');
            }
            
            const data = await response.json();
            addMessage(data.response, 'bot');
        } catch (error) {
            console.error('Erro:', error);

            const typingEl = document.querySelector('.typing');
            if (typingEl) chatBox.removeChild(typingEl);
            
            addMessage('Desculpe, tive um problema ao processar sua mensagem.', 'bot');
        }
    }

    sendBtn.addEventListener('click', function() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            userInput.value = '';
            sendMessage(message);
        }
    });

    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const message = userInput.value.trim();
            if (message) {
                addMessage(message, 'user');
                userInput.value = '';
                sendMessage(message);
            }
        }
    });
});
