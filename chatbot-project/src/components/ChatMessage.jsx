import RobotProfileImage from '../assets/robot.png'
import UserProfileImage from '../assets/user.png'

export function ChatMessage({ message, sender, timestamp }) {
return (
  <div
    className={
      sender === 'user' ? 'chat-msg-user' : 'chat-msg-robot'
    }
  >
    {sender === 'robot' && (
      <img src={RobotProfileImage} alt="" className="chat-msg-profile" />
    )}
    <div 
      className="chat-msg-text"
      dangerouslySetInnerHTML={{ __html: message }}
    />

    {
      timestamp && (
        <div className={`chat-msg-timestamp ${sender === 'user' ? 'user-timestamp' : 'robot-timestamp'}`}>
          {timestamp}
        </div>
      )
    }

    {sender === 'user' && (
      <img src={UserProfileImage} alt="" className="chat-msg-profile" />
    )}
  </div>
);
}
