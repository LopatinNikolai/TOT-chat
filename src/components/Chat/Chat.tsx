import React from "react";
import "./Chat.css";
import { MessageInput } from "../MessageInput/MessageInput";
import { Positions, Message } from "../Message/Message";
import { ChatService, TMessage } from "../../services/api/chat.service";
import { TUserDataFromServer } from "../../services/api/auth.service";

type TChat = {
  chatId: string;
  userData: TUserDataFromServer;
};

export const Chat: React.FC<TChat> = ({ chatId, userData }) => {
  const [messages, setMessages] = React.useState<Array<TMessage>>([]);
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    ChatService.getMessages(chatId).then(setMessages);
  }, [chatId]);

  React.useEffect(() => {
    function updateMessages(message: TMessage) {
      const updatedMessages = [...messages];
      updatedMessages.push(message);
      setMessages(updatedMessages);
    }

    ChatService.subscribe(updateMessages);
    return () => {
      ChatService.unsubscribe();
    };
  }, [messages]);

  React.useEffect(() => {
    if(ref.current instanceof HTMLDivElement){
      ref.current.scrollIntoView({block:"end",behavior:"smooth"})
    }
  }, [ref , messages]);

  function handleSend(text: string) {
    ChatService.sendMessage(chatId, userData.userId, text);
  }
  return (
    <div className="chat-container">
      <div  className="messages-wrapper">
        <div ref={ref} className="messages">
          {messages.map((message) => (
            <Message
              key={message.messageId}
              messageLocation={
                userData.userId === message.userId
                  ? Positions.RIGHT
                  : Positions.LEFT
              }
              name={message.userName}
              surname={message.userSurname}
            >
              {message.textMessage}
            </Message>
          ))}
          
        </div>
        <div ></div>
      </div>
      <MessageInput onSend={handleSend}></MessageInput>
    </div>
  );
};
