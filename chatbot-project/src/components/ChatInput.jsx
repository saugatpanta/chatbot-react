import { useState } from 'react'


function ChatInput({ onSend, isLoading }) {
  const [text, setText] = useState('');

  function handleSend() {
    if (!text.trim() || isLoading) return;
    onSend(text);
    setText('');
  }

  function handeKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chat-input-container">
      <input
        type="text"
        placeholder="Send a message to Chatbot"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handeKeyDown}
        disabled={isLoading}
        className="user-input"
      />
      <button
        onClick={handleSend}
        disabled={isLoading}
        className="send-button"
      >
        {isLoading ? <div className="spinner"></div> : 'Send'}
      </button>
    </div>
  );
}

export default ChatInput;