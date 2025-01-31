import { z } from "zod";

export const resetPasswordSchemas = {
  reset_password: z
    .object({
      new_password: z.string().min(6, "Password must be at least 6 characters"),
      confirm_password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: "Passwords don't match",
      path: ["confirm_password"], // This shows the error on the confirm_password field
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
    otp: z
      .string()
      .refine(
        (val) => val.length === 4 || val.length === 6,
        "OTP must be 4 or 6 digits"
      )
      .refine((val) => /^\d+$/.test(val), "OTP must contain only numbers"),
  }),
};
