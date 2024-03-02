import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  ENVIRONMENT: z.enum(["prod", "dev"]).default("prod"),
});

export const env = envSchema.parse(process.env);
