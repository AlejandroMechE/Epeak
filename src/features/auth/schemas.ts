import { z } from "zod";

/**
 * Shared validation rules for a more engineering-focused "Secure Cockpit" vibe.
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character");

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid engineering email address"),
  password: z.string().min(1, "Password is required"),
});

export const RegisterSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid engineering email address"),
  password: passwordSchema,
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid engineering email address"),
});

export const UpdatePasswordSchema = z.object({
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof UpdatePasswordSchema>;
