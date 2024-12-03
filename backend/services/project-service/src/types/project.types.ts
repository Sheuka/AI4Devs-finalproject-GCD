import { ProjectStatus } from "@prisma/client";
import { QuoteResponseDTO } from './quote.types';

export interface ProjectCreateDTO {
  clientId: string;
  title: string;
  description: string;
  type: string;
  amount: number;
  budget: number | null;
  startDate: string;
}

export interface ProjectUpdateDTO {
  title?: string;
  description?: string;
}

export interface ProjectResponseDTO {
  id: string;
  clientId: string;
  professionalId?: string;
  title: string;
  description: string;
  type: string;
  amount: number;
  budget: number | null;
  startDate: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  quotes?: QuoteResponseDTO[];
}

export interface ChatMessageResponseDTO {
  id: string;
  projectId: string;
  userId: string;
  content: string;
  timestamp: Date;
}

export interface ChatMessageCreateDTO {
  content: string;
}
