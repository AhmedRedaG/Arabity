export enum ChatRole {
  CUSTOMER = 'Customer',
  ASSISTANT = 'Assistant',
}

export interface ChatMessage {
  role: ChatRole;
  content: string;
}
