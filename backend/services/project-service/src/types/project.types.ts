import { ProjectStatus } from "@prisma/client";

export interface ProjectCreateDTO {
  clientId: string;
  title: string;
  description: string;
}

export interface ProjectUpdateDTO {
  title?: string;
  description?: string;
}

export interface ProjectResponseDTO {
  projectId: string;
  clientId: string;
  professionalId?: string;
  title: string;
  description: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
}
