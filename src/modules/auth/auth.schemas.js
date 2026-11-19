import { z } from "zod";

const email = z.string().trim().toLowerCase().email().max(255);

const password = z.string().min(8).max(72);

export const registerBody = z.object({
  email,
  password,
  name: z.string().trim().min(1).max(100),
});

export const loginBody = z.object({
  email,
  password: z.string().min(1).max(72),
});

export const refreshBody = z.object({
  refreshToken: z.string().min(1),
});
