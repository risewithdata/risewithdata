import { z } from 'zod';
import { CourseCreateSchema } from '../schemas/course.schema';
import { courseService } from '../services/course.service';

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

export async function createCourseAction(payload: unknown): Promise<Result<any>> {
  const parsed = CourseCreateSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, error: { code: 'VALIDATION_ERROR', message: parsed.error.message } };
  }

  try {
    const course = await courseService.createCourse(parsed.data);
    return { success: true, data: course };
  } catch (e) {
    return { success: false, error: { code: 'SERVICE_ERROR', message: (e as Error).message } };
  }
}
