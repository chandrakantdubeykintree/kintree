import { z } from "zod";

export const forgotUsernameSchemas = {
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
