import { CourseCreateInput } from '../schemas/course.schema';
import { courseRepository } from '../repositories/course.repository';
import { CourseDTO } from '../types';

export const courseService = {
  async createCourse(input: CourseCreateInput): Promise<CourseDTO> {
    // Business rule: ensure slug is unique and well-formed
    const created = await courseRepository.create(input);
    // TODO: trigger any side-effects (email, analytics, etc.) via infrastructure adapters
    return created;
  },

  async getPublishedCourses(): Promise<CourseDTO[]> {
    return courseRepository.findAll();
  },

  async getCourseBySlug(slug: string): Promise<CourseDTO | null> {
    return courseRepository.findBySlug(slug);
  }
};
