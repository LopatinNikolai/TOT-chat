import * as React from "react";
import "./ChatList.css";
import { TChatInfo, ChatService } from "../../services/api/chat.service";
import { RouteChildrenProps } from "react-router-dom";
import { Chat } from "../Chat/Chat";
import { TUserDataFromServer } from "../../services/api/auth.service";

type TChatListProps = RouteChildrenProps & { userData: TUserDataFromServer };

export const ChatList: React.FC<TChatListProps> = (props) => {
  const [currentChatId, setChatId] = React.useState<string | null>(null);
  const [chatList, setChatList] = React.useState<Array<TChatInfo>>([]);

  React.useEffect(() => {
    ChatService.getChatsList().then(setChatList);

    return () => {};
  }, []);

  function handleClick(
    event: React.MouseEvent<HTMLUListElement, MouseEvent>
  ): void {
    setChatId((event.target as Element).getAttribute("data-chatid") as string);
  }
  return (
    <div className="container-chats">
      <div className="container_chats-nav">
        <nav>
          <ul className="chats-nav" onClick={handleClick}>
            {chatList.map((value, i) => (
              <li className="li-chat" data-chatid={value.chatId} key={i}>
                {value.chatName}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {currentChatId && (
        <Chat userData={props.userData} chatId={currentChatId} />
      )}
    </div>
  );
};
