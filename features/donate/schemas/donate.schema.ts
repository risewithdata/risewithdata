import { z } from 'zod';

export const PRESET_AMOUNTS = [25, 50, 100, 250] as const;

export const DonateSchema = z
  .object({
    firstName:  z.string().min(1, 'First name is required'),
    lastName:   z.string().min(1, 'Last name is required'),
    email:      z.string().min(1, 'Email is required').email('Enter a valid email address'),
    frequency:  z.enum(['one-time', 'monthly'], { error: 'Select a donation frequency' }),
    presetAmount: z.enum(['25', '50', '100', '250', 'custom']).optional(),
    customAmount: z.string().optional(),
    message:    z.string().max(500, 'Message must be under 500 characters').optional(),
    anonymous:  z.boolean().optional(),
    terms:      z.literal(true, { error: 'You must accept the Terms & Conditions' }),
  })
  .refine(
    (data) => {
      if (data.presetAmount === 'custom') {
        const n = parseFloat(data.customAmount ?? '');
        return !isNaN(n) && n >= 1;
      }
      return !!data.presetAmount;
    },
    { message: 'Please enter a valid donation amount (minimum $1)', path: ['customAmount'] }
  );

export type DonateInput = z.infer<typeof DonateSchema>;
