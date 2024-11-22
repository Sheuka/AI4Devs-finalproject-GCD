export class DatabaseError extends Error {
  status: number;
  
  constructor(message: string) {
    super(message);
    this.status = 500;
    this.name = 'DatabaseError';
  }
}

export class AuthenticationError extends Error {
  status: number;
  
  constructor(message: string) {
    super(message);
    this.status = 401;
    this.name = 'AuthenticationError';
  }
}
