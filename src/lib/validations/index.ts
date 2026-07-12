import { z } from "zod";

export const VALID_STATUSES = [
  "Not Started",
  "In Progress",
  "Completed",
  "Blocked",
] as const;

export const statusSchema = z.enum(VALID_STATUSES);

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must include an uppercase letter")
  .regex(/[a-z]/, "Password must include a lowercase letter")
  .regex(/[0-9]/, "Password must include a number")
  .regex(/[^A-Za-z0-9\s]/, "Password must include a special character");

export const authSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: passwordSchema,
  name: z.string().min(1, "Name is required").optional(),
});

export const weekProgressSchema = z.object({
  weekId: z.string().min(1),
  status: statusSchema,
  notes: z.string().max(5000).nullable().optional(),
  weekdayHours: z.number().min(0).max(24).nullable().optional(),
  weekendHours: z.number().min(0).max(24).nullable().optional(),
});

export const learningLogSchema = z.object({
  weekId: z.string().nullable().optional(),
  learnedText: z.string().min(1, "What did you learn?").max(5000),
  difficultyText: z.string().max(2000).nullable().optional(),
  insightText: z.string().max(2000).nullable().optional(),
  nextAction: z.string().max(2000).nullable().optional(),
  tags: z.array(z.string()).default([]),
});

export const evidenceSchema = z.object({
  weekId: z.string().nullable().optional(),
  milestoneId: z.string().nullable().optional(),
  type: z.enum([
    "repository",
    "pull-request",
    "report",
    "screenshot",
    "documentation",
    "url",
    "other",
  ]),
  title: z.string().min(1).max(500),
  url: z.string().url("Invalid URL").nullable().optional(),
  description: z.string().max(2000).nullable().optional(),
});

export const settingsSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  primaryLanguage: z
    .enum(["Java", "TypeScript/JavaScript", "Python", "Other"])
    .nullable()
    .optional(),
  startDate: z.string().nullable().optional(),
  weekdayHourGoal: z.number().min(0).max(24).nullable().optional(),
  weekendHourGoal: z.number().min(0).max(24).nullable().optional(),
  currentWeekOverride: z.number().int().min(1).max(52).nullable().optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
});
