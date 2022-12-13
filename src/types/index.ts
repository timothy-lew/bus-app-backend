export interface Payload {
  sub: string;
  iat?: number;
  exp: number;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  pass_salt?: string;
  pass_hash?: string;
}
