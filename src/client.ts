const textArea: HTMLTextAreaElement | null = document.querySelector('#chat-input');
const content = document.querySelector('.content');

const ws = new WebSocket('ws://localhost:3001');

if (textArea) {
  textArea.onkeypress = <KeyboardEvent>(event: KeyboardEvent) => {
    // @ts-ignore
    if (event.key === 'Enter') {
      ws.send(JSON.stringify({
        message: textArea.value,
      }));

      textArea.value = '';
    }
  };
}

if (ws) {
  ws.onmessage = (msg: MessageEvent) => {
    addChatMessage(msg.data);
  }
}

const addChatMessage = (message: string) => {
  const jsonMessage = JSON.parse(message);

  const messageDiv = document.createElement('div');

  messageDiv.classList.add('message');

  messageDiv.innerText = `${jsonMessage.user} @ ${jsonMessage.timestamp}: ${jsonMessage.message}`;

  if (content) {
    content.appendChild(messageDiv);
  }
};
