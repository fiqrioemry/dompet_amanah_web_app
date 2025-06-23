import { Request, Response, NextFunction } from "express";

const apiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.SERVER_API_KEY) {
    res.status(401).json({ error: "Invalid API Key" });
    return;
  }
  next();
};

export default apiKeyMiddleware;
