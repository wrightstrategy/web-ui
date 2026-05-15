// Client-safe Zod schemas. Imported by both server actions (for
// validation) and Svelte pages (for inferred types via Superforms).

import { z } from 'zod';

// ─── Edit a queue document ───────────────────────────────────────────

export const editSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters.')
    .max(200, 'Title must be at most 200 characters.'),
  source: z.enum(['Paperless', 'Scan-router', 'Email', 'Other']),
  confidence: z.coerce
    .number()
    .int('Confidence must be a whole number.')
    .min(0, 'Confidence must be ≥ 0.')
    .max(100, 'Confidence must be ≤ 100.'),
  tags: z.string().max(200, 'Tags must be at most 200 characters.').default(''),
  notes: z.string().max(2000, 'Notes must be at most 2000 characters.').default(''),
});

export type EditInput = z.infer<typeof editSchema>;

// ─── Settings: Profile section ───────────────────────────────────────

export const profileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required.')
    .max(80, 'Name must be at most 80 characters.'),
  email: z.email('Enter a valid email address.').max(120),
});

// ─── Settings: Notifications section ────────────────────────────────

export const notificationsSchema = z.object({
  onError: z.boolean().default(true),
  onReviewNeeded: z.boolean().default(true),
  onDailyDigest: z.boolean().default(false),
  channel: z.enum(['Email', 'Slack', 'Webhook']).default('Email'),
});

// ─── Settings: Advanced section ─────────────────────────────────────

export const advancedSchema = z.object({
  apiKey: z
    .string()
    .min(8, 'API key looks too short.')
    .max(128, 'API key looks too long.'),
  retentionDays: z.coerce
    .number()
    .int()
    .min(7, 'Retention must be at least 7 days.')
    .max(365, 'Retention can be at most 365 days.'),
  autoTriageFloor: z.coerce
    .number()
    .int()
    .min(50, 'Auto-triage floor must be at least 50%.')
    .max(100, 'Auto-triage floor must be at most 100%.'),
});
