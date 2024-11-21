import { PrismaClient } from '@prisma/client';

let _prismaClient: PrismaClient;

export const getPrismaClient = () => {
  if (!_prismaClient) {
    _prismaClient = new PrismaClient();
  }
  return _prismaClient;
};

// Para testing
export const setPrismaClient = (client: PrismaClient) => {
  _prismaClient = client;
};
