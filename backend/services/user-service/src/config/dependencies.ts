import { PrismaClient } from '@prisma/client';
import { UserService } from '../services/user.service';
import { ProfessionalService } from '../services/professional.service';
import { RatingService } from '../services/ratingService';

let _prismaClient: PrismaClient;
let _userService: UserService;
let _professionalService: ProfessionalService;
let _ratingService: RatingService;
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

export const getProfessionalService = () => {
  if (!_professionalService) {
    _professionalService = new ProfessionalService();
  }
  return _professionalService;
};

export const getRatingService = () => {
  if (!_ratingService) {
    _ratingService = new RatingService();
  }
  return _ratingService;
};

// Para testing
export const setPrismaClient = (client: PrismaClient) => {
  _prismaClient = client;
};

export const setUserService = (service: UserService) => {
  _userService = service;
};

export const setProfessionalService = (service: ProfessionalService) => {
  _professionalService = service;
};

export const setRatingService = (service: RatingService) => {
  _ratingService = service;
};
