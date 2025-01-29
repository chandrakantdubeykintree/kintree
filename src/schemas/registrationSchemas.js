import { z } from "zod";

export const registrationStepSchemas = {
  1: z.object({
    first_name: z.string().min(1, "First name is required"),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, "Last name is required"),
  }),

  2: z.object({
    date_of_birth: z.string().min(1, "Date of birth is required"),
  }),

  3: z.object({
    gender: z.enum(["m", "f"], {
      required_error: "Please select a gender",
    }),
  }),

  4: z
    .object({
      profile_image: z.any().optional(),
      preseted_profile_image_id: z.number().optional(),
      skipped: z.number().optional(),
    })
    .refine((data) => {
      if (data.skipped) return true;
      return data.profile_image || data.preseted_profile_image_id;
    }, "Please select a profile image or skip this step"),

  5: z.object({
    father_first_name: z.string().min(1, "Father's first name is required"),
    father_last_name: z.string().min(1, "Father's last name is required"),
    grand_father_name: z.string().min(1, "Grandfather's name is required"),
  }),

  6: z.object({
    mother_first_name: z.string().min(1, "Mother's first name is required"),
    mother_last_name: z.string().min(1, "Mother's last name is required"),
    grand_father_name: z.string().min(1, "Grandfather's name is required"),
  }),
};
