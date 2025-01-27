import { z } from "zod";

export const loginSchemas = {
  username: z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),

  email: z.object({
    email: z.string().email("Please enter a valid email address"),
  }),

  phone_no: z.object({
    phone_no: z
      .string()
      .regex(/^\+[1-9]\d{1,14}$/, "Please enter a valid phone number"),
  }),

  otp: z.object({
    otp: z.string().length(6, "OTP must be 6 digits"),
  }),
};
