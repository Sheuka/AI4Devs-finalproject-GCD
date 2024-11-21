import { PrismaClient } from '@prisma/client';
import { UserService } from '../services/user.service';

let _prismaClient: PrismaClient;
let _userService: UserService;

export const getPrismaClient = () => {
  if (!_prismaClient) {
    _prismaClient = new PrismaClient();
  }
  return _prismaClient;
};

export const getUserService = () => {
  if (!_userService) {
    _userService = new UserService();
  }
  return _userService;
};

// Para testing
export const setPrismaClient = (client: PrismaClient) => {
  _prismaClient = client;
};

export const setUserService = (service: UserService) => {
  _userService = service;
};
