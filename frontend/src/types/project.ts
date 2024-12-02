export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  budget: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientProject extends Project {
  professionalName: string;  
  quotes: Quote[];
}

export interface ProfessionalProject extends Project {
  clientName: string;
  quote: Quote;
}

export interface Quote {
  quoteId: string;
  projectId: string;
  professionalId: string;
  amount: number;
  message: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface QuoteFormData {
  projectId: string;
  professionalId: string;
  amount: number;
  message: string;
  estimatedDuration: string;
}

export interface Message {
  id: string;
  projectId: string;
  userId: string;
  content: string;
  sender: 'LOCAL' | 'REMOTE';
  timestamp: Date;
}
