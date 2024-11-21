import { QuoteStatus } from "@prisma/client";

export interface QuoteCreateDTO {
  projectId: string;
  professionalId: string;
  amount: number;
  message?: string;
}

export interface QuoteUpdateDTO {
  amount?: number;
  message?: string;
}

export interface QuoteResponseDTO {
  quoteId: string;
  projectId: string;
  professionalId: string;
  amount: number;
  message?: string;
  status: QuoteStatus;
  createdAt: Date;
  updatedAt: Date;
}
