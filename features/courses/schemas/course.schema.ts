import { z } from 'zod';

export const CourseCreateSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  published: z.boolean().optional()
});

export type CourseCreateInput = z.infer<typeof CourseCreateSchema>;
