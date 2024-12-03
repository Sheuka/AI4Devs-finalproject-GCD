export interface ThreadResponseDTO {
  threadId: string;
  content: string;
}

export interface MessageCreateDTO {
  message: string;
  threadId: string;
  userId: string;
}

export interface MessageResponseDTO {
  content: string;
  isComplete: boolean;
} 