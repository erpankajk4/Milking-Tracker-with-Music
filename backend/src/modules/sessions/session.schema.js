import { z } from 'zod';

export const createSessionSchema = z
  .object({
    start_time: z
      .string({ required_error: 'start_time is required' })
      .datetime({ message: 'start_time must be a valid ISO 8601 UTC date string' }),
    end_time: z
      .string({ required_error: 'end_time is required' })
      .datetime({ message: 'end_time must be a valid ISO 8601 UTC date string' }),
    duration: z
      .number({ required_error: 'duration is required' })
      .int({ message: 'duration must be an integer' })
      .min(0, { message: 'duration must be non-negative' }),
    milk_quantity: z
      .number({ required_error: 'milk_quantity is required' })
      .finite({ message: 'milk_quantity must be a finite number' })
      .positive({ message: 'milk_quantity must be greater than 0' })
  })
  .strict({ message: 'Unrecognized field in request body' })
  .superRefine((data, ctx) => {
    const startDate = new Date(data.start_time);
    const endDate = new Date(data.end_time);

    if (endDate.getTime() <= startDate.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['end_time'],
        message: 'end_time must be after start_time'
      });
    }

    const wallClockDurationSeconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
    // Allow a small 5-second tolerance for clock skew/rounding
    if (data.duration > wallClockDurationSeconds + 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['duration'],
        message: `duration (${data.duration}s) cannot exceed total elapsed time (${wallClockDurationSeconds}s)`
      });
    }
  });
