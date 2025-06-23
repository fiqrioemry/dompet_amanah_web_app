// src/types/express/index.d.ts atau di root `types/express.d.ts`
import { JwtPayload } from "./types"; // sesuaikan path jika perlu

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
