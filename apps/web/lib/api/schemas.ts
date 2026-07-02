import { z } from 'zod';

export const trackPayloadSchema = z.object({
  medicine_id: z.string().uuid({ message: "Invalid medicine UUID format" }),
  batch_number: z.string().min(1).max(50, { message: "Batch number length must be between 1 and 50" }),
  notes: z.string().max(255).optional()
}).strict();