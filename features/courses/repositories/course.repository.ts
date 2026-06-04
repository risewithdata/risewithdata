import { prisma } from '../../../prisma/prisma.config';
import { CourseCreateInput } from '../schemas/course.schema';
import { CourseDTO } from '../types';

export const courseRepository = {
  async create(input: CourseCreateInput): Promise<CourseDTO> {
    const course = await prisma.course.create({
      data: {
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        published: input.published ?? false
      }
    });
    return { id: course.id, title: course.title, slug: course.slug, excerpt: course.excerpt ?? undefined };
  },

  async findBySlug(slug: string): Promise<CourseDTO | null> {
    const course = await prisma.course.findUnique({
      where: { slug }
    });
    if (!course) return null;
    return { id: course.id, title: course.title, slug: course.slug, excerpt: course.excerpt ?? undefined };
  },

  async findAll(): Promise<CourseDTO[]> {
    const courses = await prisma.course.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    });
    return courses.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      excerpt: c.excerpt ?? undefined
    }));
  }
};
