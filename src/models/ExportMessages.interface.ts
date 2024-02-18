type MessageTypes = 'message' | 'service';
type MessageTextTypes = 'plain' | 'bot_command';
type MessageObjectType = {
  type: MessageTextTypes;
  text: string;
};

interface Message {
  id: number;
  type: MessageTypes;
  date: string;
  date_unixtime: string;
  edited: string;
  from: string;
  from_id: string;
  text: Array<string | MessageObjectType>;
  text_entities: MessageObjectType[];
}

interface ExportMessagesData {
  name: string;
  type: string;
  id: number;
  messages: Message[];
}

export { MessageTypes, MessageTextTypes, MessageObjectType, Message };
export default ExportMessagesData;
