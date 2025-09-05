declare namespace Express {
  export interface Request {
    user: {
      role;
      user_id;
    };
  }
}
