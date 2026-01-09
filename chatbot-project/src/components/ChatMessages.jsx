import { useState, useRef, useEffect } from 'react'
import { Chatbot } from 'supersimpledev'
import { ChatMessage } from './ChatMessage'
import ChatInput from './ChatInput'
import dayjs from 'dayjs'

export function ChatMessages() {
const chatMsgesRef =  useRef(null);

const [chatMessages, setChatMessages] = useState([
  
]);
const [isLoading, setIsLoading] = useState(false);



useEffect(()=>{
  const containerElem = chatMsgesRef.current;
  if(containerElem){
    containerElem.scrollTop = containerElem.scrollHeight;
  }
},[chatMessages])//dependency array

async function sendMessage(messageText) {
  const timestamp = dayjs().format('h:mm A');

  setChatMessages((prev) => [
    ...prev,
    { 
      message: messageText, 
      sender: 'user', 
      id: crypto.randomUUID(),
      timestamp: timestamp
    },
  ]);

  setIsLoading(true);

  setChatMessages((prev) => [
    ...prev,
    {
      message:
        '<div class="loading-dots"><span></span><span></span><span></span></div>',
      sender: 'robot',
      id: 'loading',
      timestamp: timestamp
    },
  ]);

  try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer AIzaSyDkRwFc9x2MsHhg4VR2k43qIZkru0-bhyU`
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash", // pick a free-access model
        messages: [{ role: "user", content: messageText }]
      }),
    });


    const data = await response.json();

    const aiText = data?.choices?.[0]?.message?.content || "No response";
     const aiTimestamp = dayjs().format('h:mm A'); 

    setChatMessages((prev) =>
      prev
        .filter((msg) => msg.id !== "loading")
        .concat({
          message: aiText,
          sender: "robot",
          id: crypto.randomUUID(),
          timestamp: aiTimestamp 
        })
    );
  } catch {
    const errorTimestamp = dayjs().format('h:mm A'); 
    setChatMessages((prev) =>
      prev
        .filter((msg) => msg.id !== "loading")
        .concat({
          message: "Error contacting DeepSeek.",
          sender: "robot",
          id: crypto.randomUUID(),
          timestamp: errorTimestamp 
        })
    );
  }

  setIsLoading(false);
}


return (
  <>
    <div className="chat-msg-container"
      ref = {chatMsgesRef}
    >
      {chatMessages.map((chatMessage) => (
        <ChatMessage
          key={chatMessage.id}
          message={chatMessage.message}
          sender={chatMessage.sender}
          timestamp={chatMessage.timestamp}
        />
      ))}
    </div>
    <ChatInput onSend={sendMessage} isLoading={isLoading} />
  </>
);
}
