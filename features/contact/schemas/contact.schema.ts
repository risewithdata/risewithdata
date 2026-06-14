import { z } from 'zod';

export const ContactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName:  z.string().min(1, 'Last name is required'),
  email:     z.string().min(1, 'Email is required').email('Enter a valid email address'),
  message:   z.string().min(1, 'Message is required').max(2000, 'Message must be under 2000 characters'),
});

export type ContactInput = z.infer<typeof ContactSchema>;
