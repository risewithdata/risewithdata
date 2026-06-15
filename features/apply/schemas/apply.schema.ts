import { z } from 'zod';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const ApplySchema = z.object({
  firstName:    z.string().min(1, 'First name is required'),
  lastName:     z.string().min(1, 'Last name is required'),
  zipcode:      z.string().min(1, 'Zipcode is required').max(10, 'Invalid zipcode'),
  linkedinName: z.string().min(1, 'LinkedIn name is required'),
  resume: z
    .any()
    .refine((files) => files?.length > 0, 'Resume is required')
    .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, 'File must be 5 MB or smaller')
    .refine(
      (files) => ACCEPTED_TYPES.includes(files?.[0]?.type),
      'Only PDF, DOC, and DOCX files are accepted'
    ),
});

export type ApplyInput = z.infer<typeof ApplySchema>;
