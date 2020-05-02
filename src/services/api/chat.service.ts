import axios from "axios";

export type TChatInfo = {
  chatName: string;
  chatId: string;
};

export type TMessage = {
  textMessage: string;
  userName: string;
  userSurname: string;
  userId: string;
  messageId: string;
};

export class ChatService {
  private static GET_CHAT_MESSAGES_ROUTE = "/api/messages";
  private static GET_CHAT_LIST_ROUTE = "/api/chats";
  private static SEND_MESSAGE = "/api/send";
  private static webSocket:WebSocket | null= null;
  public static getChatsList(): Promise<Array<TChatInfo>> {
    return axios.get(ChatService.GET_CHAT_LIST_ROUTE).then(({ data }) => {
      return data;
    });
  }
  public static sendMessage(
    chatId: string,
    userId: string,
    text: string
  ): void {
    ChatService.webSocket?.send(JSON.stringify({ chatId, userId, text }));
  }

  public static getMessages(chatId: string): Promise<Array<TMessage>> {
    return axios
      .get(ChatService.GET_CHAT_MESSAGES_ROUTE, { params: { chatId } })
      .then(({ data }) => {
        return data;
      });
  }
  public static subscribe(cb: (message: TMessage) => void) { 
      (ChatService.webSocket as WebSocket).onmessage = (event: MessageEvent) => cb(JSON.parse(event.data));
    
  }

  public static unsubscribe() {
    (ChatService.webSocket as WebSocket).onmessage = null;
  
  }
  public static destroyConnection(){
    ChatService.webSocket?.close();
  }

  public static setConnection(){
    ChatService.webSocket = new WebSocket("ws://localhost:8003");
  }
}
