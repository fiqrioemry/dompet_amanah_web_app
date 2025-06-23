export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

export interface DBConfig {
  username: string;
  password: string | null;
  database: string;
  host: string;
  port?: number | string;
  dialect: "postgres";
}

// src/types/jwt.ts
export interface JwtPayload {
  id: string;
  role: string;
  [key: string]: any;
}
